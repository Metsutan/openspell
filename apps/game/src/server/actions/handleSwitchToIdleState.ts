/**
 * Handles the SwitchToIdleState action.
 * Cancels all player activities and transitions to idle state.
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { decodeSwitchToIdleStatePayload } from "../../protocol/packets/actions/SwitchToIdleState";
import type { ActionContext, ActionHandler } from "./types";
import type { EntityRef } from "../events/GameEvents";

/**
 * Handles player request to switch to idle state.
 * This cancels everything:
 * - Movement/pathfinding
 * - Shopping
 * - Conversations
 * - Combat
 * - Skilling
 * - etc.
 * 
 * The state machine's exitState handlers take care of all the cleanup.
 */
export const handleSwitchToIdleState: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) {
    console.warn("[handleSwitchToIdleState] No userId - action ignored");
    return;
  }

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) {
    console.warn(`[handleSwitchToIdleState] No player state for user ${ctx.userId}`);
    return;
  }

  // Decode payload (contains a Switch field, though we don't need it)
  const payload = decodeSwitchToIdleStatePayload(actionData);
  
  //console.log(`[handleSwitchToIdleState] Player ${ctx.userId} switching to idle state (from ${States[playerState.currentState]})`);

  // Clear any pending actions (NPC interactions, seamless pathfinding)
  if (playerState.pendingAction) {
    playerState.pendingAction = null;
  }

  // Clear targeting
  ctx.targetingService.clearPlayerTarget(ctx.userId);

  // Use state machine to transition to idle
  // This will properly handle all cleanup through exitState handlers:
  // - Cancel movement
  // - Close shops
  // - End conversations
  // - Stop skilling
  // - etc.
  const entityRef: EntityRef = {
    type: EntityType.Player,
    id: ctx.userId
  };

  ctx.stateMachine.setState(entityRef, States.IdleState);
};
