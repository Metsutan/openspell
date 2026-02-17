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

// Re-export types for convenience
export type { ActionContext, ActionDefinition, ActionHandler } from "./types";

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

  // Block all actions while player is dead (except logout which is always allowed)
  if (ctx.userId !== null && actionType !== ClientActionTypes.Logout) {
    const playerState = ctx.playerStatesByUserId.get(ctx.userId);
    if (playerState && playerState.currentState === States.PlayerDeadState) {
      // Player is dead - silently ignore the action
      // They will be respawned automatically after the death delay
      return;
    }
  }

  // Block all actions while player has a blocking delay (stunned, channeling, etc.)
  // Blocking delays prevent ALL actions except logout
  if (ctx.userId !== null && actionType !== ClientActionTypes.Logout) {
    if (ctx.delaySystem.hasBlockingDelay(ctx.userId)) {
      // Player has a blocking delay (e.g., stunned from failed pickpocket)
      // Silently ignore the action - the delay start message already informed them
      return;
    }
  }

  // Interrupt non-blocking delays when player tries to perform a new action
  // Non-blocking delays are cancellable (e.g., pickpocket windup, skilling delays)
  if (ctx.userId !== null && actionType !== ClientActionTypes.Logout) {
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
