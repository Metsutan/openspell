import type { PlayerState, SkillSlug, InventoryItem } from "../../world/PlayerState";
import type { ItemCatalog, ItemDefinition, ItemOnItemAction, ItemOnItemActionItem } from "../../world/items/ItemCatalog";
import type { WorldEntityCatalog } from "../../world/entities/WorldEntityCatalog";
import type { NPCState, WorldEntityState } from "../state/EntityState";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { ExperienceService } from "./ExperienceService";
import type { CookingService } from "./CookingService";
import type { EnchantingService } from "./EnchantingService";
import { GameAction } from "../../protocol/enums/GameAction";
import { buildCreatedUseItemOnItemActionItemsPayload } from "../../protocol/packets/actions/CreatedUseItemOnItemActionItems";
import { buildCreatedItemPayload } from "../../protocol/packets/actions/CreatedItem";
import { buildStartedTargetingPayload } from "../../protocol/packets/actions/StartedTargeting";
import { buildStoppedTargetingPayload } from "../../protocol/packets/actions/StoppedTargeting";
import { isSkillSlug, skillToClientRef } from "../../world/PlayerState";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { InventoryManager } from "../../world/systems/InventoryManager";
import type { PacketAuditService } from "./PacketAuditService";
import type { EventBus } from "../events/EventBus";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";

export interface ItemInteractionServiceDependencies {
  inventoryService: InventoryService;
  messageService: MessageService;
  itemCatalog: ItemCatalog;
  experienceService: ExperienceService;
  cookingService: CookingService | null;
  enchantingService: EnchantingService | null;
  worldEntityCatalog: WorldEntityCatalog | null;
  playerStatesByUserId: Map<number, PlayerState>;
  eventBus: EventBus;
  delaySystem: DelaySystem;
  stateMachine: StateMachine;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  packetAudit?: PacketAuditService | null;
}

export interface ItemOnWorldEntityContext {
  playerState: PlayerState;
  itemId: number;
  entityState: WorldEntityState;
  inventoryService: InventoryService;
  messageService: MessageService;
  itemCatalog: ItemCatalog;
  experienceService: ExperienceService;
  cookingService: CookingService | null;
}

export interface ItemOnItemContext {
  playerState: PlayerState;
  itemId: number;
  targetItemId: number;
  inventoryService: InventoryService;
  messageService: MessageService;
  itemCatalog: ItemCatalog;
  experienceService: ExperienceService;
  cookingService: CookingService | null;
}

export interface ItemOnNpcContext {
  playerState: PlayerState;
  itemId: number;
  npcState: NPCState;
  inventoryService: InventoryService;
  messageService: MessageService;
  itemCatalog: ItemCatalog;
  experienceService: ExperienceService;
  cookingService: CookingService | null;
}

export type ItemOnWorldEntityHandler = (context: ItemOnWorldEntityContext) => void;
export type ItemOnItemHandler = (context: ItemOnItemContext) => void;
export type ItemOnNpcHandler = (context: ItemOnNpcContext) => void;
export type WorldEntityActionHandler = (context: ItemOnWorldEntityContext) => void;

type ItemOnItemResult = {
  handled: boolean;
  success: boolean;
};

type ItemOnItemSession = {
  userId: number;
  useItemId: number;
  usedOnItemId: number;
  action: ItemOnItemAction;
  actionIndex: number;
  remainingCrafts: number;
  expPerCraft: number;
  skillToCreate: SkillSlug | null;
  state: States | null;
};

type ItemOnEntityRecipeIngredient = {
  itemId: number;
  amount: number;
};

type ItemOnEntityRecipe = {
  outputItemId: number;
  ingredients: ItemOnEntityRecipeIngredient[];
  expSkill: SkillSlug | null;
  expAmount: number;
};

const DEFAULT_INTERACTION_MESSAGE = "Nothing interesting happens.";

type ItemOnEntitySession = {
  userId: number;
  actionName: string;
  recipe: ItemOnEntityRecipe;
  targetId: number;
  targetType: EntityType;
  remainingCrafts: number;
  state: States | null;
};

const ITEM_ON_ITEM_INTERVAL_TICKS = 5;
const ITEM_ON_ENTITY_INTERVAL_TICKS = 5;

