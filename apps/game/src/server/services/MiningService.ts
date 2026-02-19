/**
 * MiningService.ts - Handles mining at rock nodes
 *
 * Architecture mirrors WoodcuttingService/FishingService:
 * - Validates player has pickaxe equipped
 * - Uses DelaySystem for initial wind-up
 * - After initial delay, MiningSystem processes attempts every tick
 * - Calculates success probability based on player level, pickaxe bonus, and ore difficulty
 * - Tracks rock resource depletion (single-use) and respawn
 * - Awards ore and XP based on itemdefs expFromObtaining
 */

import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { SKILLS, SkillClientReference, SkillSlug } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { WorldEntityState } from "../state/EntityState";
import type { ItemCatalog, ItemDefinition } from "../../world/items/ItemCatalog";
import type { EquipmentService } from "./EquipmentService";
import type { VisibilitySystem } from "../systems/VisibilitySystem";
import type { ExperienceService } from "./ExperienceService";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import { buildObtainedResourcePayload } from "../../protocol/packets/actions/ObtainedResource";
import type { PacketAuditService } from "./PacketAuditService";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";

// =============================================================================
// Constants
// =============================================================================

const LEVEL_SCALING_FACTOR = 0.0001; // 0.01% per level
const MIN_PROBABILITY = 0.01;
const MAX_PROBABILITY = 0.5;
const SINGLE_RESOURCE_PER_ROCK = 1;
const RARE_DROP_CHANCE = 1 / 256;

// =============================================================================
// Pickaxe Configuration
// =============================================================================

export enum PickaxeTier {
  BRONZE = "bronze",
  IRON = "iron",
  STEEL = "steel",
  PALLADIUM = "palladium",
  CORONIUM = "coronium",
  CELADON = "celadon"
}

interface PickaxeConfig {
  tier: PickaxeTier;
  itemId: number;
  requiredLevel: number;
  minimumMineTime: number; // Ticks before first roll
  probabilityBonus: number;
}

const PICKAXE_CONFIGS: Record<PickaxeTier, PickaxeConfig> = {
  [PickaxeTier.BRONZE]: {
    tier: PickaxeTier.BRONZE,
    itemId: 73,
    requiredLevel: 1,
    minimumMineTime: 9,
    probabilityBonus: 0
  },
  [PickaxeTier.IRON]: {
    tier: PickaxeTier.IRON,
    itemId: 74,
    requiredLevel: 10,
    minimumMineTime: 7,
    probabilityBonus: 0.01
  },
  [PickaxeTier.STEEL]: {
    tier: PickaxeTier.STEEL,
    itemId: 75,
    requiredLevel: 20,
    minimumMineTime: 6,
    probabilityBonus: 0.02
  },
  [PickaxeTier.PALLADIUM]: {
    tier: PickaxeTier.PALLADIUM,
    itemId: 76,
    requiredLevel: 30,
    minimumMineTime: 5,
    probabilityBonus: 0.03
  },
  [PickaxeTier.CORONIUM]: {
    tier: PickaxeTier.CORONIUM,
    itemId: 77,
    requiredLevel: 40,
    minimumMineTime: 4,
    probabilityBonus: 0.04
  },
  [PickaxeTier.CELADON]: {
    tier: PickaxeTier.CELADON,
    itemId: 245,
    requiredLevel: 70,
    minimumMineTime: 3,
    probabilityBonus: 0.05
  }
};

const PICKAXE_CONFIG_BY_ITEM_ID: Map<number, PickaxeConfig> = new Map(
  Object.values(PICKAXE_CONFIGS).map((config) => [config.itemId, config])
);

// =============================================================================
// Ore Configuration (type -> mining-test + table)
// =============================================================================

interface OreConfig {
  itemName: string;
  requiredLevel: number;
  baseProbability: number;
}

const ORE_CONFIGS_BY_ROCK_TYPE: Record<string, OreConfig> = {
  copperrocks: { itemName: "copper ore", requiredLevel: 1, baseProbability: 0.15 },
  tinrocks: { itemName: "tin ore", requiredLevel: 1, baseProbability: 0.15 },
  ironrocks: { itemName: "iron ore", requiredLevel: 20, baseProbability: 0.12 },
  coalrocks: { itemName: "coal", requiredLevel: 35, baseProbability: 0.1 },
  silverrocks: { itemName: "silver nugget", requiredLevel: 45, baseProbability: 0.04 },
  palladiumrocks: { itemName: "palladium ore", requiredLevel: 56, baseProbability: 0.015 },
  goldrocks: { itemName: "gold nugget", requiredLevel: 72, baseProbability: 0.012 },
  coroniumrocks: { itemName: "coronium ore", requiredLevel: 82, baseProbability: 0.008 },
  celadiumrocks: { itemName: "celadium ore", requiredLevel: 101, baseProbability: 0.005 }
};

