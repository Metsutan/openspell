import { GameAction } from "../../protocol/enums/GameAction";
import { EntityType } from "../../protocol/enums/EntityType";
import { EquipmentSlots } from "../../protocol/enums/EquipmentSlots";
import { MenuType } from "../../protocol/enums/MenuType";
import { States } from "../../protocol/enums/States";
import { buildAddedItemAtInventorySlotPayload } from "../../protocol/packets/actions/AddedItemAtInventorySlot";
import { buildRemovedItemFromInventoryAtSlotPayload } from "../../protocol/packets/actions/RemovedItemFromInventoryAtSlot";
import type { ItemCatalog, ItemDefinition } from "../../world/items/ItemCatalog";
import type { PlayerState, EquipmentSlot } from "../../world/PlayerState";
import { EQUIPMENT_SLOTS } from "../../world/PlayerState";
import type { EquipmentStack } from "../../world/items/EquipmentStack";
import { InventoryManager } from "../../world/systems/InventoryManager";
import { applyWeightChange } from "../../world/systems/WeightCalculator";
import type { EventBus } from "../events/EventBus";
import type { StateMachine } from "../StateMachine";
import type { PacketAuditService } from "./PacketAuditService";

export interface EquipmentServiceDependencies {
  itemCatalog: ItemCatalog;
  playerStatesByUserId: Map<number, PlayerState>;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  eventBus: EventBus;
  stateMachine: StateMachine;
  packetAudit?: PacketAuditService | null;
}

export interface EquipItemResult {
  success: boolean;
  error?: string;
}

export interface UnequipItemResult {
  success: boolean;
  error?: string;
  itemId?: number;
  amount?: number;
}

/**
 * Maps equipment slot names to EquipmentSlots enum values for protocol packets.
 */
const SLOT_NAME_TO_ENUM: Record<EquipmentSlot, EquipmentSlots> = {
  helmet: EquipmentSlots.Helmet,
  chest: EquipmentSlots.Chest,
  legs: EquipmentSlots.Legs,
  shield: EquipmentSlots.Shield,
  weapon: EquipmentSlots.Weapon,
  back: EquipmentSlots.Back,
  neck: EquipmentSlots.Neck,
  gloves: EquipmentSlots.Gloves,
  boots: EquipmentSlots.Boots,
  projectile: EquipmentSlots.Projectile
};

/**
 * Service for managing player equipment operations.
 * Handles equipping/unequipping items, applying bonuses, and sending client updates.
 */
export class EquipmentService {
  constructor(private readonly deps: EquipmentServiceDependencies) {}

