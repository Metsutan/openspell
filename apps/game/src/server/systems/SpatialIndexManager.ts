/**
 * SpatialIndexManager.ts - Unified spatial index management for all entity types.
 * 
 * This system maintains spatial indexes for:
 * - Players
 * - NPCs
 * - Ground Items
 * - World Entities (trees, rocks, doors, etc.)
 * 
 * It provides efficient spatial queries for:
 * - Visibility calculations (who can see what)
 * - Aggro detection (NPCs finding nearby players)
 * - Proximity queries (finding entities near a position)
 * 
 * The manager listens to game events and automatically updates the spatial indexes.
 */

import { SpatialIndex, type SpatialEntity } from "../../world/SpatialIndex";
import { EntityType } from "../../protocol/enums/EntityType";
import type { MapLevel } from "../../world/Location";
import type { PlayerState } from "../../world/PlayerState";
import type { States } from "../../protocol/enums/States";
import type { EntityRef, Position } from "../events/GameEvents";
import { NPCState } from "../state/EntityState";

// ============================================================================
// Spatial Entity Types
// ============================================================================

/**
 * Player entry in the spatial index.
 * Wraps PlayerState with SpatialEntity interface.
 */
export interface PlayerSpatialEntry extends SpatialEntity {
  id: number; // userId
  mapLevel: MapLevel;
  x: number;
  y: number;
  playerState: PlayerState;
}

/**
 * NPC entry in the spatial index.
 */
export interface NPCSpatialEntry extends SpatialEntity {
  id: number;
  definitionId: number;
  mapLevel: MapLevel;
  x: number;
  y: number;
  hitpointsLevel: number;
  currentState: States;
  aggroRadius: number;
}

/**
 * Ground item entry in the spatial index.
 */
export interface ItemSpatialEntry extends SpatialEntity {
  id: number;
  itemId: number;
  isIOU: boolean;
  amount: number;
  mapLevel: MapLevel;
  x: number;
  y: number;
  isPresent: boolean;
  /** UserId of player who can see this item (null = visible to all). */
  visibleToUserId: number | null;
}

/**
 * World entity entry in the spatial index.
 */
export interface WorldEntitySpatialEntry extends SpatialEntity {
  id: number;
  definitionId: number;
  type: string;
  mapLevel: MapLevel;
  x: number;
  y: number;
  resourcesRemaining: number | null;
}

// ============================================================================
// View Radius Constants
// ============================================================================

/** View radius for NPCs and other players (Chebyshev distance in tiles) */
export const ENTITY_VIEW_RADIUS = 32;

/** View radius for ground items (Chebyshev distance in tiles) */
export const ITEM_VIEW_RADIUS = 32;

/** Default cell size for spatial indexes */
const DEFAULT_CELL_SIZE = 16;

// ============================================================================
// SpatialIndexManager
// ============================================================================

/**
 * Manages all spatial indexes for the game world.
 * Provides unified API for spatial queries across all entity types.
 */
export class SpatialIndexManager {
  // Spatial indexes for each entity type
  private readonly playerIndex = new SpatialIndex<PlayerSpatialEntry>(DEFAULT_CELL_SIZE);
  private readonly npcIndex = new SpatialIndex<NPCSpatialEntry>(DEFAULT_CELL_SIZE);
  private readonly itemIndex = new SpatialIndex<ItemSpatialEntry>(DEFAULT_CELL_SIZE);
  private readonly worldEntityIndex = new SpatialIndex<WorldEntitySpatialEntry>(DEFAULT_CELL_SIZE);

  // Lookup maps for fast entity retrieval
  private readonly playerEntries = new Map<number, PlayerSpatialEntry>();
  private readonly npcEntries = new Map<number, NPCSpatialEntry>();
  private readonly itemEntries = new Map<number, ItemSpatialEntry>();
  private readonly worldEntityEntries = new Map<number, WorldEntitySpatialEntry>();

  // ============================================================================
  // Player Management
  // ============================================================================

