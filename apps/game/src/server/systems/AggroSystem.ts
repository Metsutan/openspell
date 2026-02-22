/**
 * AggroSystem.ts - Handles NPC aggression AI and behavior.
 * 
 * **Purpose**: AI decision-making for NPC aggression
 * - Decides WHEN NPCs should aggro (aggro radius, movement areas)
 * - Decides WHO NPCs should aggro (closest valid target)
 * - Validates existing aggro targets (still in range, on same map, etc)
 * - Manages aggro drop logic (recently dropped target memory)
 * 
 * **Architecture**:
 * - Uses TargetingService to set/clear NPC targets (doesn't manipulate state directly)
 * - TargetingService emits events and is the single source of truth for targeting
 * - This system is purely for AI behavior logic
 * 
 * **Game Rules Enforced**:
 * - Aggro radius (Chebyshev distance)
 * - Movement area boundaries (NPCs only aggro targets inside their area)
 * - Recently dropped target memory (prevents instant re-aggro)
 * - Distinction between initiating aggro vs maintaining aggro
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { SpatialIndexManager } from "./SpatialIndexManager";
import type { NPCState } from "../state/EntityState";
import type { Target } from "../../world/targeting";
import type { EntityMovementArea } from "../../world/entities/EntityCatalog";
import { isWithinBounds } from "../../world/SpatialIndex";
import type { TargetingService } from "../services/TargetingService";
import { getInstancedNpcOwnerUserId } from "../services/instancedNpcUtils";

export type AggroSystemConfig = {
  npcStates: Map<number, NPCState>;
  spatialIndex: SpatialIndexManager;
  targetingService: TargetingService;
};

export class AggroSystem {
  constructor(private readonly config: AggroSystemConfig) {}

  /**
   * Updates aggro state for all NPCs.
   * 
   * Main AI update loop that runs every server tick:
   * - For NPCs with aggro: Validates existing targets or finds new ones
   * - Uses TargetingService to actually set/clear targets (doesn't manipulate state)
   * 
   * Called once per server tick.
   */
  update(): void {
    for (const npc of this.config.npcStates.values()) {
      // Skip NPCs without aggro capability
      if (!this.npcHasAggro(npc) && !this.config.targetingService.getNpcTarget(npc.id)) continue;

      const aggroRadius = this.getNpcAggroRadius(npc);

      // If already has a target, validate it
      const target = this.config.targetingService.getNpcTarget(npc.id);
      if (target) {
        const targetValid = this.validateTargetForNpc(npc, target);
        if (!targetValid) {
          // Use TargetingService to drop aggro (handles state and events)
          this.config.targetingService.clearNpcTarget(npc.id);
        }
        continue;
      }

      // Try to find a new target
      const newTarget = this.findAggroTarget(npc, aggroRadius);
      if (newTarget) {
        // Use TargetingService to set target (handles state and events)
        this.config.targetingService.setNpcTarget(npc.id, newTarget);
      }
    }
  }

  /**
   * Drops aggro for an NPC and returns it to idle/wandering state.
   * 
   * This is a convenience method that uses TargetingService.
   * Can be called by other systems when they need to force an NPC to drop aggro.
   * 
   * @param npcId - The ID of the NPC to drop aggro for
   */
  dropNpcAggro(npcId: number): void {
    // Use TargetingService to drop aggro (handles state and events)
    this.config.targetingService.clearNpcTarget(npcId);
  }

  /**
   * Validates that an existing aggro target is still valid.
   * Target becomes invalid if:
   * - Player logged out
   * - Player moved to a different map level
   * - Player moved outside the NPC's movement area (including adjacent tiles)
   * 
   * Note: Aggro radius is only used for INITIATING aggro, not maintaining it.
   * Once aggro'd, NPCs will pursue until the player leaves the movement area boundary.
   * 
   * @param npcId The ID of the NPC whose target should be validated
   * @returns true if the target is valid, false if it should be dropped
   */
  validateTarget(npcId: number, target: Target): boolean {
    const npc = this.config.npcStates.get(npcId);
    if (!npc) return false;
    return this.validateTargetForNpc(npc, target);
  }

  /**
   * Gets the current position of a target (player, NPC, or other entity).
   * 
   * Convenience method that uses TargetingService.
   * 
   * @param target - The target to get the position for
   * @returns The target's position or null if the target doesn't exist
   */
  getTargetPosition(target: Target): { x: number; y: number } | null {
    const position = this.config.targetingService.getTargetPosition(target);
    if (!position) return null;
    return { x: position.x, y: position.y };
  }

  // ==================== Private Helper Methods ====================

  /**
   * Checks if an NPC has aggro capabilities based on its definition.
   */
  private npcHasAggro(npc: NPCState): boolean {
    const aggroRadius = npc.definition.combat?.aggroRadius ?? 0;
    return aggroRadius > 0;
  }

  /**
   * Gets the aggro radius for an NPC.
   */
  private getNpcAggroRadius(npc: NPCState): number {
    return npc.definition.combat?.aggroRadius ?? 0;
  }

  /**
   * Validates that an existing aggro target is still valid for a specific NPC.
   */
  private validateTargetForNpc(npc: NPCState, target: Target): boolean {
    if (target.type !== EntityType.Player) {
      // For now, only players can be aggro targets
      return false;
    }

    const playerEntry = this.config.spatialIndex.getPlayer(target.id);
    if (!playerEntry) {
      // Player logged out
      return false;
    }

    // Check if player is dead - drop aggro immediately
    if (playerEntry.playerState.currentState === States.PlayerDeadState) {
      return false;
    }

    // Check if player is still on the same map level
    if (playerEntry.mapLevel !== npc.mapLevel) {
      return false;
    }

    // Check if player is outside the NPC's movement area + adjacent buffer (drop aggro)
    if (!this.isPositionInOrAdjacentToMovementArea(playerEntry.x, playerEntry.y, npc.movementArea)) {
      return false;
    }

    // Instanced NPCs can only aggro their owning player.
    const ownerUserId = getInstancedNpcOwnerUserId(npc);
    if (ownerUserId !== null && ownerUserId !== target.id) {
      return false;
    }

    return true;
  }

  /**
   * Finds a potential aggro target for an NPC.
   * 
   * Requirements for INITIATING aggro:
   * - Target must be within aggro radius (Chebyshev distance)
   * - Target must be STRICTLY INSIDE the NPC's movement area (not adjacent)
   * - Target must not be a recently dropped target (unless they left and re-entered)
   * 
   * Note: Once aggro is established, NPCs can PURSUE targets that are adjacent to
   * their movement area (handled by validateTargetForNpc), but they cannot INITIATE
   * aggro on targets that are only adjacent.
   */
  private findAggroTarget(npc: NPCState, aggroRadius: number): Target | null {
    // Query the unified spatial index for nearby players
    const nearbyPlayers = this.config.spatialIndex.getPlayersInAggroRange(
      npc.mapLevel,
      npc.x,
      npc.y,
      aggroRadius
    );

    if (nearbyPlayers.length === 0) {
      // No players nearby, clear the dropped target memory
      // (this allows re-aggro if the player returns later)
      npc.aggroDroppedTargetId = null;
      return null;
    }

    // Find the closest valid target
    let bestTarget: { id: number; x: number; y: number } | null = null;
    let bestDistSq = Infinity;

    for (const player of nearbyPlayers) {
      const ownerUserId = getInstancedNpcOwnerUserId(npc);
      if (ownerUserId !== null && ownerUserId !== player.id) {
        continue;
      }

      // Skip dead players - NPCs cannot aggro on dead players
      if (player.playerState.currentState === States.PlayerDeadState) {
        continue;
      }

      // Skip if this is a recently dropped target that hasn't left the area
      if (npc.aggroDroppedTargetId === player.id) {
        // Check if they're still in or adjacent to the area - if so, don't re-aggro
        if (this.isPositionInOrAdjacentToMovementArea(player.x, player.y, npc.movementArea)) {
          continue;
        } else {
          // They left and came back, clear the memory
          npc.aggroDroppedTargetId = null;
        }
      }

      // For INITIATING aggro, target must be STRICTLY INSIDE the movement area
      // (not just adjacent - adjacent is only allowed for continued pursuit)
      if (!this.isPositionInMovementArea(player.x, player.y, npc.movementArea)) {
        continue;
      }

      // Calculate distance
      const dx = player.x - npc.x;
      const dy = player.y - npc.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        bestTarget = player;
      }
    }

    if (!bestTarget) return null;

    return {
      type: EntityType.Player,
      id: bestTarget.id
    };
  }

  /**
   * Checks if a position is within the NPC's movement area (or adjacent to it).
   * Used to determine if a target can be pursued or if aggro should be dropped.
   */
  private isPositionInOrAdjacentToMovementArea(
    x: number,
    y: number,
    area: EntityMovementArea
  ): boolean {
    const innerBounds = this.getExclusiveMovementAreaBounds(area);
    if (!innerBounds) return false;

    const { minX, maxX, minY, maxY } = innerBounds;
    // Allow 1 tile outside the boundary for "adjacent"
    return isWithinBounds(x, y, minX - 1, maxX + 1, minY - 1, maxY + 1);
  }

  /**
   * Checks if a position is strictly within the NPC's movement area.
   */
  private isPositionInMovementArea(
    x: number,
    y: number,
    area: EntityMovementArea
  ): boolean {
    const innerBounds = this.getExclusiveMovementAreaBounds(area);
    if (!innerBounds) return false;

    const { minX, maxX, minY, maxY } = innerBounds;
    return isWithinBounds(x, y, minX, maxX, minY, maxY);
  }

  /**
   * Converts a configured movement box to an exclusive interior box.
   * Example: [min..max] becomes [min+1..max-1].
   */
  private getExclusiveMovementAreaBounds(area: EntityMovementArea): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null {
    const minX = Math.min(area.minX, area.maxX);
    const maxX = Math.max(area.minX, area.maxX);
    const minY = Math.min(area.minY, area.maxY);
    const maxY = Math.max(area.minY, area.maxY);

    const innerMinX = minX + 1;
    const innerMaxX = maxX - 1;
    const innerMinY = minY + 1;
    const innerMaxY = maxY - 1;
    if (innerMinX > innerMaxX || innerMinY > innerMaxY) {
      return null;
    }

    return {
      minX: innerMinX,
      maxX: innerMaxX,
      minY: innerMinY,
      maxY: innerMaxY
    };
  }
}
