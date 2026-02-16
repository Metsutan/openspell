import { ItemAction } from "../../protocol/enums/ItemAction";
import { MenuType } from "../../protocol/enums/MenuType";
import { EquipmentSlots } from "../../protocol/enums/EquipmentSlots";
import { States } from "../../protocol/enums/States";
import { decodeInvokeInventoryItemActionPayload, InvokeInventoryItemActionPayload } from "../../protocol/packets/actions/InvokeInventoryItemAction";
import { buildInvokedInventoryItemActionPayload } from "../../protocol/packets/actions/InvokedInventoryItemAction";
import { buildRemovedItemFromInventoryAtSlotPayload } from "../../protocol/packets/actions/RemovedItemFromInventoryAtSlot";
import { buildAddedItemAtInventorySlotPayload } from "../../protocol/packets/actions/AddedItemAtInventorySlot";
import { buildSkillCurrentLevelChangedPayload } from "../../protocol/packets/actions/SkillCurrentLevelChanged";
import { buildShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload } from "../../protocol/packets/actions/ShowSkillCurrentLevelIncreasedOrDecreasedMessage";
import { GameAction } from "../../protocol/enums/GameAction";
import type { ActionContext, ActionHandler } from "./types";
import type { ItemOnItemAction, ItemOnItemActionItem } from "../../world/items/ItemCatalog";
import { buildPlayerWeightChangedPayload } from "../../protocol/packets/actions/PlayerWeightChanged";
import { InventoryManager, InventoryMenuType } from "../../world/systems/InventoryManager";
import { PlayerState, EQUIPMENT_SLOTS, SKILLS, isSkillSlug, skillToClientRef, type EquipmentSlot, type InventoryItem } from "../../world/PlayerState";
import { applyWeightChange } from "../../world/systems/WeightCalculator";
import { EntityType } from "../../protocol/enums/EntityType";
import { createEntityHitpointsChangedEvent } from "../events/GameEvents";
import { DelayType } from "../systems/DelaySystem";

/**
 * Handles inventory item action invocations (e.g., eat food, equip weapon, drop, etc.)
 * Routes actions to appropriate systems based on the item action type.
 */