  /**
   * Adds or updates a player in the spatial index.
   * Returns the previous position if updating, null if new.
   */
  addOrUpdatePlayer(playerState: PlayerState): Position | null {
    let entry = this.playerEntries.get(playerState.userId);
    let oldPosition: Position | null = null;

    if (entry) {
      // Capture old position before update
      oldPosition = {
        mapLevel: entry.mapLevel,
        x: entry.x,
        y: entry.y
      };

      // Update existing entry
      entry.mapLevel = playerState.mapLevel;
      entry.x = playerState.x;
      entry.y = playerState.y;
      entry.playerState = playerState;
      this.playerIndex.update(entry);
    } else {
      // Create new entry
      entry = {
        id: playerState.userId,
        mapLevel: playerState.mapLevel,
        x: playerState.x,
        y: playerState.y,
        playerState
      };
      this.playerEntries.set(playerState.userId, entry);
      this.playerIndex.insert(entry);
    }

    return oldPosition;
  }

  /**
   * Removes a player from the spatial index.
   * Returns the player's last position.
   */
  removePlayer(userId: number): Position | null {
    const entry = this.playerEntries.get(userId);
    if (!entry) return null;

    const lastPosition: Position = {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };

    this.playerIndex.remove(entry);
    this.playerEntries.delete(userId);

    return lastPosition;
  }

  /**
   * Gets a player entry by userId.
   */
  getPlayer(userId: number): PlayerSpatialEntry | null {
    return this.playerEntries.get(userId) ?? null;
  }

  /**
   * Gets the player's current position.
   */
  getPlayerPosition(userId: number): Position | null {
    const entry = this.playerEntries.get(userId);
    if (!entry) return null;
    return {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };
  }

  // ============================================================================
  // NPC Management
  // ============================================================================

  /**
   * Adds an NPC to the spatial index.
   */
  addNPC(entry: NPCSpatialEntry): void {
    if (this.npcEntries.has(entry.id)) {
      this.updateNPC(entry);
      return;
    }
    this.npcEntries.set(entry.id, entry);
    this.npcIndex.insert(entry);
  }

  /**
   * Updates an NPC's position in the spatial index.
   */
   updateNPCByState(npc: NPCState): Position | null {
    return this.updateNPC({
        id: npc.id,
        definitionId: npc.definitionId,
        mapLevel: npc.mapLevel,
        x: npc.x,
        y: npc.y,
        hitpointsLevel: npc.hitpointsLevel,
        currentState: npc.currentState,
        aggroRadius: npc.aggroRadius
      });
  }
  /**
   * Updates an NPC's position in the spatial index.
   * Returns the previous position if found.
   */
  updateNPC(entry: NPCSpatialEntry): Position | null {
    const existing = this.npcEntries.get(entry.id);
    let oldPosition: Position | null = null;

    if (existing) {
      oldPosition = {
        mapLevel: existing.mapLevel,
        x: existing.x,
        y: existing.y
      };

      // Update properties
      existing.mapLevel = entry.mapLevel;
      existing.x = entry.x;
      existing.y = entry.y;
      existing.hitpointsLevel = entry.hitpointsLevel;
      existing.currentState = entry.currentState;
      this.npcIndex.update(existing);
    } else {
      this.addNPC(entry);
    }

    return oldPosition;
  }

  /**
   * Removes an NPC from the spatial index.
   */
  removeNPC(npcId: number): Position | null {
    const entry = this.npcEntries.get(npcId);
    if (!entry) return null;

    const lastPosition: Position = {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };

    this.npcIndex.remove(entry);
    this.npcEntries.delete(npcId);

    return lastPosition;
  }

  /**
   * Gets an NPC entry by ID.
   */
  getNPC(npcId: number): NPCSpatialEntry | null {
    return this.npcEntries.get(npcId) ?? null;
  }

  /**
   * Gets the NPC's current position.
   */
  getNPCPosition(npcId: number): Position | null {
    const entry = this.npcEntries.get(npcId);
    if (!entry) return null;
    return {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };
  }

  // ============================================================================
  // Item Management
  // ============================================================================

  /**
   * Adds an item to the spatial index.
   */
  addItem(entry: ItemSpatialEntry): void {
    if (this.itemEntries.has(entry.id)) {
      this.updateItem(entry);
      return;
    }
    this.itemEntries.set(entry.id, entry);
    if (entry.isPresent) {
      this.itemIndex.insert(entry);
    }
  }