export class ItemInteractionService {
  private readonly worldEntityHandlers = new Map<number, Map<string, ItemOnWorldEntityHandler>>();
  private readonly itemHandlers = new Map<number, Map<number, ItemOnItemHandler>>();
  private readonly npcHandlers = new Map<number, ItemOnNpcHandler>();
  private readonly worldEntityActionHandlers = new Map<string, WorldEntityActionHandler>();
  private readonly itemEntityActionMap = new Map<number, Map<string, string>>();
  private readonly itemOnItemActionsByItemId = new Map<number, ItemOnItemAction[]>();
  private readonly itemOnEntityRecipesByAction = new Map<string, Map<number, ItemOnEntityRecipe>>();
  private readonly activeItemOnItemSessions = new Map<number, ItemOnItemSession>();
  private readonly activeItemOnEntitySessions = new Map<number, ItemOnEntitySession>();

  constructor(private readonly deps: ItemInteractionServiceDependencies) {
    this.buildItemEntityActionMap();
    this.buildItemOnItemActionMap();
    this.registerCookingHandlers();
    this.registerEnchantingHandlers();
    this.buildItemOnEntityRecipeMap();
  }

  registerItemOnWorldEntity(
    itemIds: number[],
    entityTypes: string[],
    handler: ItemOnWorldEntityHandler
  ): void {
    for (const itemId of itemIds) {
      let handlersByEntity = this.worldEntityHandlers.get(itemId);
      if (!handlersByEntity) {
        handlersByEntity = new Map<string, ItemOnWorldEntityHandler>();
        this.worldEntityHandlers.set(itemId, handlersByEntity);
      }
      for (const entityType of entityTypes) {
        handlersByEntity.set(entityType, handler);
      }
    }
  }

  registerItemOnItem(
    itemIds: number[],
    targetItemIds: number[],
    handler: ItemOnItemHandler
  ): void {
    for (const itemId of itemIds) {
      let handlersByItem = this.itemHandlers.get(itemId);
      if (!handlersByItem) {
        handlersByItem = new Map<number, ItemOnItemHandler>();
        this.itemHandlers.set(itemId, handlersByItem);
      }
      for (const targetItemId of targetItemIds) {
        handlersByItem.set(targetItemId, handler);
      }
    }
  }

  registerItemOnNpc(itemIds: number[], handler: ItemOnNpcHandler): void {
    for (const itemId of itemIds) {
      this.npcHandlers.set(itemId, handler);
    }
  }

  handleItemOnWorldEntity(
    playerState: PlayerState,
    itemId: number,
    entityState: WorldEntityState
  ): boolean {
    const actionName = this.itemEntityActionMap.get(itemId)?.get(entityState.type);
    if (!actionName) return false;

    const actionHandler = this.worldEntityActionHandlers.get(actionName);
    if (!actionHandler) return false;

    actionHandler({
      playerState,
      itemId,
      entityState,
      inventoryService: this.deps.inventoryService,
      messageService: this.deps.messageService,
      itemCatalog: this.deps.itemCatalog,
      experienceService: this.deps.experienceService,
      cookingService: this.deps.cookingService
    });
    return true;
  }

  handleItemOnItem(
    playerState: PlayerState,
    itemId: number,
    targetItemId: number,
    actionIndex?: number,
    amountToCreate?: number
  ): ItemOnItemResult {
    const directHandler = this.itemHandlers.get(itemId)?.get(targetItemId);
    if (directHandler) {
      directHandler({
        playerState,
        itemId,
        targetItemId,
        inventoryService: this.deps.inventoryService,
        messageService: this.deps.messageService,
        itemCatalog: this.deps.itemCatalog,
        experienceService: this.deps.experienceService,
        cookingService: this.deps.cookingService
      });
      return { handled: true, success: true };
    }

    const reverseHandler = this.itemHandlers.get(targetItemId)?.get(itemId);
    if (reverseHandler) {
      reverseHandler({
        playerState,
        itemId: targetItemId,
        targetItemId: itemId,
        inventoryService: this.deps.inventoryService,
        messageService: this.deps.messageService,
        itemCatalog: this.deps.itemCatalog,
        experienceService: this.deps.experienceService,
        cookingService: this.deps.cookingService
      });
      return { handled: true, success: true };
    }

    return this.handleItemOnItemActionDefinition(
      playerState,
      itemId,
      targetItemId,
      actionIndex,
      amountToCreate
    );
  }

