import type { MapLevel } from "../Location";
import type { ItemCatalog } from "../items/ItemCatalog";
import type { SpatialIndexManager, ItemSpatialEntry } from "../../server/systems/SpatialIndexManager";
import type { EventBus } from "../../server/events/EventBus";
import type { GroundItemState } from "../../server/state/EntityState";
import { createItemSpawnedEvent, createItemDespawnedEvent, createItemBecameVisibleToAllEvent } from "../../server/events/GameEvents";

/**
 * Manages ground items in the game world.
 * Handles spawning, despawning, respawning, and spatial indexing of ground items.
 * 
 * Items with ID >= 100000 are dynamic (dropped by players) and are permanently removed when picked up.
 * Items with ID < 100000 are world spawns and will respawn after being picked up.
 */
export class ItemManager {
  /** Standard despawn time for monster drops (5 minutes = 500 ticks at 600ms per tick) */
  public static readonly MONSTER_DROP_DESPAWN_TICKS = 500;
  /** Time until item becomes visible to all players (3 minutes = 300 ticks at 600ms per tick) */
  public static readonly VISIBLE_TO_ALL_DELAY_TICKS = 300;
  /** Extend private visibility by 10s when merging into an existing private stack. */
  public static readonly PRIVATE_STACK_VISIBILITY_EXTENSION_TICKS = Math.max(
    1,
    Math.ceil(10000 / Number(process.env.TICK_MS ?? 600))
  );
  
  private nextGroundItemId: number = 100000; // Start from a high number to avoid conflicts with static spawns
  private currentTick: number = 0;

  constructor(
    private readonly itemCatalog: ItemCatalog,
    private readonly spatialIndexManager: SpatialIndexManager,
    private readonly eventBus: EventBus,
    private readonly groundItemStates: Map<number, GroundItemState>
  ) {
  }

  /**
   * Updates the current tick. Should be called from GameServer each tick.
   * @param tick - Current server tick
   */
  setCurrentTick(tick: number): void {
    this.currentTick = tick;
  }

