/**
 * Environment (world entity) action handlers.
 * 
 * SIMPLIFIED ARCHITECTURE:
 * 1. handleEnvironmentAction - Entry point: validates action, sets pendingAction, starts pathfinding
 * 2. processPendingEnvironmentActions - Called each tick: handles ALL state (moving, waiting, executing)
 * 3. executeEnvironmentAction - Actual execution: checks override, runs action
 * 
 * Flow:
 * - Player clicks entity → handleEnvironmentAction sets pendingAction
 * - Each tick → processPendingEnvironmentActions checks state and progresses
 * - When ready (in position + wait complete) → executeEnvironmentAction runs
 */

import { Action } from "../../../protocol/enums/Actions";
import { EntityType } from "../../../protocol/enums/EntityType";
import { GameAction } from "../../../protocol/enums/GameAction";
import { States } from "../../../protocol/enums/States";
import { PlayerSetting } from "../../../protocol/enums/PlayerSetting";
import { MenuType } from "../../../protocol/enums/MenuType";
import { MessageStyle } from "../../../protocol/enums/MessageStyle";
import type { ActionContext } from "../types";
import type { PlayerState } from "../../../world/PlayerState";
import type { WorldEntityState } from "../../state/EntityState";
import type { EntityRef } from "../../events/GameEvents";
import { createPlayerWentThroughDoorEvent } from "../../events/GameEvents";
import { buildMovementPath, buildMovementPathAdjacent } from "../utils/pathfinding";
import { checkAdjacentToEnvironment, checkAdjacentToDirectionalBlockingEntity } from "./shared";
import type { WorldEntityActionLocation } from "../../services/WorldEntityActionService";
import type { MapLevel } from "../../../world/Location";
import type { RequirementCheckContext } from "../../services/RequirementsChecker";
import { SKILLS, isSkillSlug } from "../../../world/PlayerState";
import { DelayType } from "../../systems/DelaySystem";
import { buildPathfindingFailedPayload } from "../../../protocol/packets/actions/PathfindingFailed";
import { buildShowLootMenuPayload } from "../../../protocol/packets/actions/ShowLootMenu";
import type { WorldEntityAction } from "../../services/WorldEntityActionService";

// =============================================================================
// Constants
// =============================================================================

/**
 * Maps Action enum values to their string names used in worldentityactions.4.carbon
 */
const ACTION_TO_STRING: Partial<Record<Action, string>> = {
  [Action.Open]: "open",
  [Action.Close]: "close",
  [Action.Fish]: "fish",
  [Action.Mine]: "mine",
  [Action.Chop]: "chop",
  [Action.Shake]: "shake",
  [Action.Comb]: "comb",
  [Action.Climb]: "climb",
  [Action.ClimbSameMapLevel]: "climb_same_map_level",
  [Action.Enter]: "enter",
  [Action.Exit]: "exit",
  [Action.Harvest]: "harvest",
  [Action.Smelt]: "smelt",
  [Action.Smith]: "smith",
  [Action.Search]: "search",
  [Action.Picklock]: "picklock",
  [Action.Unlock]: "unlock",
  [Action.Brew]: "brew",
  [Action.MineThrough]: "mine_through",
  [Action.GoThrough]: "go_through",
  [Action.SleepIn]: "sleep_in",
  [Action.Touch]: "touch",
  [Action.CraftAt]: "craft_at",
  [Action.WalkAcross]: "walk_across",
  [Action.SwingOn]: "swing_on",
  [Action.JumpOver]: "jump_over",
  [Action.ClimbOver]: "climb_over",
  [Action.SqueezeThrough]: "squeeze_through",
  [Action.JumpTo]: "jump_to",
  [Action.JumpIn]: "jump_in",
  [Action.JumpOn]: "jump_on",
  [Action.LeapFrom]: "leap_from",
  [Action.WalkAlong]: "walk_along",
  [Action.BankAt]: "bank_at",
  [Action.Craft]: "craft",
  [Action.WalkHere]: "walk_here",
};

/** Door-like entity types that use directional blocking */
const DOOR_LIKE_TYPES = new Set(["door", "opendoor", "gate"]);
const SEARCH_DELAY_TICKS = 4;
const PICKLOCK_DELAY_TICKS = 4;

function isDoorLikeEntity(entityState: WorldEntityState): boolean {
  return DOOR_LIKE_TYPES.has(entityState.type);
}

/**
 * Determines if an action requires a 1-tick wait before executing.
 * This ensures the player visibly stops before teleporting/transitioning.
 * 
 * Actions that require wait:
 * - Door interactions (GoThroughDoor)
 * - Teleport actions (TeleportTo) - cave entrances, ladders, etc.
 * - Mining through rocks (MineThroughRocks)
 * - Climbing ladders (ClimbSameMapLevel)
 */
