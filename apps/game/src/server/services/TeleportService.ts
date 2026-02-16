import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import type { MapLevel } from "../../world/Location";
import type { PlayerState } from "../../world/PlayerState";
import type { EventBus } from "../events/EventBus";
import { createPlayerTeleportedEvent, type Position } from "../events/GameEvents";
import type { SpatialIndexManager } from "../systems/SpatialIndexManager";
import { buildCastedTeleportSpellPayload } from "../../protocol/packets/actions/CastedTeleportSpell";
import { TeleportType } from "../../protocol/enums/TeleportType";

export interface TeleportServiceDependencies {
  playerStatesByUserId: Map<number, PlayerState>;
  spatialIndex: SpatialIndexManager;
  eventBus: EventBus;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  enqueueBroadcast: (action: GameAction, payload: unknown[]) => void;
  cancelMovementPlanForPlayer?: (userId: number) => void;
}

export interface TeleportOptions {
  /** The type of teleport (Teleport, Respawn, ChangeMapLevel) */
  type?: TeleportType;
  
  /** Spell ID if teleporting via spell (triggers cast animation) */
  spellId?: number;
  
  /** Whether to broadcast the spell cast animation to nearby players */
  broadcastSpellCast?: boolean;
  
  /** Whether to validate the teleport (default: true) */
  validate?: boolean;
}

export interface TeleportResult {
  success: boolean;
  reason?: string;
}

/**
 * Service for handling all teleportation logic.
 * Manages spell casts, position updates, spatial index, and event emission.
 */
export class TeleportService {
  constructor(private readonly deps: TeleportServiceDependencies) {}

  /**
   * Teleports a player to a new location.
   * Handles spell casting animations, position updates, spatial index updates,
   * and emits events for VisibilitySystem to handle packets.
   * 
   * @param userId The player to teleport
   * @param x Target X coordinate
   * @param y Target Y coordinate
   * @param mapLevel Target map level
   * @param options Optional teleport configuration
   * @returns Result indicating success/failure
   */
  teleportPlayer(
    userId: number,
    x: number,
    y: number,
    mapLevel: MapLevel,
    options: TeleportOptions = {}
  ): TeleportResult {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return { success: false, reason: "Player not found" };
    }

    // Default options
    const {
      type = TeleportType.Teleport,
      spellId,
      broadcastSpellCast = !!spellId,
      validate = true
    } = options;

    // Validation (can be disabled for admin commands)
    if (validate) {
      const validation = this.validateTeleport(userId, x, y, mapLevel);
      if (!validation.success) {
        return validation;
      }
    }

    // Teleports are instantaneous relocation; stale movement plans must be dropped.
    this.deps.cancelMovementPlanForPlayer?.(userId);

    // Capture old position before updating
    const oldPosition: Position = {
      mapLevel: playerState.mapLevel,
      x: playerState.x,
      y: playerState.y
    };

    // Broadcast spell cast animation if teleporting via spell
    if (broadcastSpellCast && spellId !== undefined) {
      this.broadcastSpellCast(userId, spellId, oldPosition);
    }

    // Update player position
    playerState.x = x;
    playerState.y = y;
    playerState.mapLevel = mapLevel;

    // Update spatial index
    this.deps.spatialIndex.addOrUpdatePlayer(playerState);

    const newPosition: Position = { mapLevel, x, y };

    // Emit PlayerTeleported event - VisibilitySystem handles TeleportTo packet dispatch
    this.deps.eventBus.emit(createPlayerTeleportedEvent(
      userId,
      oldPosition,
      newPosition,
      type,
      spellId ?? 0
    ));

    return { success: true };
  }

  /**
   * Teleports a player using a spell.
   * Convenience method that sets appropriate options for spell-based teleports.
   * 
   * @param userId The player casting the spell
   * @param spellId The spell being cast
   * @param x Target X coordinate
   * @param y Target Y coordinate
   * @param mapLevel Target map level
   * @returns Result indicating success/failure
   */
  teleportPlayerWithSpell(
    userId: number,
    spellId: number,
    x: number,
    y: number,
    mapLevel: MapLevel
  ): TeleportResult {
    return this.teleportPlayer(userId, x, y, mapLevel, {
      type: TeleportType.Teleport,
      spellId,
      broadcastSpellCast: true,
      validate: true
    });
  }

  /**
   * Respawns a player at their spawn point (e.g., after death).
   * 
   * @param userId The player to respawn
   * @param x Spawn X coordinate
   * @param y Spawn Y coordinate
   * @param mapLevel Spawn map level
   * @returns Result indicating success/failure
   */
  respawnPlayer(
    userId: number,
    x: number,
    y: number,
    mapLevel: MapLevel
  ): TeleportResult {
    return this.teleportPlayer(userId, x, y, mapLevel, {
      type: TeleportType.Respawn,
      spellId: -1, // -1 indicates no spell animation for respawn
      broadcastSpellCast: false,
      validate: false // Don't validate respawn teleports
    });
  }

  /**
   * Changes a player's map level (e.g., climbing stairs, entering dungeon).
   * 
   * @param userId The player changing levels
   * @param x Target X coordinate
   * @param y Target Y coordinate
   * @param mapLevel Target map level
   * @returns Result indicating success/failure
   */
  changeMapLevel(
    userId: number,
    x: number,
    y: number,
    mapLevel: MapLevel
  ): TeleportResult {
    return this.teleportPlayer(userId, x, y, mapLevel, {
      type: TeleportType.ChangeMapLevel,
      validate: true
    });
  }

  /**
   * Validates a teleport request.
   * Can be extended with additional checks (e.g., wilderness restrictions, combat checks).
   * 
   * @private
   */
  private validateTeleport(
    userId: number,
    x: number,
    y: number,
    mapLevel: MapLevel
  ): TeleportResult {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return { success: false, reason: "Player not found" };
    }

    // TODO: Add validation logic:
    // - Check if player is in combat
    // - Check if destination is in wilderness
    // - Check if player has required level/quest
    // - Check if destination is valid/walkable

    // Basic coordinate validation
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return { success: false, reason: "Invalid coordinates" };
    }

    return { success: true };
  }

  /**
   * Broadcasts the spell cast animation to nearby players.
   * Sends CastedTeleportSpell packet to all players who can see the caster.
   * 
   * @private
   */
  private broadcastSpellCast(userId: number, spellId: number, position: Position): void {
    // Build the spell cast packet
    const payload = buildCastedTeleportSpellPayload({
      EntityID: userId,
      EntityType: EntityType.Player,
      SpellID: spellId
    });

    // Get nearby players who can see the spell cast
    const nearbyPlayers = this.deps.spatialIndex.getPlayersViewingPosition(
      position.mapLevel,
      position.x,
      position.y
    );

    // Broadcast to caster (so they see their own animation)
    this.deps.enqueueUserMessage(userId, GameAction.CastedTeleportSpell, payload);

    // Broadcast to nearby players
    for (const player of nearbyPlayers) {
      if (player.id !== userId) { // Don't send twice to caster
        this.deps.enqueueUserMessage(player.id, GameAction.CastedTeleportSpell, payload);
      }
    }
  }
}
