/**
 * Ground item action handlers.
 * Handles pickup actions for items on the ground.
 */

import { Action } from "../../../protocol/enums/Actions";
import { EntityType } from "../../../protocol/enums/EntityType";
import { PlayerSetting } from "../../../protocol/enums/PlayerSetting";
import type { ActionContext } from "../types";
import type { PlayerState } from "../../../world/PlayerState";
import type { ItemSpatialEntry } from "../../systems/SpatialIndexManager";
import type { EntityRef } from "../../events/GameEvents";
import { buildMovementPathAdjacent } from "../utils/pathfinding";
import { checkGroundItemRange } from "./shared";

/**
 * Main handler for ground item actions.
 * Currently only supports Grab (pickup) action.
 */
export function handleGroundItemAction(
  ctx: ActionContext,
  playerState: PlayerState,
  action: Action,
  itemId: number,
  onMovementComplete: (ctx: ActionContext, playerState: PlayerState) => void
): void {
  // Only valid action for ground items is Grab (pickup)
  if (action !== Action.Grab) {
    return;
  }

  // Get the ground item
  if (!ctx.itemManager) {
    return;
  }

  const groundItem = ctx.itemManager.getGroundItem(itemId);
  if (!groundItem) {
    return;
  }

  // Check if item is on the same map level
  if (groundItem.mapLevel !== playerState.mapLevel) {
    return;
  }

  // Check if player is within range (using LOS system)
  const isInRange = checkGroundItemRange(ctx, playerState, groundItem);

  if (isInRange) {
    // Execute pickup immediately
    executePickupGroundItem(ctx, playerState, groundItem);
  } else {
    // Queue pending action and pathfind to item
    playerState.pendingAction = {
      action: Action.Grab,
      entityType: EntityType.Item,
      entityId: itemId
    };

    // Build path to item (or adjacent if item is on blocked tile)
    const path = buildMovementPathAdjacent(
      ctx,
      playerState.x,
      playerState.y,
      groundItem.x,
      groundItem.y,
      playerState.mapLevel
    );

    if (!path || path.length <= 1) {
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that item");
      playerState.pendingAction = null;
      return;
    }

    // Calculate player movement speed
    const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;

    // Schedule movement with completion callback
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

/**
 * Executes the pickup of a ground item when player is in range.
 */
export function executePickupGroundItem(
  ctx: ActionContext,
  playerState: PlayerState,
  groundItem: ItemSpatialEntry
): void {
  if (ctx.treasureMapService?.isTreasureMapItemId(groundItem.itemId)) {
    const ownerUserId = ctx.treasureMapService.getOwnerForGroundTreasureMap(groundItem.id);
    if (ownerUserId !== null && ownerUserId !== playerState.userId) {
      ctx.messageService.sendServerInfo(playerState.userId, "This treasure map does not belong to you.");
      return;
    }
  }

  // Check if player has inventory space
  if (!playerState.hasInventorySpace()) {
    ctx.messageService.sendServerInfo(playerState.userId, "Your inventory is full.");
    return;
  }

  // Add item to inventory
  const result = ctx.inventoryService.giveItem(
    playerState.userId,
    groundItem.itemId,
    groundItem.amount,
    groundItem.isIOU ? 1 : 0
  );

  // Check if any items were actually added
  if (result.added === 0) {
    ctx.messageService.sendServerInfo(playerState.userId, "Could not pick up item");
    return;
  }

  // Remove item from world (will respawn if it's a world spawn)
  ctx.itemManager?.removeGroundItem(groundItem.id, "picked_up", ctx.currentTick);

  ctx.itemAudit?.logItemPickup({
    pickerUserId: playerState.userId,
    itemId: groundItem.itemId,
    amount: result.added,
    isIOU: groundItem.isIOU ? 1 : 0,
    mapLevel: groundItem.mapLevel,
    x: groundItem.x,
    y: groundItem.y,
    groundItemId: groundItem.id
  });

}

/**
 * Handles ground item action after movement completion.
 * Called from the main movement completion handler.
 */
export function handleGroundItemMovementComplete(
  ctx: ActionContext,
  playerState: PlayerState,
  itemId: number
): void {
  if (!ctx.itemManager) return;

  const groundItem = ctx.itemManager.getGroundItem(itemId);
  if (!groundItem) {
    return;
  }

  // Check if still in range (using LOS system)
  if (checkGroundItemRange(ctx, playerState, groundItem)) {
    executePickupGroundItem(ctx, playerState, groundItem);
  } else {
    ctx.messageService.sendServerInfo(playerState.userId, "Unable to reach that item");
  }
}
