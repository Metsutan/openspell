import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { States } from "../../protocol/enums/States";
import { buildPathfindingFailedPayload } from "../../protocol/packets/actions/PathfindingFailed";
import { decodeSendMovementPathPayload } from "../../protocol/packets/actions/SendMovementPath";
import { MapLevel } from "../../world/Location";
import type { EntityRef } from "../events/GameEvents";
import type { ActionHandler } from "./types";
import { buildMovementPath } from "./utils";

/**
 * Handles player movement path requests.
 * Validates the path, performs pathfinding, and schedules movement.
 * If player is in conversation, ends the conversation first.
 * 
 * **Important**: This cancels any pending NPC interactions (seamless pathfinding).
 * When a player manually clicks to move, it breaks them out of NPC tracking.
 */
export const handleMovementPath: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;
  
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const move = decodeSendMovementPathPayload(actionData);
  if (!move) return;

  const targetX = move.X;
  const targetY = move.Y;

  const entityRef: EntityRef = { type: EntityType.Player, id: ctx.userId };
  
  // Cancel any pending NPC interactions (seamless pathfinding)
  // This allows players to break out of NPC tracking by clicking elsewhere
  if (playerState.pendingAction) {
    playerState.pendingAction = null;
  }
  if (ctx.targetingService.getPlayerTarget(ctx.userId)) {
    ctx.targetingService.clearPlayerTarget(ctx.userId); 
  }
  
  // If clicking on current position, cancel current action by transitioning to IdleState
  // This is how players "cancel" woodcutting, combat, etc. in MMOs
  if (targetX === playerState.x && targetY === playerState.y) {
    ctx.pathfindingSystem.cancelMovementPlan(entityRef);
    
    // Transition to IdleState (StateMachine will handle exiting current state)
    ctx.stateMachine.setState(entityRef, States.IdleState);
    return;
  }

  // Build movement path using pathfinding
  // Note: State machine will automatically handle exiting ConversationState
  // when scheduleMovementPlan transitions to MovingState
  const path = buildMovementPath(
    ctx,
    playerState.x,
    playerState.y,
    targetX as number,
    targetY as number,
    playerState.mapLevel as MapLevel
  );
  
  if (!path || path.length <= 1) {
    ctx.pathfindingSystem.cancelMovementPlan(entityRef);
    ctx.enqueueUserMessage(
      playerState.userId,
      GameAction.PathfindingFailed,
      buildPathfindingFailedPayload({ EntityID: -1 })
    );
    return;
  }

  // Calculate player movement speed (sprinting = 2, walking = 1)
  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;

  // Moving away from a skilling station should close any open skilling menu.
  ctx.skillingMenuService.closeMenu(ctx.userId, false);
  
  // Schedule movement plan via PathfindingSystem
  ctx.pathfindingSystem.scheduleMovementPlan(entityRef, playerState.mapLevel, path, speed);
};
