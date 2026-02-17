import { EntityType } from "../../protocol/enums/EntityType";
import { isSameTarget, type Target } from "../../world/targeting";
import type { PlayerState } from "../../world/PlayerState";
import type { EventBus } from "../events/EventBus";
import type { Position } from "../events/GameEvents";
import { 
  createPlayerStartedTargetingEvent, 
  createPlayerStoppedTargetingEvent,
  createNPCStartedAggroEvent,
  createNPCStoppedAggroEvent
} from "../events/GameEvents";
import type { AggroSystem } from "../systems/AggroSystem";
import type { NPCState } from "../state/EntityState";

export interface TargetingServiceDependencies {
  eventBus: EventBus;
  playerStatesByUserId: Map<number, PlayerState>;
  npcStates: Map<number, NPCState>;
  spatialIndexManager?: any; // For target position validation
}

/**
 * Service for managing entity targeting (players and NPCs).
 * 
 * **Architecture**:
 * - This is the SINGLE SOURCE OF TRUTH for all targeting state changes
 * - All targeting state modifications and event emissions happen here
 * - AggroSystem uses this service for NPC targeting (doesn't manipulate state directly)
 * 
 * **Responsibilities**:
 * - Player targeting: Track what players are targeting
 * - NPC targeting: Track what NPCs are targeting (aggro targets)
 * - Target validation: Ensure targets still exist
 * - Event emission: Notify visibility system of targeting changes
 * - Cleanup: Clear invalid targets
 * 
 * **Target types supported**:
 * - EntityType.Player: Another player
 * - EntityType.NPC: An NPC
 * - EntityType.Item: A ground item
 * - EntityType.Environment: A world entity (tree, rock, etc.)
 * 
 * **Related Systems**:
 * - AggroSystem: AI behavior that decides WHEN and WHO NPCs should aggro (uses TargetingService)
 */
export class TargetingService {
  private readonly playerTargets = new Map<number, Target>();

  constructor(private readonly deps: TargetingServiceDependencies) {}

  // ============================================================================
  // Player Targeting Methods
  // ============================================================================

