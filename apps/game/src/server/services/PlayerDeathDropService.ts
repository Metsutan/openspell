/**
 * PlayerDeathDropService.ts - Handles item drops when players die
 * 
 * Architecture:
 * - Implements RuneScape-style death mechanics
 * - Players keep their 3 most valuable items
 * - All other items are dropped on the ground (visible to killer first)
 * - Value is determined by itemDef.cost
 * 
 * Death Flow:
 * 1. Collect all items from inventory and equipment
 * 2. Calculate value for each item (itemDef.cost * amount)
 * 3. Sort items by value descending
 * 4. Keep top 3 most valuable items
 * 5. Clear player's inventory and equipment completely
 * 6. Add kept items back to inventory
 * 7. Drop all other items at death position (visible to killer first)
 * 8. Recalculate player weight
 */

import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { ItemManager } from "../../world/systems/ItemManager";
import type { PlayerState, EquipmentSlot, InventoryItem } from "../../world/PlayerState";
import { EQUIPMENT_SLOTS } from "../../world/PlayerState";
import type { EquipmentStack } from "../../world/items/EquipmentStack";
import type { MapLevel } from "../../world/Location";
import type { InventoryService } from "./InventoryService";
import type { EquipmentService } from "./EquipmentService";
import type { ItemAuditService } from "./ItemAuditService";

/**
 * Represents an item stack with its source and value information.
 */
interface ItemWithValue {
  itemId: number;
  amount: number; // Total amount in the stack
  isIOU: number;
  unitValue: number; // itemDef.cost per individual item
  source: 'inventory' | 'equipment';
  inventorySlot?: number; // For inventory items
  equipmentSlot?: EquipmentSlot; // For equipment items
}

/**
 * Result of processing death items.
 */
interface DeathItemsResult {
  keptItems: ItemWithValue[];
  droppedItems: ItemWithValue[];
}

export interface PlayerDeathDropServiceConfig {
  itemCatalog: ItemCatalog;
  itemManager: ItemManager;
  inventoryService: InventoryService;
  equipmentService: EquipmentService;
  playerStatesByUserId: Map<number, PlayerState>;
  itemAudit?: ItemAuditService | null;
}

/**
 * Service for handling player death item drops.
 */
export class PlayerDeathDropService {
  /** Number of most valuable items to keep on death */
  private static readonly ITEMS_KEPT_ON_DEATH = 3;

  constructor(private readonly config: PlayerDeathDropServiceConfig) {}

  /**
   * Processes a player's death, determining which items to keep and which to drop.
   * 
   * @param userId - The player who died
   * @param deathX - X coordinate where player died
   * @param deathY - Y coordinate where player died
   * @param deathMapLevel - Map level where player died
   * @param killerUserId - User ID of the killer for loot visibility
   */
  public processPlayerDeath(
    userId: number,
    deathX: number,
    deathY: number,
    deathMapLevel: MapLevel,
    killerUserId: number | null
  ): void {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) {
      console.warn(`[PlayerDeathDropService] Player ${userId} not found`);
      return;
    }

    // Step 1: Collect all items from inventory and equipment
    const allItems = this.collectAllItems(player);

    if (allItems.length === 0) {
      // Player had no items, nothing to do
      console.log(`[PlayerDeathDropService] Player ${userId} died with no items`);
      return;
    }

    // Step 2: Sort by value and determine what to keep/drop
    const { keptItems, droppedItems } = this.sortAndSplitItems(allItems);

    console.log(
      `[PlayerDeathDropService] Player ${userId} died: keeping ${keptItems.length} items, dropping ${droppedItems.length} items`
    );

    // Step 3: Clear ALL items from player (both inventory and equipment)
    this.clearAllPlayerItems(player, userId);

    // Step 4: Add kept items back to inventory
    this.restoreKeptItems(player, userId, keptItems);

    // Step 5: Drop all other items at death position (visible to killer first)
    this.dropItemsOnGround(droppedItems, deathX, deathY, deathMapLevel, killerUserId, userId);

