/**
 * FishingService.ts - Handles fishing at fishing spots
 *
 * Architecture mirrors WoodcuttingService:
 * - Validates player has a fishing rod equipped with proper tier
 * - Uses DelaySystem ONLY for rod-based initial delay
 * - After initial delay, FishingSystem processes attempts every tick
 * - Calculates success probability based on player level and fish probability
 * - Tracks fishing spot resource depletion and respawn
 * - Awards fish and XP based on itemdefs expFromObtaining
 */

import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { SkillClientReference } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
import { SKILLS } from "../../world/PlayerState";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { WorldEntityState } from "../state/EntityState";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { EquipmentService } from "./EquipmentService";
import type { VisibilitySystem } from "../systems/VisibilitySystem";
import type { ExperienceService } from "./ExperienceService";
import { buildStoppedSkillingPayload } from "../../protocol/packets/actions/StoppedSkilling";
import { buildObtainedResourcePayload } from "../../protocol/packets/actions/ObtainedResource";
import { createPlayerStartedSkillingEvent } from "../events/GameEvents";

// =============================================================================
// Constants
// =============================================================================

/** Success probability constants */
const LEVEL_SCALING_FACTOR = 0.0005; // 0.05% per level
const PROBABILITY_SCALE = 20; // Scale down base probabilities
const MIN_PROBABILITY = 0.01; // Floor: 1% minimum
const MAX_PROBABILITY = 0.15; // Ceiling: 15% maximum

// =============================================================================
// Rod Configuration
// =============================================================================

export enum RodTier {
  BASIC = "basic",
  GREAT = "great",
  ULTRA = "ultra",
  MASTER = "master"
}

export interface RodConfig {
  tier: RodTier;
  itemId: number;
  requiredLevel: number;
  castDelay: number; // Ticks before first roll and between successes
}

const ROD_CONFIGS: Record<RodTier, RodConfig> = {
  [RodTier.BASIC]: {
    tier: RodTier.BASIC,
    itemId: 7,
    requiredLevel: 1,
    castDelay: 3
  },
  [RodTier.GREAT]: {
    tier: RodTier.GREAT,
    itemId: 8,
    requiredLevel: 10,
    castDelay: 3
  },
  [RodTier.ULTRA]: {
    tier: RodTier.ULTRA,
    itemId: 9,
    requiredLevel: 35,
    castDelay: 3
  },
  [RodTier.MASTER]: {
    tier: RodTier.MASTER,
    itemId: 10,
    requiredLevel: 50,
    castDelay: 3
  }
};

/** Map item ID to rod config for quick lookup */
const ROD_CONFIG_BY_ITEM_ID: Map<number, RodConfig> = new Map(
  Object.values(ROD_CONFIGS).map((config) => [config.itemId, config])
);

const ROD_TIER_ORDER: RodTier[] = [
  RodTier.BASIC,
  RodTier.GREAT,
  RodTier.ULTRA,
  RodTier.MASTER
];

const ROD_TIER_RANK = new Map<RodTier, number>(
  ROD_TIER_ORDER.map((tier, index) => [tier, index])
);

// =============================================================================
// Fish Configuration
// =============================================================================

interface FishConfig {
  itemId: number;
  name: string;
  requiredLevel: number;
  rodRequired: RodTier;
  fishingSpot: string;
  probability: number;
}

