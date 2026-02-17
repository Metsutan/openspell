/**
 * ShopSystem.ts - Manages shop state and restocking.
 * 
 * Features:
 * - 50-slot inventory per shop
 * - Automatic restocking for permanent items
 * - Temporary items (player-sold) that decay over time
 * - Supports shops that buy any item (General Store) vs specialized shops
 * 
 * Item Types:
 * - Permanent: Original shop items, restock when purchased
 * - Temporary: Player-sold items, decay 1 per TEMPORARY_ITEM_DECAY_TICKS until gone
 */

import type { ShopCatalog, ShopItemDefinition } from "../../world/shops/ShopCatalog";
import type { PlayerState } from "../../world/PlayerState";
import { States } from "../../protocol/enums/States";
import type { MessageService } from "../services/MessageService";
import type { InventoryService } from "../services/InventoryService";
import { GameAction } from "../../protocol/enums/GameAction";
import { buildUpdatedShopStockPayload } from "../../protocol/packets/actions/UpdatedShopStock";
import { ItemCatalog } from "../../world/items/ItemCatalog";
import type { ItemAuditService } from "../services/ItemAuditService";
import type { PacketAuditService } from "../services/PacketAuditService";

/**
 * Maximum number of slots in a shop inventory.
 */
export const SHOP_SLOT_COUNT = 50;

/**
 * Ticks between temporary item decay (player-sold items).
 * Temporary items lose 1 stock every this many ticks until depleted.
 */
export const TEMPORARY_ITEM_DECAY_TICKS = 100;

/**
 * Item ID for coins/gold.
 */
const COIN_ITEM_ID = 6;

/**
 * Runtime state for a single shop slot.
 */
export interface ShopSlotState {
  /** Item definition ID */
  itemId: number;
  /** Current stock amount */
  currentAmount: number;
  /** Maximum stock amount (from definition) */
  maxAmount: number;
  /** Cost in gold */
  cost: number;
  /** Ticks between restocks */
  restockSpeed: number;
  /** Ticks remaining until next restock */
  ticksUntilRestock: number;
  /** Whether this is a temporary item (player-sold, not in original shop definition) */
  isTemporary: boolean;
  /** For temporary items: ticks until one item decays */
  ticksUntilDecay: number;
}

/**
 * Runtime state for a shop.
 */
export interface ShopState {
  shopId: number;
  name: string;
  canBuyTemporaryItems: boolean;
  /** Fixed-size array of 50 slots (null for empty slots) */
  slots: (ShopSlotState | null)[];
}

export interface ShopSystemDependencies {
  shopCatalog: ShopCatalog;
  playerStatesByUserId: Map<number, PlayerState>;
  messageService: MessageService;
  inventoryService: InventoryService;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  itemCatalog: ItemCatalog;
  itemAudit?: ItemAuditService | null;
  packetAudit?: PacketAuditService | null;
}

/**
 * System for managing shop state and restocking.
 * Runs every tick to update restock timers and replenish stock.
 */
export class ShopSystem {
  /** Maps shopId to shop state */
  private readonly shopStates = new Map<number, ShopState>();
  private readonly temporaryLotsBySlot = new Map<string, Array<{ sellerUserId: number; amount: number }>>();

  constructor(private readonly deps: ShopSystemDependencies) {
    this.initializeShopStates();
  }

  /**
   * Initializes shop states from catalog definitions.
   */
  private initializeShopStates(): void {
    const shops = this.deps.shopCatalog.getAllShops();

    for (const shopDef of shops) {
      const slots: (ShopSlotState | null)[] = new Array(SHOP_SLOT_COUNT).fill(null);

      // Populate slots from definition
      for (let i = 0; i < shopDef.items.length && i < SHOP_SLOT_COUNT; i++) {
        const itemDef = shopDef.items[i];
        slots[i] = {
          itemId: itemDef.id,
          currentAmount: itemDef.amount,
          maxAmount: itemDef.amount,
          cost: itemDef.cost,
          restockSpeed: itemDef.restockSpeed,
          ticksUntilRestock: 0, // Start fully stocked
          isTemporary: false, // Original shop items are permanent
          ticksUntilDecay: 0 // Not applicable for permanent items
        };
      }

      const state: ShopState = {
        shopId: shopDef._id,
        name: shopDef.name,
        canBuyTemporaryItems: shopDef.canBuyTemporaryItems,
        slots
      };

      this.shopStates.set(shopDef._id, state);
    }

    console.log(`[ShopSystem] Initialized ${this.shopStates.size} shop states.`);
  }