  /**
   * Sets a target for a player.
   * 
   * This is the primary method for initiating player targeting. Common use cases:
   * - Player clicks on NPC to interact
   * - Player clicks on another player to trade/follow
   * - Player clicks on environment object to interact
   * 
   * Behavior:
   * - If already targeting the same entity: No-op, returns true
   * - If targeting different entity: Clears old target, sets new target
   * - Emits StartedTargeting event (triggers packet to player and viewers)
   * 
   * @param userId - The player who is targeting
   * @param target - The entity being targeted (NPC, Player, Item, or Environment)
   * @returns true if target was set successfully, false if player doesn't exist
   * 
   * @example
   * // Player clicks NPC to talk
   * targetingService.setPlayerTarget(userId, { type: EntityType.NPC, id: npcId });
   * 
   * @example
   * // Player clicks another player
   * targetingService.setPlayerTarget(userId, { type: EntityType.Player, id: otherUserId });
   */
  setPlayerTarget(userId: number, target: Target): boolean {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[TargetingService] Cannot set target - player ${userId} not found`);
      return false;
    }

    const currentTarget = this.playerTargets.get(userId);
    
    // If already targeting the same entity, no-op
    if (isSameTarget(currentTarget ?? null, target)) {
      return true;
    }
    
    // If player had a previous target, clear it first (emits StoppedTargeting)
    if (currentTarget) {
      this.playerTargets.delete(userId);
      this.deps.eventBus.emit(createPlayerStoppedTargetingEvent(userId));
    }
    
    // Set the new target
    this.playerTargets.set(userId, target);
    const position: Position = {
      mapLevel: playerState.mapLevel,
      x: playerState.x,
      y: playerState.y
    };
    this.deps.eventBus.emit(createPlayerStartedTargetingEvent(userId, target, position));
    return true;
  }

  /**
   * Gets the current target for a player.
   * 
   * @param userId - The player to query
   * @returns The current target, or null if player is not targeting anything
   * 
   * @example
   * const target = targetingService.getPlayerTarget(userId);
   * if (target?.type === EntityType.NPC) {
   *   console.log(`Player targeting NPC ${target.id}`);
   * }
   */
  getPlayerTarget(userId: number): Target | null {
    return this.playerTargets.get(userId) ?? null;
  }

  /**
   * Clears a player's target and emits StoppedTargeting event.
   * 
   * Use this when:
   * - Player manually de-targets (ESC key, click ground)
   * - Action completes and should clear target
   * - Target becomes invalid and should be cleared with notification
   * 
   * For disconnect handling, use `clearPlayerTargetOnDisconnect()` instead.
   * 
   * @param userId - The player whose target should be cleared
   * @returns true if a target was cleared, false if player wasn't targeting anything
   * 
   * @example
   * // Clear target after completing interaction
   * if (interactionComplete) {
   *   targetingService.clearPlayerTarget(userId);
   * }
   */
  clearPlayerTarget(userId: number): boolean {
    const target = this.playerTargets.get(userId);
    if (!target) {
      return false;
    }
    
    this.playerTargets.delete(userId);
    this.deps.eventBus.emit(createPlayerStoppedTargetingEvent(userId));
    return true;
  }

  /**
   * Checks if a player is currently targeting a specific entity.
   * 
   * @param userId - The player to check
   * @param target - The target to compare against
   * @returns true if player is targeting the specified entity
   * 
   * @example
   * if (targetingService.isPlayerTargeting(userId, { type: EntityType.NPC, id: npcId })) {
   *   console.log("Player is targeting this NPC");
   * }
   */
  isPlayerTargeting(userId: number, target: Target): boolean {
    const currentTarget = this.playerTargets.get(userId);
    return isSameTarget(currentTarget ?? null, target);
  }

  /**
   * Validates that a player's current target still exists.
   * 
   * Automatically clears the target if invalid (e.g., target logged out, died, despawned).
   * This is useful for periodic validation or before performing actions.
   * 
   * @param userId - The player whose target should be validated
   * @returns true if target is valid, false if target was cleared or didn't exist
   * 
   * @example
   * // Before attacking, validate target still exists
   * if (!targetingService.validatePlayerTarget(userId)) {
   *   messageService.sendServerInfo(userId, "Target is no longer available");
   *   return;
   * }
   */
  validatePlayerTarget(userId: number): boolean {
    const target = this.playerTargets.get(userId);
    if (!target) return false;
    
    // Check if target still exists
    const exists = this.doesTargetExist(target);
    if (!exists) {
      // Target no longer exists - clear it
      this.playerTargets.delete(userId);
      this.deps.eventBus.emit(createPlayerStoppedTargetingEvent(userId));
      return false;
    }
    
    return true;
  }

  /**
   * Clears a player's target WITHOUT emitting events.
   * 
   * Special disconnect-only method. Does not emit StoppedTargeting event because
   * the player is already disconnected and won't receive it.
   * 
   * Also clears any targets pointing AT this disconnecting player.
   * 
   * ⚠️ Do not use this for normal target clearing! Use `clearPlayerTarget()` instead.
   * 
   * @param userId - The player who is disconnecting
   */
  clearPlayerTargetOnDisconnect(userId: number): void {
    const target = this.playerTargets.get(userId);
    if (target) {
      this.playerTargets.delete(userId);
    }
    
    // Also clear any other players/NPCs that were targeting this player
    this.clearTargetsOnEntity({ type: EntityType.Player, id: userId });
  }

  // ============================================================================
  // NPC Targeting Methods
  // ============================================================================
  // 
  // Note: These methods are used by AggroSystem to set/clear NPC targets.
  // AggroSystem handles the AI logic (when to aggro, who to aggro), and calls
  // these methods to actually change the state and emit events.

  /**
   * Sets a target for an NPC (aggro).
   * 
   * **Called by AggroSystem** after it decides an NPC should aggro something.
   * This is the single source of truth for setting NPC targets.
   * 
   * Behavior:
   * - If already targeting same entity: No-op, returns true
   * - Sets npc.aggroTarget
   * - Clears npc.aggroDroppedTargetId (allows re-aggro)
   * - Emits NPCStartedAggro event (triggers packets to viewers)
   * 
   * @param npcId - The NPC who should target something
   * @param target - The entity to target (usually a player)
   * @param clearDroppedMemory - Whether to clear the dropped target memory (default true)
   * @returns true if successful, false if NPC doesn't exist
   * 
   * @example
   * // Called by AggroSystem when NPC finds a target
   * targetingService.setNpcTarget(npcId, { type: EntityType.Player, id: userId });
   */
  setNpcTarget(npcId: number, target: Target, clearDroppedMemory: boolean = true): boolean {
    const npcState = this.deps.npcStates.get(npcId);
    if (!npcState) {
      return false;
    }

    // Check if already targeting the same entity
    if (isSameTarget(npcState.aggroTarget ?? null, target)) {
      return true;
    }

    // Set the target and emit event (single source of truth)
    npcState.aggroTarget = target;
    if (clearDroppedMemory) {
      npcState.aggroDroppedTargetId = null;
    }

    const position: Position = {
      mapLevel: npcState.mapLevel,
      x: npcState.x,
      y: npcState.y
    };
    this.deps.eventBus.emit(createNPCStartedAggroEvent(npcId, target, position));
    return true;
  }

  /**
   * Gets the current target for an NPC.
   * 
   * @param npcId - The NPC to query
   * @returns The NPC's current target (aggroTarget), or null if not targeting anything
   * 
   * @example
   * const target = targetingService.getNpcTarget(npcId);
   * if (target?.type === EntityType.Player) {
   *   console.log(`NPC is aggro'd on player ${target.id}`);
   * }
   */
  getNpcTarget(npcId: number): Target | null {
    const npcState = this.deps.npcStates.get(npcId);
    return npcState?.aggroTarget ?? null;
  }

