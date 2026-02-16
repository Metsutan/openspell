/**
 * DeathSystem.ts - Handles entity death and respawn mechanics.
 * 
 * Architecture:
 * - Processes dying NPCs/Players from CombatSystem after combat resolution
 * - Moves dead NPCs from npcStates to deadNpcs map (keeps npcStates clean)
 * - Manages respawn timers for dead entities
 * - Emits events to EventBus for VisibilitySystem to handle packets
 * 
 * Death Flow (NPCs):
 * 1. Check CombatSystem.getDyingNpcs() for NPCs that reached 0 HP this tick
 * 2. Verify HP is actually 0 (safety check)
 * 3. Move NPC from npcStates to deadNpcs map
 * 4. Set state to NPCDeadState
 * 5. Set respawningTicks based on definition.combat.respawnLength
 * 6. Emit NPCDiedEvent (VisibilitySystem sends EntityExitedChunk)
 * 7. Clear any aggro/targeting references to dead NPC
 * 
 * Respawn Flow (NPCs):
 * 1. Decrement respawningTicks for all dead NPCs
 * 2. When timer reaches 0:
 *    - Reset position to spawn point (definition x, y)
 *    - Reset hitpoints to max
 *    - Set state to IdleState
 *    - Clear any lingering combat state
 *    - Move NPC from deadNpcs back to npcStates
 *    - Emit NPCRespawnedEvent (VisibilitySystem sends NPCEnteredChunk)
 *    - Update spatial index with new position
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import type { NPCState } from "../state/EntityState";
import type { EventBus } from "../events/EventBus";
import type { CombatSystem } from "./CombatSystem";
import type { TargetingService } from "../services/TargetingService";
import type { SpatialIndexManager } from "./SpatialIndexManager";
import type { StateMachine } from "../StateMachine";
import type { TeleportService } from "../services/TeleportService";
import type { PlayerState, SKILLS } from "../../world/PlayerState";
import { SKILLS as SkillsEnum } from "../../world/PlayerState";
import type { MapLevel } from "../../world/Location";
import type { MonsterDropService } from "../services/MonsterDropService";
import type { PlayerDeathDropService } from "../services/PlayerDeathDropService";
import type { InstancedNpcService } from "../services/InstancedNpcService";
import type { DelaySystem } from "./DelaySystem";
import {
  createNPCRemovedEvent,
  createNPCAddedEvent,
  createPlayerDiedEvent,
  type Position,
  type EntityRef
} from "../events/GameEvents";

/**
 * Defines a rectangular respawn area with two corner points.
 * Players respawn at a random position within this area.
 */
export interface RespawnArea {
  mapLevel: MapLevel;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Default respawn area - players will spawn here on death.
 * This is the starting town/safe area.
 */
const DEFAULT_RESPAWN_AREA: RespawnArea = {
  mapLevel: 1 as MapLevel, // Overworld
  minX: 91,
  minY: -186,
  maxX: 94,
  maxY: -183
};

export interface DeathSystemConfig {
  /** Reference to combat system to get dying entities */
  combatSystem: CombatSystem;
  /** Map of alive NPCs (entities are removed from here when they die) */
  npcStates: Map<number, NPCState>;
  /** Map of player states */
  playerStates: Map<number, PlayerState>;
  /** Event bus for emitting death/respawn events */
  eventBus: EventBus;
  /** Targeting service to clear targets when entities die */
  targetingService: TargetingService;
  /** Spatial index for updating entity positions */
  spatialIndex: SpatialIndexManager;
  /** State machine for managing entity states */
  stateMachine: StateMachine;
  /** Teleport service for respawning players */
  teleportService: TeleportService;
  /** Monster drop service for spawning loot when NPCs die */
  monsterDropService: MonsterDropService;
  /** Player death drop service for handling player item drops on death */
  playerDeathDropService: PlayerDeathDropService;
  /** Delay system for clearing active delays on death */
  delaySystem: DelaySystem;
  /** Optional instanced NPC service for kill callbacks */
  instancedNpcService?: InstancedNpcService | null;
  /** Optional custom respawn area (uses DEFAULT_RESPAWN_AREA if not provided) */
  respawnArea?: RespawnArea;
}

/**
 * Represents a dead NPC waiting to respawn.
 */
interface DeadNPC {
  /** The NPC's full state (frozen at death) */
  npcState: NPCState;
  /** Ticks to wait before sending EntityExitedChunk (death animation delay) */
  deathVisibilityTicks: number;
  /** Ticks remaining until respawn */
  respawningTicks: number;
  /** Original spawn position from definition */
  spawnPosition: Position;
  /** Max hitpoints to restore on respawn */
  maxHitpoints: number;
  /** Position where the NPC died (for sending EntityExitedChunk later) */
  deathPosition: Position;
  /** User ID of the player who killed this NPC (for loot visibility) */
  killerUserId: number | null;
  /** Whether loot has been dropped for this NPC */
  lootDropped: boolean;
  /** Loot table override for instanced NPCs */
  lootOverrideId: number | null;
  /** Whether this NPC should respawn after death */
  shouldRespawn: boolean;
}

/**
 * Represents a dead player waiting to respawn.
 */
interface DeadPlayer {
  /** The player's userId */
  userId: number;
  /** Ticks remaining until respawn (2 ticks for death animation) */
  dyingTicks: number;
  /** Position where the player died */
  deathPosition: Position;
  /** The entity that killed them (for PlayerDied packet) */
  killerRef: EntityRef | null;
}

/**
 * System for handling entity death and respawn.
 */
export class DeathSystem {
  /** Map of dead NPCs by NPC ID */
  private readonly deadNpcs = new Map<number, DeadNPC>();
  
