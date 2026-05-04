import { GameAction } from "../../protocol/enums/GameAction";
import { MenuType } from "../../protocol/enums/MenuType";
import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { buildOpenedSkillingMenuPayload } from "../../protocol/packets/actions/OpenedSkillingMenu";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import { buildCreatedItemPayload } from "../../protocol/packets/actions/CreatedItem";
import type { CreateItemPayload } from "../../protocol/packets/actions/CreateItem";
import { SkillClientReference, isSkillSlug, clientRefToSkill } from "../../world/PlayerState";
import type { FullInventory, InventoryItem, PlayerState } from "../../world/PlayerState";
import type { ItemCatalog, ItemDefinition } from "../../world/items/ItemCatalog";
import type { ExperienceService } from "./ExperienceService";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { PacketAuditService } from "./PacketAuditService";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";
import { InventoryManager } from "../../world/systems/InventoryManager";

type SkillingMenuDefinition = {
  menuType: MenuType;
  state: States;
  allowedItemIds: Set<number>;
};

type ActiveSkillingMenu = {
  menuType: MenuType;
  targetId: number;
};

export interface SkillingMenuServiceConfig {
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  messageService: MessageService;
  playerStatesByUserId: Map<number, PlayerState>;
  itemCatalog: ItemCatalog;
  inventoryService: InventoryService;
  experienceService: ExperienceService;
  delaySystem: DelaySystem;
  stateMachine: StateMachine;
  eventBus: EventBus;
  packetAudit?: PacketAuditService | null;
}

const MENU_STATES: Record<MenuType, States> = {
  [MenuType.Smelting]: States.SmeltingState,
  [MenuType.Smithing]: States.SmithingState,
  [MenuType.SmeltingKiln]: States.SmeltingKilnState,
  [MenuType.CraftingTable]: States.CraftingAtTableState,
  [MenuType.Inventory]: States.IdleState,
  [MenuType.Bank]: States.IdleState,
  [MenuType.Shop]: States.IdleState,
  [MenuType.TradeInventory]: States.IdleState,
  [MenuType.TradeMyOfferedItems]: States.IdleState,
  [MenuType.TradeOtherPlayerOfferedItems]: States.IdleState,
  [MenuType.Loadout]: States.IdleState,
  [MenuType.ChangeAppearance]: States.IdleState,
  [MenuType.Magic]: States.IdleState,
  [MenuType.QuestDetail]: States.IdleState,
  [MenuType.PotionMaking]: States.PotionMakingState,
  [MenuType.Welcome]: States.IdleState,
  [MenuType.CameraSettings]: States.IdleState,
  [MenuType.SkillGuide]: States.IdleState,
  [MenuType.Loot]: States.IdleState,
  [MenuType.FriendList]: States.IdleState,
  [MenuType.Stats]: States.IdleState,
  [MenuType.Quests]: States.IdleState,
  [MenuType.Settings]: States.IdleState,
  [MenuType.TextInput]: States.IdleState,
  [MenuType.Confirmation]: States.IdleState,
  [MenuType.Chat]: States.IdleState,
  [MenuType.PrivateChat]: States.IdleState,
  [MenuType.TradeMenu]: States.IdleState,
  [MenuType.TreasureMap]: States.IdleState,
  [MenuType.GraphicsSettings]: States.IdleState,
  [MenuType.ChatSettings]: States.IdleState,
  [MenuType.Moderation]: States.IdleState
};

const SKILLING_MENU_TYPES = [
  MenuType.Smelting,
  MenuType.Smithing,
  MenuType.SmeltingKiln,
  MenuType.CraftingTable,
  MenuType.PotionMaking
] as const;

export type MenuItemConfig = { itemId: number; level: number };

