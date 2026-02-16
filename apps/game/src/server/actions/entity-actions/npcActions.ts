/**
 * NPC action handlers.
 * Handles TalkTo, Shop, Attack, and Pickpocket actions for NPCs.
 */

import { Action } from "../../../protocol/enums/Actions";
import { EntityType } from "../../../protocol/enums/EntityType";
import { PlayerSetting } from "../../../protocol/enums/PlayerSetting";
import { States } from "../../../protocol/enums/States";
import { GameAction } from "../../../protocol/enums/GameAction";
import type { ActionContext } from "../types";
import type { PlayerState } from "../../../world/PlayerState";
import type { NPCState } from "../../state/EntityState";
import type { EntityRef } from "../../events/GameEvents";
import { buildMovementPathAdjacent, buildMovementPathWithinRange } from "../utils/pathfinding";
import { getPlayerAttackRange, getPlayerCombatMode, isWithinRange } from "../utils/combatMode";
import { checkAdjacentToNPC } from "./shared";
import { buildStartedShoppingPayload } from "../../../protocol/packets/actions/StartedShopping";
import { canPlayerInteractWithNpc } from "../../services/instancedNpcUtils";

/**
 * Main router for NPC actions.
 */
export function handleNPCAction(
  ctx: ActionContext,
  playerState: PlayerState,
  action: Action,
  npcId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  switch (action) {
    case Action.Attack:
      handleAttackNPC(ctx, playerState, npcId, onMovementComplete);
      break;
    case Action.TalkTo:
      handleTalkToNPC(ctx, playerState, npcId, onMovementComplete);
      break;
    case Action.Shop:
      handleShopNPC(ctx, playerState, npcId, onMovementComplete);
      break;
    case Action.Pickpocket:
      handlePickpocketNPC(ctx, playerState, npcId, onMovementComplete);
      break;
    default:
      console.warn(`[handleNPCAction] Unhandled action: ${action}`);
      break;
  }
}

/**
 * Generic helper to handle NPC interactions with pathfinding.
 * Reduces duplication across different NPC action handlers.
 */
function handleNPCInteraction(
  ctx: ActionContext,
  playerState: PlayerState,
  npcId: number,
  action: Action,
  actionName: string,
  executeFunction: (ctx: ActionContext, playerState: PlayerState, npcState: NPCState) => void,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  // Get the NPC state
  const npcState = ctx.npcStates.get(npcId);
  if (!npcState) {
    console.warn(`[${actionName}] NPC ${npcId} not found`);
    return;
  }

  // Check if NPC is on the same map level
  if (npcState.mapLevel !== playerState.mapLevel) {
    console.warn(`[${actionName}] NPC on different map level`);
    return;
  }

  // Check if player is adjacent to the NPC
  const isAdjacent = checkAdjacentToNPC(ctx, playerState, npcState);

  if (isAdjacent) {
    // Execute action immediately
    executeFunction(ctx, playerState, npcState);
  } else {
    // Start targeting the NPC
    ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.NPC, id: npcId });
    
    // Queue pending action with NPC position tracking
    playerState.pendingAction = {
      action,
      entityType: EntityType.NPC,
      entityId: npcId,
      retryCount: 0, // Initialize retry counter for moving NPCs
      lastKnownX: npcState.x, // Track NPC position
      lastKnownY: npcState.y
    };

    // Build path to adjacent to NPC with large radius for initial pathfind
    const INITIAL_PATHFIND_RADIUS = 128;
    const path = buildMovementPathAdjacent(
      ctx,
      playerState.x,
      playerState.y,
      npcState.x,
      npcState.y,
      playerState.mapLevel,
      true, // Force adjacent pathfinding
      INITIAL_PATHFIND_RADIUS // Large radius for initial pathfind
    );

    if (!path || path.length <= 1) {
      console.warn(`[${actionName}] Failed to find path to NPC`);
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
      playerState.pendingAction = null;
      ctx.targetingService.clearPlayerTarget(playerState.userId);
      return;
    }

    // Calculate player movement speed
    const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;

    // Schedule movement with completion callback
    const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
    ctx.pathfindingSystem.scheduleMovementPlan(
      entityRef,
      playerState.mapLevel,
      path,
      speed,
      () => onMovementComplete(ctx, playerState)
    );

    console.log(`[${actionName}] Player ${playerState.userId} pathfinding to NPC ${npcId} at (${npcState.x}, ${npcState.y})`);
  }
}

