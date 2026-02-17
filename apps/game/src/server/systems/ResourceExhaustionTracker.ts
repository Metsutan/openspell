/**
 * ResourceExhaustionTracker.ts - Tracks resource exhaustion and witnesses
 * 
 * This system tracks which entities (trees, rocks, etc.) are exhausted and which
 * players have witnessed the exhaustion. When an entity replenishes, all witnesses
 * are notified regardless of their current location.
 * 
 * Architecture:
 * - Integrates with VisibilitySystem to detect when players enter view of exhausted entities
 * - Tracks witnesses per exhausted entity
 * - Sends EntityExhaustedResources when entity depletes or player enters view
 * - Sends EntityReplenishedResources to all witnesses when entity replenishes
 */

import type { EntityRef } from "../events/GameEvents";
import type { PacketSender } from "./VisibilitySystem";
import { GameAction } from "../../protocol/enums/GameAction";
import { buildEntityExhaustedResourcesPayload } from "../../protocol/packets/actions/EntityExhaustedResources";
import { buildEntityReplenishedResourcesPayload } from "../../protocol/packets/actions/EntityReplenishedResources";

/**
 * Tracks exhausted entities and their witnesses.
 */
export class ResourceExhaustionTracker {
  /** Map of exhausted entity ID to set of witness user IDs */
  private exhaustedEntities = new Map<number, Set<number>>();

  constructor(private readonly packetSender: PacketSender) {}

  /**
   * Marks an entity as exhausted and notifies nearby players.
   * @param entityId - The entity that was exhausted (e.g., tree ID)
   * @param nearbyPlayerIds - Player IDs who can currently see the entity
   */
  markExhausted(entityId: number, nearbyPlayerIds: Set<number>): void {

    // Initialize witness set if not exists
    if (!this.exhaustedEntities.has(entityId)) {
      this.exhaustedEntities.set(entityId, new Set());
    }

    const witnesses = this.exhaustedEntities.get(entityId)!;

    // Build exhausted packet
    const exhaustedPayload = buildEntityExhaustedResourcesPayload({
      EntityTypeID: entityId
    });

    // Send to all nearby players and add them as witnesses
    for (const userId of nearbyPlayerIds) {
      if (!witnesses.has(userId)) {
        witnesses.add(userId);
      }
      
      this.packetSender.sendToUser(userId, {
        action: GameAction.EntityExhaustedResources,
        payload: exhaustedPayload
      });
    }
  }

  /**
   * Notifies a player that an entity is exhausted when they enter view of it.
   * @param entityId - The exhausted entity
   * @param userId - The player who just entered view
   */
  notifyExhausted(entityId: number, userId: number): void {
    if (!this.exhaustedEntities.has(entityId)) {
      return; // Entity is not exhausted
    }

    const witnesses = this.exhaustedEntities.get(entityId)!;
    
    // Add player as witness if not already
    if (!witnesses.has(userId)) {
      witnesses.add(userId);
    }

    // Send exhausted packet to the player
    const exhaustedPayload = buildEntityExhaustedResourcesPayload({
      EntityTypeID: entityId
    });

    this.packetSender.sendToUser(userId, {
      action: GameAction.EntityExhaustedResources,
      payload: exhaustedPayload
    });
  }

  /**
   * Marks an entity as replenished and notifies all witnesses.
   * @param entityId - The entity that replenished
   */
  markReplenished(entityId: number): void {
    const witnesses = this.exhaustedEntities.get(entityId);
    if (!witnesses) {
      return; // Entity was not exhausted
    }


    // Build replenished packet
    const replenishedPayload = buildEntityReplenishedResourcesPayload({
      EntityTypeID: entityId
    });

    // Send to ALL witnesses (regardless of current location)
    for (const userId of witnesses) {
      this.packetSender.sendToUser(userId, {
        action: GameAction.EntityReplenishedResources,
        payload: replenishedPayload
      });
    }

    // Clear witness list
    this.exhaustedEntities.delete(entityId);
  }

  /**
   * Checks if an entity is currently exhausted.
   */
  isExhausted(entityId: number): boolean {
    return this.exhaustedEntities.has(entityId);
  }

  /**
   * Gets the witness count for an exhausted entity (for debugging).
   */
  getWitnessCount(entityId: number): number {
    return this.exhaustedEntities.get(entityId)?.size ?? 0;
  }

  /**
   * Gets all currently exhausted entities (for debugging).
   */
  getExhaustedEntities(): number[] {
    return Array.from(this.exhaustedEntities.keys());
  }

  /**
   * Clears all exhaustion tracking (for cleanup/reset).
   */
  clear(): void {
    this.exhaustedEntities.clear();
  }
}