const MENU_ITEM_IDS: Partial<Record<MenuType, MenuItemConfig[]>> = {
  [MenuType.Smelting]: [
    { itemId: 70, level: 1 }, // bronze bar
    { itemId: 148, level: 14 }, // iron bar
    { itemId: 383, level: 14 }, // pig iron bar
    { itemId: 143, level: 28 }, // steel bar
    { itemId: 71, level: 42 }, // silver bar
    { itemId: 144, level: 50 }, // palladium bar
    { itemId: 72, level: 70 }, // gold bar
    { itemId: 145, level: 75 }, // coronium bar
    { itemId: 253, level: 94 }, // celadium bar
  ],
  [MenuType.Smithing]: [
    { itemId: 92, level: 1 }, // bronze gloves
    { itemId: 328, level: 2 }, // bronze arrowheads
    { itemId: 73, level: 3 }, // bronze pickaxe
    { itemId: 314, level: 4 }, // bronze hatchet
    { itemId: 52, level: 5 }, // bronze helm
    { itemId: 364, level: 6 }, // bronze scimitar
    { itemId: 58, level: 7 }, // bronze longsword
    { itemId: 122, level: 8 }, // bronze full helm
    { itemId: 56, level: 9 }, // bronze battleaxe
    { itemId: 41, level: 11 }, // bronze platelegs
    { itemId: 185, level: 12 }, // bronze shield
    { itemId: 370, level: 13 }, // bronze chainmail body
    { itemId: 97, level: 14 }, // bronze great sword
    { itemId: 40, level: 16 }, // bronze chestplate
    { itemId: 121, level: 17 }, // iron gloves
    { itemId: 329, level: 18 }, // iron arrowheads
    { itemId: 74, level: 19 }, // iron pickaxe
    { itemId: 315, level: 20 }, // iron hatchet
    { itemId: 120, level: 21 }, // iron helm
    { itemId: 365, level: 22 }, // iron scimitar
    { itemId: 59, level: 23 }, // iron longsword
    { itemId: 128, level: 24 }, // iron full helm
    { itemId: 57, level: 25 }, // iron battleaxe
    { itemId: 119, level: 27 }, // iron platelegs
    { itemId: 191, level: 28 }, // iron shield
    { itemId: 371, level: 29 }, // iron chainmail body
    { itemId: 126, level: 30 }, // iron great sword
    { itemId: 118, level: 32 }, // iron chestplate
    { itemId: 93, level: 33 }, // steel gloves
    { itemId: 330, level: 34 }, // steel arrowheads
    { itemId: 75, level: 35 }, // steel pickaxe
    { itemId: 316, level: 36 }, // steel hatchet
    { itemId: 53, level: 37 }, // steel helm
    { itemId: 366, level: 38 }, // steel scimitar
    { itemId: 60, level: 39 }, // steel longsword
    { itemId: 123, level: 40 }, // steel full helm
    { itemId: 63, level: 41 }, // steel battleaxe
    { itemId: 43, level: 43 }, // steel platelegs
    { itemId: 186, level: 44 }, // steel shield
    { itemId: 372, level: 45 }, // steel chainmail body
    { itemId: 127, level: 46 }, // steel great sword
    { itemId: 42, level: 48 }, // steel chestplate
    { itemId: 255, level: 50 }, // silver warrior helm
    { itemId: 254, level: 75 }, // gold warrior helm
    { itemId: 94, level: 52 }, // palladium gloves
    { itemId: 331, level: 53 }, // palladium arrowheads
    { itemId: 76, level: 54 }, // palladium pickaxe
    { itemId: 317, level: 55 }, // palladium hatchet
    { itemId: 54, level: 56 }, // palladium helm
    { itemId: 367, level: 57 }, // palladium scimitar
    { itemId: 61, level: 58 }, // palladium longsword
    { itemId: 124, level: 60 }, // palladium full helm
    { itemId: 78, level: 62 }, // palladium battleaxe
    { itemId: 45, level: 64 }, // palladium platelegs
    { itemId: 187, level: 66 }, // palladium shield
    { itemId: 373, level: 68 }, // palladium chainmail body
    { itemId: 146, level: 70 }, // palladium great sword
    { itemId: 44, level: 72 }, // palladium chestplate
    { itemId: 95, level: 76 }, // coronium gloves
    { itemId: 332, level: 77 }, // coronium arrowheads
    { itemId: 77, level: 78 }, // coronium pickaxe
    { itemId: 318, level: 79 }, // coronium hatchet
    { itemId: 55, level: 80 }, // coronium helm
    { itemId: 368, level: 81 }, // coronium scimitar
    { itemId: 62, level: 82 }, // coronium longsword
    { itemId: 125, level: 84 }, // coronium full helm
    { itemId: 96, level: 86 }, // coronium battleaxe
    { itemId: 47, level: 88 }, // coronium platelegs
    { itemId: 188, level: 90 }, // coronium shield
    { itemId: 374, level: 92 }, // coronium chainmail body
    { itemId: 147, level: 94 }, // coronium great sword
    { itemId: 46, level: 96 }, // coronium chestplate
    { itemId: 246, level: 96 }, // celadon gloves
    { itemId: 333, level: 96 }, // celadon arrowheads
    { itemId: 245, level: 96 }, // celadon pickaxe
    { itemId: 319, level: 96 }, // celadon hatchet
    { itemId: 258, level: 96 }, // celadon helm
    { itemId: 369, level: 97 }, // celadon scimitar
    { itemId: 249, level: 97 }, // celadon longsword
    { itemId: 247, level: 97 }, // celadon full helm
    { itemId: 250, level: 97 }, // celadon battleaxe
    { itemId: 244, level: 98 }, // celadon platelegs
    { itemId: 248, level: 98 }, // celadon shield
    { itemId: 377, level: 98 }, // celadon chainmail body
    { itemId: 251, level: 99 }, // celadon great sword
    { itemId: 243, level: 100 }, // celadon chestplate
  ],
  [MenuType.SmeltingKiln]: [
    { itemId: 380, level: 8 }, // monk's necklace
    { itemId: 194, level: 13 }, // amethyst necklace
    { itemId: 195, level: 24 }, // sapphire necklace
    { itemId: 196, level: 35 }, // emerald necklace
    { itemId: 197, level: 46 }, // topaz necklace
    { itemId: 198, level: 57 }, // citrine necklace
    { itemId: 199, level: 68 }, // ruby necklace
    { itemId: 200, level: 79 }, // diamond necklace
    { itemId: 426, level: 90 }, // carbonado necklace
    { itemId: 427, level: 79 }, // gold amethyst necklace
    { itemId: 428, level: 82 }, // gold sapphire necklace
    { itemId: 429, level: 85 }, // gold emerald necklace
    { itemId: 430, level: 88 }, // gold topaz necklace
    { itemId: 431, level: 91 }, // gold citrine necklace
    { itemId: 432, level: 94 }, // gold ruby necklace
    { itemId: 433, level: 97 }, // gold diamond necklace
    { itemId: 434, level: 100 }, // gold carbonado necklace
  ],
  [MenuType.CraftingTable]: [
    { itemId: 503, level: 5 }, // leather gloves
    { itemId: 493, level: 5 }, // leather bracers
    { itemId: 498, level: 10 }, // leather boots
    { itemId: 507, level: 15 }, // leather chaps
    { itemId: 492, level: 20 }, // leather body armour
    { itemId: 494, level: 30 }, // plains dragonleather bracers
    { itemId: 504, level: 35 }, // plains dragonleather chaps
    { itemId: 495, level: 45 }, // water dragonleather bracers
    { itemId: 505, level: 50 }, // water dragonleather chaps
    { itemId: 496, level: 60 }, // fire dragonleather bracers
    { itemId: 506, level: 65 }, // fire dragonleather chaps
    { itemId: 552, level: 80 }, // shadow dragonleather bracers
    { itemId: 554, level: 80 }, // sky dragonleather bracers
    { itemId: 551, level: 85 }, // shadow dragonleather chaps
    { itemId: 553, level: 85 }, // sky dragonleather chaps
  ],
  [MenuType.PotionMaking]: [
    { itemId: 261, level: 1 }, // potion of accuracy (2)
    { itemId: 275, level: 8 }, // potion of forestry (2)
    { itemId: 267, level: 14 }, // potion of fishing (2)
    { itemId: 271, level: 20 }, // potion of mining (2)
    { itemId: 263, level: 28 }, // potion of defense (2)
    { itemId: 269, level: 36 }, // potion of smithing (2)
    { itemId: 511, level: 40 }, // potion of stamina (2)
    { itemId: 273, level: 42 }, // potion of restoration (2)
    { itemId: 265, level: 50 }, // potion of strength (2)
    { itemId: 285, level: 56 }, // potion of mischief (2)
    { itemId: 291, level: 62 }, // potion of magic (2)
  ]
};

