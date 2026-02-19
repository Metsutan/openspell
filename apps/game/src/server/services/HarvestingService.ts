/**
 * HarvestingService.ts - Handles harvesting plants and crops
 *
 * Architecture mirrors WoodcuttingService/FishingService:
 * - Validates player has harvesting gloves equipped
 * - Uses DelaySystem for initial wind-up
 * - After initial delay, HarvestingSystem processes attempts every tick
 * - Calculates success probability based on player level, glove bonus, and plant difficulty
 * - Tracks plant resource depletion and respawn
 * - Awards items and XP based on itemdefs expFromObtaining
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
import type { WorldEntityDefinition } from "../../world/entities/WorldEntityCatalog";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import { buildObtainedResourcePayload } from "../../protocol/packets/actions/ObtainedResource";
import type { PacketAuditService } from "./PacketAuditService";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";

// =============================================================================
// Constants
// =============================================================================

/** Harvest success probability constants (from harvesting-test.ts) */
const BASE_PROBABILITY = 0.045;
const PROBABILITY_SCALE = 2400;
const MIN_PROBABILITY = 0.01;
const MAX_PROBABILITY = 0.35;
const DIFFICULTY_FACTOR = 0.0008; // 0.08% penalty per required level

const INITIAL_HARVEST_DELAY_TICKS = 1;

// =============================================================================
// Glove Configuration (from harvesting-test.ts, item IDs resolved via itemdefs)
// =============================================================================

export enum GloveTier {
  BRONZE = "bronze",
  IRON = "iron",
  STEEL = "steel",
  PALLADIUM = "palladium",
  CORONIUM = "coronium",
  CORONIUM_SILVER = "coronium_silver",
  CORONIUM_GOLD = "coronium_gold",
  CELADON = "celadon",
  CELADON_SILVER = "celadon_silver",
  CELADON_GOLD = "celadon_gold",
  LEGENDARY = "legendary"
}

interface GloveConfig {
  tier: GloveTier;
  itemName: string;
  requiredLevel: number;
  levelBonus: number; // Virtual level bonus
}

const GLOVE_CONFIGS: Record<GloveTier, GloveConfig> = {
  [GloveTier.BRONZE]: {
    tier: GloveTier.BRONZE,
    itemName: "bronze gloves",
    requiredLevel: 1,
    levelBonus: 0
  },
  [GloveTier.IRON]: {
    tier: GloveTier.IRON,
    itemName: "iron gloves",
    requiredLevel: 10,
    levelBonus: 5
  },
  [GloveTier.STEEL]: {
    tier: GloveTier.STEEL,
    itemName: "steel gloves",
    requiredLevel: 20,
    levelBonus: 10
  },
  [GloveTier.PALLADIUM]: {
    tier: GloveTier.PALLADIUM,
    itemName: "palladium gloves",
    requiredLevel: 30,
    levelBonus: 20
  },
  [GloveTier.CORONIUM]: {
    tier: GloveTier.CORONIUM,
    itemName: "coronium gloves",
    requiredLevel: 40,
    levelBonus: 30
  },
  [GloveTier.CORONIUM_SILVER]: {
    tier: GloveTier.CORONIUM_SILVER,
    itemName: "coronium gloves (silver plating)",
    requiredLevel: 40,
    levelBonus: 30
  },
  [GloveTier.CORONIUM_GOLD]: {
    tier: GloveTier.CORONIUM_GOLD,
    itemName: "coronium gloves (gold plating)",
    requiredLevel: 40,
    levelBonus: 30
  },
  [GloveTier.CELADON]: {
    tier: GloveTier.CELADON,
    itemName: "celadon gloves",
    requiredLevel: 70,
    levelBonus: 40
  },
  [GloveTier.CELADON_SILVER]: {
    tier: GloveTier.CELADON_SILVER,
    itemName: "celadon gloves (silver plating)",
    requiredLevel: 70,
    levelBonus: 40
  },
  [GloveTier.CELADON_GOLD]: {
    tier: GloveTier.CELADON_GOLD,
    itemName: "celadon gloves (gold plating)",
    requiredLevel: 70,
    levelBonus: 40
  },
  [GloveTier.LEGENDARY]: {
    tier: GloveTier.LEGENDARY,
    itemName: "legendary gloves",
    requiredLevel: 80,
    levelBonus: 50
  }
};

