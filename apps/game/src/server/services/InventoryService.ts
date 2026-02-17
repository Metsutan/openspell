import { GameAction } from "../../protocol/enums/GameAction";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { buildAddedItemAtInventorySlotPayload } from "../../protocol/packets/actions/AddedItemAtInventorySlot";
import { buildRemovedItemFromInventoryAtSlotPayload } from "../../protocol/packets/actions/RemovedItemFromInventoryAtSlot";
import { buildPlayerWeightChangedPayload } from "../../protocol/packets/actions/PlayerWeightChanged";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { PlayerState } from "../../world/PlayerState";
import {
  InventoryManager,
  InventoryMenuType,
  isValidSlotIndex,
  type InventorySlotChange
} from "../../world/systems/InventoryManager";
import { applyWeightChange } from "../../world/systems/WeightCalculator";
import type { ItemManager } from "../../world/systems/ItemManager";
import type { ItemAuditService } from "./ItemAuditService";

export interface InventoryServiceDependencies {
  itemCatalog: ItemCatalog;
  itemManager: ItemManager | null;
  playerStatesByUserId: Map<number, PlayerState>;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  enqueueBroadcast: (action: GameAction, payload: unknown[]) => void;
  itemAudit?: ItemAuditService | null;
}

export interface GiveItemResult {
  added: number;
  overflow: number;
  itemName: string;
}

export interface RemoveItemResult {
  removed: number;
  shortfall: number;
}

export interface DecrementItemAtSlotResult {
  removed: number;
  remainingAmount: number;
}

/**
 * Service for managing player inventory operations.
 * Handles adding/removing items, sending client updates, and overflow handling.
 */
export class InventoryService {
  constructor(private readonly deps: InventoryServiceDependencies) {}

  /**
   * Gives items to a player's inventory.
   * Handles stackability, sends client updates, and manages overflow.
   * 
   * @param targetUserId The player to give items to
   * @param itemId The item definition ID
   * @param amount Number of items to give
   * @param isIOU Whether this is an IOU/noted item (0 or 1)
   * @returns Result containing added count, overflow, and item name
   */
  giveItem(
    targetUserId: number,
    itemId: number,
    amount: number,
    isIOU: number = 0
  ): GiveItemResult {
    const playerState = this.deps.playerStatesByUserId.get(targetUserId);
    const definition = this.deps.itemCatalog.getDefinitionById(itemId);
    const itemName = definition?.name ?? `Item #${itemId}`;

    if (!playerState) {
      return { added: 0, overflow: amount, itemName };
    }

    if (!definition) {
      return { added: 0, overflow: amount, itemName };
    }

    // Create inventory manager for this player with weight tracking
    const inventoryManager = new InventoryManager(
      playerState.inventory,
      this.deps.itemCatalog,
      (changes) => applyWeightChange(playerState, changes, this.deps.itemCatalog)
    );

    // Add items with proper stackability handling
    const result = inventoryManager.addItems(itemId, amount, isIOU);

    // Mark player state as dirty if items were added
    if (result.added > 0) {
      playerState.markInventoryDirty();
      
      // Send weight update packet
      this.sendWeightUpdate(targetUserId, playerState);
    }

    // Send client updates for modified slots
    this.sendInventorySlotUpdates(targetUserId, result.slotsModified);

    // Handle overflow
    if (result.overflow > 0) {
      this.handleInventoryOverflow(targetUserId, itemId, result.overflow, isIOU, itemName);
    }

    return { added: result.added, overflow: result.overflow, itemName };
  }