  /**
   * Updates shop restock timers, replenishes stock, and decays temporary items.
   * Called every server tick.
   */
  update(): void {
    for (const shopState of this.shopStates.values()) {
      const changedSlots: Array<{ slotIndex: number; itemId: number; amount: number }> = [];

      for (let i = 0; i < shopState.slots.length; i++) {
        const slot = shopState.slots[i];
        if (!slot) continue;

        // Handle temporary item decay
        if (slot.isTemporary && slot.currentAmount > 0) {
          slot.ticksUntilDecay--;

          if (slot.ticksUntilDecay <= 0) {
            slot.currentAmount--;
            this.consumeTemporaryLots(shopState.shopId, i, 1, null, slot.itemId, slot.cost);
            changedSlots.push({ slotIndex: i, itemId: slot.itemId, amount: slot.currentAmount });

            if (slot.currentAmount > 0) {
              // Still has stock, reset decay timer
              slot.ticksUntilDecay = TEMPORARY_ITEM_DECAY_TICKS;
            } else {
              // No more stock, remove temporary slot
              shopState.slots[i] = null;
              this.temporaryLotsBySlot.delete(this.getLotKey(shopState.shopId, i));
            }
          }
        }
        // Handle permanent item restocking
        else if (!slot.isTemporary && slot.currentAmount < slot.maxAmount) {
          slot.ticksUntilRestock--;

          // Time to restock
          if (slot.ticksUntilRestock <= 0) {
            slot.currentAmount++;
            changedSlots.push({ slotIndex: i, itemId: slot.itemId, amount: slot.currentAmount });

            // Reset timer if still not at max
            if (slot.currentAmount < slot.maxAmount) {
              slot.ticksUntilRestock = slot.restockSpeed;
            } else {
              slot.ticksUntilRestock = 0;
            }
          }
        }
      }

      // Broadcast stock updates to players currently shopping at this shop
      if (changedSlots.length > 0) {
        this.broadcastStockUpdate(shopState.shopId, changedSlots);
      }
    }
  }

  /**
   * Gets the current stock for a shop as a 50-element array.
   * Format: [itemId, currentAmount] for stocked items, null for empty slots.
   */
  getCurrentStock(shopId: number): ([number, number] | null)[] {
    const shopState = this.shopStates.get(shopId);
    if (!shopState) {
      console.warn(`[ShopSystem] Shop ${shopId} not found`);
      return new Array(SHOP_SLOT_COUNT).fill(null);
    }

    return shopState.slots.map(slot => {
      if (!slot) return null;
      return [slot.itemId, slot.currentAmount];
    });
  }

  /**
   * Gets a shop state by ID.
   */
  getShopState(shopId: number): ShopState | undefined {
    return this.shopStates.get(shopId);
  }

  /**
   * Gets the number of temporary items currently in a shop.
   * Useful for debugging and monitoring.
   */
  getTemporaryItemCount(shopId: number): number {
    const shopState = this.shopStates.get(shopId);
    if (!shopState) return 0;

    return shopState.slots.filter(s => s && s.isTemporary).length;
  }