const CRAFT_OUTPUT_AMOUNT_BY_ITEM_ID: Record<number, number> = {
  70: 1, // bronze bar
  148: 1, // iron bar
  383: 1, // pig iron bar
  143: 1, // steel bar
  71: 1, // silver bar
  144: 1, // palladium bar
  72: 1, // gold bar
  145: 1, // coronium bar
  253: 1, // celadium bar
  328: 5, // bronze arrowheads
  329: 5, // iron arrowheads
  330: 5, // steel arrowheads
  331: 5, // palladium arrowheads
  332: 5, // coronium arrowheads
  333: 5 // celadon arrowheads
};

const CRAFT_INTERVAL_TICKS = 5;
const IRON_BAR_ITEM_ID = 148;
const PIG_IRON_BAR_ITEM_ID = 383;
const PIG_IRON_CHANCE = 0.4;

type CraftingSession = {
  userId: number;
  menuType: MenuType;
  targetId: number;
  itemId: number;
  remainingCrafts: number;
};

export class SkillingMenuService {
  private readonly menuDefinitions = new Map<MenuType, SkillingMenuDefinition>();
  private readonly activeMenusByUserId = new Map<number, ActiveSkillingMenu>();
  private readonly activeCraftingSessions = new Map<number, CraftingSession>();