function requiresWaitTick(
  ctx: ActionContext,
  entityState: WorldEntityState,
  actionName: string
): boolean {
  // Doors always require wait
  if (isDoorLikeEntity(entityState)) {
    return true;
  }
  
  // Check if this entity has an override with TeleportTo, GoThroughDoor, MineThroughRocks, or ClimbSameMapLevel
  const hasOverride = ctx.worldEntityActionService.hasAction(entityState.id, actionName);
  if (hasOverride) {
    const config = ctx.worldEntityActionService.getActionConfig(entityState.id, actionName);
    if (config) {
      for (const eventAction of config.playerEventActions) {
        if (
          eventAction.type === "TeleportTo" || 
          eventAction.type === "GoThroughDoor" || 
          eventAction.type === "MineThroughRocks" ||
          eventAction.type === "ClimbSameMapLevel"
        ) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// =============================================================================
// Entry Point
// =============================================================================

/**
 * Main entry point for environment actions.
 * Validates the action and sets up pendingAction for tick-based processing.
 * 
 * This function DOES NOT execute the action - it only sets up the state.
 * The actual execution happens in processPendingEnvironmentActions.
 */
export function handleEnvironmentAction(
  ctx: ActionContext,
  playerState: PlayerState,
  action: Action,
  environmentId: number
): void {
  const entityState = ctx.worldEntityStates.get(environmentId);
  if (!entityState) {
    ctx.messageService.sendServerInfo(playerState.userId, "That doesn't exist anymore");
    return;
  }

  if (entityState.mapLevel !== playerState.mapLevel) {
    return;
  }

  const actionName = ACTION_TO_STRING[action];
  if (!actionName) {
    console.warn(`[handleEnvironmentAction] Unknown action: ${action}`);
    return;
  }

  // Validate action is supported
  const supportedActions = entityState.definition.actions || [];
  const hasOverride = ctx.worldEntityActionService.hasAction(entityState.id, actionName);
  
  if (!supportedActions.includes(actionName) && !hasOverride) {
    ctx.messageService.sendServerInfo(playerState.userId, "Supported action but lacks override. Please contact an administrator.");
    ctx.messageService.sendServerInfo(playerState.userId, "Environment ID: " + entityState.id + " Action: " + actionName);
    ctx.enqueueUserMessage(
      playerState.userId,
      GameAction.PathfindingFailed,
      buildPathfindingFailedPayload({ EntityID: -1 })
    );
    //console.warn(`[handleEnvironmentAction] Supported action but lacks override. Please contact an administrator. Environment ID: ${entityState.id}`);
    return;
  }

  // Set up pending action - tick processor handles the rest
  playerState.pendingAction = {
    action,
    entityType: EntityType.Environment,
    entityId: entityState.id,
    // waitTicks: undefined means "not in position yet"
  };

  // Check if already in valid position
  const isDoor = isDoorLikeEntity(entityState);
  const isInPosition = checkPosition(ctx, playerState, entityState, isDoor, actionName);

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Environment, id: entityState.id });
  if (isInPosition) {
    // Already in position - set initial wait ticks
    // Teleports and doors wait 1 tick, others execute immediately
    const needsWait = requiresWaitTick(ctx, entityState, actionName);
    playerState.pendingAction.waitTicks = needsWait ? 1 : 0;
  } else {
    // Need to pathfind - start it
    startPathfinding(ctx, playerState, entityState, isDoor, actionName);
  }
}

// =============================================================================
// Tick Processor - THE SINGLE PLACE that handles all state transitions
// =============================================================================

/**
 * Process pending environment actions for all players.
 * Called once per tick from GameServer.
 * 
 * This is THE ONLY PLACE that:
 * - Checks if player finished pathfinding
 * - Checks if player is in valid position
 * - Handles wait tick countdown
 * - Executes the action
 */
export function processPendingEnvironmentActions(ctx: ActionContext): void {
  for (const playerState of ctx.playerStatesByUserId.values()) {
    if (playerState.currentState === States.PlayerDeadState) {
      playerState.pendingAction = null;
      continue;
    }

    const pending = playerState.pendingAction;
    if (!pending || pending.entityType !== EntityType.Environment) {
      continue;
    }

    const entityState = ctx.worldEntityStates.get(pending.entityId);
    if (!entityState) {
      // Entity gone
      playerState.pendingAction = null;
      continue;
    }

    const isDoor = isDoorLikeEntity(entityState);

    // If waitTicks is undefined, player hasn't reached position yet
    if (pending.waitTicks === undefined) {
      // Check if still moving
      const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
      const isMoving = ctx.pathfindingSystem.hasMovementPlan(entityRef);
      
      if (isMoving) {
        // Still pathfinding, wait for next tick
        continue;
      }

      // Movement finished - check if in valid position
      const actionName = ACTION_TO_STRING[pending.action];
      const isInPosition = checkPosition(ctx, playerState, entityState, isDoor, actionName);
      
      if (!isInPosition) {
        // Not in position and not moving - failed to reach
        ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that");
        playerState.pendingAction = null;
        continue;
      }

      // Just arrived at position - set wait ticks
      // Teleports and doors wait 1 tick for clean stop, others execute immediately
      const needsWait = actionName ? requiresWaitTick(ctx, entityState, actionName) : false;
      pending.waitTicks = needsWait ? 1 : 0;
      continue; // Process on next tick
    }

    // Has waitTicks set - count down
    if (pending.waitTicks > 0) {
      pending.waitTicks--;
      continue;
    }

    // waitTicks === 0, ready to execute
    const actionName = ACTION_TO_STRING[pending.action];
    if (!actionName) {
      playerState.pendingAction = null;
      continue;
    }

    // Final position check before execution
    const isInPosition = checkPosition(ctx, playerState, entityState, isDoor, actionName);
    if (!isInPosition) {
      ctx.messageService.sendServerInfo(playerState.userId, "You moved away");
      playerState.pendingAction = null;
      continue;
    }

    ctx.targetingService.clearPlayerTarget(playerState.userId);

    const hasOverride = ctx.worldEntityActionService.hasAction(entityState.id, actionName);
    executeEnvironmentAction(ctx, playerState, entityState, pending.action, actionName, hasOverride);
    playerState.pendingAction = null;
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Single position check function - THE ONLY adjacency check in this file.
 * 
 * Logic:
 * - Doors: Use directional blocking check (cardinal only, based on blocked directions)
 * - Small entities (1x1): Cardinal only (diagonal feels wrong for ladders, etc.)
 * - Large entities (2x2+): Allow diagonals (caves, large objects)
 */
function checkPosition(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  isDoor: boolean,
  actionName?: string
): boolean {
  // Doors use special directional blocking logic
  if (isDoor) {
    return checkAdjacentToDirectionalBlockingEntity(ctx, playerState, entityState);
  }
  
  // Small entities (1x1): Cardinal adjacency only
  // Large entities (2x2+): Allow diagonal adjacency
  const isSmallEntity = entityState.width <= 1 && entityState.length <= 1;
  const allowDiagonal = !isSmallEntity;
  
  const isAdjacentToEntity = checkAdjacentToEnvironment(ctx, playerState, entityState, false, allowDiagonal);
  if (isAdjacentToEntity) {
    return true;
  }

  // ClimbSameMapLevel is modeled with sideOne/sideTwo tiles in content.
  // If the entity tile itself is blocked, being at either side tile is sufficient.
  if (!actionName) {
    return false;
  }

  const sideLocations = getClimbSameMapLevelSideLocations(ctx, entityState.id, actionName);
  return sideLocations.some((location) => isPlayerAtLocation(playerState, location));
}

/**
 * Starts pathfinding to an entity.
 * Pathfinding logic matches position checking:
 * - Doors: Try direct path first (if accessible), cardinal adjacency fallback
 * - Small entities (1x1): Cardinal adjacency only
 * - Large entities (2x2+): Allow diagonal adjacency
 */
function startPathfinding(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  isDoor: boolean,
  actionName?: string
): void {
  // Determine adjacency rules based on entity size
  const isSmallEntity = entityState.width <= 1 && entityState.length <= 1;
  const allowDiagonal = isDoor ? false : !isSmallEntity; // Doors: false, Small: false, Large: true
  
  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    entityState.x,
    entityState.y,
    playerState.mapLevel,
    !isDoor, // forceAdjacent: true for non-doors
    null,
    allowDiagonal // Cardinal only for doors and small entities
  );

  if (!path || path.length <= 1) {
    const climbSidePath = getBestPathToClimbSameMapLevelSide(
      ctx,
      playerState,
      entityState,
      actionName
    );
    if (climbSidePath && climbSidePath.length > 1) {
      const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
      const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
      ctx.pathfindingSystem.scheduleMovementPlan(
        entityRef,
        playerState.mapLevel,
        climbSidePath,
        speed
      );
      return;
    }

    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that");
    playerState.pendingAction = null;
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };
  
  // Schedule movement - NO CALLBACK needed, tick processor handles completion
  ctx.pathfindingSystem.scheduleMovementPlan(
    entityRef,
    playerState.mapLevel,
    path,
    speed
  );
}

function getClimbSameMapLevelSideLocations(
  ctx: ActionContext,
  entityId: number,
  actionName: string
): WorldEntityActionLocation[] {
  const actionConfig = ctx.worldEntityActionService.getActionConfig(entityId, actionName);
  if (!actionConfig) {
    return [];
  }

  const locations: WorldEntityActionLocation[] = [];
  for (const eventAction of actionConfig.playerEventActions) {
    if (eventAction.type !== "ClimbSameMapLevel") {
      continue;
    }
    if (eventAction.sideOne) {
      locations.push(eventAction.sideOne);
    }
    if (eventAction.sideTwo) {
      locations.push(eventAction.sideTwo);
    }
  }
  return locations;
}

function isPlayerAtLocation(
  playerState: PlayerState,
  location: WorldEntityActionLocation
): boolean {
  return (
    playerState.mapLevel === location.lvl &&
    playerState.x === location.x &&
    playerState.y === location.y
  );
}

function getBestPathToClimbSameMapLevelSide(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  actionName?: string
) {
  if (!actionName) {
    return null;
  }

  const sideLocations = getClimbSameMapLevelSideLocations(ctx, entityState.id, actionName);
  if (sideLocations.length === 0) {
    return null;
  }

  let bestPath: ReturnType<typeof buildMovementPath> = null;
  for (const location of sideLocations) {
    if (location.lvl !== playerState.mapLevel) {
      continue;
    }

    const candidatePath = buildMovementPath(
      ctx,
      playerState.x,
      playerState.y,
      location.x,
      location.y,
      playerState.mapLevel
    );
    if (!candidatePath || candidatePath.length <= 1) {
      continue;
    }

    if (!bestPath || candidatePath.length < bestPath.length) {
      bestPath = candidatePath;
    }
  }

  return bestPath;
}

// =============================================================================
// Action Execution
// =============================================================================

/**
 * Executes an environment action.
 * First checks for override behavior, then falls back to default.
 */
function executeEnvironmentAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  action: Action,
  actionName: string,
  hasOverride: boolean
): void {
  if (hasOverride) {
    executeOverrideAction(ctx, playerState, entityState, actionName);
  } else {
    executeDefaultAction(ctx, playerState, entityState, action, actionName);
  }
}

/**
 * Executes override behavior from worldentityactions.4.carbon.
 */
function shouldCheckRequirementsForOverrideAction(
  actionConfig: WorldEntityAction,
  playerState: PlayerState
): boolean {
  const doorActions = actionConfig.playerEventActions.filter(
    (eventAction) => eventAction.type === "GoThroughDoor"
  );

  // Non-door overrides should always enforce requirements.
  if (doorActions.length === 0) {
    return true;
  }

  const { x: px, y: py, mapLevel: pl } = playerState;

  for (const eventAction of doorActions) {
    if (!eventAction.insideLocation || !eventAction.outsideLocation) {
      continue;
    }

    const isAtInside =
      px === eventAction.insideLocation.x &&
      py === eventAction.insideLocation.y &&
      pl === eventAction.insideLocation.lvl;
    const isAtOutside =
      px === eventAction.outsideLocation.x &&
      py === eventAction.outsideLocation.y &&
      pl === eventAction.outsideLocation.lvl;

    if (!isAtInside && !isAtOutside) {
      continue;
    }

    // Default behavior for GoThroughDoor requirements is one-way:
    // only enforce when entering (outside -> inside).
    // checkRequirementsFromBothSides=true opts into bidirectional checks.
    if (isAtInside) {
      return eventAction.checkRequirementsFromBothSides === true;
    }

    // Standing at outsideLocation always means "entering", so enforce requirements.
    return true;
  }

  // If we cannot determine side, keep default strict behavior.
  return true;
}

function executeOverrideAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  actionName: string
): void {

  const actionConfig = ctx.worldEntityActionService.getActionConfig(entityState.id, actionName);
  if (!actionConfig) {
    console.error(`[executeOverrideAction] Config disappeared for entity ${entityState.id}`);
    return;
  }

  // Check requirements - player has walked up to the entity and is now trying to use it.
  // For directional doors, we can skip requirement checks when exiting from inside.
  const shouldCheckRequirements = shouldCheckRequirementsForOverrideAction(actionConfig, playerState);
  if (shouldCheckRequirements) {
    const getInstancedNpcConfigIdsForOwner = (ownerUserId: number): number[] =>
      ctx.instancedNpcService?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? [];
    const context: RequirementCheckContext = {
      playerState,
      groundItemStates: ctx.groundItemStates,
      currentTick: ctx.currentTick,
      getInstancedNpcConfigIdsForOwner
    };

    const requirementCheck = ctx.worldEntityActionService.checkActionRequirements(actionConfig, context);
    if (!requirementCheck.passed) {
      // Player tried to use the entity but doesn't meet requirements
      // Use custom message from action config, or fall back to action-specific defaults
      let failureMessage;
      let detailedFailureMessage: string = requirementCheck.failureReason ?? "";
      
      if (!failureMessage) {
        // Default messages based on action type
        switch (actionName) {
          case "open":
          case "close":
            failureMessage = "It's locked.";
            break;
          case "enter":
          case "exit":
            failureMessage = "It doesn't budge.";
            break;
          case "mine":
          case "mine_through":
            failureMessage = "You are not skilled enough to mine this.";
            break;
          case "chop":
            failureMessage = "You are not skilled enough to chop this.";
            break;
          case "fish":
            failureMessage = "You are not skilled enough to fish here.";
            break;
          case "climb":
          case "climb_over":
          case "climb_same_map_level":
            failureMessage = "You cannot climb this.";
            break;
          case "go_through":
            failureMessage = "You cannot pass through.";
            break;
          case "unlock":
            failureMessage = "You don't have the key.";
            break;
          case "picklock":
            failureMessage = "You are not skilled enough to pick this lock.";
            break;
          case "search":
            failureMessage = "You cannot search this.";
            break;
          case "touch":
            failureMessage = "Nothing happens.";
            break;
          default:
            // Fall back to detailed requirement failure reason
            failureMessage = requirementCheck.failureReason || "You don't meet the requirements.";
        }
      }
      
      ctx.messageService.sendServerInfo(playerState.userId, failureMessage);
      ctx.messageService.sendServerInfo(playerState.userId, detailedFailureMessage);
      return;
    }
  }

  for (const eventAction of actionConfig.playerEventActions) {
    switch (eventAction.type) {
      case "TeleportTo":
        if (eventAction.location) {
          const { x, y, lvl } = eventAction.location;
          const result = ctx.teleportService.changeMapLevel(
            playerState.userId,
            x,
            y,
            lvl as MapLevel
          );
          if (!result.success) {
            ctx.messageService.sendServerInfo(playerState.userId, "Unable to teleport");
          }
        }
        break;

      case "GoThroughDoor":
        executeGoThroughDoor(
          ctx,
          playerState,
          entityState,
          eventAction.insideLocation,
          eventAction.outsideLocation,
          eventAction.doesLockAfterEntering,
          eventAction.checkRequirementsFromBothSides
        );
        break;

      case "MineThroughRocks":
        executeMineThroughRocks(ctx, playerState, entityState, actionConfig, eventAction.sideOne, eventAction.sideTwo);
        break;

      case "ClimbSameMapLevel":
        executeClimbSameMapLevel(ctx, playerState, entityState, eventAction.sideOne, eventAction.sideTwo);
        break;

      case "PlayerGiveItems":
        executePlayerGiveItemsEvent(ctx, playerState.userId, eventAction as any);
        break;
      case "StartBanking":
        // Mirror default Action.BankAt behavior for scripted world-entity actions.
        ctx.bankingService.openBank(playerState.userId, entityState.id).catch((err) => {
          console.error(`[banking] Error opening bank for user ${playerState.userId}:`, err);
          ctx.messageService.sendServerInfo(playerState.userId, "Unable to access the bank at this time.");
        });
        break;
      case "SpawnInstancedNPC": {
        if (!ctx.instancedNpcService) {
          console.warn("[executeOverrideAction] SpawnInstancedNPC requested but service is unavailable");
          break;
        }
        const configId = Number((eventAction as any).id);
        if (!Number.isInteger(configId) || configId <= 0) {
          console.warn(`[executeOverrideAction] Invalid SpawnInstancedNPC id: ${(eventAction as any).id}`);
          break;
        }

        const eventRequirements = (eventAction as any).requirements;
        if (Array.isArray(eventRequirements) && eventRequirements.length > 0) {
          const syntheticAction: WorldEntityAction = {
            targetAction: "SpawnInstancedNPC",
            requirements: eventRequirements,
            playerEventActions: []
          };
          const eventReqCheck = ctx.worldEntityActionService.checkActionRequirements(syntheticAction, {
            playerState,
            groundItemStates: ctx.groundItemStates,
            currentTick: ctx.currentTick,
            getInstancedNpcConfigIdsForOwner: (ownerUserId) =>
              ctx.instancedNpcService?.getActiveInstancedNpcConfigIdsForOwner(ownerUserId) ?? []
          });
          if (!eventReqCheck.passed) {
            break;
          }
        }

        const spawnResult = ctx.instancedNpcService.spawnInstancedNpc(configId, playerState.userId);
        if (!spawnResult.ok && spawnResult.reason === "already_has_active_instanced_npc") {
          ctx.messageService.sendServerInfo(playerState.userId, "Nothing interesting happens.");
        }
        break;
      }

      default:
        console.warn(`[executeOverrideAction] Unknown event type: ${eventAction.type}`);
    }
  }
}

function executePlayerGiveItemsEvent(
  ctx: ActionContext,
  userId: number,
  eventAction: {
    messageToPlayer?: string;
    playerGiveItems?: Array<{ id?: number; itemId?: number; amt?: number; amount?: number; isIOU?: boolean; isiou?: boolean }>;
  }
): void {
  const toGive = Array.isArray(eventAction.playerGiveItems) ? eventAction.playerGiveItems : [];

  for (const item of toGive) {
    const itemId = typeof item.id === "number" ? item.id : item.itemId;
    const amount = typeof item.amt === "number" ? item.amt : item.amount;
    if (!Number.isFinite(itemId) || !Number.isFinite(amount) || (amount as number) <= 0) {
      continue;
    }

    ctx.inventoryService.removeItem(
      userId,
      itemId as number,
      amount as number,
      (item.isIOU ?? item.isiou) ? 1 : 0
    );
  }

  if (typeof eventAction.messageToPlayer === "string" && eventAction.messageToPlayer.trim().length > 0) {
    ctx.messageService.sendServerInfo(userId, eventAction.messageToPlayer);
  }
}

/**
 * Executes default behavior for environment actions.
 */
function executeDefaultAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  action: Action,
  actionName: string
): void {

  switch (action) {
    case Action.BankAt:
      // Open the bank - handled by BankingService
      // Pass world entity ID (e.g., 2907) as the bank ID in the packet
      ctx.bankingService.openBank(playerState.userId, entityState.id).catch((err) => {
        console.error(`[banking] Error opening bank for user ${playerState.userId}:`, err);
        ctx.messageService.sendServerInfo(playerState.userId, "Unable to access the bank at this time.");
      });
      break;
    case Action.Chop:
      // Woodcutting - handled by WoodcuttingService
      if (ctx.woodcuttingService) {
        ctx.woodcuttingService.initiateChop(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Woodcutting is not available.");
      }
      break;
    case Action.Fish:
      // Fishing - handled by FishingService
      if (ctx.fishingService) {
        ctx.fishingService.initiateFish(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Fishing is not available.");
      }
      break;
    case Action.Mine:
      // Mining - handled by MiningService
      if (ctx.miningService) {
        ctx.miningService.initiateMine(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Mining is not available.");
      }
      break;
    case Action.Harvest:
      // Harvesting - handled by HarvestingService
      if (ctx.harvestingService) {
        ctx.harvestingService.initiateHarvest(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Harvesting is not available.");
      }
      break;
    case Action.Open:
      ctx.messageService.sendServerInfo(playerState.userId, `Please let us know how you managed to trigger this`);
      break;
    case Action.Close:
      ctx.messageService.sendServerInfo(playerState.userId, `Hmm it won't close`);
      break;
    case Action.Smelt: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.Smelting);
      break;
    }
    case Action.Smith: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.Smithing);
      break;
    }
    case Action.Craft: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.SmeltingKiln);
      break;
    }
    case Action.CraftAt: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.CraftingTable);
      break;
    }
    case Action.Brew: {
      ctx.skillingMenuService.openMenu(playerState.userId, entityState.id, MenuType.PotionMaking);
      break;
    }
    case Action.Search: {
      executeSearchAction(ctx, playerState, entityState);
      break;
    }
    case Action.Picklock: {
      executePicklockAction(ctx, playerState, entityState);
      break;
    }
    case Action.Unlock:
      executeUnlockAction(ctx, playerState, entityState);
      break;
    case Action.SleepIn:
      ctx.messageService.sendServerInfo(playerState.userId, "You don't feel tired.");
      break;
    case Action.Shake: {
      if (ctx.shakingService) {
        ctx.shakingService.initiateShake(playerState, entityState);
      } else {
        ctx.messageService.sendServerInfo(playerState.userId, "Shaking is not available.");
      }
      break;
    }
    case Action.Comb:
      ctx.messageService.sendServerInfo(playerState.userId, `${actionName} not yet implemented`);
      break;
    default:
      // Actions without default behavior (require override)
      ctx.messageService.sendServerInfo(playerState.userId, "Nothing interesting happens.");
  }
}

function executeSearchAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState
): void {
  const entityName = entityState.definition.name || entityState.type;
  startDelayedLootInteraction(
    ctx,
    playerState,
    entityState,
    SEARCH_DELAY_TICKS,
    `You search the ${entityName}...`,
    (nextUserId, nextEntityId) => resolveSearchAction(ctx, nextUserId, nextEntityId)
  );
}

function executePicklockAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState
): void {
  const worldEntityLootId = getWorldEntityLootIdForPicklock(entityState);
  if (!worldEntityLootId) {
    const entityName = entityState.definition.name || entityState.type;
    ctx.messageService.sendServerInfo(playerState.userId, `You can't picklock the ${entityName}.`);
    return;
  }

  if (!ctx.worldEntityLootService) {
    ctx.messageService.sendServerInfo(playerState.userId, "Picklock loot is not available right now.");
    return;
  }

  const requirementCheck = ctx.worldEntityLootService.checkLootRequirements(playerState, worldEntityLootId);
  if (!requirementCheck.passed) {
    const unmetSkill = requirementCheck.unmetSkillRequirement;
    if (unmetSkill && (unmetSkill.operator === ">=" || unmetSkill.operator === ">")) {
      ctx.messageService.sendServerInfo(
        playerState.userId,
        `You need a ${unmetSkill.skill} level of at least ${unmetSkill.level} to picklock this`
      );
    } else {
      ctx.messageService.sendServerInfo(
        playerState.userId,
        requirementCheck.failureReason || "You do not meet the requirements to picklock this"
      );
    }
    return;
  }

  schedulePicklockAttempt(ctx, playerState.userId, entityState.id, true);
}