// =============================================================================
// Individual NPC Action Handlers
// =============================================================================

function handleAttackNPC(
  ctx: ActionContext,
  playerState: PlayerState,
  npcId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  const npcState = ctx.npcStates.get(npcId);
  if (!npcState) {
    console.warn(`[handleAttackNPC] NPC ${npcId} not found`);
    return;
  }

  if (npcState.mapLevel !== playerState.mapLevel) {
    console.warn(`[handleAttackNPC] NPC on different map level`);
    return;
  }

  if (!npcState.definition.combat) {
    ctx.packetAudit?.logInvalidPacket({
      userId: playerState.userId,
      packetName: "NpcAttack",
      reason: "npc_no_combat",
      details: { npcId }
    });
    //ctx.messageService.sendServerInfo(playerState.userId, "You can't attack that.");
    return;
  }

  if (!canPlayerInteractWithNpc(playerState.userId, npcState)) {
    ctx.messageService.sendServerInfo(playerState.userId, "You cannot attack that.");
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    playerState.pendingAction = null;
    return;
  }

  const combatMode = getPlayerCombatMode(playerState);
  const attackRange = getPlayerAttackRange(playerState, ctx.spellCatalog);

  const hasLOS = ctx.losSystem
    ? ctx.losSystem.checkLOS(playerState.x, playerState.y, npcState.x, npcState.y, playerState.mapLevel).hasLOS
    : true;

  const inRange = combatMode === "melee"
    ? checkAdjacentToNPC(ctx, playerState, npcState)
    : isWithinRange(playerState.x, playerState.y, npcState.x, npcState.y, attackRange) && hasLOS;

  if (inRange) {
    executeAttackNPC(ctx, playerState, npcState);
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.NPC, id: npcId });
  playerState.pendingAction = {
    action: Action.Attack,
    entityType: EntityType.NPC,
    entityId: npcId,
    retryCount: 0,
    lastKnownX: npcState.x,
    lastKnownY: npcState.y
  };

  const INITIAL_PATHFIND_RADIUS = 128;
  const path = combatMode === "melee"
    ? buildMovementPathAdjacent(
        ctx,
        playerState.x,
        playerState.y,
        npcState.x,
        npcState.y,
        playerState.mapLevel,
        true,
        INITIAL_PATHFIND_RADIUS
      )
    : buildMovementPathWithinRange(
        ctx,
        playerState.x,
        playerState.y,
        npcState.x,
        npcState.y,
        playerState.mapLevel,
        attackRange,
        INITIAL_PATHFIND_RADIUS,
        true
      );

  if (!path || path.length <= 1) {
    console.warn(`[handleAttackNPC] Failed to find path to NPC`);
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
  ctx.pathfindingSystem.scheduleMovementPlan(
    entityRef,
    playerState.mapLevel,
    path,
    speed,
    () => onMovementComplete(ctx, playerState)
  );

  console.log(`[handleAttackNPC] Player ${playerState.userId} pathfinding to NPC ${npcId} at (${npcState.x}, ${npcState.y})`);
}

function handleTalkToNPC(
  ctx: ActionContext,
  playerState: PlayerState,
  npcId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  handleNPCInteraction(
    ctx,
    playerState,
    npcId,
    Action.TalkTo,
    "handleTalkToNPC",
    executeTalkToNPC,
    onMovementComplete
  );
}

function handleShopNPC(
  ctx: ActionContext,
  playerState: PlayerState,
  npcId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  handleNPCInteraction(
    ctx,
    playerState,
    npcId,
    Action.Shop,
    "handleShopNPC",
    executeShopNPC,
    onMovementComplete
  );
}

function handlePickpocketNPC(
  ctx: ActionContext,
  playerState: PlayerState,
  npcId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  handleNPCInteraction(
    ctx,
    playerState,
    npcId,
    Action.Pickpocket,
    "handlePickpocketNPC",
    executePickpocketNPC,
    onMovementComplete
  );
}