  /**
   * Spawns a dynamic ground item at the specified location (e.g., dropped by player).
   * Dynamic items are permanently removed when picked up (no respawn).
   * All items default to despawning after 5 minutes (MONSTER_DROP_DESPAWN_TICKS).
   * Items can be initially visible only to a specific player, becoming visible to all after 3 minutes.
   * 
   * @param itemId - The item definition ID
   * @param amount - The quantity of items
   * @param isIOU - Whether this is an IOU (bank note) representation
   * @param mapLevel - The map level to spawn at
   * @param x - World X coordinate
   * @param y - World Y coordinate
   * @param despawnTicks - Number of ticks until item despawns (default = 500 ticks / 5 minutes, 0 = never)
   * @param visibleToUserId - Optional: UserId of player who can initially see this item (null = visible to all immediately)
   * @returns The created ground item state, or null if spawn failed
   * 
   * @example
   * // Spawn a monster drop visible only to player 123, becomes visible to all after 3 minutes
   * itemManager.spawnGroundItem(itemId, amount, false, mapLevel, x, y, ItemManager.MONSTER_DROP_DESPAWN_TICKS, 123);
   * 
   * @example
   * // Spawn a permanent item visible to all immediately
   * itemManager.spawnGroundItem(itemId, amount, false, mapLevel, x, y, 0, null);
   */
  spawnGroundItem(
    itemId: number,
    amount: number,
    isIOU: boolean,
    mapLevel: MapLevel,
    x: number,
    y: number,
    despawnTicks: number = ItemManager.MONSTER_DROP_DESPAWN_TICKS,
    visibleToUserId: number | null = null
  ): GroundItemState | null {
    // Validate item exists
    const itemDef = this.itemCatalog.getDefinitionById(itemId);
    if (!itemDef) {
      console.warn(`[ItemManager] Cannot spawn item ${itemId}: definition not found`);
      return null;
    }

    // Stackable items (or IOUs) merge into an existing dynamic pile on the same tile.
    const canMergeWithExistingPile = isIOU || itemDef.isStackable;
    if (canMergeWithExistingPile) {
      const existingPile = this.findMergeTargetGroundItem(
        itemId,
        isIOU,
        mapLevel,
        x,
        y,
        visibleToUserId
      );
      if (existingPile) {
        existingPile.amount += amount;

        // Keep merged piles alive based on the latest drop timing.
        if (existingPile.despawnTicks > 0) {
          existingPile.despawnAtTick = this.currentTick + existingPile.despawnTicks;
        } else if (despawnTicks > 0) {
          existingPile.despawnTicks = despawnTicks;
          existingPile.despawnAtTick = this.currentTick + despawnTicks;
        }

        if (existingPile.visibleToUserId !== null && existingPile.visibleToAllAtTick !== null) {
          existingPile.visibleToAllAtTick += ItemManager.PRIVATE_STACK_VISIBILITY_EXTENSION_TICKS;
        }

        this.spatialIndexManager.updateItem(this.stateToSpatialEntry(existingPile));
        return existingPile;
      }
    }

    // Create unique ID for this ground item (dynamic items use high IDs)
    const groundItemId = this.nextGroundItemId++;

    // Calculate despawn tick if despawn timer is set
    const despawnAtTick = (despawnTicks > 0) 
      ? this.currentTick + despawnTicks 
      : null;

    // Calculate visibility.
    // Private drops normally become visible to all after 3 minutes, but non-tradeables
    // stay private forever to prevent ownership transfer via floor drops.
    const isTradeable = itemDef.isTradeable;
    const visibleToAllAtTick = (visibleToUserId !== null && isTradeable)
      ? this.currentTick + ItemManager.VISIBLE_TO_ALL_DELAY_TICKS
      : null;

    // Create ground item state
    const state: GroundItemState = {
      id: groundItemId,
      itemId,
      isIOU,
      amount,
      respawnTicks: 0, // Dynamic items don't respawn
      mapLevel,
      x,
      y,
      isPresent: true,
      respawnAtTick: null,
      despawnTicks,
      despawnAtTick,
      visibleToUserId,
      visibleToAllAtTick
    };

    // Store in state map
    this.groundItemStates.set(groundItemId, state);

    // Add to spatial index
    const spatialEntry: ItemSpatialEntry = this.stateToSpatialEntry(state);
    this.spatialIndexManager.addItem(spatialEntry);

    // Emit ItemSpawned event - VisibilitySystem will handle notifying nearby players
    this.eventBus.emit(createItemSpawnedEvent(
      groundItemId,
      { mapLevel, x, y },
      { itemId, amount, isIOU }
    ));

    return state;
  }

  private findMergeTargetGroundItem(
    itemId: number,
    isIOU: boolean,
    mapLevel: MapLevel,
    x: number,
    y: number,
    visibleToUserId: number | null
  ): GroundItemState | null {
    for (const state of this.groundItemStates.values()) {
      if (
        state.isPresent &&
        state.respawnTicks === 0 &&
        state.mapLevel === mapLevel &&
        state.x === x &&
        state.y === y &&
        state.itemId === itemId &&
        state.isIOU === isIOU &&
        state.visibleToUserId === visibleToUserId
      ) {
        return state;
      }
    }
    return null;
  }

  /**
   * Removes or marks a ground item as picked up.
   * 
   * - Dynamic items (ID >= 100000): Permanently removed
   * - World spawn items (ID < 100000): Marked as picked up and will respawn
   * 
   * @param groundItemId - The ground item ID to remove
   * @param reason - The reason for removal (picked_up, despawned, or removed)
   * @param currentTick - Current server tick (for respawn calculation)
   * @returns true if successful
   */
  removeGroundItem(
    groundItemId: number, 
    reason: "picked_up" | "despawned" | "removed" = "removed",
    currentTick?: number
  ): boolean {
    const state = this.groundItemStates.get(groundItemId);
    if (!state) {
      return false;
    }

    const isDynamicItem = groundItemId >= 100000;

    if (reason === "picked_up" && !isDynamicItem && state.respawnTicks > 0) {
      // World spawn item - mark as picked up and schedule respawn
      state.isPresent = false;
      state.respawnAtTick = currentTick !== undefined ? currentTick + state.respawnTicks : null;

      // Emit ItemDespawned event
      this.eventBus.emit(createItemDespawnedEvent(
        groundItemId,
        { mapLevel: state.mapLevel, x: state.x, y: state.y },
        reason
      ));

      // Remove from spatial index (will be re-added when it respawns)
      this.spatialIndexManager.removeItem(groundItemId);
    } else {
      // Dynamic item or permanent removal - delete completely
      this.eventBus.emit(createItemDespawnedEvent(
        groundItemId,
        { mapLevel: state.mapLevel, x: state.x, y: state.y },
        reason
      ));

      // Remove from spatial index
      this.spatialIndexManager.removeItem(groundItemId);

      // Remove from state map
      this.groundItemStates.delete(groundItemId);

    }

    return true;
  }