function executeUnlockAction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState
): void {
  const entityName = entityState.definition.name || entityState.type;
  const worldEntityLootId = getWorldEntityLootIdForUnlock(entityState);
  if (!worldEntityLootId) {
    ctx.messageService.sendServerInfo(playerState.userId, "It's locked shut");
    return;
  }

  if (!ctx.worldEntityLootService) {
    ctx.messageService.sendServerInfo(playerState.userId, "Unlock loot is not available right now.");
    return;
  }

  const requirementCheck = ctx.worldEntityLootService.checkLootRequirements(playerState, worldEntityLootId);
  if (!requirementCheck.passed) {
    ctx.messageService.sendServerInfo(playerState.userId, "It's locked shut");
    return;
  }

  const startMessages = ctx.worldEntityLootService.getStartResultMessages(worldEntityLootId);
  const startMessage = startMessages[0] ?? `You begin unlocking the ${entityName}...`;
  scheduleUnlockAttempt(ctx, playerState.userId, entityState.id, worldEntityLootId, startMessage);
}

function startDelayedLootInteraction(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  delayTicks: number,
  startMessage: string,
  onComplete: (userId: number, worldEntityId: number) => void
): void {
  // Always restart windup when player clicks again.
  ctx.delaySystem.interruptDelay(playerState.userId, false);

  const delayStarted = ctx.delaySystem.startDelay({
    userId: playerState.userId,
    type: DelayType.NonBlocking,
    ticks: delayTicks,
    onComplete: (userId) => onComplete(userId, entityState.id)
  });

  if (!delayStarted) {
    return;
  }

  ctx.messageService.sendServerInfo(playerState.userId, startMessage);
}