  /**
   * Reduces shop stock and handles restock timer and client updates.
   * 
   * This is the centralized method for reducing shop stock that:
   * - Decreases the stock amount at the specified slot
   * - Starts restock timer if not already running (for permanent items)
   * - Sends UpdatedShopStock packet to the player
   * 
   * @param userId - The player who triggered the stock reduction
   * @param shopId - The shop ID
   * @param slotIndex - The slot index in the shop (0-49)
   * @param amount - The amount to reduce by
   * @returns true if successful, false if validation fails
   */
  reduceShopStock(userId: number, shopId: number, slotIndex: number, amount: number): boolean {
    // Get shop state
    const shopState = this.shopStates.get(shopId);
    if (!shopState) {
      console.warn(`[ShopSystem] reduceShopStock: Shop ${shopId} not found`);
      return false;
    }

    // Validate slot index
    if (slotIndex < 0 || slotIndex >= SHOP_SLOT_COUNT) {
      console.warn(`[ShopSystem] reduceShopStock: Invalid slot index ${slotIndex}`);
      return false;
    }

    const slot = shopState.slots[slotIndex];
    if (!slot) {
      console.warn(`[ShopSystem] reduceShopStock: Slot ${slotIndex} is empty in shop ${shopId}`);
      return false;
    }

    // Validate amount
    if (amount <= 0 || amount > slot.currentAmount) {
      console.warn(`[ShopSystem] reduceShopStock: Invalid amount ${amount} (current stock: ${slot.currentAmount})`);
      return false;
    }

    // Reduce shop stock
    slot.currentAmount -= amount;

    // Start restock timer if not already running (and not temporary)
    if (!slot.isTemporary && slot.currentAmount < slot.maxAmount && slot.ticksUntilRestock === 0) {
      slot.ticksUntilRestock = slot.restockSpeed;
    }

    // Send UpdatedShopStock packet to the player
    const updatePayload = buildUpdatedShopStockPayload({
      ItemID: slot.itemId,
      Amount: slot.currentAmount
    });
    this.deps.enqueueUserMessage(userId, GameAction.UpdatedShopStock, updatePayload);


    return true;
  }