export const handleInvokeInventoryItemAction: ActionHandler = (ctx, actionData) => {
  const payload = decodeInvokeInventoryItemActionPayload(actionData);
  const actionType = typeof payload.Action === "number" ? payload.Action : undefined;
  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "InvokeInventoryItemAction",
      actionType,
      reason,
      payload,
      details
    });
  };

  // Validate user is authenticated
  if (!ctx.userId) {
    console.warn("[handleInvokeInventoryItemAction] No userId - action ignored");
    return;
  }

  // Get player state
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) {
    console.warn(`[handleInvokeInventoryItemAction] No player state for user ${ctx.userId}`);
    return;
  }

  const handleEdibleAction = (actionLabel: "eat" | "drink") => {
    if (payload.MenuType !== MenuType.Inventory) {
      logInvalid(`${actionLabel}_invalid_menu`, { menuType: payload.MenuType });
      console.warn(`[handleInvokeInventoryItemAction] ${actionLabel} called on non-inventory menu: ${payload.MenuType}`);
      return;
    }

    const slot = Number(payload.Slot);
    if (!Number.isInteger(slot) || slot < 0 || slot >= 28) {
      logInvalid(`${actionLabel}_invalid_slot`, { slot });
      console.warn(`[handleInvokeInventoryItemAction] Invalid ${actionLabel} slot index: ${slot}`);
      return;
    }

    const inventoryItem = playerState.inventory[slot];
    if (!inventoryItem) {
      logInvalid(`${actionLabel}_empty_slot`, { slot });
      console.warn(`[handleInvokeInventoryItemAction] No item at slot ${slot} for ${actionLabel}`);
      return;
    }

    const [itemId, _itemAmount, isIOU] = inventoryItem;
    const expectedItemId = Number(payload.ItemID);
    if (itemId !== expectedItemId) {
      logInvalid(`${actionLabel}_item_mismatch`, { slot, expectedItemId, itemId });
      console.warn(`[handleInvokeInventoryItemAction] ItemID mismatch at slot ${slot}. Expected ${itemId}, got ${expectedItemId}`);
      return;
    }

    if (playerState.lastEdibleActionTick === ctx.currentTick) {
      logInvalid(`${actionLabel}_rate_limited`, { slot, itemId, tick: ctx.currentTick });
      console.warn(`[handleInvokeInventoryItemAction] ${actionLabel} rate limited for user ${ctx.userId} on tick ${ctx.currentTick}`);
      const failurePayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: 1,
        IsIOU: isIOU === 1,
        Success: false,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId!, GameAction.InvokedInventoryItemAction, failurePayload);
      return;
    }

    if (isIOU === 1) {
      logInvalid(`${actionLabel}_iou`, { slot, itemId });
      console.warn(`[handleInvokeInventoryItemAction] Cannot ${actionLabel} IOU item ${itemId} at slot ${slot}`);
      const failurePayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: 1,
        IsIOU: true,
        Success: false,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId!, GameAction.InvokedInventoryItemAction, failurePayload);
      return;
    }

    playerState.lastEdibleActionTick = ctx.currentTick;

    const itemDef = ctx.itemCatalog?.getDefinitionById(itemId);
    if (!itemDef) {
      console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${itemId}`);
      return;
    }

    const edibleEffects = itemDef.edibleEffects ?? null;
    if (!edibleEffects || edibleEffects.length === 0) {
      logInvalid(`${actionLabel}_no_effects`, { itemId });
      console.warn(`[handleInvokeInventoryItemAction] Item ${itemId} has no edible effects for ${actionLabel}`);
      return;
    }

    const decrementResult = ctx.inventoryService.decrementItemAtSlot(ctx.userId!, slot, itemId, 1, isIOU);
    if (!decrementResult || decrementResult.removed <= 0) {
      logInvalid(`${actionLabel}_remove_failed`, { slot, itemId });
      console.warn(`[handleInvokeInventoryItemAction] Failed to remove item ${itemId} from slot ${slot} for ${actionLabel}`);
      return;
    }

    for (const edibleEffect of edibleEffects) {
      const effect = edibleEffect?.effect;
      if (!effect || !Number.isFinite(effect.amount)) {
        continue;
      }
      if (!isSkillSlug(effect.skill)) {
        console.warn(`[handleInvokeInventoryItemAction] Invalid edible effect skill "${effect.skill}" on item ${itemId}`);
        continue;
      }

      const skill = effect.skill;
      const currentState = playerState.getSkillState(skill);
      const baseLevel = currentState.level;
      const currentBoosted = currentState.boostedLevel;
      const amount = effect.amount;

      let delta: number;
      if (Math.abs(amount) < 1) {
        delta = amount > 0
          ? Math.ceil(baseLevel * amount)
          : Math.floor(baseLevel * amount);
      } else {
        delta = Math.round(amount);
      }

      if (delta === 0) {
        continue;
      }

      let newBoosted = currentBoosted;
      if (skill === SKILLS.hitpoints) {
        if (delta > 0) {
          if (currentBoosted < baseLevel) {
            newBoosted = Math.min(baseLevel, currentBoosted + delta);
          }
        } else {
          newBoosted = Math.max(0, currentBoosted + delta);
        }
      } else if (delta > 0) {
        newBoosted = Math.max(currentBoosted, baseLevel + delta);
      } else {
        const floorLevel = baseLevel + delta;
        if (currentBoosted > floorLevel) {
          newBoosted = Math.max(currentBoosted + delta, floorLevel);
        }
      }

      if (newBoosted === currentBoosted) {
        continue;
      }

      playerState.setBoostedLevel(skill, newBoosted);

      const clientRef = skillToClientRef(skill);
      if (clientRef !== null) {
        const skillPayload = buildSkillCurrentLevelChangedPayload({
          Skill: clientRef,
          CurrentLevel: newBoosted
        });
        ctx.enqueueUserMessage(ctx.userId!, GameAction.SkillCurrentLevelChanged, skillPayload);
      }

      if (skill === SKILLS.hitpoints) {
        ctx.eventBus.emit(createEntityHitpointsChangedEvent(
          { type: EntityType.Player, id: ctx.userId! },
          newBoosted,
          { mapLevel: playerState.mapLevel, x: playerState.x, y: playerState.y }
        ));
      }
    }

    if (itemDef.edibleResult) {
      const result = itemDef.edibleResult;
      ctx.inventoryService.giveItem(
        ctx.userId!,
        result.id,
        result.amount,
        result.isIOU ? 1 : 0
      );
    }

    const successPayload = buildInvokedInventoryItemActionPayload({
      Action: payload.Action,
      MenuType: payload.MenuType,
      Slot: payload.Slot,
      ItemID: payload.ItemID,
      Amount: 1,
      IsIOU: isIOU === 1,
      Success: true,
      Data: null
    });
    ctx.enqueueUserMessage(ctx.userId!, GameAction.InvokedInventoryItemAction, successPayload);

    console.log(`[handleInvokeInventoryItemAction] User ${ctx.userId} ${actionLabel} item ${itemId} (slot ${slot})`);
  };

  const handleNotImplementedAction = (actionLabel: string) => {
    const message = `The ${actionLabel} action is not implemented yet.`;
    ctx.messageService.sendServerInfo(ctx.userId!, message);

    const failurePayload = buildInvokedInventoryItemActionPayload({
      Action: payload.Action,
      MenuType: payload.MenuType,
      Slot: payload.Slot,
      ItemID: payload.ItemID,
      Amount: payload.Amount,
      IsIOU: payload.IsIOU,
      Success: false,
      Data: null
    });
    ctx.enqueueUserMessage(ctx.userId!, GameAction.InvokedInventoryItemAction, failurePayload);

    console.warn(`[handleInvokeInventoryItemAction] ${actionLabel} action not implemented`);
  };

  const handleRubAction = () => {
    const sendRubResponse = (success: boolean) => {
      const responsePayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: payload.Amount,
        IsIOU: payload.IsIOU,
        Success: success,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId!, GameAction.InvokedInventoryItemAction, responsePayload);
    };

    if (payload.MenuType !== MenuType.Inventory) {
      logInvalid("rub_invalid_menu", { menuType: payload.MenuType });
      sendRubResponse(false);
      return;
    }

    const slot = Number(payload.Slot);
    if (!Number.isInteger(slot) || slot < 0 || slot >= 28) {
      logInvalid("rub_invalid_slot", { slot });
      sendRubResponse(false);
      return;
    }

    const inventoryItem = playerState.inventory[slot];
    if (!inventoryItem) {
      logInvalid("rub_empty_slot", { slot });
      sendRubResponse(false);
      return;
    }

    const [itemId, _amount, isIOU] = inventoryItem;
    const expectedItemId = Number(payload.ItemID);
    if (itemId !== expectedItemId) {
      logInvalid("rub_item_mismatch", { slot, expectedItemId, itemId });
      sendRubResponse(false);
      return;
    }

    if (isIOU === 1) {
      logInvalid("rub_iou", { slot, itemId });
      sendRubResponse(false);
      return;
    }

    const FIRST_CELADON_ORB_ID = 408;
    const DORMANT_CELADON_ORB_ID = 413;
    if (itemId < FIRST_CELADON_ORB_ID || itemId > DORMANT_CELADON_ORB_ID) {
      logInvalid("rub_invalid_item", { itemId });
      sendRubResponse(false);
      return;
    }

    // Restart this non-blocking windup if player rubs again.
    ctx.delaySystem.interruptDelay(ctx.userId!, false);

    const delayStarted = ctx.delaySystem.startDelay({
      userId: ctx.userId!,
      type: DelayType.NonBlocking,
      ticks: 1,
      onComplete: (delayedUserId) => {
        ctx.messageService.sendServerInfo(delayedUserId, "You Rub the Celadon Orb...");

        const resolveDelayStarted = ctx.delaySystem.startDelay({
          userId: delayedUserId,
          type: DelayType.NonBlocking,
          ticks: 2,
          onComplete: (resolvedUserId) => {
            const delayedPlayerState = ctx.playerStatesByUserId.get(resolvedUserId);
            if (!delayedPlayerState) return;

            const delayedInventoryItem = delayedPlayerState.inventory[slot];
            if (!delayedInventoryItem) {
              logInvalid("rub_delay_empty_slot", { slot, expectedItemId: itemId });
              sendRubResponse(false);
              return;
            }

            const [delayedItemId, _delayedAmount, delayedIsIOU] = delayedInventoryItem;
            if (delayedItemId !== itemId || delayedIsIOU === 1) {
              logInvalid("rub_delay_item_mismatch", { slot, expectedItemId: itemId, delayedItemId, delayedIsIOU });
              sendRubResponse(false);
              return;
            }

            if (delayedItemId === DORMANT_CELADON_ORB_ID) {
              ctx.messageService.sendServerInfo(resolvedUserId, "But nothing happened");
              sendRubResponse(false);
              return;
            }

            const decrementResult = ctx.inventoryService.decrementItemAtSlot(resolvedUserId, slot, delayedItemId, 1, delayedIsIOU);
            if (!decrementResult || decrementResult.removed <= 0) {
              logInvalid("rub_remove_failed", { slot, itemId: delayedItemId });
              sendRubResponse(false);
              return;
            }

            const nextOrbId = delayedItemId + 1;
            ctx.inventoryService.giveItem(resolvedUserId, nextOrbId, 1, 0);

            const defenseState = delayedPlayerState.getSkillState(SKILLS.defense);
            const baseLevel = defenseState.level;
            const previousCurrentLevel = defenseState.boostedLevel;
            const delta = Math.ceil(baseLevel * 0.2);
            const newBoosted = Math.max(previousCurrentLevel, baseLevel + delta);

            if (newBoosted !== previousCurrentLevel) {
              delayedPlayerState.setBoostedLevel(SKILLS.defense, newBoosted);
            }

            const clientRef = skillToClientRef(SKILLS.defense);
            if (clientRef !== null) {
              const skillPayload = buildSkillCurrentLevelChangedPayload({
                Skill: clientRef,
                CurrentLevel: newBoosted
              });
              ctx.enqueueUserMessage(resolvedUserId, GameAction.SkillCurrentLevelChanged, skillPayload);

              const increasedMessagePayload = buildShowSkillCurrentLevelIncreasedOrDecreasedMessagePayload({
                Skill: clientRef,
                Level: baseLevel,
                PreviousCurrentLevel: previousCurrentLevel,
                CurrentLevel: newBoosted
              });
              ctx.enqueueUserMessage(
                resolvedUserId,
                GameAction.ShowSkillCurrentLevelIncreasedOrDecreasedMessage,
                increasedMessagePayload
              );
            }

            sendRubResponse(true);
            console.log(`[handleInvokeInventoryItemAction] User ${resolvedUserId} rubbed orb ${delayedItemId} -> ${nextOrbId} and gained defense boost`);
          }
        });

        if (!resolveDelayStarted) {
          logInvalid("rub_resolve_delay_failed", { slot, itemId });
          sendRubResponse(false);
        }
      }
    });

    if (!delayStarted) {
      logInvalid("rub_delay_failed", { slot, itemId });
      sendRubResponse(false);
    }
  };

  // Switch on the item action type
  switch (payload.Action) {
    case ItemAction.drop: {
      // Step 1: Remove item from inventory
      const removedItem = ctx.world.inventorySystem.removeItemFromInventoryAtSlot(
        { enqueueUserMessage: ctx.enqueueUserMessage, itemCatalog: ctx.itemCatalog! },
        playerState,
        payload
      );

      if (!removedItem) {
        console.warn(`[handleInvokeInventoryItemAction] Failed to remove item from inventory`);
        // TODO Implement logging - Specifically inside of removeItemFromInventoryAtslot for better specifics.
        return;
      }

      // Step 2: Spawn item at player's current location
      if (ctx.itemManager) {
        const spawned = ctx.itemManager.spawnGroundItem(
          removedItem[0], // itemId
          removedItem[1], // amount
          removedItem[2] === 1, // isIOU
          playerState.mapLevel,
          playerState.x,
          playerState.y,
          undefined, // Use default despawn time
          ctx.userId ?? undefined // Visible to this player initially
        );
        if (spawned && ctx.itemAudit) {
          ctx.itemAudit.logItemDrop({
            dropperUserId: ctx.userId!,
            itemId: removedItem[0],
            amount: removedItem[1],
            isIOU: removedItem[2],
            mapLevel: playerState.mapLevel,
            x: playerState.x,
            y: playerState.y,
            groundItemId: spawned.id
          });
        }
      } else {
        console.error("[handleInvokeInventoryItemAction] ItemManager not available");
      }

      // Step 3: Send success confirmation
      const successPayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: payload.Amount,
        IsIOU: payload.IsIOU,
        Success: true,
        Data: null
      });
      
      ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, successPayload);
      ctx.inventoryService.sendWeightUpdate(ctx.userId, playerState);
      
      console.log(`[handleInvokeInventoryItemAction] User ${ctx.userId} dropped item ${removedItem[0]} x${removedItem[1]}`);
      
      // TODO: implement PlayerWeightChanged
      break;
    }

    case ItemAction.use:
      handleNotImplementedAction("use");
      break;

    case ItemAction.equip: {
      // Validate MenuType is Inventory (equipping FROM inventory)
      if (payload.MenuType !== MenuType.Inventory) {
        console.warn(`[handleInvokeInventoryItemAction] equip called on non-inventory menu: ${payload.MenuType}`);
        return;
      }

      // Validate slot index
      const slot = Number(payload.Slot);
      if (!Number.isInteger(slot) || slot < 0 || slot >= 28) {
        console.warn(`[handleInvokeInventoryItemAction] Invalid slot index: ${slot}`);
        return;
      }

      // Get item from inventory slot
      const inventoryItem = playerState.inventory[slot];
      if (!inventoryItem) {
        console.warn(`[handleInvokeInventoryItemAction] No item at slot ${slot}`);
        return;
      }

      const [itemId, itemAmount, isIOU] = inventoryItem;

      // Validate packet data matches inventory
      const expectedItemId = Number(payload.ItemID);
      if (itemId !== expectedItemId) {
        console.warn(`[handleInvokeInventoryItemAction] ItemID mismatch at slot ${slot}. Expected ${itemId}, got ${expectedItemId}`);
        return;
      }

      // Cannot equip IOUs
      if (isIOU === 1) {
        logInvalid("equip_iou", { itemId });
        console.warn(`[handleInvokeInventoryItemAction] Cannot equip IOU item ${itemId}`);
        return;
      }

      // Get item definition
      const itemDef = ctx.itemCatalog?.getDefinitionById(itemId);
      if (!itemDef) {
        console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${itemId}`);
        return;
      }

      // Check if item is equippable
      if (!itemDef.equipmentType) {
        logInvalid("equip_not_equippable", { itemId });
        console.warn(`[handleInvokeInventoryItemAction] Item ${itemId} is not equippable`);
        return;
      }

      // Determine amount to equip (1 for non-stackable, full amount for stackable)
      const amountToEquip = itemDef.isStackable ? itemAmount : 1;

      // Attempt to equip the item via EquipmentService (handles everything internally)
      const equipResult = ctx.equipmentService.equipItem(ctx.userId, itemId, amountToEquip, slot);

      if (!equipResult.success) {
        console.warn(`[handleInvokeInventoryItemAction] Failed to equip item ${itemId}: ${equipResult.error}`);
        ctx.messageService.sendServerInfo(ctx.userId, equipResult.error ?? "Failed to equip item");
        // Send success response
        const failurePayload = buildInvokedInventoryItemActionPayload({
          Action: payload.Action,
          MenuType: payload.MenuType,
          Slot: payload.Slot,
          ItemID: payload.ItemID,
          Amount: amountToEquip,
          IsIOU: false,
          Success: false,
          Data: null
        });
        ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
      }

      // Send success response
      const successPayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: amountToEquip,
        IsIOU: false,
        Success: true,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, successPayload);

      // Send weight update
      ctx.inventoryService.sendWeightUpdate(ctx.userId, playerState);

      console.log(`[handleInvokeInventoryItemAction] User ${ctx.userId} equipped item ${itemId} x${amountToEquip}`);
      break;
    }

    case ItemAction.unequip: {
      // Validate MenuType is Loadout (unequipping FROM equipment)
      if (payload.MenuType !== MenuType.Loadout) {
        logInvalid("unequip_invalid_menu", { menuType: payload.MenuType });
        console.warn(`[handleInvokeInventoryItemAction] unequip called on non-loadout menu: ${payload.MenuType}`);
        return;
      }

      // Validate slot index is a valid equipment slot (0-9)
      const slotIndex = Number(payload.Slot);
      if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 9) {
        logInvalid("unequip_invalid_slot", { slotIndex });
        console.warn(`[handleInvokeInventoryItemAction] Invalid equipment slot index: ${slotIndex}`);
        return;
      }

      // Map EquipmentSlots enum to slot name
      const SLOT_INDEX_TO_NAME: Record<number, EquipmentSlot> = {
        [EquipmentSlots.Helmet]: "helmet",
        [EquipmentSlots.Chest]: "chest",
        [EquipmentSlots.Legs]: "legs",
        [EquipmentSlots.Shield]: "shield",
        [EquipmentSlots.Weapon]: "weapon",
        [EquipmentSlots.Back]: "back",
        [EquipmentSlots.Neck]: "neck",
        [EquipmentSlots.Gloves]: "gloves",
        [EquipmentSlots.Boots]: "boots",
        [EquipmentSlots.Projectile]: "projectile"
      };

      const equipmentSlot = SLOT_INDEX_TO_NAME[slotIndex];
      if (!equipmentSlot) {
        logInvalid("unequip_unknown_slot", { slotIndex });
        console.warn(`[handleInvokeInventoryItemAction] Unknown equipment slot index: ${slotIndex}`);
        return;
      }

      // Get item from equipment slot
      const equippedItem = playerState.equipment[equipmentSlot];
      if (!equippedItem) {
        logInvalid("unequip_empty_slot", { equipmentSlot });
        console.warn(`[handleInvokeInventoryItemAction] No item equipped at slot ${equipmentSlot}`);
        return;
      }

      const [itemId, itemAmount] = equippedItem;

      // Validate packet data matches equipment
      const expectedItemId = Number(payload.ItemID);
      if (itemId !== expectedItemId) {
        logInvalid("unequip_item_mismatch", { equipmentSlot, expectedItemId, itemId });
        console.warn(`[handleInvokeInventoryItemAction] ItemID mismatch at equipment slot ${equipmentSlot}. Expected ${itemId}, got ${expectedItemId}`);
        return;
      }

      // Get item definition
      const itemDef = ctx.itemCatalog?.getDefinitionById(itemId);
      if (!itemDef) {
        console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${itemId}`);
        return;
      }

      // Attempt to unequip the item via EquipmentService (handles everything internally)
      const unequipResult = ctx.equipmentService.unequipItem(ctx.userId, equipmentSlot);

      if (!unequipResult.success) {
        console.warn(`[handleInvokeInventoryItemAction] Failed to unequip item ${itemId}: ${unequipResult.error}`);
        return;
      }

      // Send success response
      const successPayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: itemAmount,
        IsIOU: false,
        Success: true,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, successPayload);

      // Send weight update
      ctx.inventoryService.sendWeightUpdate(ctx.userId, playerState);

      console.log(`[handleInvokeInventoryItemAction] User ${ctx.userId} unequipped item ${itemId} x${itemAmount} from ${equipmentSlot}`);
      break;
    }

    case ItemAction.eat:
      handleEdibleAction("eat");
      break;

    case ItemAction.drink:
      handleEdibleAction("drink");
      break;

    case ItemAction.open:
      handleNotImplementedAction("open");
      break;

    case ItemAction.check_price: {
      // Validate player is in a shop
      const currentShopId = playerState.currentShopId;
      if (currentShopId === null) {
        logInvalid("check_price_not_in_shop");
        console.warn(`[handleInvokeInventoryItemAction] check_price called but player not in shop`);
        return;
      }

      // Get shop state
      const shopState = ctx.shopSystem.getShopState(currentShopId);
      if (!shopState) {
        logInvalid("check_price_shop_missing", { shopId: currentShopId });
        console.warn(`[handleInvokeInventoryItemAction] Shop ${currentShopId} not found`);
        return;
      }

      // Validate slot index
      const slotIndex = payload.Slot as number;
      if (slotIndex < 0 || slotIndex >= 50) {
        logInvalid("check_price_invalid_slot", { slotIndex });
        console.warn(`[handleInvokeInventoryItemAction] Invalid slot index: ${slotIndex}`);
        return;
      }

      let price: number;
      let itemName: string;
      let message: string;

      if (payload.MenuType === MenuType.Shop) {
        // Player is checking the price to BUY an item from the shop
        const slot = shopState.slots[slotIndex];
        if (!slot) {
          logInvalid("check_price_empty_slot", { slotIndex });
          console.warn(`[handleInvokeInventoryItemAction] Slot ${slotIndex} is empty in shop ${currentShopId}`);
          return;
        }

        // Get item definition
        const itemDef = ctx.itemCatalog?.getDefinitionById(slot.itemId);
        if (!itemDef) {
          console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${slot.itemId}`);
          return;
        }

        // Validate item is tradeable and not coins
        const COIN_ITEM_ID = 6;
        if (slot.itemId === COIN_ITEM_ID || !itemDef.isTradeable) {
          ctx.messageService.sendServerInfo(ctx.userId, "You cannot sell this item.");
          const failurePayload = buildInvokedInventoryItemActionPayload({
            Action: payload.Action,
            MenuType: payload.MenuType,
            Slot: payload.Slot,
            ItemID: payload.ItemID,
            Amount: payload.Amount,
            IsIOU: payload.IsIOU,
            Success: false,
            Data: null
          });
          ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
        }

        itemName = itemDef.name;
        const capitalizedName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

        // Calculate price: permanent items use slot.cost, temporary items use 1.25x itemDef.cost
        if (slot.isTemporary) {
          price = Math.floor(itemDef.cost * 1.25);
        } else {
          price = Math.floor(slot.cost);
        }

        message = `The shop is selling their ${capitalizedName} for ${price} coins.`;
        
      } else if (payload.MenuType === MenuType.Inventory) {
        // Player is checking how much the shop will BUY their item for
        const itemId = payload.ItemID as number;
        
        // Get item definition
        const itemDef = ctx.itemCatalog?.getDefinitionById(itemId);
        if (!itemDef) {
          console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${itemId}`);
          return;
        }

        // Validate item is tradeable and not coins
        const COIN_ITEM_ID = 6;
        if (itemId === COIN_ITEM_ID || !itemDef.isTradeable) {
          ctx.messageService.sendServerInfo(ctx.userId, "You cannot sell this item.");
          return;
        }

        itemName = itemDef.name;

        // Check if the shop has this item in stock (including stock of 0)
        const shopHasItem = shopState.slots.some(slot => slot && slot.itemId === itemId);

        // Calculate sell price (player selling to shop)
        if (shopHasItem) {
          // Shop has the item: pay full itemDef.cost
          price = Math.floor(itemDef.cost);
        } else {
          // Shop doesn't have the item: pay 0.75x itemDef.cost
          price = Math.floor(itemDef.cost * 0.75);
        }

        // Simple capitalization for first letter
        const capitalizedName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        message = `The shop will buy your ${capitalizedName} for ${price} coins.`;
        
      } else {
        logInvalid("check_price_invalid_menu", { menuType: payload.MenuType });
        console.warn(`[handleInvokeInventoryItemAction] check_price called on invalid menu: ${payload.MenuType}`);
        return;
      }

      // Send InvokedInventoryItemAction response
      const responsePayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: payload.Amount,
        IsIOU: payload.IsIOU,
        Success: true,
        Data: null
      });

      ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, responsePayload);

      // Send server info message with price
      ctx.messageService.sendServerInfo(ctx.userId, message);

      console.log(`[handleInvokeInventoryItemAction] Player ${ctx.userId} checked price of ${itemName} in shop ${currentShopId}: ${price} coins (MenuType: ${payload.MenuType})`);
      break;
    }

    case ItemAction.buy: {
      // Validate MenuType is Shop
      if (payload.MenuType !== MenuType.Shop) {
        logInvalid("buy_invalid_menu", { menuType: payload.MenuType });
        console.warn(`[handleInvokeInventoryItemAction] buy called on non-shop menu: ${payload.MenuType}`);
        return;
      }

      // Check if player is in a shop
      const currentShopId = playerState.currentShopId;
      if (currentShopId === null) {
        logInvalid("buy_not_in_shop");
        console.warn(`[handleInvokeInventoryItemAction] buy called but player not in shop`);
        return;
      }

      // Get shop state for validation
      const shopState = ctx.shopSystem.getShopState(currentShopId);
      if (!shopState) {
        logInvalid("buy_shop_missing", { shopId: currentShopId });
        console.warn(`[handleInvokeInventoryItemAction] Shop ${currentShopId} not found`);
        return;
      }

      // Validate slot index
      const slotIndex = payload.Slot as number;
      if (slotIndex < 0 || slotIndex >= 50) {
        logInvalid("buy_invalid_slot", { slotIndex });
        console.warn(`[handleInvokeInventoryItemAction] Invalid slot index: ${slotIndex}`);
        return;
      }

      // Get shop slot for packet validation
      const slot = shopState.slots[slotIndex];
      if (!slot) {
        logInvalid("buy_empty_slot", { slotIndex });
        console.warn(`[handleInvokeInventoryItemAction] Slot ${slotIndex} is empty in shop ${currentShopId}`);
        return;
      }

      // Validate item is tradeable and not coins
      const COIN_ITEM_ID = 6;
      const buyItemDef = ctx.itemCatalog?.getDefinitionById(slot.itemId);
      if (!buyItemDef) {
        console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${slot.itemId}`);
        return;
      }
      if (slot.itemId === COIN_ITEM_ID || !buyItemDef.isTradeable) {
        ctx.messageService.sendServerInfo(ctx.userId, "You cannot sell this item.");
        return;
      }

      // Validate itemId matches shop stock
      const expectedItemId = payload.ItemID as number;
      if (slot.itemId !== expectedItemId) {
        logInvalid("buy_item_mismatch", { slotIndex, expectedItemId, itemId: slot.itemId });
        console.warn(`[handleInvokeInventoryItemAction] ItemID mismatch at slot ${slotIndex}. Expected ${slot.itemId}, got ${expectedItemId}`);
        return;
      }

      // Validate Amount is a number
      const requestedAmount = payload.Amount as number;
      if (typeof requestedAmount !== 'number' || !Number.isInteger(requestedAmount) || requestedAmount <= 0) {
        logInvalid("buy_invalid_amount", { requestedAmount });
        console.warn(`[handleInvokeInventoryItemAction] Invalid amount: ${requestedAmount}`);
        return;
      }

      // Validate IsIOU matches shop stock (shop items are never IOUs)
      const expectedIsIOU = payload.IsIOU ? 1 : 0;
      if (expectedIsIOU !== 0) {
        logInvalid("buy_iou_not_allowed");
        console.warn(`[handleInvokeInventoryItemAction] IsIOU mismatch. Shop items cannot be IOUs.`);
        return;
      }

      // Execute the purchase through ShopSystem
      const success = ctx.shopSystem.purchaseItem(ctx.userId, currentShopId, slotIndex, requestedAmount);

      // Send response packet
      const responsePayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: payload.Amount,
        IsIOU: payload.IsIOU,
        Success: success,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, responsePayload);

      break;
    }

    case ItemAction.sell: {
      // Validate MenuType is Inventory (selling FROM inventory TO shop)
      if (payload.MenuType !== MenuType.Inventory) {
        logInvalid("sell_invalid_menu", { menuType: payload.MenuType });
        console.warn(`[handleInvokeInventoryItemAction] sell called on non-inventory menu: ${payload.MenuType}`);
        return;
      }

      // Check if player is in a shop
      const currentShopId = playerState.currentShopId;
      if (currentShopId === null) {
        logInvalid("sell_not_in_shop");
        console.warn(`[handleInvokeInventoryItemAction] sell called but player not in shop`);
        return;
      }

      // Get shop state for validation
      const shopState = ctx.shopSystem.getShopState(currentShopId);
      if (!shopState) {
        logInvalid("sell_shop_missing", { shopId: currentShopId });
        console.warn(`[handleInvokeInventoryItemAction] Shop ${currentShopId} not found`);
        return;
      }

      // Validate itemId
      const itemId = payload.ItemID as number;
      if (!itemId || itemId <= 0) {
        logInvalid("sell_invalid_item", { itemId });
        console.warn(`[handleInvokeInventoryItemAction] Invalid itemId: ${itemId}`);
        return;
      }

      // Validate item is tradeable and not coins
      const COIN_ITEM_ID = 6;
      const sellItemDef = ctx.itemCatalog?.getDefinitionById(itemId);
      if (!sellItemDef) {
        console.warn(`[handleInvokeInventoryItemAction] Item definition not found for item ${itemId}`);
        return;
      }
      if (itemId === COIN_ITEM_ID || !sellItemDef.isTradeable) {
        ctx.messageService.sendServerInfo(ctx.userId, "You cannot sell this item.");
        
        const failurePayload = buildInvokedInventoryItemActionPayload({
          Action: payload.Action,
          MenuType: payload.MenuType,
          Slot: payload.Slot,
          ItemID: payload.ItemID,
          Amount: payload.Amount,
          IsIOU: payload.IsIOU,
          Success: false,
          Data: null
        });
        ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
        return;
      }

      // Validate amount
      let amount = payload.Amount as number;
      if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
        logInvalid("sell_invalid_amount", { amount });
        console.warn(`[handleInvokeInventoryItemAction] Invalid amount: ${amount}`);
        return;
      }

      // Get isIOU
      const isIOU = payload.IsIOU ? 1 : 0;

      // Validate player has the item
      const playerHasAmount = playerState.countItem(itemId, isIOU);
      if (playerHasAmount < amount) {
        amount = playerHasAmount;
      }

      // Check if shop has space for new items
      const existingSlotIndex = shopState.slots.findIndex(s => s && s.itemId === itemId);
      if (existingSlotIndex === -1) {
        // Item doesn't exist in shop - check if there's space for a new item
        const hasEmptySlot = shopState.slots.some(s => s === null);
        if (!hasEmptySlot) {
          ctx.messageService.sendServerInfo(ctx.userId, "The shop is full");
          
          const failurePayload = buildInvokedInventoryItemActionPayload({
            Action: payload.Action,
            MenuType: payload.MenuType,
            Slot: payload.Slot,
            ItemID: payload.ItemID,
            Amount: payload.Amount,
            IsIOU: payload.IsIOU,
            Success: false,
            Data: null
          });
          ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
        }
      }

      // Execute the sell through ShopSystem
      const success = ctx.shopSystem.sellItem(ctx.userId, currentShopId, itemId, amount, isIOU);

      // Send response packet
      const responsePayload = buildInvokedInventoryItemActionPayload({
        Action: payload.Action,
        MenuType: payload.MenuType,
        Slot: payload.Slot,
        ItemID: payload.ItemID,
        Amount: payload.Amount,
        IsIOU: payload.IsIOU,
        Success: success,
        Data: null
      });
      ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, responsePayload);

      break;
    }
    case ItemAction.withdraw:
      handleBankWithdraw(ctx, playerState, payload, false);
      break;
    case ItemAction.withdrawiou:
      handleBankWithdraw(ctx, playerState, payload, true);
      break;
    case ItemAction.deposit:
      handleBankDeposit(ctx, playerState, payload);
      break;

    case ItemAction.offer:
      handleNotImplementedAction("offer");
      break;
    case ItemAction.revoke:
      handleNotImplementedAction("revoke");
      break;

    case ItemAction.create:
      handleNotImplementedAction("create");
      break;

    case ItemAction.rub:
      handleRubAction();
      break;

    case ItemAction.dropx:
      handleNotImplementedAction("dropx");
      break;

    case ItemAction.look_at:
      handleNotImplementedAction("look at");
      break;

    case ItemAction.dig:
      handleNotImplementedAction("dig");
      break;

    case ItemAction.discard:
      handleNotImplementedAction("discard");
      break;

    case ItemAction.blow:
      handleNotImplementedAction("blow");
      break;

    case ItemAction.disassemble:
      {
        // Validate MenuType is Inventory (disassembling FROM inventory)
        if (payload.MenuType !== MenuType.Inventory) {
          logInvalid("disassemble_invalid_menu", { menuType: payload.MenuType });
          console.warn(`[handleInvokeInventoryItemAction] disassemble called on non-inventory menu: ${payload.MenuType}`);
          return;
        }

        // Validate slot index
        const slot = Number(payload.Slot);
        if (!Number.isInteger(slot) || slot < 0 || slot >= 28) {
          logInvalid("disassemble_invalid_slot", { slot });
          console.warn(`[handleInvokeInventoryItemAction] Invalid slot index: ${slot}`);
          return;
        }

        // Get item from inventory slot
        const inventoryItem = playerState.inventory[slot];
        if (!inventoryItem) {
          logInvalid("disassemble_empty_slot", { slot });
          console.warn(`[handleInvokeInventoryItemAction] No item at slot ${slot}`);
          return;
        }

        const [itemId, itemAmount, isIOU] = inventoryItem;

        // Validate packet data matches inventory
        const expectedItemId = Number(payload.ItemID);
        if (itemId !== expectedItemId) {
          logInvalid("disassemble_item_mismatch", { slot, expectedItemId, itemId });
          console.warn(`[handleInvokeInventoryItemAction] ItemID mismatch at slot ${slot}. Expected ${itemId}, got ${expectedItemId}`);
          return;
        }

        const payloadIsIOU = payload.IsIOU ? 1 : 0;
        if (isIOU !== payloadIsIOU) {
          logInvalid("disassemble_iou_mismatch", { slot, isIOU, payloadIsIOU });
          console.warn(`[handleInvokeInventoryItemAction] IsIOU mismatch at slot ${slot}. Expected ${isIOU}, got ${payloadIsIOU}`);
          return;
        }

        if (isIOU === 1) {
          logInvalid("disassemble_iou_blocked", { itemId });
          const failurePayload = buildInvokedInventoryItemActionPayload({
            Action: payload.Action,
            MenuType: payload.MenuType,
            Slot: payload.Slot,
            ItemID: payload.ItemID,
            Amount: payload.Amount,
            IsIOU: payload.IsIOU,
            Success: false,
            Data: null
          });
          ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
        }

        if (itemAmount !== 1) {
          logInvalid("disassemble_invalid_amount", { itemAmount });
          const failurePayload = buildInvokedInventoryItemActionPayload({
            Action: payload.Action,
            MenuType: payload.MenuType,
            Slot: payload.Slot,
            ItemID: payload.ItemID,
            Amount: payload.Amount,
            IsIOU: payload.IsIOU,
            Success: false,
            Data: null
          });
          ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
        }

        const requestedAmount = Number(payload.Amount);
        if (requestedAmount !== 1) {
          logInvalid("disassemble_requested_amount", { requestedAmount });
          const failurePayload = buildInvokedInventoryItemActionPayload({
            Action: payload.Action,
            MenuType: payload.MenuType,
            Slot: payload.Slot,
            ItemID: payload.ItemID,
            Amount: payload.Amount,
            IsIOU: payload.IsIOU,
            Success: false,
            Data: null
          });
          ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
        }

        if (!ctx.itemCatalog) {
          console.warn("[handleInvokeInventoryItemAction] Item catalog unavailable for disassemble");
          return;
        }

        const findReverseAction = (): { action: ItemOnItemAction; resultItems: ItemOnItemActionItem[] } | null => {
          for (const definition of ctx.itemCatalog!.getDefinitions()) {
            const actions = definition.useItemOnItemActions;
            if (!actions || actions.length === 0) continue;
            for (const action of actions) {
              const resultItems = action.resultItems;
              if (!resultItems || resultItems.length === 0) continue;
              const matches = resultItems.some((result) =>
                result &&
                result.id === itemId &&
                (result.isIOU ? 1 : 0) === isIOU
              );
              if (matches) {
                return { action, resultItems };
              }
            }
          }
          return null;
        };

        const reverseAction = findReverseAction();
        if (!reverseAction) {
          logInvalid("disassemble_no_reverse_action", { itemId });
          ctx.messageService.sendServerInfo(ctx.userId, "This item cannot be disassembled.");
          const failurePayload = buildInvokedInventoryItemActionPayload({
            Action: payload.Action,
            MenuType: payload.MenuType,
            Slot: payload.Slot,
            ItemID: payload.ItemID,
            Amount: payload.Amount,
            IsIOU: payload.IsIOU,
            Success: false,
            Data: null
          });
          ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
          return;
        }

        const previewInventory = playerState.inventory.map((item) =>
          item ? ([...item] as InventoryItem) : null
        );
        const previewManager = new InventoryManager(previewInventory, ctx.itemCatalog);
        for (const result of reverseAction.resultItems) {
          if (!result || result.amount <= 0) continue;
          const removePreview = previewManager.removeItems(
            result.id,
            result.amount,
            result.isIOU ? 1 : 0
          );
          if (removePreview.removed < result.amount) {
            ctx.messageService.sendServerInfo(ctx.userId, "You don't have the required items.");
            const failurePayload = buildInvokedInventoryItemActionPayload({
              Action: payload.Action,
              MenuType: payload.MenuType,
              Slot: payload.Slot,
              ItemID: payload.ItemID,
              Amount: payload.Amount,
              IsIOU: payload.IsIOU,
              Success: false,
              Data: null
            });
            ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
            return;
          }
        }

        if (reverseAction.action.itemsToRemove) {
          for (const item of reverseAction.action.itemsToRemove) {
            if (!item || item.amount <= 0) continue;
            const addPreview = previewManager.addItems(
              item.id,
              item.amount,
              item.isIOU ? 1 : 0
            );
            if (addPreview.overflow > 0) {
              ctx.messageService.sendServerInfo(ctx.userId, "Your inventory is full.");
              const failurePayload = buildInvokedInventoryItemActionPayload({
                Action: payload.Action,
                MenuType: payload.MenuType,
                Slot: payload.Slot,
                ItemID: payload.ItemID,
                Amount: payload.Amount,
                IsIOU: payload.IsIOU,
                Success: false,
                Data: null
              });
              ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
              return;
            }
          }
        }

        // Remove result items (reverse of crafting)
        for (const result of reverseAction.resultItems) {
          if (!result || result.amount <= 0) continue;
          const removeAmount = result.amount;
          const removeResult = ctx.inventoryService.removeItem(
            ctx.userId,
            result.id,
            removeAmount,
            result.isIOU ? 1 : 0
          );
          if (removeResult.removed < removeAmount) {
            console.warn(`[handleInvokeInventoryItemAction] Failed to remove result item ${result.id} for disassemble`);
            const failurePayload = buildInvokedInventoryItemActionPayload({
              Action: payload.Action,
              MenuType: payload.MenuType,
              Slot: payload.Slot,
              ItemID: payload.ItemID,
              Amount: payload.Amount,
              IsIOU: payload.IsIOU,
              Success: false,
              Data: null
            });
            ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, failurePayload);
            return;
          }
        }

        // Add original recipe items back
        if (reverseAction.action.itemsToRemove) {
          for (const item of reverseAction.action.itemsToRemove) {
            if (!item || item.amount <= 0) continue;
            ctx.inventoryService.giveItem(
              ctx.userId,
              item.id,
              item.amount,
              item.isIOU ? 1 : 0
            );
          }
        }

        const successPayload = buildInvokedInventoryItemActionPayload({
          Action: payload.Action,
          MenuType: payload.MenuType,
          Slot: payload.Slot,
          ItemID: payload.ItemID,
          Amount: 1,
          IsIOU: payload.IsIOU,
          Success: true,
          Data: null
        });
        ctx.enqueueUserMessage(ctx.userId, GameAction.InvokedInventoryItemAction, successPayload);
        break;
      }

    default:
      console.warn(`[handleInvokeInventoryItemAction] Unhandled item action: ${payload.Action}`);
      break;
  }
};