  handleItemOnNpc(playerState: PlayerState, itemId: number, npcState: NPCState): boolean {
    const handler = this.npcHandlers.get(itemId);
    if (!handler) {
      return false;
    }
    handler({
      playerState,
      itemId,
      npcState,
      inventoryService: this.deps.inventoryService,
      messageService: this.deps.messageService,
      itemCatalog: this.deps.itemCatalog,
      experienceService: this.deps.experienceService,
      cookingService: this.deps.cookingService
    });
    return true;
  }

  private registerCookingHandlers(): void {
    if (!this.deps.cookingService) return;
    this.registerWorldEntityAction("cooking", ({ playerState, itemId, entityState }) => {
      this.deps.cookingService?.startCooking(playerState, itemId, entityState);
    });
  }

  private registerEnchantingHandlers(): void {
    if (!this.deps.enchantingService) return;
    this.registerWorldEntityAction("enchanting", ({ playerState, itemId, entityState }) => {
      this.deps.enchantingService?.startEnchanting(playerState, itemId, entityState);
    });
  }

  private registerWorldEntityAction(actionName: string, handler: WorldEntityActionHandler): void {
    this.worldEntityActionHandlers.set(actionName, handler);
  }

  private buildItemOnEntityRecipeMap(): void {
    if (!this.deps.worldEntityCatalog) return;

    const recipesByIngredient = new Map<number, ItemOnEntityRecipe[]>();
    for (const definition of this.deps.itemCatalog.getDefinitions()) {
      const ingredients = getItemRecipeIngredients(definition);
      if (ingredients.length === 0) continue;

      const expFromObtaining = definition.expFromObtaining;
      const expSkill = expFromObtaining && isSkillSlug(expFromObtaining.skill)
        ? expFromObtaining.skill
        : null;
      const expAmount = expFromObtaining && expSkill ? expFromObtaining.amount : 0;
      const recipe: ItemOnEntityRecipe = {
        outputItemId: definition.id,
        ingredients,
        expSkill,
        expAmount
      };

      for (const ingredient of ingredients) {
        if (!recipesByIngredient.has(ingredient.itemId)) {
          recipesByIngredient.set(ingredient.itemId, []);
        }
        recipesByIngredient.get(ingredient.itemId)!.push(recipe);
      }
    }

    for (const definition of this.deps.worldEntityCatalog.getDefinitions()) {
      const actions = definition.useItemWithEntityActions;
      if (!actions || actions.length === 0) continue;

      for (const action of actions) {
        if (this.worldEntityActionHandlers.has(action.action)) {
          continue;
        }

        const recipes = recipesByIngredient.get(action.itemId);
        if (!recipes || recipes.length === 0) {
          continue;
        }

        const selectedRecipe = selectEntityRecipeForIngredient(recipes, action.itemId);
        if (!selectedRecipe) {
          continue;
        }

        const actionName = action.action;
        if (!this.itemOnEntityRecipesByAction.has(actionName)) {
          this.itemOnEntityRecipesByAction.set(actionName, new Map());
          this.registerWorldEntityAction(actionName, (context) =>
            this.handleItemOnEntityRecipe(actionName, context)
          );
        }
        this.itemOnEntityRecipesByAction.get(actionName)!.set(action.itemId, selectedRecipe);
      }
    }
  }

  private buildItemEntityActionMap(): void {
    if (!this.deps.worldEntityCatalog) return;

    for (const definition of this.deps.worldEntityCatalog.getDefinitions()) {
      const actions = definition.useItemWithEntityActions;
      if (!actions || actions.length === 0) continue;

      for (const action of actions) {
        if (!this.itemEntityActionMap.has(action.itemId)) {
          this.itemEntityActionMap.set(action.itemId, new Map());
        }
        this.itemEntityActionMap.get(action.itemId)!.set(definition.type, action.action);
      }
    }
  }

  private buildItemOnItemActionMap(): void {
    for (const definition of this.deps.itemCatalog.getDefinitions()) {
      if (!definition.useItemOnItemActions || definition.useItemOnItemActions.length === 0) {
        continue;
      }
      this.itemOnItemActionsByItemId.set(definition.id, definition.useItemOnItemActions);
    }
  }

