import { ClientActionTypes, type ClientActionType } from "../../protocol/enums/ClientActionType";
import { States } from "../../protocol/enums/States";
import type { ActionDefinition, ActionContext } from "./types";
import { handleInvokeInventoryItemAction } from "./handleInvokeInventoryItemAction";
import { handlePerformActionOnEntity } from "./handlePerformActionOnEntity";
import { handleMovementPath } from "./handleMovementPath";
import { handleLogout } from "./handleLogout";
import { handleChangePlayerSetting } from "./handleChangePlayerSetting";
import { handlePublicMessage } from "./handlePublicMessage";
import { handleReorganizeInventorySlots } from "./handleReorganizeInventorySlots";
import { handleCastTeleportSpell } from "./handleCastTeleportSpell";
import { handleSelectNPCConversationOption } from "./handleRespondToNPCConversation";
import { handleSwitchToIdleState } from "./handleSwitchToIdleState";
import { handleUseItemOnEntity } from "./handleUseItemOnEntity";
import { handleUseItemOnItem } from "./handleUseItemOnItem";
import { handleCreateItem } from "./handleCreateItem";
import { handleToggleAutoCast } from "./handleToggleAutoCast";
import { handleCastSingleCombatOrStatusSpell } from "./handleCastSingleCombatOrStatusSpell";
import { handleCastInventorySpell } from "./handleCastInventorySpell";
import { handleUpdateTradeStatus } from "./handleUpdateTradeStatus";
import { handleChangeAppearance } from "./handleChangeAppearance";
import { decodeInvokeInventoryItemActionPayload } from "../../protocol/packets/actions/InvokeInventoryItemAction";
import { decodePerformActionOnEntityPayload } from "../../protocol/packets/actions/PerformActionOnEntity";
import { buildInvokedInventoryItemActionPayload } from "../../protocol/packets/actions/InvokedInventoryItemAction";
import { GameAction } from "../../protocol/enums/GameAction";
import { ItemAction } from "../../protocol/enums/ItemAction";
import { Action } from "../../protocol/enums/Actions";
import { EntityType } from "../../protocol/enums/EntityType";
import { checkGroundItemRange } from "./entity-actions/shared";

// Re-export types for convenience
export type { ActionContext, ActionDefinition, ActionHandler } from "./types";

const STUN_ALLOWED_ITEM_ACTIONS = new Set<number>([
  ItemAction.eat,
  ItemAction.drink
]);

// ============================================================================
// Action Registry
// ============================================================================
// Register all client action handlers here. Each action can specify:
// - handler: The function to execute
// - requiresAuth: Whether userId must be set (default: true)
// - description: Short description for documentation

const ACTIONS: Partial<Record<ClientActionType, ActionDefinition>> = {
  [ClientActionTypes.InvokeInventoryItemAction]: {
    handler: handleInvokeInventoryItemAction,
    requiresAuth: false, // Handled by world inventory system
    description: "Invoke an inventory item action (eat, equip, etc.)"
  },

  [ClientActionTypes.PerformActionOnEntity]: {
    handler: handlePerformActionOnEntity,
    requiresAuth: false, // Handled by world entity system
    description: "Perform an action on an entity (attack, pickup, etc.)"
  },

  [ClientActionTypes.SendMovementPath]: {
    handler: handleMovementPath,
    requiresAuth: true,
    description: "Player movement path request"
  },

  [ClientActionTypes.SwitchToIdleState]: {
    handler: handleSwitchToIdleState,
    requiresAuth: true,
    description: "Cancel all activities and switch to idle state"
  },

  [ClientActionTypes.Logout]: {
    handler: handleLogout,
    requiresAuth: true,
    description: "Player logout request"
  },

  [ClientActionTypes.ChangePlayerSetting]: {
    handler: handleChangePlayerSetting,
    requiresAuth: true,
    description: "Change player setting (sprint, auto-retaliate, etc.)"
  },
  
  [ClientActionTypes.ToggleAutoCast]: {
    handler: handleToggleAutoCast,
    requiresAuth: true,
    description: "Select a spell for auto-casting"
  },

  [ClientActionTypes.PublicMessage]: {
    handler: handlePublicMessage,
    requiresAuth: true,
    description: "Send public chat message or command"
  },

  [ClientActionTypes.ReorganizeInventorySlots]: {
    handler: handleReorganizeInventorySlots,
    requiresAuth: true,
    description: "Swap or move inventory slots"
  },

  [ClientActionTypes.CastTeleportSpell]: {
    handler: handleCastTeleportSpell,
    requiresAuth: true,
    description: "Cast a teleport spell"
  },

  [ClientActionTypes.CastInventorySpell]: {
    handler: handleCastInventorySpell,
    requiresAuth: true,
    description: "Cast an inventory spell"
  },

  [ClientActionTypes.CastSingleCombatOrStatusSpell]: {
    handler: handleCastSingleCombatOrStatusSpell,
    requiresAuth: true,
    description: "Cast a single combat or status spell (TODO)"
  },

  [ClientActionTypes.SelectNPCConversationOption]: {
    handler: handleSelectNPCConversationOption,
    requiresAuth: true,
    description: "Select NPC conversation dialogue option"
  },

  [ClientActionTypes.UseItemOnEntity]: {
    handler: handleUseItemOnEntity,
    requiresAuth: true,
    description: "Use an inventory item on an entity"
  },

  [ClientActionTypes.UseItemOnItem]: {
    handler: handleUseItemOnItem,
    requiresAuth: true,
    description: "Use an inventory item on another item"
  },
  [ClientActionTypes.CreateItem]: {
    handler: handleCreateItem,
    requiresAuth: true,
    description: "Create an item from a skilling menu"
  },
  [ClientActionTypes.UpdateTradeStatus]: {
    handler: handleUpdateTradeStatus,
    requiresAuth: true,
    description: "Update current trade status (decline/accept)"
  },
  [ClientActionTypes.ChangeAppearance]: {
    handler: handleChangeAppearance,
    requiresAuth: true,
    description: "Submit requested character appearance"
  }

  // Add more handlers here as they're implemented...
};