// =============================================================================
// Harvestable Configuration (levels from harvesting-test.ts)
// =============================================================================

const HARVEST_LEVEL_BY_ITEM_NAME: Record<string, number> = {
  // Roots
  "aruba root": 8,
  "fiji root": 16,
  "sardinian root": 24,
  "maui root": 32,
  "grenada root": 40,
  "tonga root": 48,
  "nauru root": 56,
  "samoan root": 64,
  "vanua root": 72,
  "mariana root": 80,
  // Produce
  flax: 1,
  potato: 1,
  wheat: 3,
  carrot: 5,
  corn: 6,
  tomato: 12,
  onion: 20,
  "red mushroom": 26,
  strawberry: 30,
  watermelon: 40,
  pumpkin: 50,
  grapes: 65,
  rose: 80
};

const HARVESTABLE_ENTITY_ITEM_NAME: Record<string, string> = {
  // Roots
  arubaplant: "aruba root",
  fijiplant: "fiji root",
  sardinianplant: "sardinian root",
  mauiplant: "maui root",
  grenadaplant: "grenada root",
  tongaplant: "tonga root",
  nauruplant: "nauru root",
  samoanplant: "samoan root",
  vanuaplant: "vanua root",
  marianaplant: "mariana root",
  // Produce
  flax: "flax",
  potatoes: "potato",
  wheat: "wheat",
  carrot: "carrot",
  corn: "corn",
  tomatoes: "tomato",
  onions: "onion",
  redmushroom: "red mushroom",
  strawberries: "strawberry",
  watermelon: "watermelon",
  pumpkin: "pumpkin",
  grapes: "grapes",
  roses: "rose"
};

interface HarvestableConfig {
  itemId: number;
  itemName: string;
  requiredLevel: number;
  respawnTicks: number;
  minResourcesPerSpawn: number;
  maxResourcesPerSpawn: number;
}

// =============================================================================
// Service Types
// =============================================================================

export interface HarvestingServiceConfig {
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

interface HarvestingSession {
  userId: number;
  plantId: number;
  gloveConfig: GloveConfig;
  resourcesRemaining: number;
  successProbability: number;
  nextAttemptTick: number | null;
}

// =============================================================================
// Service Implementation
// =============================================================================

export class HarvestingService {
  private activeSessions = new Map<number, HarvestingSession>();
  private plantResources = new Map<number, number>();
  private harvestableConfigsByType = new Map<string, HarvestableConfig>();
  private gloveConfigByItemId = new Map<number, GloveConfig>();
  private itemIdByName = new Map<string, number>();

  constructor(private readonly config: HarvestingServiceConfig) {
    this.itemIdByName = this.buildItemIdIndex(config.itemCatalog);
    this.gloveConfigByItemId = this.buildGloveConfigIndex();
  }

  static async load(config: HarvestingServiceConfig): Promise<HarvestingService> {
    const service = new HarvestingService(config);
    console.log(`[HarvestingService] Service initialized`);
    return service;
  }

  public initiateHarvest(playerState: PlayerState, entityState: WorldEntityState): boolean {
    const gloveConfig = this.getEquippedGloveConfig(playerState);
    if (!gloveConfig) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        "You need to equip a pair of gloves before doing that"
      );
      return false;
    }

    const harvestableConfig = this.getHarvestableConfig(entityState);
    if (!harvestableConfig) {
      this.config.packetAudit?.logInvalidPacket({
        userId: playerState.userId,
        packetName: "Harvesting",
        reason: "invalid_target",
        details: { entityId: entityState.id }
      });
      this.config.messageService.sendServerInfo(playerState.userId, "You can't harvest that.");
      return false;
    }