  /**
   * Removes items from a player's inventory.
   * Sends appropriate client updates.
   * 
   * @param targetUserId The player to remove items from
   * @param itemId The item definition ID
   * @param amount Number of items to remove
   * @param isIOU Optional isIOU filter (if undefined, removes any matching itemId)
   * @returns Result containing removed count and shortfall
   */
  removeItem(
    targetUserId: number,
    itemId: number,
    amount: number,
    isIOU?: number
  ): RemoveItemResult {
    const playerState = this.deps.playerStatesByUserId.get(targetUserId);
    
    if (!playerState) {
      return { removed: 0, shortfall: amount };
    }

    const inventoryManager = new InventoryManager(
      playerState.inventory,
      this.deps.itemCatalog,
      (changes) => applyWeightChange(playerState, changes, this.deps.itemCatalog)
    );

    const result = inventoryManager.removeItems(itemId, amount, isIOU);

    // Mark dirty if items were removed
    if (result.removed > 0) {
      playerState.markInventoryDirty();
      
      // Send weight update packet
      this.sendWeightUpdate(targetUserId, playerState);
    }

    // Send client updates
    this.sendInventorySlotUpdates(targetUserId, result.slotsModified);

    return { removed: result.removed, shortfall: result.shortfall };
  }

  /**
   * Decrements the amount of an item at a specific slot.
   * Removes the slot entirely if the remaining amount reaches 0.
   */
  decrementItemAtSlot(
    targetUserId: number,
    slot: number,
    itemId: number,
    amount: number = 1,
    isIOU: number = 0
  ): DecrementItemAtSlotResult | null {
    const playerState = this.deps.playerStatesByUserId.get(targetUserId);
    if (!playerState) {
      return null;
    }

    if (!isValidSlotIndex(slot) || !Number.isInteger(amount) || amount <= 0) {
      return null;
    }

    const current = playerState.inventory[slot];
    if (!current || current[0] !== itemId || current[2] !== isIOU) {
      return null;
    }

    const previousItem = [...current] as typeof current;
    const removedAmount = Math.min(amount, current[1]);
    const remainingAmount = current[1] - removedAmount;

    const newItem = remainingAmount > 0 ? ([itemId, remainingAmount, isIOU] as typeof current) : null;
    playerState.inventory[slot] = newItem;

    applyWeightChange(
      playerState,
      [{
        slot,
        previousItem,
        newItem,
        amountChanged: -removedAmount
      }],
      this.deps.itemCatalog
    );

    playerState.markInventoryDirty();

    const payload = buildRemovedItemFromInventoryAtSlotPayload({
      MenuType: InventoryMenuType.PlayerInventory,
      Slot: slot,
      ItemID: itemId,
      Amount: removedAmount,
      IsIOU: isIOU === 1,
      RemainingAmountAtSlot: remainingAmount
    });
    this.deps.enqueueUserMessage(targetUserId, GameAction.RemovedItemFromInventoryAtSlot, payload);

    this.sendWeightUpdate(targetUserId, playerState);

    return { removed: removedAmount, remainingAmount };
  }