// =============================================================================
// Execute Functions (called when player is adjacent)
// =============================================================================

function executeAttackNPC(ctx: ActionContext, playerState: PlayerState, npcState: NPCState): void {
  console.log(`[executeAttackNPC] Player ${playerState.userId} attacking NPC ${npcState.id}`);

  if (!canPlayerInteractWithNpc(playerState.userId, npcState)) {
    ctx.messageService.sendServerInfo(playerState.userId, "You cannot attack that.");
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    playerState.pendingAction = null;
    return;
  }
  
  // TODO: Implement attack logic
  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.NPC, id: npcState.id });
  const combatMode = getPlayerCombatMode(playerState);
  const nextState = combatMode === "magic"
    ? States.MagicCombatState
    : combatMode === "range"
      ? States.RangeCombatState
      : States.MeleeCombatState;
  ctx.stateMachine.setState({ type: EntityType.Player, id: playerState.userId }, nextState);
  // Clear pending action
  playerState.pendingAction = null;
}

/**
 * Executes the TalkTo action when player is adjacent to NPC.
 * Verifies line of sight before allowing interaction.
 * 
 * @param ctx - Action context
 * @param playerState - The player talking to the NPC
 * @param npcState - The NPC being talked to
 */
export function executeTalkToNPC(ctx: ActionContext, playerState: PlayerState, npcState: NPCState): void {
  console.log(`[executeTalkToNPC] Player ${playerState.userId} talking to NPC ${npcState.id}`);
  
  // Final safety check: Verify adjacency and LOS
  if (!checkAdjacentToNPC(ctx, playerState, npcState)) {
    console.warn(`[executeTalkToNPC] Player ${playerState.userId} not adjacent or no LOS to NPC ${npcState.id}`);
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    return;
  }
  
  // Check if NPC has a conversation
  if (npcState.conversationId !== null) {
    // Start conversation
    const success = ctx.conversationService.startConversation(
      playerState.userId,
      npcState.id,
      npcState.conversationId
    );
    
    if (!success) {
      ctx.messageService.sendServerInfo(playerState.userId, "They don't feel like talking.");
    }
  } else {
    // No conversation defined - send placeholder
    ctx.messageService.sendServerInfo(playerState.userId, "They don't feel like talking.");
  }
  
  // Clear pending action
  playerState.pendingAction = null;
}

/**
 * Executes the Shop action when player is adjacent to NPC.
 * Verifies line of sight before opening shop interface.
 * 
 * @param ctx - Action context
 * @param playerState - The player opening the shop
 * @param npcState - The NPC shopkeeper
 */
export function executeShopNPC(ctx: ActionContext, playerState: PlayerState, npcState: NPCState): void {
  console.log(`[executeShopNPC] Player ${playerState.userId} shopping with NPC ${npcState.id}`);
  
  // Final safety check: Verify adjacency and LOS
  if (!checkAdjacentToNPC(ctx, playerState, npcState)) {
    console.warn(`[executeShopNPC] Player ${playerState.userId} not adjacent or no LOS to NPC ${npcState.id}`);
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    return;
  }
  
  // Check if NPC has a shop
  if (!npcState.shopId) {
    ctx.messageService.sendServerInfo(playerState.userId, "They don't have anything to sell.");
    playerState.pendingAction = null;
    return;
  }

  // Get current stock from ShopSystem
  const currentStock = ctx.shopSystem.getCurrentStock(npcState.shopId);

  // Send StartedShopping packet
  const payload = buildStartedShoppingPayload({
    ShopID: npcState.shopId,
    EntityID: playerState.userId,
    CurrentStock: currentStock
  });

  ctx.enqueueUserMessage(playerState.userId, GameAction.StartedShopping, payload);

  // Set player to shopping state and track which shop they're browsing
  playerState.setState(States.ShoppingState);
  playerState.currentShopId = npcState.shopId;

  // Clear pending action
  playerState.pendingAction = null;
  
  console.log(`[executeShopNPC] Player ${playerState.userId} opened shop ${npcState.shopId} from NPC ${npcState.id}`);
}

