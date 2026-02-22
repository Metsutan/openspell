import { GameAction } from "../../protocol/enums/GameAction";
import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { SKILLS, SkillClientReference } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { ExperienceService } from "./ExperienceService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { WorldEntityState } from "../state/EntityState";
import { buildCookedItemPayload } from "../../protocol/packets/actions/CookedItem";
import { buildOvercookedItemPayload } from "../../protocol/packets/actions/OvercookedItem";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import type { PacketAuditService } from "./PacketAuditService";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";

/**
 * Cooking data table with calculated no-burn levels
 * Format: [itemName, requiredLevel, noBurnStove, noBurnFire]
 */
const COOKING_NO_BURN_TABLE = [
  ["Bass", 1, 8, 11],
  ["Bluegill", 1, 8, 11],
  ["Rodent Meat", 1, 8, 11],
  ["Chicken", 1, 8, 11],
  ["Baked Potato", 1, 8, 11],
  ["Grilled Corn", 2, 9, 12],
  ["Steak", 5, 12, 16],
  ["Game Meat", 12, 20, 28],
  ["Salmon", 10, 17, 26],
  ["Carp", 15, 23, 34],
  ["Stingray", 20, 31, 45],
  ["Piranha", 25, 42, 45],
  ["Walleye", 35, 55, 58],
  ["Crab", 40, 61, 64],
  ["Koi", 45, 69, 72],
  ["Tuna", 48, 65, 68],
  ["Marlin", 52, 77, 80],
  ["Frog", 55, 80, 83],
  ["Turtle", 60, 83, 86],
  ["Clownfish", 70, 87, 90],
  ["Whaleshark", 71, 88, 91],
  ["Octopus", 82, 97, 100]
] as const;

interface CookingNoBurnData {
  itemName: string;
  requiredLevel: number;
  noBurnStove: number;
  noBurnFire: number;
}

const COOKING_DATA: Record<string, CookingNoBurnData> = Object.fromEntries(
  COOKING_NO_BURN_TABLE.map(([itemName, requiredLevel, noBurnStove, noBurnFire]) => [
    itemName.toLowerCase(),
    {
      itemName,
      requiredLevel,
      noBurnStove,
      noBurnFire
    }
  ])
);

type CookingMethod = "fire" | "stove";

interface CookableItemConfig {
  name: string;
  requiredLevel: number;
  rawItemId: number;
  cookedItemId: number;
  burntItemId: number;
}

const BURNT_FOOD_ITEM_ID = 325;

const COOKABLE_ITEMS: CookableItemConfig[] = [
  { name: "Bass", requiredLevel: 1, rawItemId: 2, cookedItemId: 3, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Bluegill", requiredLevel: 1, rawItemId: 4, cookedItemId: 5, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Rodent Meat", requiredLevel: 1, rawItemId: 239, cookedItemId: 240, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Chicken", requiredLevel: 1, rawItemId: 237, cookedItemId: 238, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Baked Potato", requiredLevel: 1, rawItemId: 98, cookedItemId: 289, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Grilled Corn", requiredLevel: 2, rawItemId: 100, cookedItemId: 290, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Steak", requiredLevel: 5, rawItemId: 233, cookedItemId: 234, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Game Meat", requiredLevel: 12, rawItemId: 321, cookedItemId: 322, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Salmon", requiredLevel: 10, rawItemId: 25, cookedItemId: 26, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Carp", requiredLevel: 15, rawItemId: 33, cookedItemId: 34, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Stingray", requiredLevel: 20, rawItemId: 11, cookedItemId: 12, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Piranha", requiredLevel: 25, rawItemId: 27, cookedItemId: 28, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Walleye", requiredLevel: 35, rawItemId: 35, cookedItemId: 36, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Crab", requiredLevel: 40, rawItemId: 13, cookedItemId: 14, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Koi", requiredLevel: 45, rawItemId: 29, cookedItemId: 30, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Tuna", requiredLevel: 48, rawItemId: 21, cookedItemId: 22, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Marlin", requiredLevel: 52, rawItemId: 17, cookedItemId: 18, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Frog", requiredLevel: 55, rawItemId: 37, cookedItemId: 38, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Turtle", requiredLevel: 60, rawItemId: 31, cookedItemId: 32, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Clownfish", requiredLevel: 70, rawItemId: 15, cookedItemId: 16, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Whaleshark", requiredLevel: 71, rawItemId: 19, cookedItemId: 20, burntItemId: BURNT_FOOD_ITEM_ID },
  { name: "Octopus", requiredLevel: 82, rawItemId: 23, cookedItemId: 24, burntItemId: BURNT_FOOD_ITEM_ID }
];

