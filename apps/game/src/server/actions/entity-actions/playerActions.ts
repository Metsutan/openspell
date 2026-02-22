/**
 * Player action handlers.
 * Handles Attack, Follow, TradeWith, and Moderate actions for players.
 */

import { Action } from "../../../protocol/enums/Actions";
import { EntityType } from "../../../protocol/enums/EntityType";
import { PlayerSetting } from "../../../protocol/enums/PlayerSetting";
import { States } from "../../../protocol/enums/States";
import type { ActionContext } from "../types";
import type { PlayerState } from "../../../world/PlayerState";
import type { EntityRef } from "../../events/GameEvents";
import { buildMovementPathAdjacent, buildMovementPathWithinRange } from "../utils/pathfinding";
import { getPlayerAttackRange, getPlayerCombatMode, isWithinRange } from "../utils/combatMode";
import { WildernessService } from "../../services/WildernessService";

/**
 * Main router for player actions.
 */
export function handlePlayerAction(
  ctx: ActionContext,
  playerState: PlayerState,
  action: Action,
  targetUserId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  switch (action) {
    case Action.Attack:
      handleAttackPlayer(ctx, playerState, targetUserId, onMovementComplete);
      break;
    case Action.Follow:
      handleFollowPlayer(ctx, playerState, targetUserId, onMovementComplete);
      break;
    case Action.TradeWith:
      handleTradeWithPlayer(ctx, playerState, targetUserId, onMovementComplete);
      break;
    case Action.Moderate:
      handleModeratePlayer(ctx, playerState, targetUserId, onMovementComplete);
      break;
    default:
      console.warn(`[handlePlayerAction] Unhandled action: ${action}`);
      break;
  }
}

/**
 * Generic helper to handle player interactions with pathfinding.
 * Reduces duplication across different player action handlers.
 */
function handlePlayerInteraction(
  ctx: ActionContext,
  playerState: PlayerState,
  targetUserId: number,
  action: Action,
  actionName: string,
  executeFunction: (ctx: ActionContext, playerState: PlayerState, targetPlayer: PlayerState) => void,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: playerState.userId,
      packetName: "PlayerAction",
      reason,
      details
    });
  };

  if (targetUserId === playerState.userId) {
    logInvalid("self_target", { action, targetUserId });
    return;
  }

  const targetPlayer = ctx.playerStatesByUserId.get(targetUserId);
  if (!targetPlayer) {
    logInvalid("target_missing", { action, targetUserId });
    return;
  }

  if (targetPlayer.mapLevel !== playerState.mapLevel) {
    logInvalid("target_wrong_map", { action, targetUserId, mapLevel: targetPlayer.mapLevel });
    return;
  }

  const isAdjacent = checkAdjacentToPlayer(ctx, playerState, targetPlayer);

  if (isAdjacent) {
    executeFunction(ctx, playerState, targetPlayer);
  } else {
    ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Player, id: targetUserId });

    playerState.pendingAction = {
      action,
      entityType: EntityType.Player,
      entityId: targetUserId,
      retryCount: 0,
      lastKnownX: targetPlayer.x,
      lastKnownY: targetPlayer.y
    };

    const INITIAL_PATHFIND_RADIUS = 128;
    const path = buildMovementPathAdjacent(
      ctx,
      playerState.x,
      playerState.y,
      targetPlayer.x,
      targetPlayer.y,
      playerState.mapLevel,
      true,
      INITIAL_PATHFIND_RADIUS
    );

    if (!path || path.length <= 1) {
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
      playerState.pendingAction = null;
      ctx.targetingService.clearPlayerTarget(playerState.userId);
      return;
    }

    const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;

    const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
    ctx.pathfindingSystem.scheduleMovementPlan(
      entityRef,
      playerState.mapLevel,
      path,
      speed,
      () => onMovementComplete(ctx, playerState)
    );
  }
}

// =============================================================================
// Individual Player Action Handlers
// =============================================================================

function handleAttackPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetUserId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  const targetPlayer = ctx.playerStatesByUserId.get(targetUserId);
  if (!targetPlayer) {
    return;
  }

  if (targetPlayer.mapLevel !== playerState.mapLevel) {
    return;
  }

  const combatMode = getPlayerCombatMode(playerState);
  const attackRange = getPlayerAttackRange(playerState, ctx.spellCatalog);

  const hasLOS = ctx.losSystem
    ? ctx.losSystem.checkLOS(playerState.x, playerState.y, targetPlayer.x, targetPlayer.y, playerState.mapLevel).hasLOS
    : true;
  const inRange = combatMode === "melee"
    ? canStartMeleeAttackOnPlayer(ctx, playerState, targetPlayer)
    : isWithinRange(playerState.x, playerState.y, targetPlayer.x, targetPlayer.y, attackRange) && hasLOS;

  if (inRange) {
    executeAttackPlayer(ctx, playerState, targetPlayer);
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Player, id: targetUserId });
  playerState.pendingAction = {
    action: Action.Attack,
    entityType: EntityType.Player,
    entityId: targetUserId,
    retryCount: 0,
    lastKnownX: targetPlayer.x,
    lastKnownY: targetPlayer.y
  };

  const INITIAL_PATHFIND_RADIUS = 128;
  const path = combatMode === "melee"
    ? buildMovementPathAdjacent(
        ctx,
        playerState.x,
        playerState.y,
        targetPlayer.x,
        targetPlayer.y,
        playerState.mapLevel,
        true,
        INITIAL_PATHFIND_RADIUS
      )
    : buildMovementPathWithinRange(
        ctx,
        playerState.x,
        playerState.y,
        targetPlayer.x,
        targetPlayer.y,
        playerState.mapLevel,
        attackRange,
        INITIAL_PATHFIND_RADIUS,
        true
      );

  if (!path || path.length <= 1) {
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
  ctx.pathfindingSystem.scheduleMovementPlan(
    entityRef,
    playerState.mapLevel,
    path,
    speed,
    () => onMovementComplete(ctx, playerState)
  );

}

function handleFollowPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetUserId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  handlePlayerInteraction(
    ctx,
    playerState,
    targetUserId,
    Action.Follow,
    "handleFollowPlayer",
    executeFollowPlayer,
    onMovementComplete
  );
}

function handleTradeWithPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetUserId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  handlePlayerInteraction(
    ctx,
    playerState,
    targetUserId,
    Action.TradeWith,
    "handleTradeWithPlayer",
    executeTradeWithPlayer,
    onMovementComplete
  );
}

function handleModeratePlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetUserId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  handlePlayerInteraction(
    ctx,
    playerState,
    targetUserId,
    Action.Moderate,
    "handleModeratePlayer",
    executeModeratePlayer,
    onMovementComplete
  );
}

// =============================================================================
// Execute Functions (called when player is adjacent)
// =============================================================================

function executeAttackPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetPlayer: PlayerState
): void {

  const targetState = ctx.stateMachine.getCurrentState({ type: EntityType.Player, id: targetPlayer.userId });
  if (targetState === States.PlayerDeadState) {
    ctx.messageService.sendServerInfo(playerState.userId, "They're no longer there");
    playerState.pendingAction = null;
    return;
  }

  if (
    !WildernessService.isInWilderness(playerState.x, playerState.y, playerState.mapLevel) ||
    !WildernessService.isInWilderness(targetPlayer.x, targetPlayer.y, targetPlayer.mapLevel)
  ) {
    ctx.packetAudit?.logInvalidPacket({
      userId: playerState.userId,
      packetName: "PlayerAttack",
      reason: "attack_outside_wilderness",
      details: { targetUserId: targetPlayer.userId }
    });
    ctx.messageService.sendServerInfo(playerState.userId, "You can only attack players in the wilderness.");
    playerState.pendingAction = null;
    return;
  }

  const wildernessLevel = WildernessService.getWildernessLevel(
    playerState.x,
    playerState.y,
    playerState.mapLevel
  );

  if (!WildernessService.canAttackByCombatLevel(playerState.combatLevel, targetPlayer.combatLevel, wildernessLevel)) {
    ctx.messageService.sendServerInfo(playerState.userId, "Their combat level is too different.");
    playerState.pendingAction = null;
    return;
  }

  const combatMode = getPlayerCombatMode(playerState);
  if (combatMode === "melee" && !canStartMeleeAttackOnPlayer(ctx, playerState, targetPlayer)) {
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Player, id: targetPlayer.userId });
  const nextState = combatMode === "magic"
    ? States.MagicCombatState
    : combatMode === "range"
      ? States.RangeCombatState
      : States.MeleeCombatState;
  ctx.stateMachine.setState({ type: EntityType.Player, id: playerState.userId }, nextState);
  playerState.pendingAction = null;
}

function executeFollowPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetPlayer: PlayerState
): void {

  // Keep follow intent active; FollowSystem executes movement in the same tick
  // after normal player movement has finished.
  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Player, id: targetPlayer.userId });
  playerState.pendingAction = {
    action: Action.Follow,
    entityType: EntityType.Player,
    entityId: targetPlayer.userId,
    retryCount: 0,
    lastKnownX: targetPlayer.x,
    lastKnownY: targetPlayer.y
  };
}

function executeTradeWithPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetPlayer: PlayerState
): void {

  ctx.tradingService.requestTrade(playerState.userId, targetPlayer.userId);
  playerState.pendingAction = null;
}

function executeModeratePlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetPlayer: PlayerState
): void {

  // TODO: Implement moderate logic
  playerState.pendingAction = null;
}

// =============================================================================
// Movement Completion Handler
// =============================================================================