  /** Map of dead players by userId */
  private readonly deadPlayers = new Map<number, DeadPlayer>();
  
  /** 
   * Number of ticks to keep dead NPC visible before sending EntityExitedChunk.
   * This allows clients to play death animations before the entity disappears.
   * Set to 2 to match OSRS behavior (entities persist for ~1 second before vanishing).
   */
  private static readonly DEATH_ANIMATION_DELAY_TICKS = 2;
  
  /**
   * Number of ticks players remain in dying state before respawn.
   * During this time, players cannot take any actions.
   */
  private static readonly PLAYER_DEATH_DELAY_TICKS = 4;

  constructor(private readonly config: DeathSystemConfig) {}

  public setInstancedNpcService(service: InstancedNpcService | null): void {
    this.config.instancedNpcService = service;
  }

  /**
   * Main update called once per server tick.
   * @deprecated Use processDeath() and processRespawns() separately
   * 
   * This method is kept for backward compatibility but the game server should call
   * the individual methods at different points in the tick cycle.
   */
  update(): void {
    this.processDeath();
    this.processRespawns();
  }

  /**
   * Processes deaths for all dying entities.
   * Should be called early in the tick, right after combat resolution.
   * 
   * This moves dying NPCs from npcStates to deadNpcs and starts their respawn timers.
   * After processing, it clears the CombatSystem's dying collections.
   */
  public processDeath(): void {
    this.processDyingNPCs();
    this.processDyingPlayers();
    
    // Clear the combat system's dying collections after we've processed them
    // This prevents the same NPCs from being processed multiple times
    this.config.combatSystem.clearDyingCollections();
  }

  /**
   * Processes respawns for all dead entities.
   * Should be called at the end of the tick, before client updates.
   * 
   * This handles:
   * 1. Death animation delays (NPCs remain visible for a few ticks)
   * 2. Respawn timers (NPCs come back to life after delay)
   * 3. Player death timers (2 ticks then respawn at spawn point)
   */
  public processRespawns(): void {
    this.updateDeathAnimations();
    this.updateRespawnTimers();
    this.updatePlayerDeathTimers();
  }

