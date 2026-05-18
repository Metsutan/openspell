import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { States } from "../../protocol/enums/States";
import { buildPathfindingFailedPayload } from "../../protocol/packets/actions/PathfindingFailed";
import { decodeSendMovementPathPayload } from "../../protocol/packets/actions/SendMovementPath";
import { MapLevel } from "../../world/Location";
import { PlayerType } from "../../protocol/enums/PlayerType";
import { buildEntityPerformedPhysicalActionPayload } from "../../protocol/packets/actions/EntityPerformedPhysicalAction";
import { DelayType } from "../systems/DelaySystem";
import type { EntityRef } from "../events/GameEvents";
import type { ActionHandler } from "./types";
import { buildMovementPath } from "./utils";
import { Point } from "../../world/pathfinding";

function buildStraightLinePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Point[] {
  const path: Point[] = [new Point(startX, startY)];
  let currentX = startX;
  let currentY = startY;
  const stepX = Math.sign(endX - startX);
  const stepY = Math.sign(endY - startY);
  const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));

  for (let i = 0; i < steps; i += 1) {
    if (currentX !== endX) {
      currentX += stepX;
    }
    if (currentY !== endY) {
      currentY += stepY;
    }
    path.push(new Point(currentX, currentY));
  }

  return path;
}

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

  const targetX = move.X as number;
  const targetY = move.Y as number;

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

  // Handle Admin Leap Mode
  if (playerState.leapMode && playerState.playerType === PlayerType.Admin) {
    ctx.pathfindingSystem.cancelMovementPlan(entityRef);

    const path = buildStraightLinePath(playerState.x, playerState.y, targetX, targetY);
    const travelTicks = path.length - 1;
    if (travelTicks <= 0) return;

    const delayTicks = 1;

    // Start a blocking delay
    ctx.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.Blocking,
      ticks: travelTicks + delayTicks
    });

    // Send jump packet
    const jumpPayload = buildEntityPerformedPhysicalActionPayload({
      EntityID: playerState.userId,
      EntityType: EntityType.Player,
      Action: 0, // Jump
      ActionTickLength: travelTicks,
      ActionValue: travelTicks === 1 ? 1 : 2, // Apex height
      DelayTicks: delayTicks
    });

    // Broadcast jump packet to all who can see the START position
    const viewers = ctx.spatialIndex.getPlayersViewingPosition(playerState.mapLevel, playerState.x, playerState.y);
    for (const viewer of viewers) {
      ctx.enqueueUserMessage(viewer.id, GameAction.EntityPerformedPhysicalAction, jumpPayload);
    }

    // Move player via movement plan instead of teleport
    // This allows the client to animate the transition while the jump packet plays
    ctx.pathfindingSystem.scheduleMovementPlan(
      entityRef,
      playerState.mapLevel,
      path,
      1, // Speed 1
      undefined,
      { lockSpeed: true }
    );

    return;
  }

  // Build movement path using pathfinding
  // Note: State machine will automatically handle exiting ConversationState
  // when scheduleMovementPlan transitions to MovingState
  const path = buildMovementPath(
    ctx,
    playerState.x,
    playerState.y,
    targetX,
    targetY,
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
