import type { InvokeInventoryItemActionPayload } from "../../protocol/packets/actions/InvokeInventoryItemAction";
import { buildRemovedItemFromInventoryAtSlotPayload } from "../../protocol/packets/actions/RemovedItemFromInventoryAtSlot";
import { GameAction } from "../../protocol/enums/GameAction";
import type { InventoryItem, PlayerState } from "../PlayerState";
import { buildPlayerWeightChangedPayload } from "../../protocol/packets/actions/PlayerWeightChanged";
import { ItemCatalog } from "../items/ItemCatalog";

/**
 * Context needed for inventory system operations.
 * Provides access to the message queue system.
 */
export interface InventorySystemContext {
  /** Enqueue a message to a specific user */
  itemCatalog: ItemCatalog;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
}

export class InventorySystem {
  /**
   * Removes an item from a player's inventory at the specified slot.
   * Emits RemovedItemFromInventoryAtSlot packet to the player.
   * 
   * @param socket - Player's socket connection
   * @param playerState - Player's state containing inventory
   * @param payload - The action payload containing slot and item info
   * @returns The removed item, or null if the slot was empty or item doesn't match
   */
  removeItemFromInventoryAtSlot(
    ctx: InventorySystemContext,
    playerState: PlayerState,
    payload: InvokeInventoryItemActionPayload
  ): InventoryItem | null {
    const slot = payload.Slot as number;
    const expectedItemId = payload.ItemID as number;
    const expectedAmount = payload.Amount as number;
    const expectedIsIOU = payload.IsIOU ? 1 : 0;

    // Validate slot bounds
    if (slot < 0 || slot >= playerState.inventory.length) {
      console.warn(`[InventorySystem] Invalid slot ${slot} for user ${playerState.userId}`);
      return null;
    }

    const item = playerState.inventory[slot];
    
    // Verify slot has an item and it matches what client sent
    if (!item || item[0] !== expectedItemId) {
      console.warn(`[InventorySystem] Item mismatch at slot ${slot} for user ${playerState.userId}`);
      return null;
    }

    // Clone the item before modifying
    const removedItem: InventoryItem = [...item];

    if(!ctx.itemCatalog) {
      console.warn(`[InventorySystem] Item catalog not found`);
      return null;
    }
    const itemDefinition = ctx.itemCatalog.getDefinitionById(expectedItemId);
    if (!itemDefinition) {
      console.warn(`[InventorySystem] Item definition not found for item ${expectedItemId}`);
      return null;
    }
    const itemWeight = itemDefinition.weight;
    // Determine how much to remove (for stackable items, might be partial)
    const amountToRemove = Math.min(expectedAmount, item[1]);
    const remainingAmount = item[1] - amountToRemove;

    // Update inventory
    if (remainingAmount <= 0) {
      // Empty the slot
      playerState.inventory[slot] = null;
    } else {
      // Reduce the stack
      item[1] = remainingAmount;
    }

    // Emit RemovedItemFromInventoryAtSlot packet
    const removePayload = buildRemovedItemFromInventoryAtSlotPayload({
      MenuType: payload.MenuType,
      Slot: slot,
      ItemID: expectedItemId,
      Amount: amountToRemove,
      IsIOU: expectedIsIOU === 1,
      RemainingAmountAtSlot: remainingAmount
    });

    ctx.enqueueUserMessage(playerState.userId!, GameAction.RemovedItemFromInventoryAtSlot, removePayload);


    const removedWeight = itemWeight * amountToRemove;
    playerState.inventoryWeight -= removedWeight;
    // Return what was removed (with the original amount)
    return [expectedItemId, amountToRemove, expectedIsIOU];
  }
}