/**
 * Handles withdrawing items from the bank (both regular and IOU)
 * 
 * @param ctx - Action context
 * @param playerState - Player state
 * @param payload - Invoke inventory item action payload
 * @param asIOU - Whether to withdraw as IOU (withdrawiou) or regular item (withdraw)
 */
function handleBankWithdraw(
  ctx: ActionContext,
  playerState: PlayerState,
  payload: InvokeInventoryItemActionPayload,
  asIOU: boolean
): void {
  const userId = ctx.userId!;
  
  // Security check: Player must be in banking state
  if (playerState.currentState !== States.BankingState) {
    // Player not in banking state, silently ignore
    return;
  }
  
  // Validate menu type is Bank
  const menuType = Number(payload.MenuType);
  if (menuType !== InventoryMenuType.Bank) {
    // Not a bank operation, silently ignore
    return;
  }
  
  const slot = Number(payload.Slot);
  const requestedAmount = Number(payload.Amount);
  
  // Validate amount
  if (!Number.isInteger(requestedAmount) || requestedAmount <= 0) {
    // Invalid amount, silently ignore
    return;
  }
  
  // Withdraw from bank via BankingService
  const result = ctx.bankingService.withdrawItem(userId, slot, requestedAmount);
  
  if (!result.success) {
    // Failed to withdraw (invalid slot, empty slot, etc.)
    return;
  }
  
  // Check available inventory capacity for this specific item
  if (!ctx.itemCatalog) return;
  const availableCapacity = ctx.inventoryService.calculateAvailableCapacity(
    userId,
    result.itemId,
    asIOU ? 1 : 0
  );
  
  // Calculate how much we can actually withdraw based on inventory space
  const amountToWithdraw = Math.min(result.amountWithdrawn, availableCapacity);
  
  if (amountToWithdraw === 0) {
    // No inventory space - return item to bank
    ctx.bankingService.depositItem(userId, result.itemId, result.amountWithdrawn);
    ctx.messageService.sendServerInfo(userId, "Your inventory is full.");
    console.warn(`[banking] Inventory full for user ${userId}, returned ${result.amountWithdrawn}x ${result.itemId} to bank`);
    return;
  }
  
  // If we can't withdraw the full amount, return the excess to bank
  if (amountToWithdraw < result.amountWithdrawn) {
    const excess = result.amountWithdrawn - amountToWithdraw;
    ctx.bankingService.depositItem(userId, result.itemId, excess);
    console.log(`[banking] User ${userId} inventory partially full, returned ${excess}x ${result.itemId} to bank`);
  }
  
  // Create inventory manager and add items
  const inventoryManager = new InventoryManager(
    playerState.inventory,
    ctx.itemCatalog,
    (changes) => applyWeightChange(playerState, changes, ctx.itemCatalog!)
  );
  
  // Add to inventory (as IOU or regular item)
  const addResult = inventoryManager.addItems(result.itemId, amountToWithdraw, asIOU ? 1 : 0);
  
  if (addResult.added === 0) {
    // Shouldn't happen after capacity check, but handle gracefully
    ctx.bankingService.depositItem(userId, result.itemId, amountToWithdraw);
    console.error(`[banking] Unexpected: inventory full after capacity check for user ${userId}`);
    return;
  }
  
  // Send RemovedItemFromInventoryAtSlot for Bank
  ctx.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot, 
    buildRemovedItemFromInventoryAtSlotPayload({
      MenuType: InventoryMenuType.Bank,
      Slot: slot,
      ItemID: result.itemId,
      Amount: amountToWithdraw,
      IsIOU: false, // Bank items are never IOUs
      RemainingAmountAtSlot: result.amountRemaining + (result.amountWithdrawn - amountToWithdraw)
    })
  );
  
  // Send AddedItemAtInventorySlot for each modified inventory slot
  for (const change of addResult.slotsModified) {
    const previousAmount = change.previousItem ? change.previousItem[1] : 0;
    ctx.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot,
      buildAddedItemAtInventorySlotPayload({
        MenuType: InventoryMenuType.PlayerInventory,
        Slot: change.slot,
        ItemID: result.itemId,
        Amount: change.amountChanged,
        IsIOU: change.newItem ? change.newItem[2] === 1 : false,
        PreviousAmountAtSlot: previousAmount
      })
    );
  }
  const successPayload = buildInvokedInventoryItemActionPayload({
    Action: payload.Action,
    MenuType: payload.MenuType,
    Slot: payload.Slot,
    ItemID: result.itemId,
    Amount: amountToWithdraw,
    IsIOU: asIOU,
    Success: true,
    Data: null
  });
  ctx.enqueueUserMessage(userId, GameAction.InvokedInventoryItemAction, successPayload);


  
  // Mark inventory as dirty for autosave
  playerState.markInventoryDirty();
  
  // Send weight update if item has weight
  ctx.inventoryService.sendWeightUpdate(userId, playerState);
  
  console.log(`[banking] User ${userId} withdrew ${amountToWithdraw}x ${result.itemId} ${asIOU ? '(IOU)' : ''} from slot ${slot}`);
}