  /**
   * Clears an NPC's target (drops aggro).
   * 
   * **Called by AggroSystem** when aggro should be dropped, or by other systems
   * when an NPC's target becomes invalid.
   * 
   * Behavior:
   * - Saves current target ID to npc.aggroDroppedTargetId (prevents instant re-aggro)
   * - Clears npc.aggroTarget
   * - Emits NPCStoppedAggro event (triggers packets to viewers)
   * 
   * Common use cases:
   * - Target becomes invalid (dies, logs out)
   * - Target leaves NPC's movement area
   * - Combat ends
   * 
   * @param npcId - The NPC whose target should be cleared
   * @param rememberDroppedTarget - Whether to remember the dropped target to prevent re-aggro (default true)
   * @returns true if a target was cleared, false if NPC wasn't targeting anything
   * 
   * @example
   * // Called by AggroSystem when target validation fails
   * targetingService.clearNpcTarget(npcId);
   */
  clearNpcTarget(npcId: number, rememberDroppedTarget: boolean = true): boolean {
    const npcState = this.deps.npcStates.get(npcId);
    if (!npcState || !npcState.aggroTarget) {
      return false;
    }

    // Remember who we dropped aggro on to prevent immediate re-aggro
    if (rememberDroppedTarget) {
      npcState.aggroDroppedTargetId = npcState.aggroTarget.id;
    }
    
    npcState.aggroTarget = null;
    this.deps.eventBus.emit(createNPCStoppedAggroEvent(npcId));
    return true;
  }