  /**
   * Processes NPCs that died this tick (reached 0 HP in combat).
   */
  private processDyingNPCs(): void {
    const dyingNpcIds = this.config.combatSystem.getDyingNpcs();
    const dyingNpcsWithKillers = this.config.combatSystem.getDyingNpcsWithKillers();

    for (const npcId of dyingNpcIds) {
      const npc = this.config.npcStates.get(npcId);
      if (!npc) {
        // NPC already removed or doesn't exist
        continue;
      }

      // Safety check: verify NPC actually has 0 HP
      if (npc.hitpointsLevel > 0) {
        console.warn(`[DeathSystem] NPC ${npcId} marked as dying but has ${npc.hitpointsLevel} HP`);
        continue;
      }

      // Get killer information for loot visibility
      const killerRef = dyingNpcsWithKillers.get(npcId);
      const killerUserId = npc.instanced?.ownerUserId ?? (killerRef?.type === EntityType.Player ? killerRef.id : null);

      // Get respawn time from definition (default to 50 ticks = ~30 seconds if not specified)
      const respawnLength = npc.definition.combat?.respawnLength ?? 50;

      // Store original spawn position (from NPC's respawn coordinates)
      const spawnPosition: Position = {
        mapLevel: npc.mapLevel,
        x: npc.respawnX,
        y: npc.respawnY
      };

      // Get max hitpoints from definition
      const maxHitpoints = npc.definition.combat?.hitpoints ?? 10;

      // Capture current position for death animation
      const deathPosition: Position = {
        mapLevel: npc.mapLevel,
        x: npc.x,
        y: npc.y
      };

      // Set NPC state to dead (StateMachine handles state update internally)
      this.config.stateMachine.setState(
        { type: EntityType.NPC, id: npcId },
        States.NPCDeadState
      );

      // Clear any targeting/aggro involving this NPC
      this.clearNPCTargeting(npcId);

      // Move NPC from alive map to dead map
      // NOTE: We keep it in spatial index for death animation visibility
      this.config.npcStates.delete(npcId);
      this.deadNpcs.set(npcId, {
        npcState: npc,
        deathVisibilityTicks: DeathSystem.DEATH_ANIMATION_DELAY_TICKS,
        respawningTicks: respawnLength,
        spawnPosition,
        maxHitpoints,
        deathPosition,
        killerUserId,
        lootDropped: false,
        lootOverrideId: npc.instanced?.lootOverrideId ?? null,
        shouldRespawn: npc.instanced === null
      });

      // Don't emit NPCRemovedEvent yet - wait for death animation delay
      // The event will be emitted in updateDeathAnimations() after the delay
      this.config.instancedNpcService?.handleInstancedNpcKilled(npc);
    }
  }

  /**
   * Processes players that died this tick (reached 0 HP in combat).
   * Sets them to PlayerDeadState, emits PlayerDied event, starts death timer,
   * and handles item drops (keeping 3 most valuable, dropping rest).
   */
  private processDyingPlayers(): void {
    const dyingPlayers = this.config.combatSystem.getDyingPlayers();

    for (const [userId, killerRef] of dyingPlayers.entries()) {
      const player = this.config.playerStates.get(userId);
      if (!player) {
        // Player already removed or doesn't exist
        continue;
      }

      // Safety check: verify player actually has 0 HP
      const currentHp = player.getSkillState(SkillsEnum.hitpoints).boostedLevel;
      if (currentHp > 0) {
        console.warn(`[DeathSystem] Player ${userId} marked as dying but has ${currentHp} HP`);
        continue;
      }

      // Capture death position
      const deathPosition: Position = {
        mapLevel: player.mapLevel,
        x: player.x,
        y: player.y
      };

      // Note: PlayerDeadState was already set by CombatSystem immediately upon death
      // This ensures NPCs stop attacking right away, preventing additional hits

      // Process death item drops IMMEDIATELY when player dies
      // This keeps 3 most valuable items, drops rest on ground
      this.config.playerDeathDropService.processPlayerDeath(
        userId,
        deathPosition.x,
        deathPosition.y,
        deathPosition.mapLevel,
        killerRef?.type === EntityType.Player ? killerRef.id : null
      );

      // Clear player's targeting
      this.config.targetingService.clearPlayerTarget(userId);

      // Clear any active delays (pickpocket, stun, etc.) to prevent memory leak
      this.config.delaySystem.clearDelay(userId);

      // Add to dead players map
      this.deadPlayers.set(userId, {
        userId,
        dyingTicks: DeathSystem.PLAYER_DEATH_DELAY_TICKS,
        deathPosition,
        killerRef
      });

      // Emit PlayerDied event immediately (VisibilitySystem sends packet)
      this.config.eventBus.emit(createPlayerDiedEvent(
        userId,
        killerRef?.id ?? null,
        deathPosition
      ));

      console.log(`[DeathSystem] Player ${userId} died at (${deathPosition.x}, ${deathPosition.y})`);
    }
  }
  /**
   * Updates death animation timers and removes NPCs from visibility when ready.
   * NPCs stay visible (but non-interactive) for DEATH_ANIMATION_DELAY_TICKS
   * after death to allow clients to play death animations.
   * 
   * When the animation delay expires, loot is dropped and the NPC is removed from visibility.
   */
  private updateDeathAnimations(): void {
    const npcsToMakeInvisible: number[] = [];

    // Check death visibility timers
    for (const [npcId, deadNpc] of this.deadNpcs.entries()) {
      // Only process if still in death animation phase
      if (deadNpc.deathVisibilityTicks > 0) {
        deadNpc.deathVisibilityTicks--;

        // When animation delay expires, remove from spatial index and emit event
        if (deadNpc.deathVisibilityTicks === 0) {
          npcsToMakeInvisible.push(npcId);
        }
      }
    }

    // Remove NPCs from visibility after death animation completes
    for (const npcId of npcsToMakeInvisible) {
      const deadNpc = this.deadNpcs.get(npcId);
      if (!deadNpc) continue;

      // Drop loot RIGHT BEFORE the NPC disappears
      if (!deadNpc.lootDropped) {
        this.config.monsterDropService.dropLoot(
          deadNpc.npcState.definitionId,
          deadNpc.deathPosition.mapLevel,
          deadNpc.deathPosition.x,
          deadNpc.deathPosition.y,
          deadNpc.killerUserId,
          deadNpc.lootOverrideId
        );
        deadNpc.lootDropped = true;
      }

      // Remove from spatial index (now truly invisible)
      this.config.spatialIndex.removeNPC(npcId);

      // Emit death event (VisibilitySystem will send EntityExitedChunk)
      this.config.eventBus.emit(createNPCRemovedEvent(
        npcId,
        deadNpc.deathPosition,
        "died"
      ));

      if (!deadNpc.shouldRespawn) {
        this.deadNpcs.delete(npcId);
      }
    }
  }