  /**
   * Sends inventory slot update packets to the client.
   * Called automatically by giveItem/removeItem.
   * 
   * @private
   */
  private sendInventorySlotUpdates(userId: number, slotsModified: InventorySlotChange[]) {
    if (slotsModified.length === 0) {
      return;
    }

    for (const change of slotsModified) {
      if (change.amountChanged > 0) {
        // Item added
        const newItem = change.newItem!;
        const previousAmount = change.previousItem?.[1] ?? 0;
        
        const payload = buildAddedItemAtInventorySlotPayload({
          MenuType: InventoryMenuType.PlayerInventory,
          Slot: change.slot,
          ItemID: newItem[0],
          Amount: change.amountChanged,
          IsIOU: newItem[2] === 1,
          PreviousAmountAtSlot: previousAmount
        });
        this.deps.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot, payload);
      } else if (change.amountChanged < 0) {
        // Item removed
        const previousItem = change.previousItem!;
        const remainingAmount = change.newItem?.[1] ?? 0;
        
        const payload = buildRemovedItemFromInventoryAtSlotPayload({
          MenuType: InventoryMenuType.PlayerInventory,
          Slot: change.slot,
          ItemID: previousItem[0],
          Amount: Math.abs(change.amountChanged),
          IsIOU: previousItem[2] === 1,
          RemainingAmountAtSlot: remainingAmount
        });
        this.deps.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot, payload);
      }
    }
  }

  /**
   * Handles items that couldn't fit in the player's inventory.
   * Spawns items on the ground at the player's location.
   * Non-stackable items spawn as individual ground items.
   * 
   * @private
   */
  private handleInventoryOverflow(
    userId: number,
    itemId: number,
    amount: number,
    isIOU: number,
    itemName: string
  ) {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.error(`[InventoryService] Cannot spawn overflow item: player ${userId} not found`);
      return;
    }
    
    if (!this.deps.itemManager) {
      console.error("[InventoryService] ItemManager not available - cannot spawn overflow item");
      return;
    }

    const itemDef = this.deps.itemCatalog.getDefinitionById(itemId);
    const isItemIOU = isIOU === 1;
    
    // If item is stackable OR it's an IOU, spawn once with full amount
    if (itemDef?.isStackable || isItemIOU) {
      const spawned = this.deps.itemManager.spawnGroundItem(
        itemId,
        amount,
        isItemIOU,
        playerState.mapLevel,
        playerState.x,
        playerState.y,
        undefined, // Use default despawn time
        userId // Visible to this player initially
      );
      if (spawned) {
        this.deps.itemAudit?.logItemDrop({
          dropperUserId: userId,
          itemId,
          amount,
          isIOU,
          mapLevel: playerState.mapLevel,
          x: playerState.x,
          y: playerState.y,
          groundItemId: spawned.id
        });
      }
    } else {
      // Non-stackable items spawn individually
      for (let i = 0; i < amount; i++) {
        const spawned = this.deps.itemManager.spawnGroundItem(
          itemId,
          1, // Spawn 1 item at a time
          isItemIOU,
          playerState.mapLevel,
          playerState.x,
          playerState.y,
          undefined, // Use default despawn time
          userId // Visible to this player initially
        );
        if (spawned) {
          this.deps.itemAudit?.logItemDrop({
            dropperUserId: userId,
            itemId,
            amount: 1,
            isIOU,
            mapLevel: playerState.mapLevel,
            x: playerState.x,
            y: playerState.y,
            groundItemId: spawned.id
          });
        }
      }
    }
  }

  /**
   * Calculates how many of a specific item can be added to a player's inventory.
   * Accounts for stackability, existing stacks, and empty slots.
   * 
   * @param targetUserId The player whose inventory to check
   * @param itemId The item definition ID
   * @param isIOU Whether this is an IOU/bank note (0 or 1)
   * @returns Maximum amount that can be added, or 0 if player/item not found
   */
  calculateAvailableCapacity(targetUserId: number, itemId: number, isIOU: number = 0): number {
    const playerState = this.deps.playerStatesByUserId.get(targetUserId);
    
    if (!playerState) {
      return 0;
    }

    const inventoryManager = new InventoryManager(
      playerState.inventory,
      this.deps.itemCatalog,
      (changes) => applyWeightChange(playerState, changes, this.deps.itemCatalog)
    );

    return inventoryManager.calculateAddCapacity(itemId, isIOU);
  }

  /**
   * Sends the PlayerWeightChanged packet to a player.
   * Call this after any operation that changes inventory or equipment weight.
   * 
   * @param userId The player to send the weight update to
   * @param playerState The player's state containing weight information
   */
  sendWeightUpdate(userId: number, playerState: PlayerState): void {
    // Clamp to two decimal places, keep as a number
    const formatWeight = (wt: number): number => {
      // Truncate to whole number (remove decimals)
      return Math.floor(wt);
    };

    const payload = buildPlayerWeightChangedPayload({
      EquippedItemsWeight: formatWeight(playerState.equippedWeight),
      InventoryItemsWeight: formatWeight(playerState.inventoryWeight)
    });
    
    this.deps.enqueueUserMessage(userId, GameAction.PlayerWeightChanged, payload);
  }
}