  private handleItemOnItemActionDefinition(
    playerState: PlayerState,
    itemId: number,
    targetItemId: number,
    actionIndex?: number,
    amountToCreate?: number
  ): ItemOnItemResult {
    const actionMatch =
      this.findItemOnItemAction(itemId, targetItemId, actionIndex) ??
      this.findItemOnItemAction(targetItemId, itemId, actionIndex);

    if (!actionMatch) {
      return { handled: false, success: false };
    }

    const { action, index, useItemId, usedOnItemId } = actionMatch;
    const parsedAmountToCreate = Number(amountToCreate);
    if (!action.canCreateMultiple && Number.isFinite(parsedAmountToCreate) && parsedAmountToCreate !== 1) {
      this.deps.packetAudit?.logInvalidPacket({
        userId: playerState.userId,
        packetName: "ItemOnItem",
        reason: "invalid_craft_amount",
        details: { parsedAmountToCreate, actionIndex: actionIndex ?? null, itemId, targetItemId }
      });
      return { handled: true, success: false };
    }

    const craftCount = this.getCraftCount(action, amountToCreate);
    if (craftCount <= 0) {
      return { handled: true, success: false };
    }

    const maxCrafts = this.getMaxCrafts(playerState, action.itemsToRemove);
    if (maxCrafts <= 0) {
      this.deps.messageService.sendServerInfo(playerState.userId, "You don't have the required items.");
      return { handled: true, success: false };
    }

    const craftsToRun = Math.min(craftCount, maxCrafts);
    const expPerCraft = this.getActionExpAmount(action);
    const skillToCreate: SkillSlug | null = isSkillSlug(action.skillToCreate) ? action.skillToCreate : null;
    const state = skillToCreate ? getStateForSkill(skillToCreate) : null;

    if (!skillToCreate && !action.canCreateMultiple) {
      const crafted = this.performItemOnItemCraft(playerState, {
        useItemId,
        usedOnItemId,
        action,
        actionIndex: index
      });
      return { handled: true, success: crafted };
    }

    const started = this.startItemOnItemSession(playerState, {
      userId: playerState.userId,
      useItemId,
      usedOnItemId,
      action,
      actionIndex: index,
      remainingCrafts: craftsToRun,
      expPerCraft,
      skillToCreate,
      state
    });

    if (!started) {
      this.deps.messageService.sendServerInfo(playerState.userId, "You're already busy.");
      return { handled: true, success: false };
    }

    return { handled: true, success: true };
  }

  private findItemOnItemAction(
    useItemId: number,
    usedOnItemId: number,
    actionIndex?: number
  ): { action: ItemOnItemAction; index: number; useItemId: number; usedOnItemId: number } | null {
    const actions = this.itemOnItemActionsByItemId.get(useItemId);
    if (!actions || actions.length === 0) {
      return null;
    }

    const matchingActionIndices: number[] = [];
    for (let i = 0; i < actions.length; i += 1) {
      if (actions[i]?.targetItemId === usedOnItemId) {
        matchingActionIndices.push(i);
      }
    }
    if (matchingActionIndices.length === 0) {
      return null;
    }

    if (Number.isInteger(actionIndex)) {
      const requestedIndex = Number(actionIndex);

      const pairAbsoluteIndex = matchingActionIndices[requestedIndex];
      if (pairAbsoluteIndex !== undefined) {
        const candidate = actions[pairAbsoluteIndex];
        if (candidate) {
          return { action: candidate, index: requestedIndex, useItemId, usedOnItemId };
        }
      }

      const absoluteCandidate = actions[requestedIndex];
      if (absoluteCandidate && absoluteCandidate.targetItemId === usedOnItemId) {
        const pairIndex = matchingActionIndices.indexOf(requestedIndex);
        if (pairIndex !== -1) {
          return { action: absoluteCandidate, index: pairIndex, useItemId, usedOnItemId };
        }
      }
    }

    const firstPairAbsoluteIndex = matchingActionIndices[0];
    return { action: actions[firstPairAbsoluteIndex], index: 0, useItemId, usedOnItemId };
  }

  private getCraftCount(action: ItemOnItemAction, amountToCreate?: number): number {
    if (!action.canCreateMultiple) {
      return 1;
    }

    const parsedAmount = Number(amountToCreate);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return 1;
    }