  /**
   * Updates respawn timers for all dead NPCs and respawns when ready.
   */
  private updateRespawnTimers(): void {
    const respawningNpcs: number[] = [];

    // Decrement respawn timers and collect NPCs ready to respawn
    for (const [npcId, deadNpc] of this.deadNpcs.entries()) {
      if (!deadNpc.shouldRespawn) {
        continue;
      }
      deadNpc.respawningTicks--;

      if (deadNpc.respawningTicks <= 0) {
        respawningNpcs.push(npcId);
      }
    }

    // Respawn NPCs that are ready
    for (const npcId of respawningNpcs) {
      this.respawnNPC(npcId);
    }
  }

  /**
   * Respawns an NPC, restoring it to full health at its spawn point.
   */
  private respawnNPC(npcId: number): void {
    const deadNpc = this.deadNpcs.get(npcId);
    if (!deadNpc) return;

    const npc = deadNpc.npcState;

    // Reset position to spawn point
    npc.x = deadNpc.spawnPosition.x;
    npc.y = deadNpc.spawnPosition.y;
    npc.mapLevel = deadNpc.spawnPosition.mapLevel;

    // Restore hitpoints to max
    npc.hitpointsLevel = deadNpc.maxHitpoints;

    // Reset combat stats to base
    npc.accuracyLevel = npc.definition.combat?.accuracy ?? 1;
    npc.strengthLevel = npc.definition.combat?.strength ?? 1;
    npc.defenseLevel = npc.definition.combat?.defense ?? 1;
    npc.magicLevel = npc.definition.combat?.magic ?? 1;
    npc.rangeLevel = npc.definition.combat?.range ?? 1;
    npc.boostedStats.clear();

    // Reset combat state
    npc.combatDelay = 0;
    npc.aggroTarget = null;
    npc.aggroDroppedTargetId = null;

    // Set state to idle (StateMachine handles state update internally)
    this.config.stateMachine.setState(
      { type: EntityType.NPC, id: npcId },
      States.IdleState
    );

    // Move NPC from dead map back to alive map
    this.deadNpcs.delete(npcId);
    this.config.npcStates.set(npcId, npc);

    // Add back to spatial index
    this.config.spatialIndex.addNPC({
      id: npc.id,
      definitionId: npc.definitionId,
      mapLevel: npc.mapLevel,
      x: npc.x,
      y: npc.y,
      hitpointsLevel: npc.hitpointsLevel,
      currentState: npc.currentState,
      aggroRadius: npc.aggroRadius
    });

    // Emit respawn event (VisibilitySystem will send NPCEnteredChunk)
    this.config.eventBus.emit(createNPCAddedEvent(
      npcId,
      npc.definitionId,
      deadNpc.spawnPosition,
      {
        npcId,
        definitionId: npc.definitionId,
        hitpointsLevel: npc.hitpointsLevel,
        currentState: npc.currentState,
        aggroRadius: npc.aggroRadius
      }
    ));
  }