const COOK_INTERVAL_TICKS = 4;
const DEFAULT_INTERACTION_MESSAGE = "Nothing interesting happens.";

const STOVE_ENTITY_TYPES = new Set(["heatsource"]);
const FIRE_ENTITY_TYPES = new Set(["fire", "searchablefire"]);

export interface CookingServiceConfig {
  inventoryService: InventoryService;
  messageService: MessageService;
  itemCatalog: ItemCatalog;
  experienceService: ExperienceService;
  delaySystem: DelaySystem;
  stateMachine: StateMachine;
  eventBus: EventBus;
  playerStatesByUserId: Map<number, PlayerState>;
  worldEntityStates: Map<number, WorldEntityState>;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  packetAudit?: PacketAuditService | null;
}

interface CookingSession {
  userId: number;
  entityId: number;
  method: CookingMethod;
  item: CookableItemConfig;
}

export class CookingService {
  private readonly activeSessions = new Map<number, CookingSession>();
  private readonly cookableByRawItemId = new Map<number, CookableItemConfig>();

  constructor(private readonly config: CookingServiceConfig) {
    this.seedCookableItems();
  }

  getCookableItemIds(): number[] {
    return Array.from(this.cookableByRawItemId.keys());
  }

  startCooking(playerState: PlayerState, rawItemId: number, entityState: WorldEntityState): boolean {
    if (this.activeSessions.has(playerState.userId)) {
      this.cancelSession(playerState.userId, false);
    }

    const cookableItem = this.cookableByRawItemId.get(rawItemId);
    if (!cookableItem) {
      this.config.messageService.sendServerInfo(playerState.userId, "You can't cook that.");
      return false;
    }

    // Requirement checks use boosted level (potions/prayers), not equipment bonuses.
    const playerLevel = playerState.getSkillBoostedLevel(SKILLS.cooking);
    if (playerLevel < cookableItem.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${cookableItem.requiredLevel} Cooking to cook this.`
      );
      return false;
    }

    const hasRegularRawItem = playerState.hasItem(rawItemId, 1, 0);
    if (!hasRegularRawItem) {
      // Item-on-entity packets only include ItemID (not IOU state), so detect
      // note-only attempts and respond with the generic interaction message.
      if (playerState.hasItem(rawItemId, 1, 1)) {
        this.config.messageService.sendServerInfo(playerState.userId, DEFAULT_INTERACTION_MESSAGE);
        return false;
      }
      this.config.packetAudit?.logInvalidPacket({
        userId: playerState.userId,
        packetName: "Cooking",
        reason: "missing_raw_item",
        details: { rawItemId }
      });
      this.config.messageService.sendServerInfo(playerState.userId, "You don't have that item.");
      return false;
    }

    const session: CookingSession = {
      userId: playerState.userId,
      entityId: entityState.id,
      method: getCookingMethod(entityState.type),
      item: cookableItem
    };
    this.activeSessions.set(playerState.userId, session);

    this.config.eventBus.emit(
      createPlayerStartedSkillingEvent(
        playerState.userId,
        entityState.id,
        SkillClientReference.Cooking,
        EntityType.Environment,
        {
          mapLevel: playerState.mapLevel,
          x: playerState.x,
          y: playerState.y
        }
      )
    );

    const delayStarted = this.config.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.NonBlocking,
      ticks: COOK_INTERVAL_TICKS,
      state: States.CookingState,
      skipStateRestore: true,
      onComplete: (userId) => this.handleCookDelayComplete(userId),
      onInterrupt: (userId) => this.handleCookDelayInterrupted(userId)
    });

    if (!delayStarted) {
      this.activeSessions.delete(playerState.userId);
      this.config.messageService.sendServerInfo(playerState.userId, "You're already busy.");
      return false;
    }

    return true;
  }

  private handleCookDelayComplete(userId: number): void {
    const session = this.activeSessions.get(userId);
    if (!session) {
      return;
    }

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState || playerState.currentState !== States.CookingState) {
      this.activeSessions.delete(userId);
      return;
    }

    const entityState = this.config.worldEntityStates.get(session.entityId);
    if (!entityState || entityState.mapLevel !== playerState.mapLevel) {
      this.endSession(userId);
      return;
    }

    if (!playerState.hasItem(session.item.rawItemId, 1, 0)) {
      this.config.messageService.sendServerInfo(userId, "You have nothing left to cook.");
      this.endSession(userId);
      return;
    }

    const cookableItem = session.item;
    // Requirement checks use boosted level first.
    let playerLevel = playerState.getSkillBoostedLevel(SKILLS.cooking);
    if (playerLevel < cookableItem.requiredLevel) {
      this.config.messageService.sendServerInfo(
        userId,
        `You need level ${cookableItem.requiredLevel} Cooking to cook this.`
      );
      this.endSession(userId);
      return;
    }
    // Burn calculations use effective level, so equipment bonuses (e.g. chef's hat) apply.
    playerLevel += playerState.getSkillBonus(SKILLS.cooking);

    const didBurn = willBurnItem(playerLevel, cookableItem, session.method);
    const cookedItemId = cookableItem.cookedItemId;
    const outputItemId = didBurn ? cookableItem.burntItemId : cookedItemId;

    const removeResult = this.config.inventoryService.removeItem(userId, cookableItem.rawItemId, 1, 0);
    if (removeResult.removed < 1) {
      this.config.messageService.sendServerInfo(userId, "You don't have that item.");
      this.endSession(userId);
      return;
    }

    const giveResult = this.config.inventoryService.giveItem(userId, outputItemId, 1, 0);
    if (giveResult.added < 1 && giveResult.overflow < 1) {
      // Only restore the raw input when the output item was not granted at all.
      // Overflow means InventoryService has already spawned/transferred the output.
      this.config.inventoryService.giveItem(userId, cookableItem.rawItemId, 1, 0);
      this.config.messageService.sendServerInfo(userId, "Your inventory is full.");
      this.endSession(userId);
      return;
    }

    if (didBurn) {
      const payload = buildOvercookedItemPayload({ ItemID: cookableItem.rawItemId });
      this.config.enqueueUserMessage(userId, GameAction.OvercookedItem, payload);
      // this.config.messageService.sendServerInfo(userId, "You accidentally burn the food.");
    } else {
      const cookedDef = this.config.itemCatalog.getDefinitionById(outputItemId);
      const cookedName = cookedDef?.name ?? "food";
      const cookingXp =
        cookedDef?.expFromObtaining?.skill === "cooking" ? cookedDef.expFromObtaining.amount : 0;

      if (cookingXp > 0) {
        this.config.experienceService.addSkillXp(playerState, SKILLS.cooking, cookingXp, {
          sendGainedExp: false
        });
      }

      const payload = buildCookedItemPayload({ ItemID: cookableItem.rawItemId });
      this.config.enqueueUserMessage(userId, GameAction.CookedItem, payload);
      //this.config.messageService.sendServerInfo(userId, `You cook the ${cookedName}.`);
    }

    if (!playerState.hasItem(cookableItem.rawItemId, 1, 0)) {
      this.config.messageService.sendServerInfo(userId, "You have nothing left to cook.");
      this.endSession(userId);
      return;
    }

    this.config.delaySystem.startDelay({
      userId,
      type: DelayType.NonBlocking,
      ticks: COOK_INTERVAL_TICKS,
      state: States.CookingState,
      skipStateRestore: true,
      onComplete: (nextUserId) => this.handleCookDelayComplete(nextUserId),
      onInterrupt: (nextUserId) => this.handleCookDelayInterrupted(nextUserId)
    });
  }

  private handleCookDelayInterrupted(userId: number): void {
    if (!this.activeSessions.has(userId)) return;
    this.endSession(userId);
  }

  private endSession(userId: number): void {
    this.cancelSession(userId, false);

    this.config.stateMachine.setState(
      { type: EntityType.Player, id: userId },
      States.IdleState
    );
  }

  public cancelSession(userId: number, sendPackets: boolean = true): void {
    if (!this.activeSessions.has(userId)) {
      return;
    }

    this.activeSessions.delete(userId);
    this.config.delaySystem.clearDelay(userId);

    if (sendPackets) {
      const stoppedPayload = buildStoppedSkillingPayload({
        PlayerEntityID: userId,
        Skill: SkillClientReference.Cooking,
        DidExhaustResources: false
      });
      this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);
    }
  }

  private seedCookableItems(): void {
    for (const item of COOKABLE_ITEMS) {
      if (!this.config.itemCatalog.getDefinitionById(item.rawItemId)) continue;
      if (!this.config.itemCatalog.getDefinitionById(item.cookedItemId)) continue;
      this.cookableByRawItemId.set(item.rawItemId, item);
    }
  }
}

function getCookingMethod(entityType: string): CookingMethod {
  if (STOVE_ENTITY_TYPES.has(entityType)) {
    return "stove";
  }
  if (FIRE_ENTITY_TYPES.has(entityType)) {
    return "fire";
  }
  return "fire";
}

function getNoBurnLevel(
  itemName: string,
  method: CookingMethod,
  requiredLevel: number
): number {
  const data = COOKING_DATA[itemName.toLowerCase()];
  if (data) {
    return method === "stove" ? data.noBurnStove : data.noBurnFire;
  }
  return calculateNoBurnLevel(requiredLevel, method);
}

function calculateNoBurnLevel(requiredLevel: number, method: CookingMethod): number {
  const baseMultiplier = 1.7 - (Math.log(requiredLevel + 1) / Math.log(101)) * 0.5;
  const stoveNoBurnLevel = Math.floor(requiredLevel * baseMultiplier);

  if (method === "stove") {
    return stoveNoBurnLevel;
  }
  const firePenalty = 3 + Math.floor(requiredLevel / 50);
  return stoveNoBurnLevel + firePenalty;
}

function calculateBurnRate(
  playerLevel: number,
  requiredLevel: number,
  noBurnLevel: number
): number {
  const MAX_BURN_RATE = 0.3;

  if (playerLevel < requiredLevel) {
    return 1.0;
  }
  if (playerLevel >= noBurnLevel) {
    return 0.0;
  }

  const levelRange = noBurnLevel - requiredLevel;
  if (levelRange <= 0) {
    return 0.0;
  }

  const progressInRange = Math.max(0, Math.min(1, (playerLevel - requiredLevel) / levelRange));
  const burnRate = MAX_BURN_RATE * (1 - progressInRange);
  return Math.max(0, Math.min(1, burnRate));
}

function willBurnItem(
  playerLevel: number,
  item: CookableItemConfig,
  method: CookingMethod
): boolean {
  const noBurnLevel = getNoBurnLevel(item.name, method, item.requiredLevel);
  const burnRate = calculateBurnRate(playerLevel, item.requiredLevel, noBurnLevel);
  return Math.random() < burnRate;
}