function executePickpocketNPC(ctx: ActionContext, playerState: PlayerState, npcState: NPCState): void {
  console.log(`[executePickpocketNPC] Player ${playerState.userId} pickpocketing NPC ${npcState.id}`);
  
  // Final safety check: Verify adjacency and LOS
  if (!checkAdjacentToNPC(ctx, playerState, npcState)) {
    console.warn(`[executePickpocketNPC] Player ${playerState.userId} not adjacent or no LOS to NPC ${npcState.id}`);
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    return;
  }

  // Check if pickpocket service is available
  if (!ctx.pickpocketService) {
    console.error("[executePickpocketNPC] PickpocketService not available");
    ctx.messageService.sendServerInfo(playerState.userId, "Pickpocketing is not available.");
    playerState.pendingAction = null;
    return;
  }

  // Initiate pickpocket (starts 2-tick delay)
  const initiated = ctx.pickpocketService.initiatePickpocket(playerState, npcState);
  
  if (!initiated) {
    // Failed to start (requirements not met, already busy, etc.)
    // Service already sent error message
  }
  
  // Clear pending action
  playerState.pendingAction = null;
}

// =============================================================================
// Movement Completion Handler
// =============================================================================

// Maximum number of times to retry pathfinding if NPC moves
/**
 * Handles NPC action after movement completion.
 * 
 * **Called when player's movement path completes.**
 * 
 * Note: Dynamic path updating happens in MovementSystem during movement.
 * This function should only execute the final action or fail gracefully.
 * 
 * @param ctx - Action context
 * @param playerState - The player who completed movement
 * @param npcId - The NPC being interacted with
 * @param action - The action to execute
 */
export function handleNPCMovementComplete(
  ctx: ActionContext,
  playerState: PlayerState,
  npcId: number,
  action: Action
): void {
  const npcState = ctx.npcStates.get(npcId);
  if (!npcState) {
    console.warn(`[handleNPCMovementComplete] NPC ${npcId} no longer exists`);
    ctx.messageService.sendServerInfo(playerState.userId, "They're no longer there");
    playerState.pendingAction = null;
    return;
  }

  // Check if NPC is on different map level
  if (npcState.mapLevel !== playerState.mapLevel) {
    console.warn(`[handleNPCMovementComplete] NPC ${npcId} is on different map level`);
    ctx.messageService.sendServerInfo(playerState.userId, "They're no longer there");
    playerState.pendingAction = null;
    return;
  }

  const combatMode = getPlayerCombatMode(playerState);
  const attackRange = getPlayerAttackRange(playerState, ctx.spellCatalog);
  const hasLOS = ctx.losSystem
    ? ctx.losSystem.checkLOS(playerState.x, playerState.y, npcState.x, npcState.y, playerState.mapLevel).hasLOS
    : true;
  const inRange = combatMode === "melee"
    ? checkAdjacentToNPC(ctx, playerState, npcState)
    : isWithinRange(playerState.x, playerState.y, npcState.x, npcState.y, attackRange) && hasLOS;

  if (!inRange) {
    console.warn(`[handleNPCMovementComplete] Player not in range of NPC ${npcId}`);
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    return;
  }

  // Player is adjacent to NPC - execute the action
  switch (action) {
    case Action.TalkTo:
      executeTalkToNPC(ctx, playerState, npcState);
      break;
    case Action.Attack:
      if (!canPlayerInteractWithNpc(playerState.userId, npcState)) {
        ctx.messageService.sendServerInfo(playerState.userId, "You cannot attack that.");
        playerState.pendingAction = null;
        ctx.targetingService.clearPlayerTarget(playerState.userId);
        return;
      }
      executeAttackNPC(ctx, playerState, npcState);
      break;
    case Action.Shop:
      executeShopNPC(ctx, playerState, npcState);
      break;
    case Action.Pickpocket:
      executePickpocketNPC(ctx, playerState, npcState);
      break;
    default:
      console.warn(`[handleNPCMovementComplete] Unhandled NPC action: ${action}`);
      playerState.pendingAction = null;
  }
}