// ============================================================================
// Action Dispatcher
// ============================================================================

/**
 * Dispatches a client action to its registered handler.
 * 
 * @param actionType - The type of client action
 * @param ctx - Action context with utilities and system references
 * @param actionData - Raw action data from the client
 * @returns Promise<void> if handler is async, void otherwise
 */
export async function dispatchClientAction(
  actionType: ClientActionType,
  ctx: ActionContext,
  actionData: unknown
): Promise<void> {
  const actionDef = ACTIONS[actionType];
  const playerState = ctx.userId !== null ? ctx.playerStatesByUserId.get(ctx.userId) ?? null : null;

  if (!actionDef) {
    // Action not registered - silently ignore or log for debugging
    console.warn(`[actions] Unhandled client action type: ${actionType}`);
    return;
  }

  // Check authentication requirement
  if (actionDef.requiresAuth !== false && ctx.userId === null) {
    console.warn(`[actions] Action ${actionType} requires authentication but userId is null`);
    return;
  }

  // Block actions while player is dead.
  // While dead, only logout and public chat are allowed.
  if (
    ctx.userId !== null &&
    actionType !== ClientActionTypes.Logout &&
    actionType !== ClientActionTypes.PublicMessage
  ) {
    if (playerState && playerState.currentState === States.PlayerDeadState) {
      // Player is dead - silently ignore the action
      // They will be respawned automatically after the death delay
      return;
    }
  }

  // Block actions while player is stun-locked.
  // We treat either an active blocking delay OR explicit StunnedState as stun lock,
  // since some flows rely on state checks and some rely on delay checks.
  if (ctx.userId !== null && actionType !== ClientActionTypes.Logout) {
    const isStunLocked =
      ctx.delaySystem.hasBlockingDelay(ctx.userId) ||
      playerState?.currentState === States.StunnedState;

    if (isStunLocked) {
      // Always allow chatting while stunned.
      if (actionType === ClientActionTypes.PublicMessage) {
        // continue to normal handler
      } else if (actionType === ClientActionTypes.InvokeInventoryItemAction) {
        try {
          const payload = decodeInvokeInventoryItemActionPayload(actionData);
          const itemAction = Number(payload.Action);

          if (STUN_ALLOWED_ITEM_ACTIONS.has(itemAction)) {
            // Allow safe consumable actions while stunned.
          } else {
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
        } catch {
          // Malformed invoke payload - block while stunned.
          return;
        }
      } else if (actionType === ClientActionTypes.PerformActionOnEntity) {
        try {
          const payload = decodePerformActionOnEntityPayload(actionData);
          const targetAction = Number(payload.TargetAction);
          const entityType = Number(payload.EntityType);
          const entityId = Number(payload.EntityID);

          const isGroundItemGrab = targetAction === Action.Grab && entityType === EntityType.Item;
          if (!isGroundItemGrab || !Number.isInteger(entityId) || !playerState || !ctx.itemManager) {
            return;
          }

          const groundItem = ctx.itemManager.getGroundItem(entityId);
          if (!groundItem || groundItem.mapLevel !== playerState.mapLevel) {
            return;
          }

          // Allow ONLY immediate pickup while stunned; pathfinding-based pickup stays blocked.
          if (!checkGroundItemRange(ctx, playerState, groundItem)) {
            return;
          }
        } catch {
          // Malformed perform-action payload - block while stunned.
          return;
        }
      } else {
        // Player has a blocking delay (e.g., stunned from failed pickpocket)
        // Ignore disallowed actions while stunned.
        return;
      }
    }
  }

  // Interrupt non-blocking delays when player tries to perform a new action.
  // Chat should not cancel active delays; it is not gameplay state/action.
  // Non-blocking delays remain cancellable for normal gameplay actions.
  if (
    ctx.userId !== null &&
    actionType !== ClientActionTypes.Logout &&
    actionType !== ClientActionTypes.PublicMessage
  ) {
    if (ctx.delaySystem.hasActiveDelay(ctx.userId)) {
      // Has a non-blocking delay - interrupt it and proceed with new action
      ctx.delaySystem.interruptDelay(ctx.userId, false); // Don't send interrupt message
    }
  }

  if (ctx.userId !== null) {
    ctx.antiCheatRealtime?.recordAction(ctx.userId, actionType, ctx.currentTick);
  }

  // Execute the handler
  await actionDef.handler(ctx, actionData);
}

/**
 * Get all registered action types (for debugging/documentation)
 */
export function getRegisteredActions(): ClientActionType[] {
  return Object.keys(ACTIONS).map(Number) as ClientActionType[];
}

/**
 * Check if an action type has a registered handler
 */
export function hasHandler(actionType: ClientActionType): boolean {
  return actionType in ACTIONS;
}