  /**
   * Attempts to equip an item from inventory.
   * Handles all packet emission, inventory management, and equipment slot logic.
   * 
   * @param userId The player equipping the item
   * @param itemId The item definition ID to equip
   * @param amount The amount to equip (typically 1)
   * @param fromInventorySlot The inventory slot the item is being equipped from
   * @returns Result indicating success/failure
   */
  equipItem(
    userId: number, 
    itemId: number, 
    amount: number, 
    fromInventorySlot: number
  ): EquipItemResult {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    
    if (!playerState) {
      return { success: false, error: "Player not found" };
    }

    // Get item definition
    const definition = this.deps.itemCatalog.getDefinitionById(itemId);
    if (!definition) {
      return { success: false, error: `Invalid item ID ${itemId}` };
    }

    // Check if item is equippable
    if (!definition.equipmentType) {
      return { success: false, error: "Item is not equippable" };
    }

    // Validate equipment slot
    const equipmentSlot = definition.equipmentType as EquipmentSlot;
    if (!EQUIPMENT_SLOTS.includes(equipmentSlot)) {
      return { success: false, error: `Invalid equipment slot: ${definition.equipmentType}` };
    }

    // Check equipment requirements
    const requirementCheck = this.checkEquipmentRequirements(playerState, definition);
    if (!requirementCheck.canEquip) {
      this.deps.packetAudit?.logInvalidPacket({
        userId,
        packetName: "EquipItem",
        reason: "requirements_failed",
        details: { itemId, reason: requirementCheck.reason }
      });
      return { success: false, error: requirementCheck.reason };
    }

    // Check if item is stackable
    if (!definition.isStackable && amount !== 1) {
      return { success: false, error: "Non-stackable items can only be equipped one at a time" };
    }

    // Create inventory manager
    const inventoryManager = new InventoryManager(
      playerState.inventory,
      this.deps.itemCatalog,
      (changes) => applyWeightChange(playerState, changes, this.deps.itemCatalog)
    );

    // Check currently equipped item in target slot (we'll use this later too)
    const currentlyEquippedInTargetSlot = playerState.equipment[equipmentSlot];
    const canStackIntoEquippedSlot = Boolean(
      definition.isStackable &&
      currentlyEquippedInTargetSlot &&
      currentlyEquippedInTargetSlot[0] === itemId
    );

    // Calculate how many items will need to be returned to inventory
    let itemsToReturn = 0;

    // Count items from removeEquipmentOnEquip
    if (definition.removeEquipmentOnEquip && definition.removeEquipmentOnEquip.length > 0) {
      for (const slotName of definition.removeEquipmentOnEquip) {
        const slotToRemove = slotName as EquipmentSlot;
        if (EQUIPMENT_SLOTS.includes(slotToRemove)) {
          const currentlyEquipped = playerState.equipment[slotToRemove];
          if (currentlyEquipped) {
            itemsToReturn++;
          }
        }
      }
    }

    // Count item from target slot (if different from removeEquipmentOnEquip)
    if (currentlyEquippedInTargetSlot && !canStackIntoEquippedSlot) {
      // Only count if this slot wasn't already counted in removeEquipmentOnEquip
      const alreadyCounted = definition.removeEquipmentOnEquip?.includes(equipmentSlot) ?? false;
      if (!alreadyCounted) {
        itemsToReturn++;
      }
    }

    // Check if there's enough inventory space
    const emptySlots = inventoryManager.countEmptySlots();
    
    // Account for the slot we're removing the item from (it will become empty)
    const availableSlots = emptySlots + 1;
    
    if (availableSlots < itemsToReturn) {
      return { 
        success: false, 
        error: "You don't have enough inventory space to do that" 
      };
    }

    // Remove item from inventory
    const removeResult = inventoryManager.removeItems(itemId, amount, 0);
    if (removeResult.removed === 0) {
      return { success: false, error: "Failed to remove item from inventory" };
    }

    // Send RemovedItemFromInventoryAtSlot for inventory (MenuType 0)
    for (const change of removeResult.slotsModified) {
      const remaining = change.newItem ? change.newItem[1] : 0;
      this.deps.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot,
        buildRemovedItemFromInventoryAtSlotPayload({
          MenuType: MenuType.Inventory,
          Slot: change.slot,
          ItemID: itemId,
          Amount: Math.abs(change.amountChanged),
          IsIOU: false,
          RemainingAmountAtSlot: remaining
        })
      );
    }

    // Collect items to return to inventory (from unequipped slots)
    const itemsToReturnToInventory: Array<{ itemId: number; amount: number }> = [];