    return Math.floor(parsedAmount);
  }

  private getMaxCrafts(playerState: PlayerState, itemsToRemove: ItemOnItemActionItem[] | null): number {
    if (!itemsToRemove || itemsToRemove.length === 0) {
      return 0;
    }

    let maxCrafts = Number.POSITIVE_INFINITY;
    for (const item of itemsToRemove) {
      if (!item || item.amount <= 0) continue;
      const available = playerState.countItem(item.id, item.isIOU ? 1 : 0);
      const possible = Math.floor(available / item.amount);
      maxCrafts = Math.min(maxCrafts, possible);
    }

    return Number.isFinite(maxCrafts) ? maxCrafts : 0;
  }

  private removeActionItems(
    playerState: PlayerState,
    itemsToRemove: ItemOnItemActionItem[] | null
  ): boolean {
    if (!itemsToRemove || itemsToRemove.length === 0) {
      return false;
    }

    for (const item of itemsToRemove) {
      if (!item || item.amount <= 0) continue;
      const removed = this.deps.inventoryService.removeItem(
        playerState.userId,
        item.id,
        item.amount,
        item.isIOU ? 1 : 0
      );
      if (removed.removed < item.amount) {
        return false;
      }
    }

    return true;
  }

  private giveActionItems(playerState: PlayerState, resultItems: ItemOnItemActionItem[] | null): void {
    if (!resultItems || resultItems.length === 0) {
      return;
    }

    for (const item of resultItems) {
      if (!item || item.amount <= 0) continue;
      this.deps.inventoryService.giveItem(
        playerState.userId,
        item.id,
        item.amount,
        item.isIOU ? 1 : 0
      );
    }
  }

  private getActionExpAmount(action: ItemOnItemAction): number {
    if (!action.resultItems || action.resultItems.length === 0) {
      return 0;
    }

    const firstResultItem = action.resultItems[0];
    if (!firstResultItem) {
      return 0;
    }

    const definition = this.deps.itemCatalog.getDefinitionById(firstResultItem.id);
    const expFromObtaining = definition?.expFromObtaining;
    if (!expFromObtaining || !isSkillSlug(expFromObtaining.skill)) {
      return 0;
    }

    return expFromObtaining.amount;
  }

  private performItemOnItemCraft(
    playerState: PlayerState,
    context: {
      useItemId: number;
      usedOnItemId: number;
      action: ItemOnItemAction;
      actionIndex: number;
    }
  ): boolean {
    if (!this.removeActionItems(playerState, context.action.itemsToRemove)) {
      this.deps.messageService.sendServerInfo(playerState.userId, "You don't have the required items.");
      return false;
    }

    this.giveActionItems(playerState, context.action.resultItems);

    const createdPayload = buildCreatedUseItemOnItemActionItemsPayload({
      UseItemID: context.useItemId,
      UsedItemOnID: context.usedOnItemId,
      UseItemOnItemIndex: context.actionIndex
    });
    this.deps.enqueueUserMessage(
      playerState.userId,
      GameAction.CreatedUseItemOnItemActionItems,
      createdPayload
    );

    return true;
  }

  private startItemOnItemSession(playerState: PlayerState, session: ItemOnItemSession): boolean {
    if (this.activeItemOnItemSessions.has(playerState.userId)) {
      this.cancelItemOnItemSession(playerState.userId, true);
    }

    this.activeItemOnItemSessions.set(playerState.userId, session);

    const delayStarted = this.deps.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.NonBlocking,
      ticks: ITEM_ON_ITEM_INTERVAL_TICKS,
      state: session.state ?? undefined,
      skipStateRestore: true,
      onComplete: (userId) => this.handleItemOnItemDelayComplete(userId),
      onInterrupt: (userId) => this.handleItemOnItemDelayInterrupted(userId)
    });

    if (!delayStarted) {
      this.activeItemOnItemSessions.delete(playerState.userId);
      return false;
    }

    if (session.skillToCreate) {
      const skillRef = skillToClientRef(session.skillToCreate);
      if (skillRef !== null) {
        this.deps.eventBus.emit(
          createPlayerStartedSkillingEvent(
            playerState.userId,
            null,
            skillRef,
            EntityType.Environment,
            {
              mapLevel: playerState.mapLevel,
              x: playerState.x,
              y: playerState.y
            }
          )
        );
      }
    }

    return true;
  }

  private handleItemOnItemDelayComplete(userId: number): void {
    const session = this.activeItemOnItemSessions.get(userId);
    if (!session) {
      return;
    }

    const player = this.deps.playerStatesByUserId.get(userId) ?? null;
    if (!player) {
      this.activeItemOnItemSessions.delete(userId);
      return;
    }

    if (session.state !== null && player.currentState !== session.state) {
      this.activeItemOnItemSessions.delete(userId);
      return;
    }

    if (!this.removeActionItems(player, session.action.itemsToRemove)) {
      this.deps.messageService.sendServerInfo(userId, "You don't have the required items.");
      this.endItemOnItemSession(userId, true);
      return;
    }

    this.giveActionItems(player, session.action.resultItems);

    if (session.skillToCreate && session.expPerCraft > 0) {
      this.deps.experienceService.addSkillXp(player, session.skillToCreate, session.expPerCraft);
    }

    const createdPayload = buildCreatedUseItemOnItemActionItemsPayload({
      UseItemID: session.useItemId,
      UsedItemOnID: session.usedOnItemId,
      UseItemOnItemIndex: session.actionIndex
    });
    this.deps.enqueueUserMessage(userId, GameAction.CreatedUseItemOnItemActionItems, createdPayload);

    session.remainingCrafts -= 1;
    if (session.remainingCrafts <= 0) {
      this.endItemOnItemSession(userId, true);
      return;
    }

    const delayStarted = this.deps.delaySystem.startDelay({
      userId,
      type: DelayType.NonBlocking,
      ticks: ITEM_ON_ITEM_INTERVAL_TICKS,
      state: session.state ?? undefined,
      skipStateRestore: true,
      onComplete: (nextUserId) => this.handleItemOnItemDelayComplete(nextUserId),
      onInterrupt: (nextUserId) => this.handleItemOnItemDelayInterrupted(nextUserId)
    });
    if (!delayStarted) {
      this.endItemOnItemSession(userId, true);
    }
  }

  private handleItemOnItemDelayInterrupted(userId: number): void {
    this.cancelItemOnItemSession(userId, true);
  }

  private startItemOnEntitySession(playerState: PlayerState, session: ItemOnEntitySession): void {
    if (this.activeItemOnEntitySessions.has(playerState.userId)) {
      this.cancelItemOnEntitySession(playerState.userId, true);
    }

    this.activeItemOnEntitySessions.set(playerState.userId, session);

    const delayStarted = this.deps.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.NonBlocking,
      ticks: ITEM_ON_ENTITY_INTERVAL_TICKS,
      state: session.state ?? undefined,
      skipStateRestore: true,
      onComplete: (userId) => this.handleItemOnEntityDelayComplete(userId),
      onInterrupt: (userId) => this.handleItemOnEntityDelayInterrupted(userId)
    });

    if (!delayStarted) {
      this.activeItemOnEntitySessions.delete(playerState.userId);
      return;
    }

    if (session.recipe.expSkill) {
      const skillRef = skillToClientRef(session.recipe.expSkill);
      if (skillRef !== null) {
        const targetingPayload = buildStartedTargetingPayload({
          EntityID: playerState.userId,
          EntityType: EntityType.Player,
          TargetID: session.targetId,
          TargetType: session.targetType
        });
        this.deps.enqueueUserMessage(playerState.userId, GameAction.StartedTargeting, targetingPayload);

        const untargetingPayload = buildStoppedTargetingPayload({
          EntityID: playerState.userId,
          EntityType: EntityType.Player
        });
        this.deps.enqueueUserMessage(playerState.userId, GameAction.StoppedTargeting, untargetingPayload);

        this.deps.eventBus.emit(
          createPlayerStartedSkillingEvent(
            playerState.userId,
            session.targetId,
            skillRef,
            session.targetType,
            {
              mapLevel: playerState.mapLevel,
              x: playerState.x,
              y: playerState.y
            }
          )
        );
      }
    }
  }

  private handleItemOnEntityDelayComplete(userId: number): void {
    const session = this.activeItemOnEntitySessions.get(userId);
    if (!session) {
      return;
    }

    const player = this.deps.playerStatesByUserId.get(userId) ?? null;
    if (!player) {
      this.activeItemOnEntitySessions.delete(userId);
      return;
    }

    if (session.state !== null && player.currentState !== session.state) {
      this.activeItemOnEntitySessions.delete(userId);
      return;
    }

    if (session.remainingCrafts <= 0) {
      this.endItemOnEntitySession(userId, true);
      return;
    }

    if (!this.validateEntityCraftCapacity(player, session.recipe)) {
      this.deps.messageService.sendServerInfo(userId, "Your inventory is full.");
      this.endItemOnEntitySession(userId, true);
      return;
    }

    if (!this.consumeEntityRecipeItemsByUser(userId, session.recipe)) {
      this.deps.messageService.sendServerInfo(userId, "You have nothing left to craft.");
      this.endItemOnEntitySession(userId, true);
      return;
    }

    if (!this.giveEntityRecipeOutputByUser(userId, session.recipe)) {
      this.deps.messageService.sendServerInfo(userId, "Your inventory is full.");
      this.endItemOnEntitySession(userId, true);
      return;
    }

    if (session.recipe.expSkill && session.recipe.expAmount > 0) {
      this.deps.experienceService.addSkillXp(player, session.recipe.expSkill, session.recipe.expAmount);
    }

    const createdPayload = buildCreatedItemPayload({
      ItemID: session.recipe.outputItemId,
      Amount: 1,
      RecipeInstancesToRemove: 1
    });
    this.deps.enqueueUserMessage(userId, GameAction.CreatedItem, createdPayload);

    session.remainingCrafts -= 1;
    if (session.remainingCrafts <= 0) {
      this.endItemOnEntitySession(userId, true);
      return;
    }

    const delayStarted = this.deps.delaySystem.startDelay({
      userId,
      type: DelayType.NonBlocking,
      ticks: ITEM_ON_ENTITY_INTERVAL_TICKS,
      state: session.state ?? undefined,
      skipStateRestore: true,
      onComplete: (nextUserId) => this.handleItemOnEntityDelayComplete(nextUserId),
      onInterrupt: (nextUserId) => this.handleItemOnEntityDelayInterrupted(nextUserId)
    });
    if (!delayStarted) {
      this.endItemOnEntitySession(userId, true);
    }
  }

  private handleItemOnEntityDelayInterrupted(userId: number): void {
    this.cancelItemOnEntitySession(userId, true);
  }

  private endItemOnEntitySession(userId: number, setIdle: boolean): void {
    this.activeItemOnEntitySessions.delete(userId);
    this.deps.delaySystem.clearDelay(userId);
    if (setIdle) {
      this.deps.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
    }
  }

  private cancelItemOnEntitySession(userId: number, setIdle: boolean = true): void {
    if (!this.activeItemOnEntitySessions.has(userId)) {
      return;
    }
    this.endItemOnEntitySession(userId, setIdle);
  }

  private validateEntityCraftCapacity(playerState: PlayerState, recipe: ItemOnEntityRecipe): boolean {
    const previewInventory = playerState.inventory.map((item) =>
      item ? ([...item] as InventoryItem) : null
    );
    const previewManager = new InventoryManager(previewInventory, this.deps.itemCatalog);
    for (const ingredient of recipe.ingredients) {
      const removePreview = previewManager.removeItems(ingredient.itemId, ingredient.amount, 0);
      if (removePreview.removed < ingredient.amount) {
        return false;
      }
    }
    const addPreview = previewManager.addItems(recipe.outputItemId, 1, 0);
    return addPreview.overflow === 0;
  }

  private consumeEntityRecipeItemsByUser(userId: number, recipe: ItemOnEntityRecipe): boolean {
    for (const ingredient of recipe.ingredients) {
      const removeResult = this.deps.inventoryService.removeItem(
        userId,
        ingredient.itemId,
        ingredient.amount,
        0
      );
      if (removeResult.removed < ingredient.amount) {
        return false;
      }
    }
    return true;
  }

  private giveEntityRecipeOutputByUser(userId: number, recipe: ItemOnEntityRecipe): boolean {
    const giveResult = this.deps.inventoryService.giveItem(
      userId,
      recipe.outputItemId,
      1,
      0
    );
    return giveResult.added >= 1;
  }

  private getMaxCraftsForEntityRecipe(
    playerState: PlayerState,
    ingredients: ItemOnEntityRecipeIngredient[]
  ): number {
    let maxCrafts = Number.POSITIVE_INFINITY;
    for (const ingredient of ingredients) {
      const available = playerState.countItem(ingredient.itemId, 0);
      const craftable = Math.floor(available / ingredient.amount);
      if (craftable < maxCrafts) {
        maxCrafts = craftable;
      }
    }
    return Number.isFinite(maxCrafts) ? maxCrafts : 0;
  }

  private handleItemOnEntityRecipe(actionName: string, context: ItemOnWorldEntityContext): void {
    const recipe = this.itemOnEntityRecipesByAction.get(actionName)?.get(context.itemId);
    if (!recipe) {
      context.messageService.sendServerInfo(context.playerState.userId, DEFAULT_INTERACTION_MESSAGE);
      return;
    }

    const maxCrafts = this.getMaxCraftsForEntityRecipe(context.playerState, recipe.ingredients);
    if (maxCrafts <= 0) {
      context.messageService.sendServerInfo(context.playerState.userId, "You don't have the required items.");
      return;
    }

    if (recipe.expSkill) {
      if (!this.validateEntityCraftCapacity(context.playerState, recipe)) {
        context.messageService.sendServerInfo(context.playerState.userId, "Your inventory is full.");
        return;
      }
      const state = getStateForSkill(recipe.expSkill);
      this.startItemOnEntitySession(context.playerState, {
        userId: context.playerState.userId,
        actionName,
        recipe,
        targetId: context.entityState.id,
        targetType: EntityType.Environment,
        remainingCrafts: maxCrafts,
        state
      });
      return;
    }

    if (!this.validateEntityCraftCapacity(context.playerState, recipe)) {
      context.messageService.sendServerInfo(context.playerState.userId, "Your inventory is full.");
      return;
    }

    if (!this.consumeEntityRecipeItemsByUser(context.playerState.userId, recipe)) {
      context.messageService.sendServerInfo(context.playerState.userId, "You don't have the required items.");
      return;
    }

    if (!this.giveEntityRecipeOutputByUser(context.playerState.userId, recipe)) {
      context.messageService.sendServerInfo(context.playerState.userId, "Your inventory is full.");
      return;
    }

    const createdPayload = buildCreatedItemPayload({
      ItemID: recipe.outputItemId,
      Amount: 1,
      RecipeInstancesToRemove: 1
    });
    this.deps.enqueueUserMessage(context.playerState.userId, GameAction.CreatedItem, createdPayload);
  }

  private endItemOnItemSession(userId: number, setIdle: boolean): void {
    this.activeItemOnItemSessions.delete(userId);
    this.deps.delaySystem.clearDelay(userId);
    if (setIdle) {
      this.deps.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
    }
  }

  cancelItemOnItemSession(userId: number, setIdle: boolean = true): void {
    if (!this.activeItemOnItemSessions.has(userId)) {
      return;
    }
    this.endItemOnItemSession(userId, setIdle);
  }
}