const RARE_DROP_TABLE: Array<{ itemId: number; weight: number }> = [
  { itemId: 89, weight: 40 }, // silver nugget (most common)
  { itemId: 90, weight: 25 }, // gold nugget
  { itemId: 298, weight: 20 }, // rough amethyst
  { itemId: 299, weight: 14 }, // rough sapphire
  { itemId: 300, weight: 10 }, // rough emerald
  { itemId: 301, weight: 8 }, // rough topaz
  { itemId: 302, weight: 6 }, // rough citrine
  { itemId: 303, weight: 4 }, // rough ruby
  { itemId: 304, weight: 2 }, // rough diamond
  { itemId: 305, weight: 1 } // rough carbonado (rarest)
];

// =============================================================================
// Service Types
// =============================================================================

export interface MiningServiceConfig {
  inventoryService: InventoryService;
  messageService: MessageService;
  equipmentService: EquipmentService;
  itemCatalog: ItemCatalog;
  delaySystem: DelaySystem;
  eventBus: EventBus;
  visibilitySystem: VisibilitySystem;
  experienceService: ExperienceService;
  stateMachine: StateMachine;
  playerStatesByUserId: Map<number, PlayerState>;
  worldEntityStates: Map<number, WorldEntityState>;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  packetAudit?: PacketAuditService | null;
}

interface MiningSession {
  userId: number;
  rockId: number;
  pickaxeConfig: PickaxeConfig;
  oreItemId: number;
  resourcesRemaining: number;
  successProbability: number;
  nextAttemptTick: number | null;
}

// =============================================================================
// Service Implementation
// =============================================================================

export class MiningService {
  private activeSessions = new Map<number, MiningSession>();
  private rockResources = new Map<number, number>();
  private itemIdByName = new Map<string, number>();

  constructor(private readonly config: MiningServiceConfig) {
    this.itemIdByName = this.buildItemIdIndex(config.itemCatalog);
  }

  static async load(config: MiningServiceConfig): Promise<MiningService> {
    const service = new MiningService(config);
    console.log(`[MiningService] Service initialized`);
    return service;
  }