const FISH_CONFIGS: FishConfig[] = [
  { itemId: 2, name: "raw bass", requiredLevel: 1, rodRequired: RodTier.BASIC, fishingSpot: "beachsidefishingspot", probability: 1.0 },
  { itemId: 4, name: "raw bluegill", requiredLevel: 1, rodRequired: RodTier.BASIC, fishingSpot: "lakefishingspot", probability: 0.98 },
  { itemId: 25, name: "raw salmon", requiredLevel: 5, rodRequired: RodTier.BASIC, fishingSpot: "riverfishingspot", probability: 0.95 },
  { itemId: 33, name: "raw carp", requiredLevel: 10, rodRequired: RodTier.GREAT, fishingSpot: "lakefishingspot", probability: 0.94 },
  { itemId: 11, name: "raw stingray", requiredLevel: 20, rodRequired: RodTier.GREAT, fishingSpot: "beachsidefishingspot", probability: 0.925 },
  { itemId: 27, name: "raw piranha", requiredLevel: 25, rodRequired: RodTier.GREAT, fishingSpot: "riverfishingspot", probability: 0.92 },
  { itemId: 35, name: "raw walleye", requiredLevel: 35, rodRequired: RodTier.ULTRA, fishingSpot: "lakefishingspot", probability: 0.89 },
  { itemId: 13, name: "raw crab", requiredLevel: 40, rodRequired: RodTier.ULTRA, fishingSpot: "beachsidefishingspot", probability: 0.885 },
  { itemId: 29, name: "raw koi", requiredLevel: 45, rodRequired: RodTier.ULTRA, fishingSpot: "riverfishingspot", probability: 0.85 },
  { itemId: 513, name: "golden koi", requiredLevel: 45, rodRequired: RodTier.ULTRA, fishingSpot: "goldenlakefishingspot", probability: 0.85 },
  { itemId: 21, name: "raw tuna", requiredLevel: 48, rodRequired: RodTier.BASIC, fishingSpot: "oceanfishingspot", probability: 0.85 },
  { itemId: 37, name: "raw frog", requiredLevel: 50, rodRequired: RodTier.MASTER, fishingSpot: "lakefishingspot", probability: 0.75 },
  { itemId: 17, name: "raw marlin", requiredLevel: 60, rodRequired: RodTier.GREAT, fishingSpot: "oceanfishingspot", probability: 0.675 },
  { itemId: 31, name: "raw turtle", requiredLevel: 65, rodRequired: RodTier.MASTER, fishingSpot: "riverfishingspot", probability: 0.6 },
  { itemId: 15, name: "raw clownfish", requiredLevel: 70, rodRequired: RodTier.MASTER, fishingSpot: "beachsidefishingspot", probability: 0.45 },
  { itemId: 19, name: "raw whaleshark", requiredLevel: 80, rodRequired: RodTier.ULTRA, fishingSpot: "oceanfishingspot", probability: 0.4 },
  { itemId: 23, name: "raw octopus", requiredLevel: 91, rodRequired: RodTier.MASTER, fishingSpot: "oceanfishingspot", probability: 0.325 }
];

const FISH_CONFIGS_BY_SPOT: Record<string, FishConfig[]> = FISH_CONFIGS.reduce(
  (acc, fish) => {
    if (!acc[fish.fishingSpot]) {
      acc[fish.fishingSpot] = [];
    }
    acc[fish.fishingSpot].push(fish);
    return acc;
  },
  {} as Record<string, FishConfig[]>
);

interface ExtraDropConfig {
  itemId: number;
  chance: number;
  message?: string;
}

const EXTRA_DROPS_BY_SPOT: Record<string, ExtraDropConfig[]> = {
  oceanfishingspot: [
    {
      itemId: 425,
      chance: 1 / 256,
      message: "You find a message in a bottle."
    }
  ],
  beachfishingspot: [
    {
      itemId: 425,
      chance: 1 / 256,
      message: "You find a message in a bottle."
    }
  ]
};

// =============================================================================
// Service Types
// =============================================================================

export interface FishingServiceConfig {
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
}

/** Active fishing session */
interface FishingSession {
  userId: number;
  spotId: number;
  rodConfig: RodConfig;
  resourcesRemaining: number;
  nextAttemptTick: number | null; // null = initial delay in progress, number = ready at this tick
}

// =============================================================================
// Service Implementation
// =============================================================================

/**
 * Service for handling fishing mechanics.
 */
export class FishingService {
  /** Active fishing sessions (userId -> session) */
  private activeSessions = new Map<number, FishingSession>();

  /** Fishing spot resources remaining (spotId -> count) */
  private spotResources = new Map<number, number>();

  constructor(private readonly config: FishingServiceConfig) {}

  /**
   * Creates the fishing service.
   */
  static async load(config: FishingServiceConfig): Promise<FishingService> {
    const service = new FishingService(config);
    console.log(`[FishingService] Service initialized`);
    return service;
  }