    // Must have capacity for at least one harvested item before starting.
    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      playerState.userId,
      harvestableConfig.itemId,
      0
    );
    if (availableCapacity < 1) {
      this.config.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
      return false;
    }

    // Check harvesting level requirement (boosted by potions)
    let playerLevel = playerState.getSkillBoostedLevel(SKILLS.harvesting);
    if (playerLevel < harvestableConfig.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need a Harvesting level of at least ${harvestableConfig.requiredLevel} to harvest this`
      );
      return false;
    }

    // Check glove level requirement
    if (playerLevel < gloveConfig.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${gloveConfig.requiredLevel} Harvesting to use these gloves.`
      );
      return false;
    }

    if (!this.hasPlantResources(entityState)) {
      this.config.messageService.sendServerInfo(playerState.userId, "This plant has been depleted.");
      return false;
    }

    if (!this.plantResources.has(entityState.id)) {
      const { minResourcesPerSpawn, maxResourcesPerSpawn } = entityState.definition;
      const min = minResourcesPerSpawn ?? 1;
      const max = maxResourcesPerSpawn ?? 1;
      const resources = Math.floor(Math.random() * (max - min + 1)) + min;
      this.plantResources.set(entityState.id, resources);
    }

    // Add equipment bonuses
    playerLevel += playerState.getSkillBonus(SKILLS.harvesting);

    const successProbability = this.calculateHarvestProbability(
      playerLevel,
      gloveConfig.levelBonus,
      harvestableConfig.requiredLevel
    );

    const session: HarvestingSession = {
      userId: playerState.userId,
      plantId: entityState.id,
      gloveConfig,
      resourcesRemaining: this.plantResources.get(entityState.id)!,
      successProbability,
      nextAttemptTick: null
    };

    this.activeSessions.set(playerState.userId, session);

    this.config.eventBus.emit(
      createPlayerStartedSkillingEvent(
        playerState.userId,
        entityState.id,
        SkillClientReference.Harvesting,
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
      ticks: INITIAL_HARVEST_DELAY_TICKS,
      state: States.HarvestingState,
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

      if (player.currentState !== States.HarvestingState) {
        this.activeSessions.delete(userId);
        continue;
      }

      if (session.nextAttemptTick === null) {
        continue;
      }

      if (currentTick < session.nextAttemptTick) {
        continue;
      }

      this.attemptHarvest(userId, currentTick);
    }
  }

  private attemptHarvest(userId: number, currentTick: number): void {
    const player = this.config.playerStatesByUserId.get(userId);
    const session = this.activeSessions.get(userId);

    if (!player || !session) {
      return;
    }

    const plant = this.config.worldEntityStates.get(session.plantId);
    if (!plant) {
      this.endSession(userId, "The plant is no longer there.", false);
      return;
    }

    if (!this.hasPlantResources(plant)) {
      this.endSession(userId, undefined, true);
      return;
    }

    const success = Math.random() < session.successProbability;
    if (success) {
      this.handleHarvestSuccess(player, plant, session, currentTick);
    } else {
      session.nextAttemptTick = currentTick + 1;
    }
  }

  private handleHarvestSuccess(
    player: PlayerState,
    plant: WorldEntityState,
    session: HarvestingSession,
    currentTick: number
  ): void {
    const harvestableConfig = this.getHarvestableConfig(plant);
    if (!harvestableConfig) {
      this.endSession(player.userId, "Invalid plant type.", false);
      return;
    }


    const remaining = this.plantResources.get(plant.id) ?? 0;
    this.plantResources.set(plant.id, remaining - 1);
    session.resourcesRemaining = remaining - 1;

    this.config.inventoryService.giveItem(player.userId, harvestableConfig.itemId, 1, 0);

    const itemDef = this.config.itemCatalog.getDefinitionById(harvestableConfig.itemId);
    this.awardXpFromItem(player, itemDef);

    const obtainedPayload = buildObtainedResourcePayload({
      ItemID: harvestableConfig.itemId
    });
    this.config.enqueueUserMessage(player.userId, GameAction.ObtainedResource, obtainedPayload);

    const plantDepleted = session.resourcesRemaining <= 0;
    if (plantDepleted) {
      this.schedulePlantRespawn(plant);
    }

    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      player.userId,
      harvestableConfig.itemId,
      0
    );
    if (availableCapacity < 1) {
      this.config.messageService.sendServerInfo(player.userId, "Your inventory is full.");
      this.endSession(player.userId, undefined, plantDepleted);
      return;
    }

    if (plantDepleted) {
      this.endSession(player.userId, undefined, true);
    } else {
      session.nextAttemptTick = currentTick + 1;
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
      Skill: SkillClientReference.Harvesting,
      DidExhaustResources: didExhaustResources
    });
    this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);

    this.config.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
  }

  private schedulePlantRespawn(plant: WorldEntityState): void {
    const respawnTicks = plant.definition.respawnTicks ?? 100;


    const nearbyPlayers = this.config.visibilitySystem.getPlayersNearEntity(plant);
    const exhaustionTracker = this.config.visibilitySystem.getResourceExhaustionTracker();
    exhaustionTracker.markExhausted(plant.id, nearbyPlayers);

    setTimeout(() => {
      const { minResourcesPerSpawn, maxResourcesPerSpawn } = plant.definition;
      const min = minResourcesPerSpawn ?? 1;
      const max = maxResourcesPerSpawn ?? 1;
      const resources = Math.floor(Math.random() * (max - min + 1)) + min;
      this.plantResources.set(plant.id, resources);

      exhaustionTracker.markReplenished(plant.id);

    }, respawnTicks * 600);
  }

  private hasPlantResources(plant: WorldEntityState): boolean {
    const remaining = this.plantResources.get(plant.id);
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
        Skill: SkillClientReference.Harvesting,
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

  private buildGloveConfigIndex(): Map<number, GloveConfig> {
    const index = new Map<number, GloveConfig>();
    for (const config of Object.values(GLOVE_CONFIGS)) {
      const itemId = this.itemIdByName.get(config.itemName.toLowerCase());
      if (!itemId) {
        console.warn(`[HarvestingService] Missing glove item "${config.itemName}" in itemdefs`);
        continue;
      }
      index.set(itemId, config);
    }
    return index;
  }

  private getEquippedGloveConfig(playerState: PlayerState): GloveConfig | null {
    const gloveItemId = this.config.equipmentService.getEquippedItemId(playerState.userId, "gloves");
    if (!gloveItemId) {
      return null;
    }

    const gloveConfig = this.gloveConfigByItemId.get(gloveItemId);
    if (gloveConfig) {
      return gloveConfig;
    }

    const gloveDef = this.config.itemCatalog.getDefinitionById(gloveItemId);
    if (gloveDef?.equippableRequirements?.some((req: any) => req.skill === "harvesting")) {
      return GLOVE_CONFIGS[GloveTier.BRONZE];
    }

    return null;
  }

  private getHarvestableConfig(entityState: WorldEntityState): HarvestableConfig | null {
    const cached = this.harvestableConfigsByType.get(entityState.type);
    if (cached) {
      return cached;
    }

    const definition = entityState.definition;
    if (!definition.actions?.includes("harvest")) {
      return null;
    }

    const itemId = this.resolveHarvestItemId(definition);
    if (!itemId) {
      console.warn(`[HarvestingService] Unable to resolve item for harvestable type "${definition.type}"`);
      return null;
    }

    const itemDef = this.config.itemCatalog.getDefinitionById(itemId);
    const itemName = itemDef?.name ?? definition.name ?? definition.type;
    const requiredLevel = HARVEST_LEVEL_BY_ITEM_NAME[itemName.toLowerCase()] ?? 1;

    const config: HarvestableConfig = {
      itemId,
      itemName,
      requiredLevel,
      respawnTicks: definition.respawnTicks ?? 100,
      minResourcesPerSpawn: definition.minResourcesPerSpawn ?? 1,
      maxResourcesPerSpawn: definition.maxResourcesPerSpawn ?? 1
    };

    this.harvestableConfigsByType.set(entityState.type, config);
    return config;
  }

  private resolveHarvestItemId(definition: WorldEntityDefinition): number | null {
    const itemName = HARVESTABLE_ENTITY_ITEM_NAME[definition.type.toLowerCase()];
    if (!itemName) {
      return null;
    }
    return this.itemIdByName.get(itemName.toLowerCase()) ?? null;
  }

  private calculateHarvestProbability(
    playerLevel: number,
    gloveLevelBonus: number,
    requiredLevel: number
  ): number {
    const effectiveLevel = playerLevel + gloveLevelBonus;
    const difficultyPenalty = requiredLevel * DIFFICULTY_FACTOR;
    const rawProbability = BASE_PROBABILITY - difficultyPenalty + effectiveLevel / PROBABILITY_SCALE;

    return Math.max(MIN_PROBABILITY, Math.min(MAX_PROBABILITY, rawProbability));
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