/**
 * Handles depositing items into the bank from inventory
 * 
 * @param ctx - Action context
 * @param playerState - Player state
 * @param payload - Invoke inventory item action payload
 */
function handleBankDeposit(
  ctx: ActionContext,
  playerState: PlayerState,
  payload: InvokeInventoryItemActionPayload
): void {
  const userId = ctx.userId!;
  const actionType = typeof payload.Action === "number" ? payload.Action : undefined;
  const logInvalidBank = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId,
      packetName: "InvokeInventoryItemAction",
      actionType,
      reason,
      payload,
      details
    });
  };
  
  // Security check: Player must be in banking state
  if (playerState.currentState !== States.BankingState) {
    // Player not in banking state, silently ignore
    logInvalidBank("bank_deposit_not_in_state");
    return;
  }
  
  // Validate menu type is Inventory (depositing FROM inventory TO bank)
  const menuType = Number(payload.MenuType);
  if (menuType !== InventoryMenuType.PlayerInventory) {
    // Not an inventory operation, silently ignore
    logInvalidBank("bank_deposit_invalid_menu", { menuType });
    return;
  }
  
  const itemId = Number(payload.ItemID);
  const requestedAmount = Number(payload.Amount);
  const isIOU = payload.IsIOU ? 1 : 0;
  
  // Validate itemId
  if (!Number.isInteger(itemId) || itemId <= 0) {
    // Invalid itemId, silently ignore
    logInvalidBank("bank_deposit_invalid_item", { itemId });
    return;
  }
  
  // Validate amount
  if (!Number.isInteger(requestedAmount) || requestedAmount <= 0) {
    // Invalid amount, silently ignore
    logInvalidBank("bank_deposit_invalid_amount", { requestedAmount });
    return;
  }
  
  // Check if player has the item in inventory
  const playerHasAmount = playerState.countItem(itemId, isIOU);
  if (playerHasAmount <= 0) {
    // Player doesn't have the item
    sendDepositFailure(ctx, userId, payload);
    return;
  }
  
  // Use min(requested, available)
  const amountToDeposit = Math.min(requestedAmount, playerHasAmount);
  
  // Remove from inventory
  if (!ctx.itemCatalog) return;
  const inventoryManager = new InventoryManager(
    playerState.inventory,
    ctx.itemCatalog,
    (changes) => applyWeightChange(playerState, changes, ctx.itemCatalog!)
  );
  const removeResult = inventoryManager.removeItems(itemId, amountToDeposit, isIOU);
  
  if (removeResult.removed === 0) {
    // Failed to remove from inventory
    sendDepositFailure(ctx, userId, payload);
    return;
  }
  
  // Add to bank (bank items are never IOUs)
  const depositResult = ctx.bankingService.depositItem(userId, itemId, removeResult.removed);
  
  if (!depositResult.success) {
    // Bank is full - return items to inventory
    inventoryManager.addItems(itemId, removeResult.removed, isIOU);
    ctx.messageService.sendServerInfo(userId, "Your bank is full.");
    sendDepositFailure(ctx, userId, payload);
    return;
  }
  
  // Send RemovedItemFromInventoryAtSlot for each modified inventory slot
  for (const change of removeResult.slotsModified) {
    const remaining = change.newItem ? change.newItem[1] : 0;
    ctx.enqueueUserMessage(userId, GameAction.RemovedItemFromInventoryAtSlot,
      buildRemovedItemFromInventoryAtSlotPayload({
        MenuType: InventoryMenuType.PlayerInventory,
        Slot: change.slot,
        ItemID: itemId,
        Amount: Math.abs(change.amountChanged),
        IsIOU: isIOU === 1,
        RemainingAmountAtSlot: remaining
      })
    );
  }
  
  // Send AddedItemAtInventorySlot for Bank
  ctx.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot,
    buildAddedItemAtInventorySlotPayload({
      MenuType: InventoryMenuType.Bank,
      Slot: depositResult.slot,
      ItemID: itemId,
      Amount: removeResult.removed,
      IsIOU: false, // Bank items are never IOUs
      PreviousAmountAtSlot: depositResult.previousAmount
    })
  );
  
  // Send InvokedInventoryItemAction success
  const successPayload = buildInvokedInventoryItemActionPayload({
    Action: payload.Action,
    MenuType: payload.MenuType,
    Slot: payload.Slot,
    ItemID: itemId,
    Amount: removeResult.removed,
    IsIOU: payload.IsIOU,
    Success: true,
    Data: null
  });
  ctx.enqueueUserMessage(userId, GameAction.InvokedInventoryItemAction, successPayload);
  
  // Mark inventory as dirty for autosave
  playerState.markInventoryDirty();
  
  // Send weight update if item has weight
  ctx.inventoryService.sendWeightUpdate(userId, playerState);
  
  console.log(`[banking] User ${userId} deposited ${removeResult.removed}x ${itemId} ${isIOU ? '(IOU)' : ''} to bank slot ${depositResult.slot}`);
}

/**
 * Sends a deposit failure response
 */
function sendDepositFailure(ctx: ActionContext, userId: number, payload: InvokeInventoryItemActionPayload): void {
  const failurePayload = buildInvokedInventoryItemActionPayload({
    Action: payload.Action,
    MenuType: payload.MenuType,
    Slot: payload.Slot,
    ItemID: payload.ItemID,
    Amount: payload.Amount,
    IsIOU: payload.IsIOU,
    Success: false,
    Data: null
  });
  ctx.enqueueUserMessage(userId, GameAction.InvokedInventoryItemAction, failurePayload);
}