  constructor(private readonly config: SkillingMenuServiceConfig) {
    this.buildMenuDefinitions();
  }

  handlePlayerDisconnect(userId: number): void {
    this.activeMenusByUserId.delete(userId);
    this.cancelSession(userId, false);
  }

  closeMenu(userId: number, didExhaustResources: boolean = false): void {
    const activeMenu = this.activeMenusByUserId.get(userId);
    if (!activeMenu) {
      return;
    }

    const stoppedPayload = buildStoppedSkillingPayload({
      PlayerEntityID: userId,
      Skill: getSkillReferenceForMenu(activeMenu.menuType),
      DidExhaustResources: didExhaustResources
    });
    this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);
    this.activeMenusByUserId.delete(userId);
  }

  openMenu(userId: number, targetId: number, menuType: MenuType): boolean {
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[SkillingMenu] Cannot open menu ${menuType} for missing player ${userId}`);
      return false;
    }

    const definition = this.menuDefinitions.get(menuType);
    if (!definition) {
      this.config.messageService.sendServerInfo(userId, "This skilling menu is not available.");
      return false;
    }

    this.activeMenusByUserId.set(userId, { menuType, targetId });

    const payload = buildOpenedSkillingMenuPayload({
      TargetID: targetId,
      MenuType: menuType
    });
    this.config.enqueueUserMessage(userId, GameAction.OpenedSkillingMenu, payload);
    return true;
  }

  handleCreateItem(userId: number, payload: CreateItemPayload): void {
    const itemId = Number(payload.ItemID);
    const amount = Number(payload.Amount);
    const menuTypeValue = Number(payload.MenuType);
    const logInvalid = (reason: string, details?: Record<string, unknown>) => {
      this.config.packetAudit?.logInvalidPacket({
        userId,
        packetName: "CreateItem",
        reason,
        payload,
        details
      });
    };

    if (!Number.isInteger(itemId) || itemId <= 0) {
      logInvalid("invalid_item", { itemId });
      //this.config.messageService.sendServerInfo(userId, "Invalid item selection.");
      return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      logInvalid("invalid_amount", { amount });
      //this.config.messageService.sendServerInfo(userId, "Invalid item amount.");
      return;
    }

    if (!isMenuType(menuTypeValue)) {
      logInvalid("invalid_menu_type", { menuType: menuTypeValue });
      //this.config.messageService.sendServerInfo(userId, "Invalid skilling menu.");
      return;
    }

    const activeMenu = this.activeMenusByUserId.get(userId);
    if (!activeMenu || activeMenu.menuType !== menuTypeValue) {
      logInvalid("menu_mismatch", { menuType: menuTypeValue });
      //this.config.messageService.sendServerInfo(userId, "You are not using that skilling menu.");
      return;
    }

    const menuDefinition = this.menuDefinitions.get(menuTypeValue);
    if (!menuDefinition) {
      logInvalid("menu_definition_missing", { menuType: menuTypeValue });
      //this.config.messageService.sendServerInfo(userId, "This skilling menu is not available.");
      return;
    }

    if (!menuDefinition.allowedItemIds.has(itemId)) {
      logInvalid("item_not_in_menu", { menuType: menuTypeValue, itemId });
      //this.config.messageService.sendServerInfo(userId, "That item is not available from this menu yet.");
      return;
    }

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      logInvalid("player_state_missing");
      //this.config.messageService.sendServerInfo(userId, "Player state not found.");
      return;
    }

    if (
      playerState.currentState === States.MovingState ||
      playerState.currentState === States.MovingTowardTargetState
    ) {
      this.closeMenu(userId, false);
      //logInvalid("player_is_moving", { state: playerState.currentState });
      return;
    }

    const itemName = this.config.itemCatalog.getDefinitionById(itemId)?.name ?? "that item";
    const requirementFailure = getMenuRequirementFailure({
      menuType: menuDefinition.menuType,
      itemId,
      itemName,
      playerState
    });
    if (requirementFailure) {
      this.stopCraftingForRequirement(userId, menuDefinition.menuType, requirementFailure);
      return;
    }

    const itemDefinition = this.config.itemCatalog.getDefinitionById(itemId);
    if (!itemDefinition) {
      logInvalid("item_definition_missing", { itemId });
      //this.config.messageService.sendServerInfo(userId, "Item definition missing.");
      return;
    }

    const recipeIngredients = getRecipeIngredients(itemDefinition);
    if (recipeIngredients.length === 0) {
      logInvalid("recipe_missing", { itemId });
      //this.config.messageService.sendServerInfo(userId, "This item cannot be crafted.");
      return;
    }

    const maxCraftable = calculateMaxCraftable(playerState, recipeIngredients);
    if (maxCraftable < 1) {
      const ingredientName = this.config.itemCatalog.getDefinitionById(recipeIngredients[0]?.itemId ?? 0)?.name ?? "materials";
      this.config.messageService.sendServerInfo(
        userId,
        `You need ${recipeIngredients[0]?.amount ?? 1} ${ingredientName} to make that.`
      );
      this.config.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
      logInvalid("insufficient_ingredients", { itemId });
      return;
    }

    const craftsToAttempt = Math.min(amount, maxCraftable);
    this.startCraftingSession(userId, activeMenu, menuDefinition, itemId, craftsToAttempt);
  }

  private buildMenuDefinitions(): void {
    this.menuDefinitions.clear();

    for (const menuType of SKILLING_MENU_TYPES) {
      this.menuDefinitions.set(menuType, {
        menuType,
        state: MENU_STATES[menuType],
        allowedItemIds: new Set<number>()
      });
    }

    for (const [menuTypeKey, items] of Object.entries(MENU_ITEM_IDS)) {
      const menuType = Number(menuTypeKey) as MenuType;
      const menuDefinition = this.menuDefinitions.get(menuType);
      if (!menuDefinition) {
        continue;
      }

      for (const item of items ?? []) {
        const itemId = item.itemId;
        const definition = this.config.itemCatalog.getDefinitionById(itemId);
        if (!definition) {
          console.warn(`[SkillingMenu] Missing item definition ${itemId} for menu ${menuType}`);
          continue;
        }

        if (!isCraftableItem(definition)) {
          console.warn(`[SkillingMenu] Item ${itemId} is not craftable; skipping.`);
          continue;
        }

        menuDefinition.allowedItemIds.add(itemId);
      }
    }
  }

  private startCraftingSession(
    userId: number,
    activeMenu: ActiveSkillingMenu,
    menuDefinition: SkillingMenuDefinition,
    itemId: number,
    amount: number
  ): void {
    if (this.activeCraftingSessions.has(userId)) {
      this.cancelSession(userId, false);
    }

    this.config.stateMachine.setState(
      { type: EntityType.Player, id: userId },
      menuDefinition.state
    );

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (playerState) {
      this.config.eventBus.emit(
        createPlayerStartedSkillingEvent(
          userId,
          activeMenu.targetId,
          getSkillReferenceForMenu(menuDefinition.menuType),
          EntityType.Environment,
          {
            mapLevel: playerState.mapLevel,
            x: playerState.x,
            y: playerState.y
          }
        )
      );
    }

    const session: CraftingSession = {
      userId,
      menuType: menuDefinition.menuType,
      targetId: activeMenu.targetId,
      itemId,
      remainingCrafts: amount
    };

    this.activeCraftingSessions.set(userId, session);

    const delayStarted = this.config.delaySystem.startDelay({
      userId,
      type: DelayType.NonBlocking,
      ticks: CRAFT_INTERVAL_TICKS,
      state: menuDefinition.state,
      skipStateRestore: true,
      onComplete: (nextUserId) => this.handleCraftDelayComplete(nextUserId),
      onInterrupt: (nextUserId) => this.handleCraftDelayInterrupted(nextUserId)
    });

    if (!delayStarted) {
      this.activeCraftingSessions.delete(userId);
      this.config.messageService.sendServerInfo(userId, "You're already busy.");
    }
  }

  private handleCraftDelayComplete(userId: number): void {
    const session = this.activeCraftingSessions.get(userId);
    if (!session) {
      return;
    }

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      this.endSession(userId, false);
      return;
    }

    const menuDefinition = this.menuDefinitions.get(session.menuType);
    if (!menuDefinition || playerState.currentState !== menuDefinition.state) {
      this.endSession(userId, false);
      return;
    }

    if (session.remainingCrafts <= 0) {
      this.endSession(userId, false);
      return;
    }

    const itemDefinition = this.config.itemCatalog.getDefinitionById(session.itemId);
    if (!itemDefinition) {
      this.endSession(userId, false);
      return;
    }

    const recipeIngredients = getRecipeIngredients(itemDefinition);
    if (recipeIngredients.length === 0) {
      this.endSession(userId, false);
      return;
    }

    for (const ingredient of recipeIngredients) {
      if (!playerState.hasItem(ingredient.itemId, ingredient.amount, 0)) {
        this.config.messageService.sendServerInfo(userId, "You have nothing left to craft.");
        this.endSession(userId, true);
        return;
      }
    }

    const outputItemId = resolveCraftOutputItemId(session.menuType, session.itemId);
    const outputAmount = getCraftOutputAmount(outputItemId);
    if (
      !canFitCraftOutputAfterConsumingIngredients(
        playerState,
        this.config.itemCatalog,
        outputItemId,
        outputAmount,
        recipeIngredients
      )
    ) {
      this.config.messageService.sendServerInfo(userId, "Your inventory is full.");
      this.endSession(userId, false);
      return;
    }

    for (const ingredient of recipeIngredients) {
      const removeResult = this.config.inventoryService.removeItem(
        userId,
        ingredient.itemId,
        ingredient.amount,
        0
      );
      if (removeResult.removed < ingredient.amount) {
        this.config.messageService.sendServerInfo(userId, "You have nothing left to craft.");
        this.endSession(userId, true);
        return;
      }
    }

    const giveResult = this.config.inventoryService.giveItem(userId, outputItemId, outputAmount, 0);
    if (giveResult.added < outputAmount) {
      this.config.messageService.sendServerInfo(userId, "Your inventory is full.");
      this.endSession(userId, false);
      return;
    }

    const outputDefinition = this.config.itemCatalog.getDefinitionById(outputItemId);
    const expFromObtaining = outputDefinition?.expFromObtaining ?? itemDefinition.expFromObtaining;
    if (
      outputItemId !== PIG_IRON_BAR_ITEM_ID &&
      expFromObtaining &&
      isSkillSlug(expFromObtaining.skill)
    ) {
      const xpAmount = expFromObtaining.amount * outputAmount;
      if (xpAmount > 0) {
        this.config.experienceService.addSkillXp(playerState, expFromObtaining.skill, xpAmount);
      }
    }

    const createdPayload = buildCreatedItemPayload({
      ItemID: outputItemId,
      Amount: outputAmount,
      RecipeInstancesToRemove: 1
    });
    this.config.enqueueUserMessage(userId, GameAction.CreatedItem, createdPayload);

    session.remainingCrafts -= 1;
    if (session.remainingCrafts <= 0) {
      this.endSession(userId, false);
      return;
    }

    this.config.delaySystem.startDelay({
      userId,
      type: DelayType.NonBlocking,
      ticks: CRAFT_INTERVAL_TICKS,
      state: menuDefinition.state,
      skipStateRestore: true,
      onComplete: (nextUserId) => this.handleCraftDelayComplete(nextUserId),
      onInterrupt: (nextUserId) => this.handleCraftDelayInterrupted(nextUserId)
    });
  }

  private handleCraftDelayInterrupted(userId: number): void {
    if (!this.activeCraftingSessions.has(userId)) {
      return;
    }
    this.endSession(userId, false);
  }

  private endSession(userId: number, didExhaustResources: boolean): void {
    this.cancelSession(userId, didExhaustResources);
    this.config.stateMachine.setState(
      { type: EntityType.Player, id: userId },
      States.IdleState
    );
  }

  private cancelSession(userId: number, didExhaustResources: boolean): void {
    const session = this.activeCraftingSessions.get(userId);
    if (!session) {
      return;
    }

    this.activeCraftingSessions.delete(userId);
    this.config.delaySystem.clearDelay(userId);

    const stoppedPayload = buildStoppedSkillingPayload({
      PlayerEntityID: userId,
      Skill: getSkillReferenceForMenu(session.menuType),
      DidExhaustResources: didExhaustResources
    });
    this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);
    this.activeMenusByUserId.delete(userId);
  }

  private stopCraftingForRequirement(userId: number, menuType: MenuType, message: string): void {
    this.config.messageService.sendServerInfo(userId, message);
    const stoppedSkillingPayload = buildStoppedSkillingPayload({
      PlayerEntityID: userId,
      Skill: getSkillReferenceForMenu(menuType),
      DidExhaustResources: false
    });
    this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedSkillingPayload);
    this.config.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
  }
}

function isMenuType(value: number): value is MenuType {
  return Object.values(MenuType).includes(value as MenuType);
}

type RecipeIngredient = {
  itemId: number;
  amount: number;
};

type MenuRequirementContext = {
  menuType: MenuType;
  itemId: number;
  itemName: string;
  playerState: PlayerState;
};

type MenuRequirementRule = (context: MenuRequirementContext) => string | null;


const MENU_REQUIREMENT_RULES: Partial<Record<MenuType, MenuRequirementRule[]>> = {
  [MenuType.Smithing]: [
    ({ playerState, itemName }) =>
      playerState.hasItem(155, 1, 0) ? null : `You need a hammer to smith ${itemName}`
  ],
  [MenuType.SmeltingKiln]: [
    ({ playerState, itemId, itemName }) => {
      const mouldId = itemId === 380 ? 385 : 384;
      const mouldName = itemId === 380 ? "monk's necklace mould" : "necklace mould";
      return playerState.hasItem(mouldId, 1, 0) ? null : `You need a ${mouldName} to craft ${itemName}.`;
    }
  ]
};

function getMenuRequirementFailure(context: MenuRequirementContext): string | null {
  const items = MENU_ITEM_IDS[context.menuType] ?? [];
  const itemConfig = items.find((i) => i.itemId === context.itemId);
  const requiredLevel = itemConfig?.level ?? 1;
  const skillRef = getSkillReferenceForMenu(context.menuType);
  const skillSlug = clientRefToSkill(skillRef);
  const playerLevel = context.playerState.getSkillBoostedLevel(skillSlug);

  if (playerLevel < requiredLevel) {
    const skillName = skillSlug.charAt(0).toUpperCase() + skillSlug.slice(1);
    return `You need level ${requiredLevel} ${skillName} to make this.`;
  }

  const rules = MENU_REQUIREMENT_RULES[context.menuType] ?? [];
  for (const rule of rules) {
    const failureMessage = rule(context);
    if (failureMessage) {
      return failureMessage;
    }
  }
  return null;
}

function isCraftableItem(definition: ItemDefinition): boolean {
  return !!definition.expFromObtaining && getRecipeIngredients(definition).length > 0;
}

function getCraftOutputAmount(itemId: number): number {
  return CRAFT_OUTPUT_AMOUNT_BY_ITEM_ID[itemId] ?? 1;
}

function resolveCraftOutputItemId(menuType: MenuType, requestedItemId: number): number {
  if (menuType === MenuType.Smelting && requestedItemId === IRON_BAR_ITEM_ID) {
    return Math.random() < PIG_IRON_CHANCE ? PIG_IRON_BAR_ITEM_ID : IRON_BAR_ITEM_ID;
  }
  return requestedItemId;
}

function getSkillReferenceForMenu(menuType: MenuType): SkillClientReference {
  switch (menuType) {
    case MenuType.Smelting:
    case MenuType.Smithing:
      return SkillClientReference.Smithing;
    case MenuType.SmeltingKiln:
    case MenuType.CraftingTable:
      return SkillClientReference.Crafting;
    case MenuType.PotionMaking:
      return SkillClientReference.Potionmaking;
    default:
      return SkillClientReference.Crafting;
  }
}

function getRecipeIngredients(definition: ItemDefinition): RecipeIngredient[] {
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
      .filter((entry: RecipeIngredient) => Number.isInteger(entry.itemId) && Number.isInteger(entry.amount) && entry.amount > 0);
  }

  return [];
}

function calculateMaxCraftable(playerState: PlayerState, ingredients: RecipeIngredient[]): number {
  let maxCraftable = Number.POSITIVE_INFINITY;
  for (const ingredient of ingredients) {
    const available = playerState.countItem(ingredient.itemId, 0);
    const craftable = Math.floor(available / ingredient.amount);
    if (craftable < maxCraftable) {
      maxCraftable = craftable;
    }
  }
  return Number.isFinite(maxCraftable) ? maxCraftable : 0;
}

function canFitCraftOutputAfterConsumingIngredients(
  playerState: PlayerState,
  itemCatalog: ItemCatalog,
  outputItemId: number,
  outputAmount: number,
  recipeIngredients: RecipeIngredient[]
): boolean {
  // Simulate ingredient removal first to account for newly freed slots.
  const simulatedInventory = playerState.inventory.map((slot) =>
    slot ? ([slot[0], slot[1], slot[2]] as InventoryItem) : null
  ) as FullInventory;
  const simulatedInventoryManager = new InventoryManager(simulatedInventory, itemCatalog);

  for (const ingredient of recipeIngredients) {
    const removalResult = simulatedInventoryManager.removeItems(ingredient.itemId, ingredient.amount, 0);
    if (removalResult.removed < ingredient.amount) {
      return false;
    }
  }

  return simulatedInventoryManager.calculateAddCapacity(outputItemId, 0) >= outputAmount;
}