  /**
   * Gets a ground item by its ID (only if present/visible).
   */
  getGroundItem(groundItemId: number): ItemSpatialEntry | undefined {
    const state = this.groundItemStates.get(groundItemId);
    if (!state || !state.isPresent) {
      return undefined;
    }
    return this.stateToSpatialEntry(state);
  }

  /**
   * Gets all ground items at a specific location (only present/visible ones).
   */
  getGroundItemsAt(mapLevel: MapLevel, x: number, y: number): ItemSpatialEntry[] {
    const items: ItemSpatialEntry[] = [];
    for (const state of this.groundItemStates.values()) {
      if (state.mapLevel === mapLevel && state.x === x && state.y === y && state.isPresent) {
        items.push(this.stateToSpatialEntry(state));
      }
    }
    return items;
  }

  /**
   * Gets the total count of ground items (including items waiting to respawn).
   */
  getGroundItemCount(): number {
    return this.groundItemStates.size;
  }

  /**
   * Updates respawning and despawning items. Call this each server tick.
   * Re-spawns items whose respawn timer has elapsed.
   * Despawns items whose despawn timer has elapsed.
   * Makes items visible to all players when their visibility timer expires.
   * 
   * @param currentTick - Current server tick
   */
  updateRespawns(currentTick: number): void {
    // Collect items to despawn (to avoid modifying map while iterating)
    const itemsToDespawn: number[] = [];

    for (const state of this.groundItemStates.values()) {
      // Check for respawn
      if (!state.isPresent && state.respawnAtTick !== null && currentTick >= state.respawnAtTick) {
        // Item is ready to respawn
        state.isPresent = true;
        state.respawnAtTick = null;

        // Add back to spatial index
        const spatialEntry = this.stateToSpatialEntry(state);
        this.spatialIndexManager.addItem(spatialEntry);

        // Emit ItemSpawned event
        this.eventBus.emit(createItemSpawnedEvent(
          state.id,
          { mapLevel: state.mapLevel, x: state.x, y: state.y },
          { itemId: state.itemId, amount: state.amount, isIOU: state.isIOU }
        ));

      }

      // Check if item should become visible to all players
      if (state.isPresent && state.visibleToAllAtTick !== null && currentTick >= state.visibleToAllAtTick) {
        // Mark as visible to all
        state.visibleToUserId = null;
        state.visibleToAllAtTick = null;
        this.spatialIndexManager.updateItem(this.stateToSpatialEntry(state));

        // Emit event so VisibilitySystem can notify other players
        this.eventBus.emit(createItemBecameVisibleToAllEvent(
          state.id,
          { mapLevel: state.mapLevel, x: state.x, y: state.y },
          { itemId: state.itemId, amount: state.amount, isIOU: state.isIOU }
        ));
      }

      // Check for despawn
      if (state.isPresent && state.despawnAtTick !== null && currentTick >= state.despawnAtTick) {
        itemsToDespawn.push(state.id);
      }
    }

    // Remove despawned items
    for (const itemId of itemsToDespawn) {
      this.removeGroundItem(itemId, "despawned");
    }
  }

  /**
   * Converts GroundItemState to ItemSpatialEntry for spatial indexing.
   */
  private stateToSpatialEntry(state: GroundItemState): ItemSpatialEntry {
    return {
      id: state.id,
      itemId: state.itemId,
      isIOU: state.isIOU,
      amount: state.amount,
      mapLevel: state.mapLevel,
      x: state.x,
      y: state.y,
      isPresent: state.isPresent,
      visibleToUserId: state.visibleToUserId
    };
  }
}