  /**
   * Updates death timers for all dead players and respawns when ready.
   */
  private updatePlayerDeathTimers(): void {
    const playersToRespawn: number[] = [];

    // Decrement death timers and collect players ready to respawn
    for (const [userId, deadPlayer] of this.deadPlayers.entries()) {
      deadPlayer.dyingTicks--;

      if (deadPlayer.dyingTicks <= 0) {
        playersToRespawn.push(userId);
      }
    }

    // Respawn players that are ready
    for (const userId of playersToRespawn) {
      this.respawnPlayer(userId);
    }
  }

  /**
   * Respawns a player at a random position within the respawn area.
   */
  private respawnPlayer(userId: number): void {
    const deadPlayer = this.deadPlayers.get(userId);
    if (!deadPlayer) return;

    const player = this.config.playerStates.get(userId);
    if (!player) {
      // Player disconnected while dead - just remove from dead list
      this.deadPlayers.delete(userId);
      return;
    }

    // Get respawn area (use config or default)
    const respawnArea = this.config.respawnArea ?? DEFAULT_RESPAWN_AREA;

    // Generate random position within respawn area
    const respawnX = Math.floor(
      Math.random() * (respawnArea.maxX - respawnArea.minX + 1) + respawnArea.minX
    );
    const respawnY = Math.floor(
      Math.random() * (respawnArea.maxY - respawnArea.minY + 1) + respawnArea.minY
    );

    // Restore hitpoints to max
    const maxHp = player.getSkillState(SkillsEnum.hitpoints).level;
    player.setBoostedLevel(SkillsEnum.hitpoints, maxHp);

    // Reset combat delay
    player.combatDelay = 0;

    // Clear any pending actions
    player.pendingAction = null;

    // Remove from dead players map
    this.deadPlayers.delete(userId);

    // Teleport to respawn point - this handles:
    // - Updating player position
    // - Updating spatial index
    // - Emitting teleport event (which sends TeleportTo packet with Type=Respawn)
    this.config.teleportService.respawnPlayer(
      userId,
      respawnX,
      respawnY,
      respawnArea.mapLevel
    );

    // Set state to idle AFTER teleport (teleport event needs to include respawn type)
    // StateMachine handles state update internally
    this.config.stateMachine.setState(
      { type: EntityType.Player, id: userId },
      States.IdleState
    );

    console.log(`[DeathSystem] Player ${userId} respawned at (${respawnX}, ${respawnY})`);
  }

  /**
   * Clears all targeting references involving an NPC (when it dies).
   * - Clears the NPC's aggro target
   * - Clears any players/NPCs targeting this NPC
   */
  private clearNPCTargeting(npcId: number): void {
    // Clear NPC's aggro target (don't remember dropped target since it's dead)
    this.config.targetingService.clearNpcTarget(npcId, false);

    // Clear any players targeting this NPC
    const playersTargetingNPCs = this.config.targetingService.getPlayersTargetingNPCs();
    for (const { userId, target } of playersTargetingNPCs) {
      if (target.type === EntityType.NPC && target.id === npcId) {
        this.config.targetingService.clearPlayerTarget(userId);
      }
    }
  }

  /**
   * Gets the number of NPCs currently dead and respawning.
   * Useful for debugging and monitoring.
   */
  getDeadNPCCount(): number {
    return this.deadNpcs.size;
  }

  /**
   * Gets a dead NPC's respawn timer (for debugging).
   */
  getDeadNPCTimer(npcId: number): number | null {
    const deadNpc = this.deadNpcs.get(npcId);
    return deadNpc ? deadNpc.respawningTicks : null;
  }

  /**
   * Checks if a player is currently dead and waiting to respawn.
   * Used to block player actions while in dying state.
   */
  isPlayerDead(userId: number): boolean {
    return this.deadPlayers.has(userId);
  }

  /**
   * Gets the number of players currently dead.
   * Useful for debugging and monitoring.
   */
  getDeadPlayerCount(): number {
    return this.deadPlayers.size;
  }

  /**
   * Gets a dead player's death timer (for debugging).
   */
  getDeadPlayerTimer(userId: number): number | null {
    const deadPlayer = this.deadPlayers.get(userId);
    return deadPlayer ? deadPlayer.dyingTicks : null;
  }
}