function resolveSearchAction(
  ctx: ActionContext,
  userId: number,
  worldEntityId: number
): void {
  const playerState = ctx.playerStatesByUserId.get(userId);
  if (!playerState) {
    return;
  }

  const entityState = ctx.worldEntityStates.get(worldEntityId);
  if (!entityState || entityState.mapLevel !== playerState.mapLevel) {
    ctx.messageService.sendServerInfo(playerState.userId, "You find nothing interesting");
    return;
  }

  const entityName = entityState.definition.name || entityState.type;

  if (ctx.resourceExhaustionTracker.isExhausted(entityState.id)) {
    ctx.messageService.sendServerInfo(playerState.userId, "You find nothing interesting");
    return;
  }

  const worldEntityLootId = getWorldEntityLootIdForSearch(entityState);
  if (!worldEntityLootId) {
    ctx.messageService.sendServerInfo(playerState.userId, "You find nothing interesting");
    return;
  }

  if (!ctx.worldEntityLootService) {
    ctx.messageService.sendServerInfo(playerState.userId, "Search loot is not available right now.");
    return;
  }

  const lootResult = ctx.worldEntityLootService.attemptLoot(playerState, worldEntityLootId, SKILLS.crime, ctx.itemCatalog);
  if (!lootResult.passedRequirements) {
    ctx.messageService.sendServerInfo(
      playerState.userId,
      lootResult.failureReason || "You do not meet the requirements to search that."
    );
    return;
  }

  if (lootResult.succeeded) {
    exhaustEntityLootIfNeeded(ctx, entityState, lootResult.respawnTicks);
  }

  if (lootResult.succeeded && lootResult.xpRewards.length > 0) {
    for (const reward of lootResult.xpRewards) {
      if (!isSkillSlug(reward.skill)) {
        console.warn(`[executeSearchAction] Invalid skill in xp reward: ${reward.skill}`);
        continue;
      }
      if (!Number.isFinite(reward.amount) || reward.amount <= 0) {
        continue;
      }
      ctx.experienceService.addSkillXp(playerState, reward.skill, reward.amount);
    }
  }

  if (!lootResult.succeeded || !lootResult.hasLoot) {
    ctx.messageService.sendServerInfo(playerState.userId, "You find nothing interesting");
    return;
  }

  let hadOverflow = false;
  for (const drop of lootResult.drops) {
    const result = ctx.inventoryService.giveItem(
      playerState.userId,
      drop.itemId,
      drop.amount,
      drop.isIOU ? 1 : 0
    );
    if (result.overflow > 0) {
      hadOverflow = true;
    }
  }

  if (hadOverflow) {
    ctx.messageService.sendServerInfo(playerState.userId, "Some items were placed on the ground.");
  }

  ctx.messageService.sendServerInfo(playerState.userId, `You find some items in the ${entityName}`);
}

