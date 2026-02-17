/**
 * ConversationService.ts - Manages active NPC conversations.
 * Handles starting conversations, player responses, and conversation actions.
 */

import { GameAction } from "../../protocol/enums/GameAction";
import { buildReceivedNPCConversationDialoguePayload } from "../../protocol/packets/actions/ReceivedNPCConversationDialogue";
import { buildEndedNPCConversationPayload } from "../../protocol/packets/actions/EndedNPCConversation";
import { buildStartedShoppingPayload } from "../../protocol/packets/actions/StartedShopping";
import { buildSkillCurrentLevelChangedPayload } from "../../protocol/packets/actions/SkillCurrentLevelChanged";
import { buildChangedAppearancePayload } from "../../protocol/packets/actions/ChangedAppearance";
import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import type { ConversationCatalog, ConversationDialogue, PlayerEventAction } from "../../world/conversations/ConversationCatalog";
import type { PlayerState } from "../../world/PlayerState";
import { isSkillSlug, skillToClientRef } from "../../world/PlayerState";
import type { NPCState } from "../state/EntityState";
import type { ShopSystem } from "../systems/ShopSystem";
import type { TargetingService } from "./TargetingService";
import type { StateMachine } from "../StateMachine";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { ExperienceService } from "./ExperienceService";
import { RequirementsChecker, type RequirementCheckContext } from "./RequirementsChecker";
import type { MapLevel } from "../../world/Location";
import { QuestProgressService } from "./QuestProgressService";
import type { InstancedNpcService } from "./InstancedNpcService";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { ChangeAppearanceService } from "./ChangeAppearanceService";

type EnqueueUserMessageCallback = (userId: number, action: GameAction, payload: unknown[]) => void;
type EnqueueBroadcastCallback = (action: GameAction, payload: unknown[]) => void;
type DeleteMovementPlanCallback = (entityRef: { type: EntityType; id: number }) => void;

export interface ConversationServiceDependencies {
  conversationCatalog: ConversationCatalog;
  enqueueUserMessage: EnqueueUserMessageCallback;
  enqueueBroadcast: EnqueueBroadcastCallback;
  npcStates: Map<number, NPCState>;
  playerStatesByUserId: Map<number, PlayerState>;
  inventoryService: InventoryService;
  messageService: MessageService;
  experienceService: ExperienceService;
  itemCatalog: ItemCatalog;
  shopSystem: ShopSystem;
  deleteMovementPlan: DeleteMovementPlanCallback;
  targetingService: TargetingService;
  stateMachine: StateMachine;
  changeAppearanceService: ChangeAppearanceService;
  getInstancedNpcService?: () => InstancedNpcService | null;
  teleportService: {
    changeMapLevel: (userId: number, x: number, y: number, mapLevel: MapLevel) => { success: boolean };
  };
}

/**
 * Tracks active conversation state for a player.
 */
interface ActiveConversation {
  npcId: number;
  conversationId: number;
  currentDialogueId: number;
}

/**
 * Service for managing NPC conversations.
 */
export class ConversationService {
  /** Maps userId to their active conversation */
  private readonly activeConversations = new Map<number, ActiveConversation>();
  private readonly requirementsChecker: RequirementsChecker;
  private readonly questProgressService: QuestProgressService;

  constructor(private readonly deps: ConversationServiceDependencies) {
    this.requirementsChecker = new RequirementsChecker();
    this.questProgressService = new QuestProgressService({
      enqueueUserMessage: deps.enqueueUserMessage,
      messageService: deps.messageService,
      inventoryService: deps.inventoryService,
      experienceService: deps.experienceService,
      itemCatalog: deps.itemCatalog
    });
  }