    // Handle removeEquipmentOnEquip (e.g., bow removes weapon + shield)
    if (definition.removeEquipmentOnEquip && definition.removeEquipmentOnEquip.length > 0) {
      for (const slotName of definition.removeEquipmentOnEquip) {
        const slotToRemove = slotName as EquipmentSlot;
        if (EQUIPMENT_SLOTS.includes(slotToRemove)) {
          const currentlyEquipped = playerState.equipment[slotToRemove];
          if (currentlyEquipped) {
            const [unequippedItemId, unequippedAmount] = currentlyEquipped;
            
            // Remove equipment bonuses
            const unequippedDef = this.deps.itemCatalog.getDefinitionById(unequippedItemId);
            if (unequippedDef && unequippedDef.equippableEffects) {
              this.removeEquipmentBonuses(playerState, unequippedDef, unequippedAmount);
            }
            
            // Unequip the item
            playerState.unequipSlot(slotToRemove);
            
            // Send RemovedItemFromInventoryAtSlot for equipment (MenuType 6)
            const slotEnum = SLOT_NAME_TO_ENUM[slotToRemove];
            this.deps.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot,
              buildRemovedItemFromInventoryAtSlotPayload({
                MenuType: MenuType.Loadout,
                Slot: slotEnum,
                ItemID: unequippedItemId,
                Amount: unequippedAmount,
                IsIOU: false,
                RemainingAmountAtSlot: 0
              })
            );
            
            // Emit equipment changed event for visibility system
            this.deps.eventBus.emit({
              type: "PlayerEquipmentChanged",
              userId,
              slot: slotToRemove,
              itemId: 0,
              unequippedItemId: unequippedItemId,
              timestamp: Date.now()
            });
            
            // Queue for return to inventory
            itemsToReturnToInventory.push({ itemId: unequippedItemId, amount: unequippedAmount });
            
          }
        }
      }
    }

    // Handle currently equipped item in the target slot
    if (currentlyEquippedInTargetSlot && !canStackIntoEquippedSlot) {
      const [unequippedItemId, unequippedAmount] = currentlyEquippedInTargetSlot;
      
      // Remove equipment bonuses
      const unequippedDef = this.deps.itemCatalog.getDefinitionById(unequippedItemId);
      if (unequippedDef && unequippedDef.equippableEffects) {
        this.removeEquipmentBonuses(playerState, unequippedDef, unequippedAmount);
      }
      
      // Unequip the item
      playerState.unequipSlot(equipmentSlot);
      
      // Send RemovedItemFromInventoryAtSlot for equipment (MenuType 6)
      const slotEnum = SLOT_NAME_TO_ENUM[equipmentSlot];
      this.deps.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot,
        buildRemovedItemFromInventoryAtSlotPayload({
          MenuType: MenuType.Loadout,
          Slot: slotEnum,
          ItemID: unequippedItemId,
          Amount: unequippedAmount,
          IsIOU: false,
          RemainingAmountAtSlot: 0
        })
      );
      
      // Emit equipment changed event for visibility system
      this.deps.eventBus.emit({
        type: "PlayerEquipmentChanged",
        userId,
        slot: equipmentSlot,
        itemId: 0,
        unequippedItemId: unequippedItemId,
        timestamp: Date.now()
      });
      
      // Queue for return to inventory
      itemsToReturnToInventory.push({ itemId: unequippedItemId, amount: unequippedAmount });
      
    }

    // Equip the new item
    const existingEquippedAmount = currentlyEquippedInTargetSlot?.[1] ?? 0;
    const equipmentStack: EquipmentStack = [
      itemId,
      canStackIntoEquippedSlot ? existingEquippedAmount + removeResult.removed : removeResult.removed
    ];
    playerState.equipItem(equipmentSlot, equipmentStack);
    
    // Apply equipment bonuses
    this.applyEquipmentBonuses(playerState, definition, removeResult.removed);
    
    // Send AddedItemAtInventorySlot for equipment (MenuType 6)
    const slotEnum = SLOT_NAME_TO_ENUM[equipmentSlot];
    this.deps.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot,
      buildAddedItemAtInventorySlotPayload({
        MenuType: MenuType.Loadout,
        Slot: slotEnum,
        ItemID: itemId,
        Amount: removeResult.removed,
        IsIOU: false,
        PreviousAmountAtSlot: canStackIntoEquippedSlot ? existingEquippedAmount : 0
      })
    );

    // Return unequipped items to inventory
    for (const { itemId: returnItemId, amount: returnAmount } of itemsToReturnToInventory) {
      const addResult = inventoryManager.addItems(returnItemId, returnAmount, 0);
      
      // Send AddedItemAtInventorySlot for inventory (MenuType 0)
      for (const change of addResult.slotsModified) {
        const previousAmount = change.previousItem ? change.previousItem[1] : 0;
        this.deps.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot,
          buildAddedItemAtInventorySlotPayload({
            MenuType: MenuType.Inventory,
            Slot: change.slot,
            ItemID: returnItemId,
            Amount: change.amountChanged,
            IsIOU: false,
            PreviousAmountAtSlot: previousAmount
          })
        );
      }
      
      // Handle overflow (drop on ground)
      if (addResult.overflow > 0) {
        // Note: Item dropping would be handled by the caller or ItemManager
      }
    }

    // Update equipment weight
    this.updateEquipmentWeight(playerState);
    
    // Mark player state as dirty
    playerState.markEquipmentDirty();
    
    // Emit equipment changed event for visibility system
    this.deps.eventBus.emit({
      type: "PlayerEquipmentChanged",
      userId,
      slot: equipmentSlot,
      itemId,
      timestamp: Date.now()
    });
    

    this.setPlayerToIdle(userId);
    
    return { success: true };
  }

  /**
   * Unequips an item from a specific equipment slot and adds it back to inventory.
   * Handles all packet emission, inventory management, and validation.
   * 
   * @param userId The player unequipping the item
   * @param slot The equipment slot to unequip from
   * @returns Result indicating success/failure
   */
  unequipItem(userId: number, slot: EquipmentSlot): UnequipItemResult {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    
    if (!playerState) {
      return { success: false, error: "Player not found" };
    }

    const currentlyEquipped = playerState.equipment[slot];
    if (!currentlyEquipped) {
      return { success: false, error: "No item equipped in that slot" };
    }

    const [itemId, amount] = currentlyEquipped;
    const definition = this.deps.itemCatalog.getDefinitionById(itemId);
    
    if (!definition) {
      return { success: false, error: `Invalid item ID ${itemId}` };
    }

    // Create inventory manager
    const inventoryManager = new InventoryManager(
      playerState.inventory,
      this.deps.itemCatalog,
      (changes) => applyWeightChange(playerState, changes, this.deps.itemCatalog)
    );

    // Check if there's room in inventory for the item
    const availableCapacity = inventoryManager.calculateAddCapacity(itemId, 0);
    
    if (availableCapacity < amount) {
      return { 
        success: false, 
        error: "You don't have enough inventory space to do that" 
      };
    }

    // Remove equipment bonuses
    if (definition.equippableEffects) {
      this.removeEquipmentBonuses(playerState, definition, amount);
    }
    
    // Unequip the item from equipment slot
    playerState.unequipSlot(slot);
    
    // Send RemovedItemFromInventoryAtSlot for equipment (MenuType 6)
    const slotEnum = SLOT_NAME_TO_ENUM[slot];
    this.deps.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot,
      buildRemovedItemFromInventoryAtSlotPayload({
        MenuType: MenuType.Loadout,
        Slot: slotEnum,
        ItemID: itemId,
        Amount: amount,
        IsIOU: false,
        RemainingAmountAtSlot: 0
      })
    );

    // Add item to inventory
    const addResult = inventoryManager.addItems(itemId, amount, 0);
    
    if (addResult.added === 0) {
      // This shouldn't happen after capacity check, but handle gracefully
      // Re-equip the item
      playerState.equipItem(slot, currentlyEquipped);
      if (definition.equippableEffects) {
        this.applyEquipmentBonuses(playerState, definition, amount);
      }
      return { success: false, error: "Failed to add item to inventory" };
    }

    // Send AddedItemAtInventorySlot for inventory (MenuType 0)
    for (const change of addResult.slotsModified) {
      const previousAmount = change.previousItem ? change.previousItem[1] : 0;
      this.deps.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot,
        buildAddedItemAtInventorySlotPayload({
          MenuType: MenuType.Inventory,
          Slot: change.slot,
          ItemID: itemId,
          Amount: change.amountChanged,
          IsIOU: false,
          PreviousAmountAtSlot: previousAmount
        })
      );
    }

    // Handle overflow (shouldn't happen after capacity check, but be safe)
    if (addResult.overflow > 0) {
      console.error(`[EquipmentService] Unexpected overflow when unequipping: ${addResult.overflow}x ${itemId} for user ${userId}`);
      // Overflow would need to be dropped on ground, but this is handled elsewhere
    }

    // Update equipment weight
    this.updateEquipmentWeight(playerState);
    
    // Mark player state as dirty
    playerState.markEquipmentDirty();
    
    // Emit equipment changed event for visibility system
    this.deps.eventBus.emit({
      type: "PlayerEquipmentChanged",
      userId,
      slot,
      itemId: 0, // 0 = unequipped
      unequippedItemId: itemId, // Pass the actual item ID that was unequipped
      timestamp: Date.now()
    });
    

    this.setPlayerToIdle(userId);
    
    return { success: true, itemId, amount };
  }

  /**
   * Checks if a player meets the requirements to equip an item.
   * 
   * @param playerState The player state
   * @param definition The item definition
   * @returns Object with canEquip boolean and optional reason
   */
  private checkEquipmentRequirements(
    playerState: PlayerState, 
    definition: ItemDefinition
  ): { canEquip: boolean; reason?: string } {
    if (!definition.equippableRequirements || definition.equippableRequirements.length === 0) {
      return { canEquip: true };
    }

    for (const requirement of definition.equippableRequirements) {
      // Use effective level (includes potions + equipment bonuses)
      // This allows players to equip items if they have boosting equipment
      const skillLevel = playerState.getSkillBoostedLevel(requirement.skill as any);
      
      if (skillLevel < requirement.level) {
        this.deps.packetAudit?.logInvalidPacket({
          userId: playerState.userId,
          packetName: "EquipItem",
          reason: "requirement_failed",
          details: {
            itemId: definition.id,
            skill: requirement.skill,
            requiredLevel: requirement.level,
            actualLevel: skillLevel
          }
        });
        return {
          canEquip: false,
          reason: `Requires level ${requirement.level} ${requirement.skill}`
        };
      }
    }

    return { canEquip: true };
  }

  /**
   * Calculates all equipment bonuses from currently equipped items.
   * Sums up bonuses from all equipment slots and returns the totals.
   * 
   * @param playerState The player state
   * @returns Object containing all calculated bonuses
   */
  public calculateEquipmentBonuses(playerState: PlayerState): {
    accuracyBonus: number;
    strengthBonus: number;
    defenseBonus: number;
    magicBonus: number;
    rangeBonus: number;
    skillBonuses: Record<string, number>;
  } {
    const bonuses = {
      accuracyBonus: 0,
      strengthBonus: 0,
      defenseBonus: 0,
      magicBonus: 0,
      rangeBonus: 0,
      skillBonuses: {} as Record<string, number>
    };

    // Iterate through all equipment slots
    for (const slot of EQUIPMENT_SLOTS) {
      const equippedItem = playerState.equipment[slot];
      if (!equippedItem) continue;

      const [itemId, amount] = equippedItem;
      const itemDef = this.deps.itemCatalog.getDefinitionById(itemId);
      if (!itemDef || !itemDef.equippableEffects) continue;

      // Sum up bonuses from this item
      for (const effect of itemDef.equippableEffects) {
        const totalBonus = effect.amount;

        // Map stat names to bonus fields
        switch (effect.skill) {
          case 'accuracy':
            bonuses.accuracyBonus += totalBonus;
            break;
          case 'strength':
            bonuses.strengthBonus += totalBonus;
            break;
          case 'defense':
            bonuses.defenseBonus += totalBonus;
            break;
          case 'magic':
            bonuses.magicBonus += totalBonus;
            break;
          case 'range':
            bonuses.rangeBonus += totalBonus;
            break;
          default:
            // All other stats are skill bonuses (forestry, mining, etc.)
            bonuses.skillBonuses[effect.skill] = (bonuses.skillBonuses[effect.skill] ?? 0) + totalBonus;
            break;
        }
      }
    }

    return bonuses;
  }

  /**
   * Applies equipment stat bonuses to the player.
   * Recalculates all equipment bonuses and updates the player state.
   * 
   * @param playerState The player state
   * @param definition The item definition (unused, kept for compatibility)
   * @param amount The amount equipped (unused, kept for compatibility)
   */
  private applyEquipmentBonuses(
    playerState: PlayerState,
    definition: ItemDefinition,
    amount: number
  ): void {
    // Recalculate all equipment bonuses and update player state
    const bonuses = this.calculateEquipmentBonuses(playerState);
    playerState.setEquipmentBonuses(bonuses);
  }

  /**
   * Removes equipment stat bonuses from the player.
   * Recalculates all equipment bonuses and updates the player state.
   * 
   * @param playerState The player state
   * @param definition The item definition (unused, kept for compatibility)
   * @param amount The amount being removed (unused, kept for compatibility)
   */
  private removeEquipmentBonuses(
    playerState: PlayerState,
    definition: ItemDefinition,
    amount: number
  ): void {
    // Recalculate all equipment bonuses and update player state
    const bonuses = this.calculateEquipmentBonuses(playerState);
    playerState.setEquipmentBonuses(bonuses);
  }

  /**
   * Calculates and updates the total weight of equipped items.
   * 
   * @param playerState The player state
   */
  private updateEquipmentWeight(playerState: PlayerState): void {
    let totalWeight = 0;

    for (const slot of EQUIPMENT_SLOTS) {
      const equipped = playerState.equipment[slot];
      if (equipped) {
        const [itemId, amount] = equipped;
        const definition = this.deps.itemCatalog.getDefinitionById(itemId);
        if (definition) {
          totalWeight += definition.weight * amount;
        }
      }
    }

    playerState.updateEquippedWeight(totalWeight);
  }

  private setPlayerToIdle(userId: number): void {
    this.deps.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
  }

  /**
   * Gets the item definition ID equipped in a specific slot.
   * 
   * @param userId The player user ID
   * @param slot The equipment slot
   * @returns The item ID, or null if slot is empty
   */
  getEquippedItemId(userId: number, slot: EquipmentSlot): number | null {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) return null;

    const equipped = playerState.equipment[slot];
    return equipped ? equipped[0] : null;
  }

  /**
   * Consumes ammo from the projectile equipment slot.
   * Returns false if no ammo is equipped or not enough quantity.
   */
  consumeProjectileAmmo(userId: number, amount: number = 1): { success: boolean; itemId?: number } {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return { success: false };
    }

    const equipped = playerState.equipment.projectile;
    if (!equipped) {
      return { success: false };
    }

    const [itemId, currentAmount] = equipped;
    if (currentAmount < amount) {
      return { success: false };
    }

    const newAmount = currentAmount - amount;
    if (newAmount <= 0) {
      playerState.unequipSlot("projectile");
    } else {
      playerState.equipItem("projectile", [itemId, newAmount]);
    }

    this.deps.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot,
      buildRemovedItemFromInventoryAtSlotPayload({
        MenuType: MenuType.Loadout,
        Slot: EquipmentSlots.Projectile,
        ItemID: itemId,
        Amount: amount,
        IsIOU: false,
        RemainingAmountAtSlot: Math.max(0, newAmount)
      })
    );

    this.updateEquipmentWeight(playerState);
    playerState.markEquipmentDirty();

    this.deps.eventBus.emit({
      type: "PlayerEquipmentChanged",
      userId,
      slot: "projectile",
      itemId: newAmount > 0 ? itemId : 0,
      unequippedItemId: newAmount > 0 ? undefined : itemId,
      timestamp: Date.now()
    });

    return { success: true, itemId };
  }

  /**
   * Checks if a player has a specific item equipped in any slot.
   * 
   * @param userId The player user ID
   * @param itemId The item definition ID
   * @returns True if the item is equipped, false otherwise
   */
  hasItemEquipped(userId: number, itemId: number): boolean {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) return false;

    for (const slot of EQUIPMENT_SLOTS) {
      const equipped = playerState.equipment[slot];
      if (equipped && equipped[0] === itemId) {
        return true;
      }
    }

    return false;
  }
}