function resolvePicklockAction(
  ctx: ActionContext,
  userId: number,
  worldEntityId: number
): void {
  const playerState = ctx.playerStatesByUserId.get(userId);
  if (!playerState) {
    return;
  }

  const entityState = ctx.worldEntityStates.get(worldEntityId);
  if (!entityState || entityState.mapLevel !== playerState.mapLevel) {
    return;
  }

  const entityName = entityState.definition.name || entityState.type;

  if (ctx.resourceExhaustionTracker.isExhausted(entityState.id)) {
    ctx.messageService.sendServerInfo(playerState.userId, `The ${entityName} has already been looted.`);
    return;
  }

  const worldEntityLootId = getWorldEntityLootIdForPicklock(entityState);
  if (!worldEntityLootId) {
    ctx.messageService.sendServerInfo(playerState.userId, `You can't picklock the ${entityName}.`);
    return;
  }

  if (!ctx.worldEntityLootService) {
    ctx.messageService.sendServerInfo(playerState.userId, "Picklock loot is not available right now.");
    return;
  }

  const lootResult = ctx.worldEntityLootService.attemptLoot(playerState, worldEntityLootId, SKILLS.crime, ctx.itemCatalog);
  if (!lootResult.passedRequirements) {
    ctx.messageService.sendServerInfo(
      playerState.userId,
      lootResult.failureReason || "You do not meet the requirements to picklock that."
    );
    return;
  }

  if (lootResult.succeeded) {
    exhaustEntityLootIfNeeded(ctx, entityState, lootResult.respawnTicks);
  }

  // Picklock failure should retry automatically every 4 ticks until success
  // (or until another player action interrupts the non-blocking delay).
  if (!lootResult.succeeded) {
    ctx.messageService.sendServerInfo(playerState.userId, "You fumble the lock...");
    schedulePicklockAttempt(ctx, userId, worldEntityId, false);
    return;
  }

  if (lootResult.succeeded && lootResult.xpRewards.length > 0) {
    for (const reward of lootResult.xpRewards) {
      if (!isSkillSlug(reward.skill)) {
        console.warn(`[executePicklockAction] Invalid skill in xp reward: ${reward.skill}`);
        continue;
      }
      if (!Number.isFinite(reward.amount) || reward.amount <= 0) {
        continue;
      }
      ctx.experienceService.addSkillXp(playerState, reward.skill, reward.amount);
    }
  }

  if (!lootResult.succeeded || !lootResult.hasLoot) {
    ctx.messageService.sendServerInfo(playerState.userId, `You fail to picklock the ${entityName}.`);
    return;
  }

  let hadOverflow = false;
  for (const drop of lootResult.drops) {
    const result = ctx.inventoryService.giveItem(
      playerState.userId,
      drop.itemId,
      drop.amount,
      drop.isIOU ? 1 : 0
    );
    if (result.overflow > 0) {
      hadOverflow = true;
    }
  }

  if (hadOverflow) {
    ctx.messageService.sendServerInfo(playerState.userId, "Some items were placed on the ground");
  }

  ctx.messageService.sendServerInfo(playerState.userId, `You successfully picklock the ${entityName}`);
}

function resolveUnlockAction(
  ctx: ActionContext,
  userId: number,
  worldEntityId: number,
  worldEntityLootId: number
): void {
  const playerState = ctx.playerStatesByUserId.get(userId);
  if (!playerState) {
    return;
  }

  const entityState = ctx.worldEntityStates.get(worldEntityId);
  if (!entityState || entityState.mapLevel !== playerState.mapLevel) {
    return;
  }

  const entityName = entityState.definition.name || entityState.type;

  if (!ctx.worldEntityLootService) {
    ctx.messageService.sendServerInfo(playerState.userId, "Unlock loot is not available right now.");
    return;
  }

  const requirementCheck = ctx.worldEntityLootService.checkLootRequirements(playerState, worldEntityLootId);
  if (!requirementCheck.passed) {
    ctx.messageService.sendServerInfo(playerState.userId, "It's locked shut");
    return;
  }

  const lootResult = ctx.worldEntityLootService.attemptLoot(
    playerState,
    worldEntityLootId,
    SKILLS.crime,
    ctx.itemCatalog
  );
  if (!lootResult.passedRequirements) {
    ctx.messageService.sendServerInfo(playerState.userId, "It's locked shut");
    return;
  }

  if (lootResult.succeeded) {
    // Apply "searchEndResult" side effects first (e.g. consume key).
    ctx.worldEntityLootService.applySearchEndResultPlayerGiveItems(
      worldEntityLootId,
      (itemId, amount, isIOU) => ctx.inventoryService.removeItem(playerState.userId, itemId, amount, isIOU)
    );
    exhaustEntityLootIfNeeded(ctx, entityState, lootResult.respawnTicks);
  }

  let hadOverflow = false;
  for (const drop of lootResult.drops) {
    const result = ctx.inventoryService.giveItem(
      playerState.userId,
      drop.itemId,
      drop.amount,
      drop.isIOU ? 1 : 0
    );
    if (result.overflow > 0) {
      hadOverflow = true;
    }
  }

  if (hadOverflow) {
    ctx.messageService.sendServerInfo(playerState.userId, "Some items were placed on the ground.");
  }

  const lootDef = ctx.worldEntityLootService.getLootDefinition(worldEntityLootId);
  if (lootDef?.showLootReceivedNotification) {
    for (const drop of lootResult.drops) {
      const def = ctx.itemCatalog?.getDefinitionById(drop.itemId);
      const name = def?.name ?? `Item #${drop.itemId}`;
      const displayName = capitalizeFirstLetter(name);
      const message = drop.amount > 1
        ? `You received ${drop.amount} ${displayName}`
        : `You received ${withIndefiniteArticle(displayName)}`;
      ctx.messageService.sendServerInfo(playerState.userId, message, MessageStyle.Magenta);
    }

    const lootMenuItems = lootResult.drops.map((drop) => [drop.itemId, drop.amount, drop.isIOU ? 1 : 0]);
    const showLootPayload = buildShowLootMenuPayload({
      Items: lootMenuItems,
      Type: 0
    });
    ctx.enqueueUserMessage(playerState.userId, 96, showLootPayload);
  }

  ctx.messageService.sendServerInfo(playerState.userId, `You unlock the ${entityName}.`);
}

function withIndefiniteArticle(value: string): string {
  if (!value) return value;
  const startsWithVowel = /^[aeiou]/i.test(value);
  return `${startsWithVowel ? "an" : "a"} ${value}`;
}

function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function schedulePicklockAttempt(
  ctx: ActionContext,
  userId: number,
  worldEntityId: number,
  sendStartMessage: boolean
): void {
  const playerState = ctx.playerStatesByUserId.get(userId);
  const entityState = ctx.worldEntityStates.get(worldEntityId);
  if (!playerState || !entityState) {
    return;
  }

  // Restart windup when player clicks picklock again.
  // During automatic retries this is a no-op because delay already completed.
  ctx.delaySystem.interruptDelay(userId, false);

  const delayStarted = ctx.delaySystem.startDelay({
    userId,
    type: DelayType.NonBlocking,
    ticks: PICKLOCK_DELAY_TICKS,
    onComplete: (nextUserId) => resolvePicklockAction(ctx, nextUserId, worldEntityId)
  });

  if (!delayStarted) {
    return;
  }

  if (sendStartMessage) {
    const entityName = entityState.definition.name || entityState.type;
    ctx.messageService.sendServerInfo(userId, `You attempt to picklock the ${entityName}...`);
  }
}

