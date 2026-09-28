/**
 * Main entry point for entity action handling.
 * Routes actions to appropriate entity-specific handlers (items, NPCs, environment).
 * 
 * This file is now a thin router - complex logic is in entity-actions/ modules.
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { decodePerformActionOnEntityPayload } from "../../protocol/packets/actions/PerformActionOnEntity";
import type { ActionContext, ActionHandler } from "./types";
import type { PlayerState } from "../../world/PlayerState";
import { handleGroundItemAction, handleGroundItemMovementComplete } from "./entity-actions/groundItemActions";
import { handleNPCAction, handleNPCMovementComplete } from "./entity-actions/npcActions";
import { handlePlayerAction, handlePlayerMovementComplete } from "./entity-actions";
import { handleEnvironmentAction } from "./entity-actions/environmentActions";

/**
 * Main handler for performing actions on entities.
 * Routes to appropriate entity type handler.
 */
export const handlePerformActionOnEntity: ActionHandler = (ctx, actionData) => {
  const payload = decodePerformActionOnEntityPayload(actionData);

  // Validate user is authenticated
  if (!ctx.userId) {
    console.warn("[handlePerformActionOnEntity] No userId - action ignored");
    return;
  }

  // Get player state
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) {
    console.warn(`[handlePerformActionOnEntity] No player state for user ${ctx.userId}`);
    return;
  }

  // Ignore entity interactions while player is traversing an obstacle
  if (playerState.currentState === States.ManeuveringObstacleState) {
    return;
  }

  const action = payload.TargetAction;
  const entityType = payload.EntityType;
  const entityId = payload.EntityID;

  // Validate inputs
  if (typeof action !== "number" || typeof entityType !== "number" || typeof entityId !== "number") {
    console.warn("[handlePerformActionOnEntity] Invalid payload:", payload);
    return;
  }

  // Route to appropriate entity handler
  switch (entityType) {
    case EntityType.Item:
      handleGroundItemAction(ctx, playerState, action, entityId, onMovementComplete);
      break;

    case EntityType.NPC:
      handleNPCAction(ctx, playerState, action, entityId, onMovementComplete);
      break;

    case EntityType.Environment:
      // Environment actions use tick-based processing (no callback needed)
      handleEnvironmentAction(ctx, playerState, action, entityId);
      break;

    case EntityType.Player:
      handlePlayerAction(ctx, playerState, action, entityId, onMovementComplete);
      break;

    default:
      console.warn(`[handlePerformActionOnEntity] Unknown entity type: ${entityType}`);
  }
};

/**
 * Called when player completes pathfinding movement.
 * Re-executes the pending action if player is now in range.
 * @deprecated
 * NOTE: Environment actions no longer use this callback - they use
 * processPendingEnvironmentActions in the game tick loop instead.
 */
function onMovementComplete(ctx: ActionContext, playerState: PlayerState): void {
  const pending = playerState.pendingAction;
  if (!pending) {
    return;
  }

  // Clear pending action (handlers will set it back if needed)
  playerState.pendingAction = null;

  // Route to appropriate entity type handler
  switch (pending.entityType) {
    case EntityType.Item:
      handleGroundItemMovementComplete(ctx, playerState, pending.entityId);
      break;

    case EntityType.NPC:
      handleNPCMovementComplete(ctx, playerState, pending.entityId, pending.action);
      break;

    case EntityType.Player:
      handlePlayerMovementComplete(ctx, playerState, pending.entityId, pending.action);
      break;

    // Environment actions handled by tick processor, not callback
    case EntityType.Environment:
      // Restore pending action - tick processor will handle it
      playerState.pendingAction = pending;
      break;

    default:
      console.warn(`[onMovementComplete] Unhandled entity type: ${pending.entityType}`);
  }
}