  /**
   * Initiates a fishing attempt at a spot.
   * Validates tool, checks requirements, and starts the initial delay.
   */
  public initiateFish(playerState: PlayerState, entityState: WorldEntityState): boolean {
    // Check if player has a fishing rod equipped and get its config
    const rodConfig = this.getEquippedRodConfig(playerState);
    if (!rodConfig) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        "You need to equip a fishing rod to fish."
      );
      return false;
    }

    // Check rod level requirement
    // Use effective level (includes potions - equipment bonuses)
    let playerLevel = playerState.getSkillBoostedLevel(SKILLS.fishing);
    if (playerLevel < rodConfig.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${rodConfig.requiredLevel} Fishing to use this rod.`
      );
      return false;
    }

    // Check fishing spot configuration
    const spotFish = FISH_CONFIGS_BY_SPOT[entityState.type];
    if (!spotFish) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        "You can't fish there."
      );
      return false;
    }

    // Validate rod + spot combo (each rod targets a specific fish at a spot)
    const rodSpotFish = this.getRodSpotFish(entityState.type, rodConfig.tier);
    if (!rodSpotFish) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        "You can't use that rod here."
      );
      return false;
    }

    if (playerLevel < rodSpotFish.requiredLevel) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${rodSpotFish.requiredLevel} Fishing to fish ${rodSpotFish.name}.`
      );
      return false;
    }

    // Must have capacity for at least one fish before starting.
    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      playerState.userId,
      rodSpotFish.itemId,
      0
    );
    if (availableCapacity < 1) {
      this.config.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
      return false;
    }

    // Check if spot has resources remaining
    if (!this.hasSpotResources(entityState)) {
      this.config.messageService.sendServerInfo(
        playerState.userId,
        "This fishing spot has been depleted."
      );
      return false;
    }

    // Initialize spot resources if not already tracked
    if (!this.spotResources.has(entityState.id)) {
      const { minResourcesPerSpawn, maxResourcesPerSpawn } = entityState.definition;
      const min = minResourcesPerSpawn ?? 1;
      const max = maxResourcesPerSpawn ?? 1;
      const resources = Math.floor(Math.random() * (max - min + 1)) + min;
      this.spotResources.set(entityState.id, resources);
    }

    // Create session
    const session: FishingSession = {
      userId: playerState.userId,
      spotId: entityState.id,
      rodConfig,
      resourcesRemaining: this.spotResources.get(entityState.id)!,
      nextAttemptTick: null // Initial delay in progress
    };
    this.activeSessions.set(playerState.userId, session);

    // Send StartedSkilling packet
    this.config.eventBus.emit(
      createPlayerStartedSkillingEvent(
        playerState.userId,
        entityState.id,
        SkillClientReference.Fishing,
        EntityType.Environment,
        {
          mapLevel: playerState.mapLevel,
          x: playerState.x,
          y: playerState.y
        }
      )
    );

    // Start initial delay (rod-dependent)
    const delayStarted = this.config.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.NonBlocking,
      ticks: rodConfig.castDelay,
      state: States.FishingState,
      skipStateRestore: true, // Stay in FishingState after delay for continuous fishing
      onComplete: (userId) => this.onInitialDelayComplete(userId)
    });

    if (!delayStarted) {
      this.activeSessions.delete(playerState.userId);
      this.config.messageService.sendServerInfo(playerState.userId, "You're already busy.");
      return false;
    }

    return true;
  }

  /**
   * Called when initial rod-dependent delay completes.
   * Sets up the session for tick-based processing.
   */
  private onInitialDelayComplete(userId: number): void {
    const session = this.activeSessions.get(userId);
    if (!session) return;
    session.nextAttemptTick = 0; // 0 = attempt immediately
  }

  /**
   * Called every tick by FishingSystem.
   * Processes all active sessions that are ready to attempt a catch.
   */
  public processTick(currentTick: number): void {
    for (const [userId, session] of this.activeSessions.entries()) {
      const player = this.config.playerStatesByUserId.get(userId);
      if (!player) {
        this.activeSessions.delete(userId);
        continue;
      }

      if (player.currentState !== States.FishingState) {
        this.activeSessions.delete(userId);
        continue;
      }

      if (session.nextAttemptTick === null) {
        continue;
      }

      if (currentTick < session.nextAttemptTick) {
        continue;
      }

      this.attemptCatch(userId, currentTick);
    }
  }

  /**
   * Attempts to catch fish at the spot.
   */
  private attemptCatch(userId: number, currentTick: number): void {
    const player = this.config.playerStatesByUserId.get(userId);
    const session = this.activeSessions.get(userId);

    if (!player || !session) {
      return;
    }

    const spot = this.config.worldEntityStates.get(session.spotId);
    if (!spot) {
      this.endSession(userId, "The fishing spot is no longer there.", false);
      return;
    }

    if (!this.hasSpotResources(spot)) {
      this.endSession(userId, undefined, true);
      return;
    }

    // Use effective level (includes potions + equipment bonuses)
    let playerLevel = player.getSkillBoostedLevel(SKILLS.fishing);

    const targetFish = this.getRodSpotFish(spot.type, session.rodConfig.tier);
    if (!targetFish) {
      this.endSession(userId, "You can't use that rod here.", false);
      return;
    }
    if (playerLevel < targetFish.requiredLevel) {
      this.endSession(
        userId,
        `You need level ${targetFish.requiredLevel} Fishing to fish ${targetFish.name}.`,
        false
      );
      return;
    }

    playerLevel += player.getSkillBonus(SKILLS.fishing);
    const successProbability = this.calculateSuccessProbability(playerLevel, targetFish.probability);
    const success = Math.random() < successProbability;

    if (success) {
      this.handleCatchSuccess(player, spot, session, targetFish, currentTick);
    } else {
      session.nextAttemptTick = currentTick + 1;
    }
  }

  /**
   * Handles successful fishing - awards XP and fish.
   */
  private handleCatchSuccess(
    player: PlayerState,
    spot: WorldEntityState,
    session: FishingSession,
    fish: FishConfig,
    currentTick: number
  ): void {
    // Deplete spot resource
    const remaining = this.spotResources.get(spot.id) ?? 0;
    this.spotResources.set(spot.id, remaining - 1);
    session.resourcesRemaining = remaining - 1;

    // Award fish
    this.config.inventoryService.giveItem(player.userId, fish.itemId, 1, 0);

    // Award XP from itemdefs if present
    const fishDef = this.config.itemCatalog.getDefinitionById(fish.itemId);
    const fishingXp =
      fishDef?.expFromObtaining?.skill === "fishing" ? fishDef.expFromObtaining.amount : 0;
    if (fishingXp > 0) {
      this.config.experienceService.addSkillXp(player, SKILLS.fishing, fishingXp);
    }

    // Send ObtainedResource packet
    const obtainedPayload = buildObtainedResourcePayload({
      ItemID: fish.itemId
    });
    this.config.enqueueUserMessage(player.userId, GameAction.ObtainedResource, obtainedPayload);

    // Roll extra drops (rare spot-specific drops)
    this.rollExtraDrops(player.userId, spot.type);

    const spotDepleted = session.resourcesRemaining <= 0;
    if (spotDepleted) {
      this.scheduleSpotRespawn(spot);
    }

    // Check if inventory has space after giving item
    const availableCapacity = this.config.inventoryService.calculateAvailableCapacity(
      player.userId,
      fish.itemId,
      0
    );
    if (availableCapacity < 1) {
      this.config.messageService.sendServerInfo(player.userId, "Your inventory is full.");
      this.endSession(player.userId, undefined, spotDepleted);
      return;
    }

    if (spotDepleted) {
      this.endSession(player.userId, undefined, true);
    } else {
      session.nextAttemptTick = currentTick + session.rodConfig.castDelay;
    }
  }

  /**
   * Ends a fishing session.
   */
  private endSession(userId: number, message?: string, didExhaustResources: boolean = false): void {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) return;

    this.activeSessions.delete(userId);

    if (message) {
      this.config.messageService.sendServerInfo(userId, message);
    }

    const stoppedPayload = buildStoppedSkillingPayload({
      PlayerEntityID: userId,
      Skill: SkillClientReference.Fishing,
      DidExhaustResources: didExhaustResources
    });
    this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);

    this.config.stateMachine.setState(
      { type: EntityType.Player, id: userId },
      States.IdleState
    );
  }

  /**
   * Schedules fishing spot respawn after depletion.
   */
  private scheduleSpotRespawn(spot: WorldEntityState): void {
    const respawnTicks = spot.definition.respawnTicks ?? 60;

    const nearbyPlayers = this.config.visibilitySystem.getPlayersNearEntity(spot);
    const exhaustionTracker = this.config.visibilitySystem.getResourceExhaustionTracker();
    exhaustionTracker.markExhausted(spot.id, nearbyPlayers);

    setTimeout(() => {
      const { minResourcesPerSpawn, maxResourcesPerSpawn } = spot.definition;
      const min = minResourcesPerSpawn ?? 1;
      const max = maxResourcesPerSpawn ?? 1;
      const resources = Math.floor(Math.random() * (max - min + 1)) + min;
      this.spotResources.set(spot.id, resources);

      exhaustionTracker.markReplenished(spot.id);
    }, respawnTicks * 600);
  }

  /**
   * Checks if fishing spot has resources remaining.
   */
  private hasSpotResources(spot: WorldEntityState): boolean {
    const remaining = this.spotResources.get(spot.id);
    if (remaining === undefined) {
      return true;
    }
    return remaining > 0;
  }

  /**
   * Gets the rod config for the player's equipped weapon.
   */
  private getEquippedRodConfig(playerState: PlayerState): RodConfig | null {
    const weaponItemId = this.config.equipmentService.getEquippedItemId(
      playerState.userId,
      "weapon"
    );

    if (!weaponItemId) {
      return null;
    }

    const rodConfig = ROD_CONFIG_BY_ITEM_ID.get(weaponItemId);
    if (!rodConfig) {
      const weaponDef = this.config.itemCatalog.getDefinitionById(weaponItemId);
      if (weaponDef?.equippableRequirements?.some((req: any) => req.skill === "fishing")) {
        return ROD_CONFIGS[RodTier.BASIC];
      }
      return null;
    }

    return rodConfig;
  }

  /**
   * Calculates success probability based on level and fish probability.
   */
  private calculateSuccessProbability(playerLevel: number, fishProbability: number): number {
    const baseProbability = fishProbability / PROBABILITY_SCALE;
    const levelBonus = playerLevel * LEVEL_SCALING_FACTOR;
    const rawProbability = baseProbability * (1 + levelBonus);

    return Math.max(MIN_PROBABILITY, Math.min(MAX_PROBABILITY, rawProbability));
  }

  /**
   * Gets the specific fish a rod can catch at a spot.
   * Picks the highest-level fish available for the rod tier at that spot.
   */
  private getRodSpotFish(spotType: string, rodTier: RodTier): FishConfig | null {
    const fishList = FISH_CONFIGS_BY_SPOT[spotType] ?? [];
    const rodRank = ROD_TIER_RANK.get(rodTier) ?? 0;

    const eligibleByRod = fishList.filter((fish) => {
      const requiredRodRank = ROD_TIER_RANK.get(fish.rodRequired) ?? 0;
      return rodRank >= requiredRodRank;
    });

    if (eligibleByRod.length === 0) {
      return null;
    }

    return eligibleByRod.reduce((best, current) => {
      if (current.requiredLevel > best.requiredLevel) {
        return current;
      }
      if (current.requiredLevel === best.requiredLevel && current.probability > best.probability) {
        return current;
      }
      return best;
    });
  }

  /**
   * Rolls extra spot-specific drops.
   */
  private rollExtraDrops(userId: number, spotType: string): void {
    const extraDrops = EXTRA_DROPS_BY_SPOT[spotType];
    if (!extraDrops) return;

    for (const drop of extraDrops) {
      if (Math.random() < drop.chance) {
        this.config.inventoryService.giveItem(userId, drop.itemId, 1, 0);
        if (drop.message) {
          this.config.messageService.sendServerInfo(userId, drop.message);
        }
      }
    }
  }

  /**
   * Cancels an active fishing session (e.g., when player moves).
   */
  public cancelSession(userId: number, sendPackets: boolean = true): void {
    if (!this.activeSessions.has(userId)) {
      return;
    }

    this.activeSessions.delete(userId);

    if (sendPackets) {
      const stoppedPayload = buildStoppedSkillingPayload({
        PlayerEntityID: userId,
        Skill: SkillClientReference.Fishing,
        DidExhaustResources: false
      });
      this.config.enqueueUserMessage(userId, GameAction.StoppedSkilling, stoppedPayload);
    }

    this.config.delaySystem.clearDelay(userId);
  }
}