  /**
   * Clears all NPCs targeting a specific player.
   * Used when a player dies, disconnects, or otherwise needs all aggro cleared.
   * 
   * This iterates through all NPCs and clears any that are targeting the specified player.
   * Does NOT remember dropped targets since the player is unavailable.
   * 
   * @param playerId - The player to clear all NPC targeting for
   * @returns Number of NPCs that had their target cleared
   * 
   * @example
   * // Player died - clear all NPCs attacking them
   * const clearedCount = targetingService.clearAllNPCsTargetingPlayer(userId);
   */
  clearAllNPCsTargetingPlayer(playerId: number): number {
    let clearedCount = 0;
    
    for (const npc of this.deps.npcStates.values()) {
      if (npc.aggroTarget?.type === EntityType.Player && npc.aggroTarget.id === playerId) {
        // Clear NPC's target (don't remember dropped target since player is unavailable)
        this.clearNpcTarget(npc.id, false);
        clearedCount++;
      }
    }
    
    return clearedCount;
  }

  /**
   * Checks if an NPC is currently targeting a specific entity.
   * 
   * @param npcId - The NPC to check
   * @param target - The target to compare against
   * @returns true if NPC is targeting the specified entity
   * 
   * @example
   * if (targetingService.isNpcTargeting(npcId, { type: EntityType.Player, id: userId })) {
   *   console.log("NPC is aggro'd on this player");
   * }
   */
  isNpcTargeting(npcId: number, target: Target): boolean {
    const npcState = this.deps.npcStates.get(npcId);
    const currentTarget = npcState?.aggroTarget;
    return isSameTarget(currentTarget ?? null, target);
  }

  /**
   * Validates that an NPC's current target still exists.
   * 
   * Useful for systems other than AggroSystem that need to check target validity.
   * AggroSystem has its own validation with additional logic (movement areas, etc).
   * 
   * @param npcId - The NPC whose target should be validated
   * @returns true if target is valid, false otherwise
   */
  validateNpcTarget(npcId: number): boolean {
    const npcState = this.deps.npcStates.get(npcId);
    if (!npcState || !npcState.aggroTarget) return false;
    
    return this.doesTargetExist(npcState.aggroTarget);
  }

  // ============================================================================
  // Global Targeting Methods
  // ============================================================================

  /**
   * Clears all targets pointing AT a specific entity.
   * 
   * Use this when an entity becomes invalid and should no longer be targetable:
   * - Player logs out
   * - NPC dies/despawns
   * - Item is picked up
   * - Environment object is destroyed
   * 
   * This clears:
   * - All player targets pointing at the entity
   * - All NPC targets (aggro) pointing at the entity
   * 
   * Emits appropriate StoppedTargeting events for affected players.
   * 
   * @param target - The entity that should no longer be targeted
   * 
   * @example
   * // When NPC dies, clear all targets on it
   * targetingService.clearTargetsOnEntity({ type: EntityType.NPC, id: npcId });
   * 
   * @example
   * // When item is picked up, clear targets on it
   * targetingService.clearTargetsOnEntity({ type: EntityType.Item, id: itemId });
   */
  clearTargetsOnEntity(target: Target): void {
    let clearedCount = 0;

    // Clear player targets pointing at this entity
    for (const [userId, playerTarget] of this.playerTargets) {
      if (isSameTarget(playerTarget, target)) {
        this.playerTargets.delete(userId);
        this.deps.eventBus.emit(createPlayerStoppedTargetingEvent(userId));
        clearedCount++;
      }
    }
    
    // Clear NPC aggro targets pointing at this entity
    for (const npc of this.deps.npcStates.values()) {
      if (npc.aggroTarget && isSameTarget(npc.aggroTarget, target)) {
        // Don't remember dropped target since the entity is invalid
        this.clearNpcTarget(npc.id, false);
        clearedCount++;
      }
    }

  }