  /**
   * Updates an item in the spatial index.
   */
  updateItem(entry: ItemSpatialEntry): void {
    const existing = this.itemEntries.get(entry.id);
    if (existing) {
      const wasPresent = existing.isPresent;
      existing.itemId = entry.itemId;
      existing.isIOU = entry.isIOU;
      existing.isPresent = entry.isPresent;
      existing.amount = entry.amount;
      existing.mapLevel = entry.mapLevel;
      existing.x = entry.x;
      existing.y = entry.y;
      existing.visibleToUserId = entry.visibleToUserId;
      
      if (wasPresent !== entry.isPresent) {
        if (entry.isPresent) {
          this.itemIndex.insert(existing);
        } else {
          this.itemIndex.remove(existing);
        }
      } else if (entry.isPresent) {
        this.itemIndex.update(existing);
      }
    } else {
      this.addItem(entry);
    }
  }

  /**
   * Removes an item from the spatial index.
   */
  removeItem(itemId: number): Position | null {
    const entry = this.itemEntries.get(itemId);
    if (!entry) return null;

    const lastPosition: Position = {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };

    if (entry.isPresent) {
      this.itemIndex.remove(entry);
    }
    this.itemEntries.delete(itemId);

    return lastPosition;
  }

  /**
   * Gets an item entry by ID.
   */
  getItem(itemId: number): ItemSpatialEntry | null {
    return this.itemEntries.get(itemId) ?? null;
  }

  /**
   * Marks an item as picked up (not present).
   */
  markItemPickedUp(itemId: number): Position | null {
    const entry = this.itemEntries.get(itemId);
    if (!entry) return null;

    const position: Position = {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };

    if (entry.isPresent) {
      entry.isPresent = false;
      this.itemIndex.remove(entry);
    }

    return position;
  }

  /**
   * Marks an item as respawned (present).
   */
  markItemRespawned(itemId: number): Position | null {
    const entry = this.itemEntries.get(itemId);
    if (!entry) return null;

    const position: Position = {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };

    if (!entry.isPresent) {
      entry.isPresent = true;
      this.itemIndex.insert(entry);
    }

    return position;
  }

  // ============================================================================
  // World Entity Management
  // ============================================================================

  /**
   * Adds a world entity to the spatial index.
   */
  addWorldEntity(entry: WorldEntitySpatialEntry): void {
    if (this.worldEntityEntries.has(entry.id)) {
      return; // World entities don't move, no update needed
    }
    this.worldEntityEntries.set(entry.id, entry);
    this.worldEntityIndex.insert(entry);
  }

  /**
   * Removes a world entity from the spatial index.
   */
  removeWorldEntity(entityId: number): Position | null {
    const entry = this.worldEntityEntries.get(entityId);
    if (!entry) return null;

    const lastPosition: Position = {
      mapLevel: entry.mapLevel,
      x: entry.x,
      y: entry.y
    };

    this.worldEntityIndex.remove(entry);
    this.worldEntityEntries.delete(entityId);

    return lastPosition;
  }

  /**
   * Gets a world entity entry by ID.
   */
  getWorldEntity(entityId: number): WorldEntitySpatialEntry | null {
    return this.worldEntityEntries.get(entityId) ?? null;
  }

  // ============================================================================
  // Visibility Queries
  // ============================================================================

  /**
   * Finds all players who can see a given position.
   * Uses ENTITY_VIEW_RADIUS for player/NPC visibility.
   */
  getPlayersViewingPosition(
    mapLevel: MapLevel,
    x: number,
    y: number,
    excludeUserId?: number
  ): PlayerSpatialEntry[] {
    const nearby = this.playerIndex.queryRadius(
      mapLevel,
      x,
      y,
      ENTITY_VIEW_RADIUS
    );

    if (excludeUserId !== undefined) {
      return nearby.filter(p => p.id !== excludeUserId);
    }
    return nearby;
  }

  /**
   * Finds all players who can see an item position.
   * Uses ITEM_VIEW_RADIUS for item visibility.
   */
  getPlayersViewingItem(
    mapLevel: MapLevel,
    x: number,
    y: number,
    excludeUserId?: number
  ): PlayerSpatialEntry[] {
    const nearby = this.playerIndex.queryRadius(
      mapLevel,
      x,
      y,
      ITEM_VIEW_RADIUS
    );

    if (excludeUserId !== undefined) {
      return nearby.filter(p => p.id !== excludeUserId);
    }
    return nearby;
  }

