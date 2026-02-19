import { GameAction } from "../../protocol/enums/GameAction";
import { MenuType } from "../../protocol/enums/MenuType";
import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { buildOpenedSkillingMenuPayload } from "../../protocol/packets/actions/OpenedSkillingMenu";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import { buildCreatedItemPayload } from "../../protocol/packets/actions/CreatedItem";
import type { CreateItemPayload } from "../../protocol/packets/actions/CreateItem";
import { SkillClientReference, isSkillSlug } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
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

const MENU_ITEM_IDS: Partial<Record<MenuType, number[]>> = {
  [MenuType.Smelting]: [
    70, // bronze bar
    148, // iron bar
    383, // pig iron bar
    143, // steel bar
    71, // silver bar
    144, // palladium bar
    72, // gold bar
    145, // coronium bar
    253 // celadium bar
  ],
  [MenuType.Smithing]: [
    92, // bronze gloves
    328, // bronze arrowheads
    73, // bronze pickaxe
    314, // bronze hatchet
    52, // bronze helm
    364, // bronze scimitar
    58, // bronze longsword
    122, // bronze full helm
    56, // bronze battleaxe
    41, // bronze platelegs
    185, // bronze shield
    370, // bronze chainmail body
    97, // bronze great sword
    40, // bronze chestplate
    121, // iron gloves
    329, // iron arrowheads
    74, // iron pickaxe
    315, // iron hatchet
    120, // iron helm
    365, // iron scimitar
    59, // iron longsword
    128, // iron full helm
    57, // iron battleaxe
    119, // iron platelegs
    191, // iron shield
    371, // iron chainmail body
    126, // iron great sword
    118, // iron chestplate
    93, // steel gloves
    330, // steel arrowheads
    75, // steel pickaxe
    316, // steel hatchet
    53, // steel helm
    366, // steel scimitar
    60, // steel longsword
    123, // steel full helm
    63, // steel battleaxe
    43, // steel platelegs
    186, // steel shield
    372, // steel chainmail body
    127, // steel great sword
    42, // steel chestplate
    94, // palladium gloves
    331, // palladium arrowheads
    76, // palladium pickaxe
    317, // palladium hatchet
    54, // palladium helm
    367, // palladium scimitar
    61, // palladium longsword
    124, // palladium full helm
    78, // palladium battleaxe
    45, // palladium platelegs
    187, // palladium shield
    373, // palladium chainmail body
    146, // palladium great sword
    44, // palladium chestplate
    95, // coronium gloves
    332, // coronium arrowheads
    77, // coronium pickaxe
    318, // coronium hatchet
    55, // coronium helm
    368, // coronium scimitar
    62, // coronium longsword
    125, // coronium full helm
    96, // coronium battleaxe
    47, // coronium platelegs
    188, // coronium shield
    374, // coronium chainmail body
    147, // coronium great sword
    46, // coronium chestplate
    246, // celadon gloves
    333, // celadon arrowheads
    245, // celadon pickaxe
    319, // celadon hatchet
    258, // celadon helm
    369, // celadon scimitar
    249, // celadon longsword
    247, // celadon full helm
    250, // celadon battleaxe
    244, // celadon platelegs
    248, // celadon shield
    377, // celadon chainmail body
    251, // celadon great sword
    243 // celadon chestplate
  ],
  [MenuType.SmeltingKiln]: [
    380, // monk's necklace
    194, // amethyst necklace
    195, // sapphire necklace
    196, // emerald necklace
    197, // topaz necklace
    198, // citrine necklace
    199, // ruby necklace
    200, // diamond necklace
    426, // carbonado necklace
    427, // gold amethyst necklace
    428, // gold sapphire necklace
    429, // gold emerald necklace
    430, // gold topaz necklace
    431, // gold citrine necklace
    432, // gold ruby necklace
    433, // gold diamond necklace
    434 // gold carbonado necklace
  ],
  [MenuType.CraftingTable]: [
    503, // leather gloves
    493, // leather bracers
    498, // leather boots
    507, // leather chaps
    492, // leather body armour
    494, // plains dragonleather bracers
    504, // plains dragonleather chaps
    495, // water dragonleather bracers
    505, // water dragonleather chaps
    496, // fire dragonleather bracers
    506, // fire dragonleather chaps
    552, // shadow dragonleather bracers
    554, // sky dragonleather bracers
    551, // shadow dragonleather chaps
    553 // sky dragonleather chaps
  ],
  [MenuType.PotionMaking]: [
    261, // potion of accuracy (2)
    275, // potion of forestry (2)
    267, // potion of fishing (2)
    271, // potion of mining (2)
    263, // potion of defense (2)
    269, // potion of smithing (2)
    511, // potion of stamina (2)
    273, // potion of restoration (2)
    265, // potion of strength (2)
    285, // potion of mischief (2)
    291 // potion of magic (2)
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

    for (const [menuTypeKey, itemIds] of Object.entries(MENU_ITEM_IDS)) {
      const menuType = Number(menuTypeKey) as MenuType;
      const menuDefinition = this.menuDefinitions.get(menuType);
      if (!menuDefinition) {
        continue;
      }

      for (const itemId of itemIds ?? []) {
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

    const outputItemId = resolveCraftOutputItemId(session.menuType, session.itemId);
    const outputAmount = getCraftOutputAmount(outputItemId);
    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      userId,
      outputItemId,
      0
    );
    if (availableCapacity + recipeIngredients.length < outputAmount) {
      this.config.messageService.sendServerInfo(userId, "Your inventory is full.");
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
    if (expFromObtaining && isSkillSlug(expFromObtaining.skill)) {
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