    // Step 6: Recalculate and send weight update
    this.recalculatePlayerWeight(player, userId);
  }

  /**
   * Collects all items from a player's inventory and equipment.
   * Each stack is kept as a single entry with its amount.
   */
  private collectAllItems(player: PlayerState): ItemWithValue[] {
    const items: ItemWithValue[] = [];

    // Collect inventory items
    for (let slotIndex = 0; slotIndex < player.inventory.length; slotIndex++) {
      const item = player.inventory[slotIndex];
      if (item) {
        const [itemId, amount, isIOU] = item;
        const itemDef = this.config.itemCatalog.getDefinitionById(itemId);
        const unitValue = itemDef?.cost ?? 0;

        items.push({
          itemId,
          amount,
          isIOU,
          unitValue,
          source: 'inventory',
          inventorySlot: slotIndex
        });
      }
    }

    // Collect equipment items
    for (const slot of EQUIPMENT_SLOTS) {
      const equipmentStack = player.equipment[slot];
      if (equipmentStack) {
        const [itemId, amount] = equipmentStack;
        const itemDef = this.config.itemCatalog.getDefinitionById(itemId);
        const unitValue = itemDef?.cost ?? 0;

        items.push({
          itemId,
          amount,
          isIOU: 0, // Equipment is never IOU
          unitValue,
          source: 'equipment',
          equipmentSlot: slot
        });
      }
    }

    return items;
  }

  /**
   * Sorts items by unit value and splits into kept/dropped lists.
   * Keeps up to 3 individual items (taking from stacks as needed), drops the rest.
   * 
   * RuneScape behavior: You can only keep individual items, not entire stacks.
   * If you have 5000 arrows and they're in your top 3, you only keep 1-3 arrows, not all 5000.
   */
  private sortAndSplitItems(items: ItemWithValue[]): DeathItemsResult {
    // Sort by unit value descending (most valuable first)
    const sortedItems = [...items].sort((a, b) => b.unitValue - a.unitValue);

    const keptItems: ItemWithValue[] = [];
    const droppedItems: ItemWithValue[] = [];
    let itemsKeptCount = 0;

    for (const itemStack of sortedItems) {
      const remainingSlots = PlayerDeathDropService.ITEMS_KEPT_ON_DEATH - itemsKeptCount;

      if (remainingSlots <= 0) {
        // No more slots to keep items, drop entire stack
        droppedItems.push({ ...itemStack });
      } else if (itemStack.amount <= remainingSlots) {
        // Keep entire stack (it fits in remaining slots)
        keptItems.push({ ...itemStack });
        itemsKeptCount += itemStack.amount;
      } else {
        // Stack is larger than remaining slots
        // Keep what we can, drop the rest
        keptItems.push({
          ...itemStack,
          amount: remainingSlots
        });
        droppedItems.push({
          ...itemStack,
          amount: itemStack.amount - remainingSlots
        });
        itemsKeptCount += remainingSlots;
      }
    }

    return { keptItems, droppedItems };
  }

  /**
   * Clears all items from a player's inventory and equipment.
   * Uses InventoryService and EquipmentService to handle packets properly.
   */
  private clearAllPlayerItems(player: PlayerState, userId: number): void {
    // Clear inventory - remove each item using InventoryService
    for (let slotIndex = 0; slotIndex < player.inventory.length; slotIndex++) {
      const item = player.inventory[slotIndex];
      if (item) {
        const [itemId, amount, isIOU] = item;
        this.config.inventoryService.removeItem(userId, itemId, amount, isIOU);
      }
    }

    // Clear equipment - unequip each slot using EquipmentService
    for (const slot of EQUIPMENT_SLOTS) {
      if (player.equipment[slot]) {
        const result = this.config.equipmentService.unequipItem(userId, slot);
        
        // If unequip returns items to inventory, remove them
        // (they'll be either kept or dropped, not left in inventory)
        if (result.success && result.itemId !== undefined) {
          this.config.inventoryService.removeItem(
            userId, 
            result.itemId, 
            result.amount ?? 1, 
            0 // Equipment is never IOU
          );
        }
      }
    }

    // Ensure inventory is completely empty (safety check)
    player.clearInventory();
    player.markInventoryDirty();
    player.markEquipmentDirty();
  }

  /**
   * Adds kept items back to the player's inventory.
   * Uses InventoryService to handle packets and weight calculation.
   */
  private restoreKeptItems(player: PlayerState, userId: number, keptItems: ItemWithValue[]): void {
    for (const item of keptItems) {
      const result = this.config.inventoryService.giveItem(
        userId,
        item.itemId,
        item.amount,
        item.isIOU
      );

      if (result.overflow > 0) {
        console.warn(
          `[PlayerDeathDropService] Could not restore ${result.overflow}x ${item.itemId} to player ${userId}`
        );
      }
    }
  }

  /**
   * Drops items on the ground at the death position.
   * Items are immediately visible to all players (no ownership restriction).
   */
  private dropItemsOnGround(
    items: ItemWithValue[],
    x: number,
    y: number,
    mapLevel: MapLevel,
    visibleToUserId: number | null,
    dropperUserId: number
  ): void {
    for (const item of items) {
      const itemDef = this.config.itemCatalog.getDefinitionById(item.itemId);
      const itemName = itemDef?.name ?? `Item ${item.itemId}`;

      // Spawn item with 5 minute despawn timer, visible to killer first
      const spawned = this.config.itemManager.spawnGroundItem(
        item.itemId,
        item.amount,
        item.isIOU === 1,
        mapLevel,
        x,
        y,
        500, // 5 minutes despawn time (500 ticks)
        visibleToUserId
      );
      if (spawned) {
        this.config.itemAudit?.logItemDrop({
          dropperUserId,
          itemId: item.itemId,
          amount: item.amount,
          isIOU: item.isIOU,
          mapLevel,
          x,
          y,
          groundItemId: spawned.id
        });
      }

      // console.log(
      //   `[PlayerDeathDropService] Dropped ${item.amount}x ${itemName} at (${x}, ${y}, L${mapLevel})`
      // );
    }
  }

  /**
   * Weight is now handled automatically by InventoryService/EquipmentService.
   * This method is kept for backward compatibility but does nothing.
   */
  private recalculatePlayerWeight(player: PlayerState, userId: number): void {
    // Weight updates are handled automatically by InventoryService and EquipmentService
    // No manual weight packet sending needed
  }

  /**
   * Gets the total value of items a player would keep on death (for UI/info purposes).
   */
  public getKeptItemsValue(userId: number): number {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) return 0;

    const allItems = this.collectAllItems(player);
    const { keptItems } = this.sortAndSplitItems(allItems);
    
    return keptItems.reduce((sum, item) => sum + (item.unitValue * item.amount), 0);
  }

  /**
   * Gets the total value of items a player would lose on death (for UI/info purposes).
   */
  public getLostItemsValue(userId: number): number {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) return 0;

    const allItems = this.collectAllItems(player);
    const { droppedItems } = this.sortAndSplitItems(allItems);
    
    return droppedItems.reduce((sum, item) => sum + (item.unitValue * item.amount), 0);
  }
}