  /**
   * Starts a conversation with an NPC.
   * Sends the initial dialogue to the player.
   * Makes NPC target player briefly (for visual effect).
   * Sets both NPC and player to conversation states.
   * 
   * @param userId - The player starting the conversation
   * @param npcId - The NPC entity ID
   * @param conversationId - The conversation definition ID
   * @returns true if conversation started successfully
   */
  startConversation(userId: number, npcId: number, conversationId: number): boolean {
    const conversation = this.deps.conversationCatalog.getConversationById(conversationId);
    if (!conversation) {
      console.warn(`[ConversationService] Conversation ${conversationId} not found`);
      return false;
    }

    // Get initial dialogue ID
    const initialDialogueId = this.resolveInitialDialogueId(userId, conversationId);
    const dialogue = this.deps.conversationCatalog.getDialogue(conversationId, initialDialogueId);
    
    if (!dialogue) {
      console.warn(`[ConversationService] Initial dialogue ${initialDialogueId} not found in conversation ${conversationId}`);
      return false;
    }

    // Get NPC and player states
    const npcState = this.deps.npcStates.get(npcId);
    const playerState = this.deps.playerStatesByUserId.get(userId);
    
    if (!npcState) {
      console.warn(`[ConversationService] NPC ${npcId} not found`);
      return false;
    }

    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found`);
      return false;
    }

    // Make NPC target player (visual effect - NPC looks at player)
    // Then immediately clear it (keeps the facing direction)
    this.deps.targetingService.setNpcTarget(npcId, { type: EntityType.Player, id: userId }, false);
    // Don't remember dropped target since this is just a visual effect, not real aggro
    this.deps.targetingService.clearNpcTarget(npcId, false);

    // Delete any active movement plan for the NPC (makes them stand still)
    // Use deleteMovementPlan instead of cancelMovementPlan to avoid unnecessary state transitions
    this.deps.deleteMovementPlan({ type: EntityType.NPC, id: npcId });

    // Set NPC to conversation state (prevents wandering/pathfinding)
    this.deps.stateMachine.setState({ type: EntityType.NPC, id: npcId }, States.NPCConversationState);

    // Set player to conversation state
    playerState.setState(States.ConversationState);

    // Store active conversation
    this.activeConversations.set(userId, {
      npcId,
      conversationId,
      currentDialogueId: initialDialogueId
    });

    // Process initial dialogue through the same flow as subsequent dialogues
    // so initial nodes can execute actions and continuances consistently.
    this.advanceToDialogue(userId, npcId, conversationId, initialDialogueId, true);

    return true;
  }

  /**
   * Handles player response to a conversation dialogue.
   * Advances the conversation based on the selected option.
   * 
   * @param userId - The player responding
   * @param conversationId - The conversation ID
   * @param dialogueId - The current dialogue ID
   * @param optionId - The option the player selected
   */
  handlePlayerResponse(
    userId: number,
    conversationId: number,
    dialogueId: number,
    optionId: number
  ): void {
    // Verify this matches the active conversation
    const active = this.activeConversations.get(userId);
    if (!active) {
      console.warn(`[ConversationService] Player ${userId} has no active conversation`);
      return;
    }

    if (active.conversationId !== conversationId || active.currentDialogueId !== dialogueId) {
      console.warn(`[ConversationService] Conversation state mismatch for player ${userId}`);
      return;
    }

    // Get current dialogue and selected option
    const currentDialogue = this.deps.conversationCatalog.getDialogue(conversationId, dialogueId);
    if (!currentDialogue || !currentDialogue.playerConversationOptions) {
      console.warn(`[ConversationService] Invalid dialogue state`);
      this.endConversation(userId);
      return;
    }


    if(optionId === -1) {
      this.endConversation(userId);
      return;
    }

    const selectedOption = currentDialogue.playerConversationOptions.find((opt) => opt.id === optionId);
    if (!selectedOption) {
      console.warn(`[ConversationService] Invalid option ${optionId} for dialogue ${dialogueId}`);
      return;
    }

    // Check if option leads to next dialogue
    if (selectedOption.nextDialogueId !== null) {
      this.advanceToDialogue(userId, active.npcId, conversationId, selectedOption.nextDialogueId);
    } else {
      // Conversation ends
      this.endConversation(userId);
    }
  }

  /**
   * Advances conversation to a specific dialogue.
   * Executes any actions and sends the next dialogue.
   */
  private advanceToDialogue(
    userId: number,
    npcId: number,
    conversationId: number,
    nextDialogueId: number,
    isInitialDialogue: boolean = false
  ): void {
    const dialogue = this.deps.conversationCatalog.getDialogue(conversationId, nextDialogueId);
    if (!dialogue) {
      console.warn(`[ConversationService] Dialogue ${nextDialogueId} not found in conversation ${conversationId}`);
      this.endConversation(userId);
      return;
    }

    // Update active conversation state
    const active = this.activeConversations.get(userId);
    if (active) {
      active.currentDialogueId = nextDialogueId;
    }

    // Execute any actions attached to this dialogue
    if (dialogue.playerEventActions) {
      this.executeActions(userId, npcId, dialogue.playerEventActions);
    }

    // Check for auto-continuance after running this dialogue's actions.
    const nextContinuanceDialogueId =
      dialogue.continuanceDialogues && dialogue.continuanceDialogues.length > 0
        ? this.resolveContinuanceDialogueId(userId, dialogue.continuanceDialogues)
        : null;

    // Determine if conversation should end when there is no visible dialogue and nowhere to continue.
    const hasDisplayableContent = !!dialogue.npcText || !!dialogue.playerConversationOptions;
    const shouldEndConversation = !hasDisplayableContent && nextContinuanceDialogueId === null;

    // Send dialogue to player (if it has options or text)
    if (hasDisplayableContent) {
      this.sendDialogue(userId, npcId, conversationId, dialogue, isInitialDialogue);
    }

    if (nextContinuanceDialogueId !== null) {
      this.advanceToDialogue(userId, npcId, conversationId, nextContinuanceDialogueId, false);
      return;
    }

    if (shouldEndConversation) {
      this.endConversation(userId);
    }
  }

  /**
   * Sends a dialogue packet to the player.
   * Filters out conversation options that don't meet requirements.
   */
  private sendDialogue(
    userId: number,
    npcId: number,
    conversationId: number,
    dialogue: ConversationDialogue,
    isInitial: boolean
  ): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found when sending dialogue`);
      return;
    }

    // Format player options - preserve null if no options exist
    // Filter out options that don't meet requirements
    let playerOptions: [number, string][] | null = null;
    if (dialogue.playerConversationOptions) {
      playerOptions = [];
      
      const context: RequirementCheckContext = {
        playerState,
        getInstancedNpcConfigIdsForOwner: (ownerUserId) =>
          this.deps.getInstancedNpcService?.()?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? []
      };

      for (const option of dialogue.playerConversationOptions) {
        // Check if option has requirements
        if (option.requirements && option.requirements.length > 0) {
          const requirementCheck = this.requirementsChecker.checkRequirements(
            option.requirements,
            context
          );
          
          // Skip options that don't meet requirements
          if (!requirementCheck.passed) {
            console.log(
              `[ConversationService] Player ${userId} doesn't meet requirements for option ${option.id}: ${requirementCheck.failureReason}`
            );
            continue;
          }
        }
        
        // Option has no requirements or requirements passed
        playerOptions.push([option.id, option.text]);
      }
    }
    if(playerOptions && playerOptions.length == 0) {
      playerOptions = null;
    }
    // Build and send packet
    const payload = buildReceivedNPCConversationDialoguePayload({
      EntityID: npcId,
      NPCConversationID: conversationId,
      ConversationDialogueID: dialogue.id,
      IsInitialDialogue: isInitial,
      NPCText: dialogue.npcText ?? "",
      PlayerConversationOptions: playerOptions
    });

    this.deps.enqueueUserMessage(userId, GameAction.ReceivedNPCConversationDialogue, payload);
  }

  /**
   * Executes actions attached to a dialogue.
   * Actions are executed in sequence, then conversation ends.
   */
  private executeActions(userId: number, npcId: number, actions: PlayerEventAction[]): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found when executing dialogue actions`);
      return;
    }

    for (const action of actions) {
      const actionRequirements = action.requirements as unknown[] | null | undefined;
      if (Array.isArray(actionRequirements) && actionRequirements.length > 0) {
        const requirementCheck = this.requirementsChecker.checkRequirements(actionRequirements, {
          playerState,
          getInstancedNpcConfigIdsForOwner: (ownerUserId) =>
            this.deps.getInstancedNpcService?.()?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? []
        });
        if (!requirementCheck.passed) {
          continue;
        }
      }

      switch (action.type) {
        case "StartShopping":
          this.handleStartShopping(userId, npcId, action);
          break;
        case "AdvanceQuest":
          this.handleAdvanceQuest(userId, action);
          break;
        case "SkillCurrentLevelChanged":
          this.handleSkillCurrentLevelChanged(userId, action);
          break;
        case "SpawnInstancedNPC":
          this.handleSpawnInstancedNPC(userId, action);
          break;
        case "GiveItem":
        case "PlayerGiveItems":
        case "PlayerReceiveItems":
        case "PlayerExchangeItems":
          this.handleGiveItem(userId, action);
          break;
        case "TeleportTo":
          this.handleTeleportTo(userId, action);
          break;
        case "ForceChangeAppearance":
          this.handleForceChangeAppearance(userId, action);
          break;
        case "ChangeAppearance":
          this.handleChangeAppearanceAction(userId);
          break;
        default:
          console.warn(`[ConversationService] Unknown action type: ${action.type}`);
      }
    }
  }

  /**
   * Handles the StartShopping action.
   * Sends StartedShopping packet to open shop interface with current stock.
   * Automatically ends the conversation to free the NPC from conversation state.
   */
  private handleStartShopping(userId: number, npcId: number, action: PlayerEventAction): void {
    const shopId = action.shopId as number | undefined;
    const playerState = this.deps.playerStatesByUserId.get(userId);
    
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found`);
      return;
    }

    if (shopId === undefined) {
      console.warn(`[ConversationService] StartShopping action missing shopId`);
      return;
    }

    
    // Get current stock from ShopSystem (50-element array with nulls for empty slots)
    const currentStock = this.deps.shopSystem.getCurrentStock(shopId);

    const payload = buildStartedShoppingPayload({
      ShopID: shopId,
      EntityID: userId, // Player's userId, not NPC's entity ID
      CurrentStock: currentStock
    });

    this.deps.enqueueUserMessage(userId, GameAction.StartedShopping, payload);

    // Set player to shopping state and track which shop they're browsing
    playerState.setState(States.ShoppingState);
    playerState.currentShopId = shopId;

    // End the conversation so NPC is freed from conversation state
    // This allows the NPC to wander/move again while player shops
    // Only end if conversation is still active (prevents double-ending)
    if (this.activeConversations.has(userId)) {
      this.endConversation(userId);
    }
  }

  /**
   * Handles quest advancement actions.
   * Updates in-memory quest progress; persistence is handled by PlayerPersistenceManager autosave.
   */
  private handleAdvanceQuest(userId: number, action: PlayerEventAction): void {
    const questIdRaw = action.questid;
    const checkpointRaw = action.checkpoint;
    const completedRaw = action.completed;

    if (!Number.isInteger(questIdRaw) || !Number.isInteger(checkpointRaw)) {
      console.warn(
        `[ConversationService] AdvanceQuest action has invalid quest data for player ${userId}:`,
        action
      );
      return;
    }

    const questId = questIdRaw as number;
    const checkpoint = checkpointRaw as number;

    if (questId < 0 || checkpoint < 0) {
      console.warn(
        `[ConversationService] AdvanceQuest action has negative values for player ${userId}: questId=${questId}, checkpoint=${checkpoint}`
      );
      return;
    }

    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found for AdvanceQuest action`);
      return;
    }

    const completed = completedRaw === true;
    const previous = playerState.getQuestProgress(questId);
    this.questProgressService.applyQuestProgressToPlayer(playerState, questId, checkpoint, { completed });

    console.log(
      `[ConversationService] Advanced quest ${questId} to checkpoint ${checkpoint} for player ${userId}` +
      ` (completed=${completed}, previous=${previous?.checkpoint ?? 0})`
    );
  }

  /**
   * Handles conversation item transfer actions.
   * Supports legacy "GiveItem" and content-driven:
   * - PlayerGiveItems: remove from player
   * - PlayerReceiveItems: give to player
   * - PlayerExchangeItems: remove then give
   */
  private handleGiveItem(userId: number, action: PlayerEventAction): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return;
    }

    const toGive = this.normalizeTransferItems(action.playerGiveItems);
    const toReceive = this.normalizeTransferItems(action.playerReceiveItems);

    const actionType = String(action.type ?? "");
    const shouldGive = actionType === "PlayerGiveItems" || actionType === "PlayerExchangeItems";
    const shouldReceive =
      actionType === "PlayerReceiveItems" || actionType === "PlayerExchangeItems" || actionType === "GiveItem";

    if (shouldGive && toGive.length > 0 && !this.playerHasInventoryItems(playerState, toGive)) {
      return;
    }

    if (shouldGive) {
      for (const item of toGive) {
        this.deps.inventoryService.removeItem(userId, item.itemId, item.amount, item.isIOU);
      }
    }

    if (shouldReceive) {
      // Backward compatibility: legacy GiveItem may include only "playerGiveItems".
      const receiveItems = toReceive.length > 0 ? toReceive : toGive;
      for (const item of receiveItems) {
        this.deps.inventoryService.giveItem(userId, item.itemId, item.amount, item.isIOU);
      }
    }
  }

  /**
   * Handles temporary skill level changes from conversation actions.
   * amount is applied as a delta to boosted level.
   * - canincreasepastactuallevel=false => cap upward at actual level (restore behavior)
   * - canincreasepastactuallevel=true  => allow boosting above actual level
   */
  private handleSkillCurrentLevelChanged(userId: number, action: PlayerEventAction): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found for SkillCurrentLevelChanged action`);
      return;
    }

    const rawSkill = action.skill;
    const rawAmount = action.amount;
    const rawCanIncreasePastActualLevel =
      action.canincreasepastactuallevel ?? action.canIncreasePastActualLevel;

    if (typeof rawSkill !== "string" || !isSkillSlug(rawSkill)) {
      console.warn(`[ConversationService] SkillCurrentLevelChanged has invalid skill for player ${userId}:`, action);
      return;
    }

    if (typeof rawAmount !== "number" || !Number.isFinite(rawAmount)) {
      console.warn(`[ConversationService] SkillCurrentLevelChanged has invalid amount for player ${userId}:`, action);
      return;
    }

    const canIncreasePastActualLevel = rawCanIncreasePastActualLevel === true;
    const currentBoosted = playerState.getSkillBoostedLevel(rawSkill);
    const actualLevel = playerState.getSkillLevel(rawSkill);

    let nextBoosted = Math.round(currentBoosted + rawAmount);
    if (!canIncreasePastActualLevel && nextBoosted > actualLevel) {
      nextBoosted = actualLevel;
    }

    playerState.setBoostedLevel(rawSkill, nextBoosted);

    const clientSkillRef = skillToClientRef(rawSkill);
    if (clientSkillRef !== null) {
      const payload = buildSkillCurrentLevelChangedPayload({
        Skill: clientSkillRef,
        CurrentLevel: playerState.getSkillBoostedLevel(rawSkill)
      });
      this.deps.enqueueUserMessage(userId, GameAction.SkillCurrentLevelChanged, payload);
    }
  }

  /**
   * Handles spawning instanced NPCs from conversation actions.
   * Supports both a single numeric id and an array of ids.
   */
  private handleSpawnInstancedNPC(userId: number, action: PlayerEventAction): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return;
    }

    const instancedNpcService = this.deps.getInstancedNpcService?.() ?? null;
    if (!instancedNpcService) {
      console.warn("[ConversationService] SpawnInstancedNPC requested but InstancedNpcService is unavailable");
      return;
    }

    const requirements = action.requirements as unknown[] | null | undefined;
    if (Array.isArray(requirements) && requirements.length > 0) {
      const requirementCheck = this.requirementsChecker.checkRequirements(requirements, {
        playerState,
        getInstancedNpcConfigIdsForOwner: (ownerUserId) =>
          this.deps.getInstancedNpcService?.()?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? []
      });
      if (!requirementCheck.passed) {
        return;
      }
    }

    const rawId = action.id as unknown;
    const ids = Array.isArray(rawId) ? rawId : [rawId];
    const normalizedIds = ids
      .map((id) => Number(id))
      .filter((configId) => Number.isInteger(configId) && configId > 0);

    if (normalizedIds.length === 0) {
      return;
    }

    if (normalizedIds.length > 1) {
      instancedNpcService.spawnInstancedNpcGroup(normalizedIds, userId);
      return;
    }

    const result = instancedNpcService.spawnInstancedNpc(normalizedIds[0], userId);
    if (!result.ok && result.reason === "already_has_active_instanced_npc") {
      // Keep consistent behavior with environment action flow.
      return;
    }
  }

  /**
   * Handles the TeleportTo action.
   * Teleports the player to a specific location.
   */
  private handleTeleportTo(userId: number, action: PlayerEventAction): void {
    const location = action.location as { x: number; y: number; lvl: number } | undefined;
    
    if (!location || location.x === undefined || location.y === undefined || location.lvl === undefined) {
      console.warn(`[ConversationService] TeleportTo action missing location data`);
      return;
    }

    
    const result = this.deps.teleportService.changeMapLevel(
      userId,
      location.x,
      location.y,
      location.lvl as MapLevel
    );

    if (!result.success) {
      console.warn(`[ConversationService] Failed to teleport player ${userId}`);
    }
  }

  /**
   * Handles forced appearance changes from dialogue actions.
   * Updates the player's appearance and emits ChangedAppearance to client/broadcast.
   */
  private handleForceChangeAppearance(userId: number, action: PlayerEventAction): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ConversationService] Player ${userId} not found for ForceChangeAppearance action`);
      return;
    }

    const parseAppearanceId = (value: unknown): number | undefined => {
      if (value === null || value === undefined) {
        return undefined;
      }
      if (!Number.isInteger(value)) {
        return undefined;
      }
      return value as number;
    };

    const hairStyleId = parseAppearanceId(action.hair);
    const beardStyleId = parseAppearanceId(action.beard);
    const shirtId = parseAppearanceId(action.shirt);
    const legsId = parseAppearanceId(action.pants);
    const bodyTypeId = parseAppearanceId(action.body);

    const hasAnyChange =
      hairStyleId !== undefined ||
      beardStyleId !== undefined ||
      shirtId !== undefined ||
      legsId !== undefined ||
      bodyTypeId !== undefined;

    if (!hasAnyChange) {
      return;
    }

    playerState.updateAppearance({
      hairStyleId,
      beardStyleId,
      shirtId,
      legsId,
      bodyTypeId
    });

    const payload = buildChangedAppearancePayload({
      EntityID: userId,
      HairID: playerState.appearance.hairStyleId,
      BeardID: playerState.appearance.beardStyleId,
      ShirtID: playerState.appearance.shirtId,
      BodyID: playerState.appearance.bodyTypeId,
      PantsID: playerState.appearance.legsId
    });

    // Update local player immediately and broadcast for nearby observers.
    this.deps.enqueueUserMessage(userId, GameAction.ChangedAppearance, payload);
    this.deps.enqueueBroadcast(GameAction.ChangedAppearance, payload);
  }

  private handleChangeAppearanceAction(userId: number): void {
    const result = this.deps.changeAppearanceService.startFromConversation(userId);
    if (!result.ok) {
      console.warn(
        `[ConversationService] Failed to start ChangeAppearance for player ${userId}: ${result.reason ?? "unknown"}`
      );
    }
  }

  /**
   * Ends a conversation for a player.
   * Sends EndedNPCConversation packet and clears conversation state.
   * 
   * @param userId - The player whose conversation is ending
   * @param handleStateTransitions - If true, also transitions player/NPC to IdleState.
   *                                  Set to false when called from FSM exitState handler
   *                                  (FSM handles state transitions itself).
   */
  endConversation(userId: number, handleStateTransitions: boolean = true): void {
    const active = this.activeConversations.get(userId);
    if (!active) {
      console.warn(`[ConversationService] Cannot end conversation - no active conversation for player ${userId}`);
      return;
    }

    if (handleStateTransitions) {
      // Get NPC and player states to clear their conversation states
      const npcState = this.deps.npcStates.get(active.npcId);
      const playerState = this.deps.playerStatesByUserId.get(userId);

      // Clear NPC conversation state (allow wandering again)
      if (npcState && npcState.currentState === States.NPCConversationState) {
        this.deps.stateMachine.setState({ type: EntityType.NPC, id: active.npcId }, States.IdleState);
      }

      // Clear player conversation state
      if (playerState && playerState.currentState === States.ConversationState) {
        playerState.setState(States.IdleState);
      }
    } else {
      // FSM is handling player state transition, but we still need to clear NPC state
      const npcState = this.deps.npcStates.get(active.npcId);
      if (npcState && npcState.currentState === States.NPCConversationState) {
        this.deps.stateMachine.setState({ type: EntityType.NPC, id: active.npcId }, States.IdleState);
      }
    }

    // Send EndedNPCConversation packet
    const payload = buildEndedNPCConversationPayload({
      EntityID: active.npcId
    });
    this.deps.enqueueUserMessage(userId, GameAction.EndedNPCConversation, payload);

    // Clear conversation state
    this.activeConversations.delete(userId);
  }

  /**
   * Gets the active conversation for a player (if any).
   */
  getActiveConversation(userId: number): ActiveConversation | undefined {
    return this.activeConversations.get(userId);
  }

  private resolveInitialDialogueId(userId: number, conversationId: number): number {
    const conversation = this.deps.conversationCatalog.getConversationById(conversationId);
    if (!conversation || conversation.initialConversationDialogues.length === 0) {
      return 0;
    }

    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return conversation.initialConversationDialogues[0].id;
    }

    // Evaluate in file order: first passing branch wins, matching if/else semantics.
    for (const candidate of conversation.initialConversationDialogues) {
      const requirements = candidate.requirements;
      if (!Array.isArray(requirements) || requirements.length === 0) {
        return candidate.id;
      }

      const requirementCheck = this.requirementsChecker.checkRequirements(requirements, {
        playerState,
        getInstancedNpcConfigIdsForOwner: (ownerUserId) =>
          this.deps.getInstancedNpcService?.()?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? []
      });
      if (requirementCheck.passed) {
        return candidate.id;
      }
    }

    return conversation.initialConversationDialogues[0].id;
  }

  private resolveContinuanceDialogueId(
    userId: number,
    continuances: { requirements: unknown[] | null; nextDialogueId: number | null }[]
  ): number | null {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return continuances[0]?.nextDialogueId ?? null;
    }

    // Evaluate in file order: first passing branch wins.
    for (const continuance of continuances) {
      const requirements = continuance.requirements;
      if (!Array.isArray(requirements) || requirements.length === 0) {
        return continuance.nextDialogueId ?? null;
      }

      const requirementCheck = this.requirementsChecker.checkRequirements(requirements, {
        playerState,
        getInstancedNpcConfigIdsForOwner: (ownerUserId) =>
          this.deps.getInstancedNpcService?.()?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? []
      });
      if (requirementCheck.passed) {
        return continuance.nextDialogueId ?? null;
      }
    }

    return null;
  }

  private normalizeTransferItems(raw: unknown): Array<{ itemId: number; amount: number; isIOU: 0 | 1 }> {
    if (!Array.isArray(raw)) {
      return [];
    }

    const normalized: Array<{ itemId: number; amount: number; isIOU: 0 | 1 }> = [];
    for (const entry of raw) {
      const item = entry as {
        id?: unknown;
        itemId?: unknown;
        amt?: unknown;
        amount?: unknown;
        isIOU?: unknown;
        isiou?: unknown;
      };
      const itemId = Number(item.id ?? item.itemId);
      const amount = Number(item.amt ?? item.amount);
      const isIOU = item.isIOU === true || item.isiou === true ? 1 : 0;
      if (!Number.isInteger(itemId) || itemId <= 0) continue;
      if (!Number.isFinite(amount) || amount <= 0) continue;
      normalized.push({ itemId, amount: Math.floor(amount), isIOU });
    }

    return normalized;
  }

  private playerHasInventoryItems(
    playerState: PlayerState,
    items: Array<{ itemId: number; amount: number; isIOU: 0 | 1 }>
  ): boolean {
    const required = new Map<string, number>();
    for (const item of items) {
      const key = `${item.itemId}:${item.isIOU}`;
      required.set(key, (required.get(key) ?? 0) + item.amount);
    }

    const owned = new Map<string, number>();
    for (const slot of playerState.inventory) {
      if (!slot) continue;
      const key = `${slot[0]}:${slot[2]}`;
      owned.set(key, (owned.get(key) ?? 0) + slot[1]);
    }

    for (const [key, amount] of required.entries()) {
      if ((owned.get(key) ?? 0) < amount) {
        return false;
      }
    }
    return true;
  }
}