function scheduleUnlockAttempt(
  ctx: ActionContext,
  userId: number,
  worldEntityId: number,
  worldEntityLootId: number,
  startMessage: string
): void {
  ctx.delaySystem.interruptDelay(userId, false);

  const delayStarted = ctx.delaySystem.startDelay({
    userId,
    type: DelayType.NonBlocking,
    ticks: PICKLOCK_DELAY_TICKS,
    onComplete: (nextUserId) => resolveUnlockAction(ctx, nextUserId, worldEntityId, worldEntityLootId)
  });

  if (!delayStarted) {
    return;
  }

  ctx.messageService.sendServerInfo(userId, startMessage);
}

function getWorldEntityLootIdForSearch(entityState: WorldEntityState): number | null {
  return entityState.definition.worldEntityLootId ?? null;
}

function getWorldEntityLootIdForPicklock(entityState: WorldEntityState): number | null {
  return entityState.worldEntityLootIdOverride ?? entityState.definition.worldEntityLootId ?? null;
}

function getWorldEntityLootIdForUnlock(entityState: WorldEntityState): number | null {
  return entityState.worldEntityLootIdOverride ?? null;
}

function exhaustEntityLootIfNeeded(
  ctx: ActionContext,
  entityState: WorldEntityState,
  respawnTicks: number
): void {
  if (!Number.isFinite(respawnTicks) || respawnTicks <= 0) {
    return;
  }

  if (ctx.resourceExhaustionTracker.isExhausted(entityState.id)) {
    return;
  }

  const nearbyPlayers = new Set(
    ctx.spatialIndex
      .getPlayersViewingPosition(entityState.mapLevel, entityState.x, entityState.y)
      .map((player) => player.id)
  );
  ctx.resourceExhaustionTracker.markExhausted(entityState.id, nearbyPlayers);

  setTimeout(() => {
    ctx.resourceExhaustionTracker.markReplenished(entityState.id);
  }, respawnTicks * getTickMs());
}

function getTickMs(): number {
  const parsed = Number(process.env.TICK_MS);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 600;
  }
  return Math.floor(parsed);
}

// =============================================================================
// GoThroughDoor
// =============================================================================

/**
 * Checks if a location is reachable within a maximum number of steps.
 * Used for determining which side of a ladder/obstacle the player is on.
 * 
 * @param ctx - Action context
 * @param playerState - The player
 * @param targetX - Target X coordinate
 * @param targetY - Target Y coordinate
 * @param maxSteps - Maximum number of steps to allow
 * @returns true if reachable within maxSteps, false otherwise
 */
function isReachableWithinSteps(
  ctx: ActionContext,
  playerState: PlayerState,
  targetX: number,
  targetY: number,
  maxSteps: number
): boolean {
  // If already at target, it's reachable
  if (playerState.x === targetX && playerState.y === targetY) {
    return true;
  }

  // Build path to target
  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    targetX,
    targetY,
    playerState.mapLevel,
    false, // forceAdjacent
    maxSteps + 1, // maxSearchRadius: +1 for radius to allow checking
    true // allowDiagonal
  );

  // Check if path exists and is within max steps
  // Path includes starting position, so length-1 is the number of moves
  return path !== null && path.length > 0 && (path.length - 1) <= maxSteps;
}

/**
 * Climbs a ladder that stays on the same map level.
 * Determines which side of the ladder the player is on by checking reachability,
 * then teleports them to the other side.
 * 
 * @param ctx - Action context
 * @param playerState - The player climbing
 * @param entityState - The ladder entity
 * @param sideOne - First side location
 * @param sideTwo - Second side location
 */
function executeClimbSameMapLevel(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  sideOne?: WorldEntityActionLocation,
  sideTwo?: WorldEntityActionLocation
): void {
  if (!sideOne || !sideTwo) {
    console.error(`[executeClimbSameMapLevel] Missing side locations for entity ${entityState.id}`);
    return;
  }

  // Determine which side the player is on by checking reachability within 2 steps
  const canReachSideOne = isReachableWithinSteps(ctx, playerState, sideOne.x, sideOne.y, 2);
  const canReachSideTwo = isReachableWithinSteps(ctx, playerState, sideTwo.x, sideTwo.y, 2);

  let targetSide: WorldEntityActionLocation | null = null;

  if (canReachSideOne && !canReachSideTwo) {
    // Player is near sideOne, teleport to sideTwo
    targetSide = sideTwo;
  } else if (canReachSideTwo && !canReachSideOne) {
    // Player is near sideTwo, teleport to sideOne
    targetSide = sideOne;
  } else if (canReachSideOne && canReachSideTwo) {
    // Player can reach both sides (unlikely but possible if very close)
    // Choose the closer one
    const distToSideOne = Math.abs(playerState.x - sideOne.x) + Math.abs(playerState.y - sideOne.y);
    const distToSideTwo = Math.abs(playerState.x - sideTwo.x) + Math.abs(playerState.y - sideTwo.y);
    
    if (distToSideOne <= distToSideTwo) {
      targetSide = sideTwo;
    } else {
      targetSide = sideOne;
    }
  } else {
    // Player cannot reach either side within 2 steps
    console.log(`[executeClimbSameMapLevel] Player ${playerState.userId} too far from ladder`);
    ctx.messageService.sendServerInfo(playerState.userId, "You cannot reach the ladder from here.");
    return;
  }

  // Teleport to the target side
  if (targetSide) {
    const result = ctx.teleportService.changeMapLevel(
      playerState.userId,
      targetSide.x,
      targetSide.y,
      targetSide.lvl as MapLevel
    );

    if (!result.success) {
      ctx.messageService.sendServerInfo(playerState.userId, "Unable to climb.");
    }
  }
}

/**
 * Executes the GoThroughDoor action.
 * Player must be at exactly insideLocation or outsideLocation.
 */