  /**
   * Gathers all entities visible to a player.
   * Returns entity keys in the format "type:id".
   */
  gatherVisibleEntities(
    userId: number,
    mapLevel: MapLevel,
    x: number,
    y: number
  ): Set<string> {
    const result = new Set<string>();

    // Query nearby players
    const nearbyPlayers = this.playerIndex.queryRadius(
      mapLevel,
      x,
      y,
      ENTITY_VIEW_RADIUS
    );
    for (const player of nearbyPlayers) {
      if (player.id !== userId) {
        result.add(this.makeEntityKey(EntityType.Player, player.id));
      }
    }

    // Query nearby NPCs
    const nearbyNpcs = this.npcIndex.queryRadius(
      mapLevel,
      x,
      y,
      ENTITY_VIEW_RADIUS
    );
    for (const npc of nearbyNpcs) {
      result.add(this.makeEntityKey(EntityType.NPC, npc.id));
    }

    // Query nearby items (larger radius)
    const nearbyItems = this.itemIndex.queryRadius(
      mapLevel,
      x,
      y,
      ITEM_VIEW_RADIUS
    );
    for (const item of nearbyItems) {
      if (item.isPresent) {
        result.add(this.makeEntityKey(EntityType.Item, item.id));
      }
    }

    return result;
  }

  /**
   * Gathers all viewers for an entity at a specific position.
   * Excludes the entity itself if it's a player.
   */
  gatherViewersForEntity(
    entityRef: EntityRef,
    position: Position
  ): Set<number> {
    const radius = entityRef.type === EntityType.Item
      ? ITEM_VIEW_RADIUS
      : ENTITY_VIEW_RADIUS;

    const nearbyPlayers = this.playerIndex.queryRadius(
      position.mapLevel,
      position.x,
      position.y,
      radius
    );

    const viewers = new Set<number>();
    for (const player of nearbyPlayers) {
      // Exclude self if entity is a player
      if (entityRef.type === EntityType.Player && player.id === entityRef.id) {
        continue;
      }
      viewers.add(player.id);
    }

    return viewers;
  }

  // ============================================================================
  // Aggro Queries
  // ============================================================================

  /**
   * Finds players within aggro range of an NPC.
   */
  getPlayersInAggroRange(
    mapLevel: MapLevel,
    x: number,
    y: number,
    aggroRadius: number
  ): PlayerSpatialEntry[] {
    return this.playerIndex.queryRadius(mapLevel, x, y, aggroRadius);
  }

  /**
   * Gets the position of an entity by reference.
   */
  getEntityPosition(entityRef: EntityRef): Position | null {
    switch (entityRef.type) {
      case EntityType.Player:
        return this.getPlayerPosition(entityRef.id);
      case EntityType.NPC:
        return this.getNPCPosition(entityRef.id);
      case EntityType.Item: {
        const item = this.getItem(entityRef.id);
        if (!item) return null;
        return { mapLevel: item.mapLevel, x: item.x, y: item.y };
      }
      case EntityType.Environment: {
        const entity = this.getWorldEntity(entityRef.id);
        if (!entity) return null;
        return { mapLevel: entity.mapLevel, x: entity.x, y: entity.y };
      }
      default:
        return null;
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Creates an entity key string.
   */
  makeEntityKey(type: EntityType, id: number): string {
    return `${type}:${id}`;
  }

  /**
   * Parses an entity key string.
   */
  parseEntityKey(key: string): EntityRef | null {
    const [typeStr, idStr] = key.split(":");
    if (!typeStr || !idStr) return null;
    const type = Number(typeStr);
    const id = Number(idStr);
    if (!Number.isInteger(type) || !Number.isInteger(id)) return null;
    return { type: type as EntityType, id };
  }

  /**
   * Clears all spatial indexes.
   */
  clear(): void {
    this.playerIndex.clear();
    this.npcIndex.clear();
    this.itemIndex.clear();
    this.worldEntityIndex.clear();
    this.playerEntries.clear();
    this.npcEntries.clear();
    this.itemEntries.clear();
    this.worldEntityEntries.clear();
  }

  // ============================================================================
  // Stats
  // ============================================================================

  /**
   * Gets statistics about the spatial indexes.
   */
  getStats(): {
    players: number;
    npcs: number;
    items: number;
    worldEntities: number;
  } {
    return {
      players: this.playerEntries.size,
      npcs: this.npcEntries.size,
      items: this.itemEntries.size,
      worldEntities: this.worldEntityEntries.size
    };
  }
}