function getItemRecipeIngredients(definition: ItemDefinition): ItemOnEntityRecipeIngredient[] {
  const recipe = definition.recipe as unknown;
  if (Array.isArray(recipe)) {
    return recipe
      .map((entry) => ({
        itemId: Number((entry as any).itemId),
        amount: Number((entry as any).amount)
      }))
      .filter((entry) => Number.isInteger(entry.itemId) && Number.isInteger(entry.amount) && entry.amount > 0);
  }

  if (recipe && typeof recipe === "object" && Array.isArray((recipe as any).ingredients)) {
    return (recipe as any).ingredients
      .map((entry: any) => ({
        itemId: Number(entry.itemId),
        amount: Number(entry.amount)
      }))
      .filter((entry: ItemOnEntityRecipeIngredient) =>
        Number.isInteger(entry.itemId) && Number.isInteger(entry.amount) && entry.amount > 0
      );
  }

  return [];
}

function selectEntityRecipeForIngredient(
  recipes: ItemOnEntityRecipe[],
  itemId: number
): ItemOnEntityRecipe | null {
  const exact = recipes.find((recipe) =>
    recipe.ingredients.length === 1 && recipe.ingredients[0]?.itemId === itemId
  );
  return exact ?? recipes[0] ?? null;
}

function getStateForSkill(skill: string): States | null {
  switch (skill) {
    case "crafting":
      return States.CraftingState;
    case "smithing":
      return States.SmithingState;
    case "smelting":
      return States.SmeltingState;
    case "potionmaking":
      return States.PotionMakingState;
    case "cooking":
      return States.CookingState;
    default:
      return null;
  }
}