export function handlePlayerMovementComplete(
  ctx: ActionContext,
  playerState: PlayerState,
  targetUserId: number,
  action: Action
): void {
  const targetPlayer = ctx.playerStatesByUserId.get(targetUserId);
  if (!targetPlayer) {
    ctx.messageService.sendServerInfo(playerState.userId, "They're no longer there");
    playerState.pendingAction = null;
    return;
  }

  if (targetPlayer.mapLevel !== playerState.mapLevel) {
    ctx.messageService.sendServerInfo(playerState.userId, "They're no longer there");
    playerState.pendingAction = null;
    return;
  }

  const attackInRange = (() => {
    const combatMode = getPlayerCombatMode(playerState);
    const attackRange = getPlayerAttackRange(playerState, ctx.spellCatalog);
    const hasLOS = ctx.losSystem
      ? ctx.losSystem.checkLOS(playerState.x, playerState.y, targetPlayer.x, targetPlayer.y, playerState.mapLevel).hasLOS
      : true;
    return combatMode === "melee"
      ? canStartMeleeAttackOnPlayer(ctx, playerState, targetPlayer)
      : isWithinRange(playerState.x, playerState.y, targetPlayer.x, targetPlayer.y, attackRange) && hasLOS;
  })();
  const isAdjacentForInteraction = checkAdjacentToPlayer(ctx, playerState, targetPlayer);
  const requiresRange = action !== Action.Follow && action !== Action.TradeWith && action !== Action.Attack;

  if (requiresRange && !attackInRange) {
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them");
    playerState.pendingAction = null;
    return;
  }

  if (action === Action.TradeWith && !isAdjacentForInteraction) {
    // Target moved while we were pathing to their old location.
    // Keep trade intent active so FollowSystem can switch to cheap greedy pursuit.
    ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Player, id: targetPlayer.userId });
    playerState.pendingAction = {
      action: Action.TradeWith,
      entityType: EntityType.Player,
      entityId: targetPlayer.userId,
      retryCount: 0,
      lastKnownX: targetPlayer.x,
      lastKnownY: targetPlayer.y
    };
    return;
  }

  if (action === Action.Attack && !attackInRange) {
    // Target moved while we were pathing to their old location.
    // Keep attack intent active so FollowSystem can continue hybrid pursuit.
    ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Player, id: targetPlayer.userId });
    playerState.pendingAction = {
      action: Action.Attack,
      entityType: EntityType.Player,
      entityId: targetPlayer.userId,
      retryCount: 0,
      lastKnownX: targetPlayer.x,
      lastKnownY: targetPlayer.y
    };
    return;
  }

  switch (action) {
    case Action.Attack:
      executeAttackPlayer(ctx, playerState, targetPlayer);
      break;
    case Action.Follow:
      executeFollowPlayer(ctx, playerState, targetPlayer);
      break;
    case Action.TradeWith:
      executeTradeWithPlayer(ctx, playerState, targetPlayer);
      break;
    case Action.Moderate:
      executeModeratePlayer(ctx, playerState, targetPlayer);
      break;
    default:
      console.warn(`[handlePlayerMovementComplete] Unhandled player action: ${action}`);
      playerState.pendingAction = null;
  }
}

function canStartMeleeAttackOnPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetPlayer: PlayerState
): boolean {
  if (!ctx.losSystem) {
    const dx = Math.abs(playerState.x - targetPlayer.x);
    const dy = Math.abs(playerState.y - targetPlayer.y);
    return dx <= 1 && dy <= 1 && (dx + dy > 0);
  }

  const isAdjacent = ctx.losSystem.isAdjacentTo(
    playerState.x,
    playerState.y,
    targetPlayer.x,
    targetPlayer.y
  );
  if (!isAdjacent) {
    return false;
  }

  return !ctx.losSystem.isMeleeBlocked(
    playerState.x,
    playerState.y,
    targetPlayer.x,
    targetPlayer.y,
    playerState.mapLevel
  );
}

// =============================================================================
// Shared Helpers
// =============================================================================

function checkAdjacentToPlayer(
  ctx: ActionContext,
  playerState: PlayerState,
  targetPlayer: PlayerState
): boolean {
  if (!ctx.losSystem) {
    const dx = Math.abs(playerState.x - targetPlayer.x);
    const dy = Math.abs(playerState.y - targetPlayer.y);
    return dx <= 1 && dy <= 1 && (dx + dy > 0);
  }

  const isAdjacent = ctx.losSystem.isAdjacentTo(
    playerState.x,
    playerState.y,
    targetPlayer.x,
    targetPlayer.y
  );

  if (!isAdjacent) {
    return false;
  }

  const losResult = ctx.losSystem.checkLOS(
    playerState.x,
    playerState.y,
    targetPlayer.x,
    targetPlayer.y,
    playerState.mapLevel
  );

  return losResult.hasLOS;
}