  /**
   * Purchases an item from the shop (shop → player).
   * 
   * Handles the complete purchase transaction:
   * - Validates shop state and slot
   * - Calculates maximum purchasable based on stock, coins, and inventory space
   * - Removes coins from player
   * - Adds items to player inventory
   * - Reduces shop stock and sends update packet
   * - Provides appropriate user feedback
   * 
   * @param userId - The player purchasing the item
   * @param shopId - The shop to buy from
   * @param slotIndex - The slot index in the shop (0-49)
   * @param requestedAmount - How many to purchase
   * @returns true if purchase was successful, false otherwise
   */
  purchaseItem(userId: number, shopId: number, slotIndex: number, requestedAmount: number): boolean {
    // Get player state
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ShopSystem] Player ${userId} not found`);
      return false;
    }

    // Get shop state
    const shopState = this.shopStates.get(shopId);
    if (!shopState) {
      console.warn(`[ShopSystem] Shop ${shopId} not found`);
      return false;
    }

    // Validate slot index
    if (slotIndex < 0 || slotIndex >= SHOP_SLOT_COUNT) {
      console.warn(`[ShopSystem] Invalid slot index ${slotIndex}`);
      return false;
    }

    const slot = shopState.slots[slotIndex];
    if (!slot) {
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "ShopPurchase",
        reason: "slot_empty",
        details: { shopId, slotIndex }
      });
      console.warn(`[ShopSystem] Slot ${slotIndex} in shop ${shopId} is empty`);
      return false;
    }

    // Validate requested amount
    if (requestedAmount <= 0) {
      console.warn(`[ShopSystem] Invalid requested amount: ${requestedAmount}`);
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "ShopPurchase",
        reason: "invalid_requested_amount",
        details: { shopId, slotIndex, requestedAmount }
      });
      return false;
    }

    // Get item definition from catalog
    const itemDef = this.deps.itemCatalog.getDefinitionById(slot.itemId);
    if (!itemDef) {
      console.warn(`[ShopSystem] Item definition not found for item ${slot.itemId}`);
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "ShopPurchase",
        reason: "item_definition_not_found",
        details: { shopId, slotIndex, itemId: slot.itemId }
      });
      return false;
    }

    // Validate item is tradeable and not coins
    if (slot.itemId === COIN_ITEM_ID || !itemDef.isTradeable) {
      console.warn(`[ShopSystem] Cannot purchase item ${slot.itemId}: not tradeable or is coins`);
      this.deps.messageService.sendServerInfo(userId, "You cannot sell this item.");
      return false;
    }

    // Calculate maximum purchasable amount based on multiple constraints
    let maxPurchasable = requestedAmount;

    // Constraint 1: Shop stock
    maxPurchasable = Math.min(maxPurchasable, slot.currentAmount);

    // Constraint 2: Player's available coins (itemId 6)
    const playerCoins = playerState.countItem(COIN_ITEM_ID, 0);
    const costPerItem = slot.cost;
    const maxAffordable = Math.floor(playerCoins / costPerItem);
    maxPurchasable = Math.min(maxPurchasable, maxAffordable);

    // Constraint 3: Inventory space
    if (itemDef.isStackable) {
      // For stackable items, check existing stacks and empty slots
      const existingStacks = playerState.findSlotsWithItem(slot.itemId, 0);
      const emptySlotCount = playerState.countEmptySlots();
      
      // Calculate space in existing stacks
      let availableSpace = 0;
      for (const slotIdx of existingStacks) {
        const item = playerState.inventory[slotIdx];
        if (item) {
          availableSpace += (Number.MAX_SAFE_INTEGER - item[1]);
        }
      }
      
      // Add space for new stacks in empty slots
      availableSpace += emptySlotCount * Number.MAX_SAFE_INTEGER;
      
      maxPurchasable = Math.min(maxPurchasable, availableSpace);
    } else {
      // For non-stackable items, each item needs its own slot
      const emptySlotCount = playerState.countEmptySlots();
      maxPurchasable = Math.min(maxPurchasable, emptySlotCount);
    }

    // Check if player can buy at least 1 item
    if (maxPurchasable <= 0) {
      let reason = "You cannot purchase this item.";
      
      if (slot.currentAmount <= 0) {
        reason = "The shop is out of stock.";
      } else if (maxAffordable <= 0) {
        reason = "You don't have enough money to buy that";
      } else if (!playerState.hasInventorySpace() && !itemDef.isStackable) {
        reason = "Your inventory is full.";
      } else if (itemDef.isStackable) {
        reason = "Your inventory is full.";
      }
      
      this.deps.messageService.sendServerInfo(userId, reason);
      return false;
    }

    // Execute the purchase
    const actualAmount = maxPurchasable;
    const totalCost = costPerItem * actualAmount;

    // Remove coins from player
    const removeResult = this.deps.inventoryService.removeItem(userId, COIN_ITEM_ID, totalCost, 0);
    if (removeResult.removed !== totalCost) {
      console.error(`[ShopSystem] Failed to remove coins. Expected ${totalCost}, removed ${removeResult.removed}`);
      this.deps.messageService.sendServerInfo(userId, "Transaction failed. Please report this to an administrator.");
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "ShopPurchase",
        reason: "remove_coins_failed",
        details: { shopId, slotIndex, requestedAmount, totalCost }
      });
      return false;
    }

    // Add items to player inventory
    const giveResult = this.deps.inventoryService.giveItem(userId, slot.itemId, actualAmount, 0);
    if (giveResult.added !== actualAmount) {
      //Shouldn't ever happen.
      console.error(`[ShopSystem] Failed to add all items. Expected ${actualAmount}, added ${giveResult.added}`);
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "ShopPurchase",
        reason: "add_items_failed",
        details: { shopId, slotIndex, requestedAmount, totalCost }
      });
      // Note: Not refunding as this should never happen due to pre-validation
    }

    if (slot.isTemporary && giveResult.added > 0) {
      this.consumeTemporaryLots(
        shopId,
        slotIndex,
        giveResult.added,
        userId,
        slot.itemId,
        slot.cost
      );
    }

    // Reduce shop stock and send update to player
    this.reduceShopStock(userId, shopId, slotIndex, giveResult.added);

    
    return true;
  }

  /**
   * Sells an item to the shop (player → shop).
   * 
   * Handles the complete sell transaction:
   * - Validates player has the item in inventory
   * - Removes items from player inventory (sends RemovedItemFromInventoryAtSlot)
   * - Adds coins to player inventory (sends AddedItemAtInventorySlot)
   * - Adds items to shop stock with proper pricing
   * - Sends UpdatedShopStock packet to all players viewing the shop
   * 
   * Pricing:
   * - If shop has item in stock: pays itemDef.cost
   * - If shop doesn't have item: pays 0.75x itemDef.cost
   * - Shop sells temporary items at 1.25x itemDef.cost
   * 
   * @param userId - The player selling the item
   * @param shopId - The shop to sell to
   * @param itemId - The item definition ID
   * @param amount - How many to sell
   * @param isIOU - Whether the item is an IOU/bank note
   * @returns true if sale was successful
   */
  sellItem(userId: number, shopId: number, itemId: number, amount: number, isIOU: number): boolean {
    // Get player state
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      console.warn(`[ShopSystem] Player ${userId} not found`);
      return false;
    }

    // Get shop state
    const shopState = this.shopStates.get(shopId);
    if (!shopState) {
      console.warn(`[ShopSystem] Shop ${shopId} not found`);
      return false;
    }

    // Get item definition for pricing
    const itemDef = this.deps.itemCatalog.getDefinitionById(itemId);
    if (!itemDef) {
      console.warn(`[ShopSystem] Item definition not found for item ${itemId}`);
      return false;
    }

    // Validate item is tradeable and not coins
    if (itemId === COIN_ITEM_ID || !itemDef.isTradeable) {
      console.warn(`[ShopSystem] Cannot sell item ${itemId}: not tradeable or is coins`);
      this.deps.messageService.sendServerInfo(userId, "You cannot sell this item.");
      return false;
    }

    // Validate amount
    if (amount <= 0) {
      console.warn(`[ShopSystem] Invalid amount: ${amount}`);
      return false;
    }

    // Check if player has the item - adjust amount to what they actually have
    const playerHasAmount = playerState.countItem(itemId, isIOU);
    if (playerHasAmount < amount) {
      if (playerHasAmount > 0) {
        amount = playerHasAmount;
      } else {
        console.warn(`[ShopSystem] Player ${userId} doesn't have item ${itemId}`);
        return false;
      }
    }

    // Find if this item already exists in the shop (including slots with 0 stock)
    const existingSlotIndex = shopState.slots.findIndex(s => s && s.itemId === itemId);
    const existingSlot = existingSlotIndex >= 0 ? shopState.slots[existingSlotIndex] : null;

    // Check if shop accepts this item BEFORE doing any transactions
    if (!existingSlot && !shopState.canBuyTemporaryItems) {
      // Shop doesn't have the item and doesn't buy temporary items
      this.deps.messageService.sendServerInfo(userId, "The shop isn't interested in buying that item.");
      return false;
    }

    // Calculate sell price (what player receives)
    let sellPricePerItem: number;
    if (existingSlot) {
      // Shop has the item: pay full itemDef.cost
      sellPricePerItem = Math.floor(itemDef.cost);
    } else {
      // Shop doesn't have the item: pay 0.75x itemDef.cost
      sellPricePerItem = Math.floor(itemDef.cost * 0.75);
    }

    const totalSellPrice = sellPricePerItem * amount;

    // Remove item from player inventory
    const removeResult = this.deps.inventoryService.removeItem(userId, itemId, amount, isIOU);
    if (removeResult.removed === 0) {
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "ShopSell",
        reason: "remove_failed",
        details: { shopId, itemId, amount, isIOU }
      });
      console.warn(`[ShopSystem] Failed to remove item from player inventory`);
      return false;
    }

    // Give coins to player
    const giveResult = this.deps.inventoryService.giveItem(userId, COIN_ITEM_ID, totalSellPrice, 0);
    if (giveResult.added === 0) {
      console.error(`[ShopSystem] Failed to give coins to player ${userId}`);
      // Note: Items already removed, coins will overflow to ground if inventory full
    }

    if (existingSlot) {
      // Item exists in shop - add to existing stock
      existingSlot.currentAmount += removeResult.removed;
      if (existingSlot.isTemporary) {
        this.addTemporaryLot(shopId, existingSlotIndex, userId, removeResult.removed);
      }
      
      // Send UpdatedShopStock to players viewing this shop
      this.broadcastStockUpdate(shopId, [{
        slotIndex: existingSlotIndex,
        itemId: existingSlot.itemId,
        amount: existingSlot.currentAmount
      }]);

      
      return true;
    }

    // Item doesn't exist in shop - create temporary slot
    // (canBuyTemporaryItems already validated above)
    
    // Find first empty slot
    const emptySlotIndex = shopState.slots.findIndex(s => s === null);
    if (emptySlotIndex === -1) {
      //Shouldn't ever happen. If it does, won't return an invoked inventory item action packet. Making it obvious to the player :D
      console.warn(`[ShopSystem] Shop ${shopId} is full, cannot add temporary item ${itemId}`);
      this.deps.messageService.sendServerInfo(userId, "The shop is full");
      return false;
    }

    // Create temporary slot for player-sold item
    // Shop will sell it at 1.25x itemDef.cost
    const shopSellPrice = Math.floor(itemDef.cost * 1.25);
    
    shopState.slots[emptySlotIndex] = {
      itemId,
      currentAmount: removeResult.removed,
      maxAmount: removeResult.removed, // Temporary items don't restock
      cost: shopSellPrice, // Shop sells at 1.25x itemDef.cost
      restockSpeed: 0, // Temporary items don't restock
      ticksUntilRestock: 0,
      isTemporary: true,
      ticksUntilDecay: TEMPORARY_ITEM_DECAY_TICKS
    };
    this.addTemporaryLot(shopId, emptySlotIndex, userId, removeResult.removed);

    // Send UpdatedShopStock to players viewing this shop
    this.broadcastStockUpdate(shopId, [{
      slotIndex: emptySlotIndex,
      itemId: itemId,
      amount: removeResult.removed
    }]);


    return true;
  }

  /**
   * Broadcasts stock updates to all players currently shopping at this shop.
   * Sends UpdatedShopStock packets for each changed item.
   * 
   * @param shopId - The shop ID
   * @param changedSlots - Array of slots that changed with their new amounts
   */
  private broadcastStockUpdate(
    shopId: number,
    changedSlots: Array<{ slotIndex: number; itemId: number; amount: number }>
  ): void {
    // Find all players currently shopping at this specific shop
    const shoppingPlayers = Array.from(this.deps.playerStatesByUserId.values())
      .filter(p => p.currentState === States.ShoppingState && p.currentShopId === shopId);

    if (shoppingPlayers.length === 0) {
      return; // No one is shopping at this shop
    }

    // Send UpdatedShopStock packet for each changed item to each shopping player
    for (const change of changedSlots) {
      const payload = buildUpdatedShopStockPayload({
        ItemID: change.itemId,
        Amount: change.amount
      });

      for (const player of shoppingPlayers) {
        if (player.userId) {
          this.deps.enqueueUserMessage(player.userId, GameAction.UpdatedShopStock, payload);
        }
      }
    }

  }

  private getLotKey(shopId: number, slotIndex: number): string {
    return `${shopId}:${slotIndex}`;
  }

  private addTemporaryLot(shopId: number, slotIndex: number, sellerUserId: number, amount: number): void {
    if (amount <= 0) return;
    const key = this.getLotKey(shopId, slotIndex);
    const lots = this.temporaryLotsBySlot.get(key) ?? [];
    lots.push({ sellerUserId, amount });
    this.temporaryLotsBySlot.set(key, lots);
  }

  private consumeTemporaryLots(
    shopId: number,
    slotIndex: number,
    amount: number,
    buyerUserId: number | null,
    itemId: number,
    priceEach: number
  ): void {
    if (amount <= 0) return;
    const key = this.getLotKey(shopId, slotIndex);
    const lots = this.temporaryLotsBySlot.get(key);
    if (!lots || lots.length === 0) return;

    let remaining = amount;
    while (remaining > 0 && lots.length > 0) {
      const lot = lots[0];
      const consumed = Math.min(remaining, lot.amount);
      lot.amount -= consumed;
      remaining -= consumed;

      if (buyerUserId !== null) {
        this.deps.itemAudit?.logShopSale({
          sellerUserId: lot.sellerUserId,
          buyerUserId,
          shopId,
          itemId,
          amount: consumed,
          priceEach,
          totalPrice: priceEach * consumed
        });
      }

      if (lot.amount <= 0) {
        lots.shift();
      }
    }

    if (lots.length === 0) {
      this.temporaryLotsBySlot.delete(key);
    } else {
      this.temporaryLotsBySlot.set(key, lots);
    }
  }
}