function executeGoThroughDoor(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  insideLocation: WorldEntityActionLocation | undefined,
  outsideLocation: WorldEntityActionLocation | undefined,
  doesLockAfterEntering?: boolean,
  checkRequirementsFromBothSides?: boolean
): void {
  if (!insideLocation || !outsideLocation) {
    ctx.messageService.sendServerInfo(playerState.userId, "The door seems stuck");
    return;
  }

  const { x: px, y: py, mapLevel: pl } = playerState;

  const isAtInside = px === insideLocation.x && py === insideLocation.y && pl === insideLocation.lvl;
  const isAtOutside = px === outsideLocation.x && py === outsideLocation.y && pl === outsideLocation.lvl;

  if (!isAtInside && !isAtOutside) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to be at the door to go through it");
    return;
  }

  // Content with checkRequirementsFromBothSides=false explicitly models "entry gated, exit free".
  // Preserve that behavior even when doesLockAfterEntering is present.
  const lockInsideExit = doesLockAfterEntering === true && checkRequirementsFromBothSides !== false;
  if (lockInsideExit && isAtInside) {
    ctx.messageService.sendServerInfo(playerState.userId, "It's locked from this side.");
    return;
  }

  const destination = isAtInside ? outsideLocation : insideLocation;


  // Cross-level transitions must use TeleportService so the client receives map-level sync.
  if ((destination.lvl as MapLevel) !== pl) {
    const result = ctx.teleportService.changeMapLevel(
      playerState.userId,
      destination.x,
      destination.y,
      destination.lvl as MapLevel
    );
    if (!result.success) {
      ctx.messageService.sendServerInfo(playerState.userId, "The door seems stuck");
    }
    return;
  }

  const oldPosition = { x: px, y: py, mapLevel: pl };

  // Instant relocation can leave behind a stale movement plan from pre-transition pathing.
  ctx.pathfindingSystem.deleteMovementPlan({ type: EntityType.Player, id: playerState.userId });

  // Update player position (this also sets the dirty flag for persistence)
  playerState.updateLocation(destination.lvl as MapLevel, destination.x, destination.y);

  const newPosition = { x: playerState.x, y: playerState.y, mapLevel: playerState.mapLevel };

  // Emit event for VisibilitySystem to handle packets
  ctx.eventBus.emit(createPlayerWentThroughDoorEvent(
    playerState.userId,
    oldPosition,
    newPosition,
    entityState.id
  ));
}

// =============================================================================
// MineThroughRocks
// =============================================================================

/**
 * Executes the MineThroughRocks action.
 * Player must have a pickaxe equipped and the required mining level.
 * The player must be at exactly sideOne or sideTwo to mine through.
 */
function executeMineThroughRocks(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  actionConfig: any,
  sideOne: WorldEntityActionLocation | undefined,
  sideTwo: WorldEntityActionLocation | undefined
): void {
  if (!sideOne || !sideTwo) {
    ctx.messageService.sendServerInfo(playerState.userId, "The rocks are too thick to mine through");
    return;
  }

  // Check if player has a pickaxe equipped
  const weaponItemId = ctx.equipmentService.getEquippedItemId(playerState.userId, "weapon");
  
  if (!weaponItemId || !ctx.itemCatalog) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to equip a pickaxe to do that");
    return;
  }

  const weaponDef = ctx.itemCatalog.getDefinitionById(weaponItemId);
  
  if (!weaponDef || !weaponDef.equippableRequirements) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to equip a pickaxe to do that");
    return;
  }

  // Check if the equipped weapon is a pickaxe (has mining requirement)
  const hasPickaxe = weaponDef.equippableRequirements.some(
    (req: any) => req.skill === "mining"
  );

  if (!hasPickaxe) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to equip a pickaxe to do that");
    return;
  }

  // Check skill level requirements
  if (actionConfig.requirements && Array.isArray(actionConfig.requirements)) {
    for (const requirement of actionConfig.requirements) {
      if (requirement.type === "skill") {
        // Use effective level (includes potions - equipment bonuses)
        const playerLevel = playerState.getSkillBoostedLevel(requirement.skill);
        const requiredLevel = requirement.level;
        
        // Check operator (default to >=)
        const operator = requirement.operator || ">=";
        let meetsRequirement = false;
        
        switch (operator) {
          case ">=":
            meetsRequirement = playerLevel >= requiredLevel;
            break;
          case ">":
            meetsRequirement = playerLevel > requiredLevel;
            break;
          case "==":
          case "=":
            meetsRequirement = playerLevel === requiredLevel;
            break;
          case "<=":
            meetsRequirement = playerLevel <= requiredLevel;
            break;
          case "<":
            meetsRequirement = playerLevel < requiredLevel;
            break;
          default:
            meetsRequirement = playerLevel >= requiredLevel;
        }
        
        if (!meetsRequirement) {
          ctx.messageService.sendServerInfo(
            playerState.userId, 
            `You need a ${requirement.skill} level of ${requiredLevel} to do that`
          );
          return;
        }
      }
    }
  }

  const { x: px, y: py, mapLevel: pl } = playerState;

  const isAtSideOne = px === sideOne.x && py === sideOne.y && pl === sideOne.lvl;
  const isAtSideTwo = px === sideTwo.x && py === sideTwo.y && pl === sideTwo.lvl;

  if (!isAtSideOne && !isAtSideTwo) {
    ctx.messageService.sendServerInfo(playerState.userId, "You need to be at the rocks to mine through them");
    return;
  }

  const destination = isAtSideOne ? sideTwo : sideOne;


  // Send message
  ctx.messageService.sendServerInfo(playerState.userId, "You mine your way through the rocks");

  // Cross-level transitions must use TeleportService so the client receives map-level sync.
  if ((destination.lvl as MapLevel) !== pl) {
    const result = ctx.teleportService.changeMapLevel(
      playerState.userId,
      destination.x,
      destination.y,
      destination.lvl as MapLevel
    );
    if (!result.success) {
      ctx.messageService.sendServerInfo(playerState.userId, "Unable to mine through.");
    }
    return;
  }

  const oldPosition = { x: px, y: py, mapLevel: pl };

  // Instant relocation can leave behind a stale movement plan from pre-transition pathing.
  ctx.pathfindingSystem.deleteMovementPlan({ type: EntityType.Player, id: playerState.userId });

  // Update player position (this also sets the dirty flag for persistence)
  playerState.updateLocation(destination.lvl as MapLevel, destination.x, destination.y);

  const newPosition = { x: playerState.x, y: playerState.y, mapLevel: playerState.mapLevel };

  // Emit event for VisibilitySystem to handle packets
  // Reuse the PlayerWentThroughDoor event since it has the exact same behavior
  // (movement via SendMovementPath packet instead of teleport)
  ctx.eventBus.emit(createPlayerWentThroughDoorEvent(
    playerState.userId,
    oldPosition,
    newPosition,
    entityState.id
  ));
}

// =============================================================================
// Legacy Exports (for backward compatibility)
// =============================================================================

/** @deprecated - No longer needed, tick processor handles everything */
export function handleEnvironmentMovementComplete(): void {
  console.warn("[handleEnvironmentMovementComplete] DEPRECATED - use processPendingEnvironmentActions");
}

/** @deprecated - Use processPendingEnvironmentActions instead */
export function executeDelayedEnvironmentAction(): void {
  console.warn("[executeDelayedEnvironmentAction] DEPRECATED - use processPendingEnvironmentActions");
}