  public initiateMine(playerState: PlayerState, entityState: WorldEntityState): boolean {
    const pickaxeConfig = this.getEquippedPickaxeConfig(playerState);
    if (!pickaxeConfig) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        "You need to equip a pickaxe to do that"
      );
      return false;
    }

    const oreConfig = this.getOreConfig(entityState);
    if (!oreConfig) {
      this.config.packetAudit?.logInvalidPacket({
        userId: playerState.userId,
        packetName: "Mining",
        reason: "invalid_ore_target",
        details: { entityId: entityState.id }
      });
      this.config.messageService.sendServerInfo(playerState.userId, "You can't mine that.");
      return false;
    }

    let playerLevel = playerState.getSkillBoostedLevel(SKILLS.mining);
    if (playerLevel < pickaxeConfig.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${pickaxeConfig.requiredLevel} Mining to use this pickaxe.`
      );
      return false;
    }

    if (playerLevel < oreConfig.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${oreConfig.requiredLevel} Mining to mine this.`
      );
      return false;
    }

    if (!this.hasRockResources(entityState)) {
      this.config.messageService.sendServerInfo(playerState.userId, "This rock has been depleted.");
      return false;
    }

    if (!this.rockResources.has(entityState.id)) {
      this.rockResources.set(entityState.id, SINGLE_RESOURCE_PER_ROCK);
    }

    playerLevel += playerState.getSkillBonus(SKILLS.mining);

    const successProbability = this.calculateSuccessProbability(
      playerLevel,
      pickaxeConfig.probabilityBonus,
      oreConfig.baseProbability
    );

    const oreItemId = this.itemIdByName.get(oreConfig.itemName.toLowerCase());
    if (!oreItemId) {
      this.config.messageService.sendServerInfo(playerState.userId, "You can't mine that.");
      return false;
    }

    // Must have capacity for at least one ore before starting.
    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      playerState.userId,
      oreItemId,
      0
    );
    if (availableCapacity < 1) {
      this.config.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
      return false;
    }

    const session: MiningSession = {
      userId: playerState.userId,
      rockId: entityState.id,
      pickaxeConfig,
      oreItemId,
      resourcesRemaining: this.rockResources.get(entityState.id)!,
      successProbability,
      nextAttemptTick: null
    };

    this.activeSessions.set(playerState.userId, session);

    this.config.eventBus.emit(
      createPlayerStartedSkillingEvent(
        playerState.userId,
        entityState.id,
        SkillClientReference.Mining,
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
      ticks: pickaxeConfig.minimumMineTime,
      state: States.MiningState,
      skipStateRestore: true,
      onComplete: (userId) => this.onInitialDelayComplete(userId)
    });

    if (!delayStarted) {
      this.activeSessions.delete(playerState.userId);
      this.config.messageService.sendServerInfo(playerState.userId, "You're already busy.");
      return false;
    }

    return true;
  }

  private onInitialDelayComplete(userId: number): void {
    const session = this.activeSessions.get(userId);
    if (!session) return;
    session.nextAttemptTick = 0;
  }

  public processTick(currentTick: number): void {
    for (const [userId, session] of this.activeSessions.entries()) {
      const player = this.config.playerStatesByUserId.get(userId);
      if (!player) {
        this.activeSessions.delete(userId);
        continue;
      }

      if (player.currentState !== States.MiningState) {
        this.activeSessions.delete(userId);
        continue;
      }

      if (session.nextAttemptTick === null) {
        continue;
      }

      if (currentTick < session.nextAttemptTick) {
        continue;
      }

      this.attemptMine(userId, currentTick);
    }
  }

  private attemptMine(userId: number, currentTick: number): void {
    const player = this.config.playerStatesByUserId.get(userId);
    const session = this.activeSessions.get(userId);

    if (!player || !session) {
      return;
    }

    const rock = this.config.worldEntityStates.get(session.rockId);
    if (!rock) {
      this.endSession(userId, "The rock is no longer there.", false);
      return;
    }

    if (!this.hasRockResources(rock)) {
      this.endSession(userId, undefined, true);
      return;
    }

    const success = Math.random() < session.successProbability;
    if (success) {
      this.handleMineSuccess(player, rock, session, currentTick);
    } else {
      session.nextAttemptTick = currentTick + 1;
    }
  }

  private handleMineSuccess(
    player: PlayerState,
    rock: WorldEntityState,
    session: MiningSession,
    currentTick: number
  ): void {

    const remaining = this.rockResources.get(rock.id) ?? 0;
    this.rockResources.set(rock.id, remaining - 1);
    session.resourcesRemaining = remaining - 1;

    const oreItemId = session.oreItemId;
    this.config.inventoryService.giveItem(player.userId, oreItemId, 1, 0);

    const oreItemDef = this.config.itemCatalog.getDefinitionById(oreItemId);
    this.awardXpFromItem(player, oreItemDef);

    const oreObtainedPayload = buildObtainedResourcePayload({
      ItemID: oreItemId
    });
    this.config.enqueueUserMessage(player.userId, GameAction.ObtainedResource, oreObtainedPayload);

    const rareDropItemId = this.rollRareDrop();
    if (rareDropItemId !== null) {
      this.config.inventoryService.giveItem(player.userId, rareDropItemId, 1, 0);

      const rareItemDef = this.config.itemCatalog.getDefinitionById(rareDropItemId);
      this.awardXpFromItem(player, rareItemDef);

      const rareObtainedPayload = buildObtainedResourcePayload({
        ItemID: rareDropItemId
      });
      this.config.enqueueUserMessage(player.userId, GameAction.ObtainedResource, rareObtainedPayload);
    }

    const rockDepleted = session.resourcesRemaining <= 0;
    if (rockDepleted) {
      this.scheduleRockRespawn(rock);
    }

    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      player.userId,
      oreItemId,
      0
    );
    if (availableCapacity < 1) {
      this.config.messageService.sendServerInfo(player.userId, "Your inventory is full.");
      this.endSession(player.userId, undefined, rockDepleted);
      return;
    }

    if (rockDepleted) {
      this.endSession(player.userId, undefined, true);
    } else {
      session.nextAttemptTick = currentTick + session.pickaxeConfig.minimumMineTime;
    }
  }

  private endSession(userId: number, message?: string, didExhaustResources: boolean = false): void {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) return;

    this.activeSessions.delete(userId);

    if (message) {
      this.config.messageService.sendServerInfo(userId, message);
    }

    const stoppedPayload = buildStoppedSkillingPayload({
      PlayerEntityID: userId,
      Skill: SkillClientReference.Mining,
      DidExhaustResources: didExhaustResources
    });
    this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);

    this.config.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
  }

  private scheduleRockRespawn(rock: WorldEntityState): void {
    const respawnTicks = rock.definition.respawnTicks ?? 10;

    const nearbyPlayers = this.config.visibilitySystem.getPlayersNearEntity(rock);
    const exhaustionTracker = this.config.visibilitySystem.getResourceExhaustionTracker();
    exhaustionTracker.markExhausted(rock.id, nearbyPlayers);

    setTimeout(() => {
      this.rockResources.set(rock.id, SINGLE_RESOURCE_PER_ROCK);

      exhaustionTracker.markReplenished(rock.id);
    }, respawnTicks * 600);
  }

  private hasRockResources(rock: WorldEntityState): boolean {
    const remaining = this.rockResources.get(rock.id);
    if (remaining === undefined) {
      return true;
    }
    return remaining > 0;
  }

  public cancelSession(userId: number, sendPackets: boolean = true): void {
    if (!this.activeSessions.has(userId)) {
      return;
    }

    this.activeSessions.delete(userId);

    if (sendPackets) {
      const stoppedPayload = buildStoppedSkillingPayload({
        PlayerEntityID: userId,
        Skill: SkillClientReference.Mining,
        DidExhaustResources: false
      });
      this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);
    }

    this.config.delaySystem.clearDelay(userId);

  }

  private buildItemIdIndex(itemCatalog: ItemCatalog): Map<string, number> {
    const index = new Map<string, number>();
    for (const def of itemCatalog.getDefinitions()) {
      index.set(def.name.toLowerCase(), def.id);
    }
    return index;
  }

  private getEquippedPickaxeConfig(playerState: PlayerState): PickaxeConfig | null {
    const weaponItemId = this.config.equipmentService.getEquippedItemId(playerState.userId, "weapon");
    if (!weaponItemId) {
      return null;
    }

    const pickaxeConfig = PICKAXE_CONFIG_BY_ITEM_ID.get(weaponItemId);
    if (pickaxeConfig) {
      return pickaxeConfig;
    }

    const weaponDef = this.config.itemCatalog.getDefinitionById(weaponItemId);
    if (weaponDef?.equippableRequirements?.some((req: any) => req.skill === "mining")) {
      return PICKAXE_CONFIGS[PickaxeTier.BRONZE];
    }

    return null;
  }

  private getOreConfig(entityState: WorldEntityState): OreConfig | null {
    if (!entityState.definition.actions?.includes("mine")) {
      return null;
    }

    return ORE_CONFIGS_BY_ROCK_TYPE[entityState.type] ?? null;
  }

  private calculateSuccessProbability(
    playerLevel: number,
    pickaxeBonus: number,
    baseProbability: number
  ): number {
    const rawProbability = baseProbability + pickaxeBonus + playerLevel * LEVEL_SCALING_FACTOR;
    return Math.max(MIN_PROBABILITY, Math.min(MAX_PROBABILITY, rawProbability));
  }

  private rollRareDrop(): number | null {
    if (Math.random() >= RARE_DROP_CHANCE) {
      return null;
    }

    const totalWeight = RARE_DROP_TABLE.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of RARE_DROP_TABLE) {
      roll -= entry.weight;
      if (roll <= 0) {
        return entry.itemId;
      }
    }

    return RARE_DROP_TABLE[RARE_DROP_TABLE.length - 1].itemId;
  }

  private awardXpFromItem(player: PlayerState, itemDef?: ItemDefinition): void {
    if (!itemDef?.expFromObtaining) {
      return;
    }

    const skill = itemDef.expFromObtaining.skill;
    if (!this.isSkillSlug(skill)) {
      return;
    }

    const xp = itemDef.expFromObtaining.amount;
    if (xp > 0) {
      this.config.experienceService.addSkillXp(player, skill, xp);
    }
  }

  private isSkillSlug(skill: string): skill is SkillSlug {
    return Object.values(SKILLS).includes(skill as SkillSlug);
  }
}