  /**
   * Gets all players currently targeting a specific entity.
   * 
   * Useful for:
   * - Determining who is interested in an entity
   * - Sending notifications to all players targeting an entity
   * - Combat/interaction systems
   * 
   * @param target - The entity to check
   * @returns Array of user IDs targeting this entity
   * 
   * @example
   * // Notify all players targeting an NPC when it dies
   * const targeters = targetingService.getPlayersTargeting({ type: EntityType.NPC, id: npcId });
   * for (const userId of targeters) {
   *   messageService.sendServerInfo(userId, "Your target has died");
   * }
   */
  getPlayersTargeting(target: Target): number[] {
    const targeters: number[] = [];
    for (const [userId, playerTarget] of this.playerTargets) {
      if (isSameTarget(playerTarget, target)) {
        targeters.push(userId);
      }
    }
    return targeters;
  }

  /**
   * Gets all NPCs currently targeting a specific entity (aggro'd on it).
   * 
   * @param target - The entity to check
   * @returns Array of NPC IDs targeting this entity
   * 
   * @example
   * // Check how many NPCs are aggro'd on a player
   * const aggroedNpcs = targetingService.getNpcsTargeting({ type: EntityType.Player, id: userId });
   * console.log(`${aggroedNpcs.length} NPCs are attacking this player`);
   */
  getNpcsTargeting(target: Target): number[] {
    const targeters: number[] = [];
    for (const npc of this.deps.npcStates.values()) {
      if (npc.aggroTarget && isSameTarget(npc.aggroTarget, target)) {
        targeters.push(npc.id);
      }
    }
    return targeters;
  }

  /**
   * Gets all players currently targeting NPCs.
   * Returns pairs of userId and target for efficient combat processing.
   * 
   * This is much more efficient than iterating over all players,
   * as it only returns players that are actively targeting something.
   * 
   * @returns Array of {userId, target} pairs for players targeting NPCs
   * 
   * @example
   * // Process combat for all players targeting NPCs
   * for (const {userId, target} of targetingService.getPlayersTargetingNPCs()) {
   *   const player = playerStates.get(userId);
   *   const npc = npcStates.get(target.id);
   *   // ... process combat
   * }
   */
  getPlayersTargetingNPCs(): Array<{userId: number, target: Target}> {
    const result: Array<{userId: number, target: Target}> = [];
    for (const [userId, target] of this.playerTargets) {
      if (target.type === EntityType.NPC) {
        result.push({ userId, target });
      }
    }
    return result;
  }

  /**
   * Gets all players currently targeting other players.
   * Returns pairs of userId and target for efficient combat processing.
   */
  getPlayersTargetingPlayers(): Array<{userId: number, target: Target}> {
    const result: Array<{userId: number, target: Target}> = [];
    for (const [userId, target] of this.playerTargets) {
      if (target.type === EntityType.Player) {
        result.push({ userId, target });
      }
    }
    return result;
  }

  /**
   * Gets the position of a target entity.
   * 
   * @param target - The target to get position for
   * @returns The target's position, or null if target doesn't exist
   */
  getTargetPosition(target: Target): { x: number; y: number; mapLevel: number } | null {
    if (target.type === EntityType.Player) {
      const player = this.deps.playerStatesByUserId.get(target.id);
      if (!player) return null;
      return { x: player.x, y: player.y, mapLevel: player.mapLevel };
    } else if (target.type === EntityType.NPC) {
      const npc = this.deps.npcStates.get(target.id);
      if (!npc) return null;
      return { x: npc.x, y: npc.y, mapLevel: npc.mapLevel };
    } else if (this.deps.spatialIndexManager) {
      // For items and environment entities, use spatial index
      const position = this.deps.spatialIndexManager.getEntityPosition(target);
      return position ?? null;
    }
    return null;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Checks if a target entity still exists.
   * @private
   */
  private doesTargetExist(target: Target): boolean {
    if (target.type === EntityType.Player) {
      return this.deps.playerStatesByUserId.has(target.id);
    } else if (target.type === EntityType.NPC) {
      return this.deps.npcStates.has(target.id);
    } else if (this.deps.spatialIndexManager) {
      // For items and environment entities, check spatial index
      const position = this.deps.spatialIndexManager.getEntityPosition(target);
      return position !== null;
    }
    return false;
  }
}
