/**
 * Shared utilities for entity action handlers.
 * Contains range checking and movement completion logic.
 */

import type { ActionContext } from "../types";
import type { PlayerState } from "../../../world/PlayerState";
import type { NPCState, WorldEntityState } from "../../state/EntityState";
import type { ItemSpatialEntry } from "../../systems/SpatialIndexManager";
import { worldToGrid } from "../../../world/gridTransforms";
import { PathingDirection, DIRECTION_OFFSETS } from "../../../world/pathfinding";

/**
 * Checks if player is within range to pick up a ground item using LOS system.
 * 
 * Pickup rules:
 * 1. Standing on the item - ALWAYS allowed
 * 2. Adjacent pickup - ONLY if:
 *    a) Player is adjacent (within 1 tile)
 *    b) Player has line of sight
 *    c) Item is on a BLOCKED tile (like a table)
 */
export function checkGroundItemRange(
  ctx: ActionContext,
  playerState: PlayerState,
  groundItem: ItemSpatialEntry
): boolean {
  const playerX = playerState.x;
  const playerY = playerState.y;
  const itemX = groundItem.x;
  const itemY = groundItem.y;

  // Rule 1: Standing directly on the item - always allowed
  if (playerX === itemX && playerY === itemY) {
    return true;
  }

  // For adjacent pickup, we need LOS system
  if (!ctx.losSystem) {
    return false;
  }

  // Rule 2a: Must be adjacent (within 1 tile)
  if (!ctx.losSystem.isAdjacentTo(playerX, playerY, itemX, itemY)) {
    return false;
  }

  // Rule 2b: Must have line of sight
  const losResult = ctx.losSystem.checkLOS(playerX, playerY, itemX, itemY, playerState.mapLevel);
  if (!losResult.hasLOS) {
    return false;
  }

  // Rule 2c: Item must be on a blocked tile
  const pathingSystem = ctx.pathfindingSystem;
  const grid = pathingSystem.getPathingGridForLevel(playerState.mapLevel);
  
  if (grid) {
    const gridPoint = worldToGrid(itemX, itemY, grid);
    const itemTileBlocked = grid.getOrAllBlockedValue(gridPoint.x, gridPoint.y) === 0xff;
    if (!itemTileBlocked) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Checks if player is adjacent to an NPC and has line of sight.
 * This prevents interactions through walls.
 * 
 * Requirements:
 * 1. Player must be within 1 tile of NPC (adjacent)
 * 2. Player must have line of sight to NPC (no walls blocking)
 * 
 * @param ctx - Action context containing LOS system
 * @param playerState - The player attempting interaction
 * @param npcState - The NPC being interacted with
 * @returns true if player is adjacent AND has LOS, false otherwise
 */
export function checkAdjacentToNPC(
  ctx: ActionContext,
  playerState: PlayerState,
  npcState: NPCState
): boolean {
  if (!ctx.losSystem) {
    // Fallback: simple distance check (no LOS available)
    const dx = Math.abs(playerState.x - npcState.x);
    const dy = Math.abs(playerState.y - npcState.y);
    return dx <= 1 && dy <= 1 && (dx + dy > 0); // Adjacent but not on same tile
  }

  // Check adjacency
  const isAdjacent = ctx.losSystem.isAdjacentTo(
    playerState.x, 
    playerState.y, 
    npcState.x, 
    npcState.y
  );
  
  if (!isAdjacent) {
    return false;
  }

  // Check line of sight
  const losResult = ctx.losSystem.checkLOS(
    playerState.x,
    playerState.y,
    npcState.x,
    npcState.y,
    playerState.mapLevel
  );

  return losResult.hasLOS;
}

/**
 * Checks if player can interact with a directionally-blocking entity (door, wall, gate).
 * Uses the pathfinding grid to determine which directions are blocked from the entity's tile.
 * 
 * Logic:
 * - If player is ON the entity tile → Valid (can interact)
 * - If entity blocks a direction → Player must be in that direction to interact
 * - If entity doesn't block any direction → Player can interact from any adjacent tile
 * 
 * Example: Door at (67, -125) that blocks West movement
 * - Player at (66, -125) [West of door] → Valid (at the blocked direction)
 * - Player at (67, -125) [On door] → Valid
 * - Player at (68, -125) [East of door] → Invalid (not at the blocked direction)
 */
export function checkAdjacentToDirectionalBlockingEntity(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState
): boolean {
  const playerX = playerState.x;
  const playerY = playerState.y;
  const entityX = entityState.x;
  const entityY = entityState.y;
  
  // If player is standing on the entity, always valid
  if (playerX === entityX && playerY === entityY) {
    return true;
  }
  
  // Get the pathfinding grid
  const grid = ctx.pathfindingSystem.getPathingGridForLevel(playerState.mapLevel);
  if (!grid) {
    return false;
  }
  
  // Convert entity world coordinates to grid coordinates
  const gridPos = worldToGrid(entityX, entityY, grid);
  
  // Get the tile flags at the entity's position
  const flags = grid.getOrAllBlockedValue(gridPos.x, gridPos.y);
  
  // If tile is completely blocked, can't interact
  if (flags === 0xff) {
    return false;
  }
  
  // Check which directions are blocked from the entity's tile
  const blockedDirections: PathingDirection[] = [];
  const cardinalDirections = [
    PathingDirection.North,
    PathingDirection.South,
    PathingDirection.East,
    PathingDirection.West
  ];
  
  for (const dir of cardinalDirections) {
    if ((flags & (1 << dir)) !== 0) {
      blockedDirections.push(dir);
    }
  }
  
  // If no directions are blocked, allow any adjacent position
  if (blockedDirections.length === 0) {
    const dx = Math.abs(playerX - entityX);
    const dy = Math.abs(playerY - entityY);
    return dx <= 1 && dy <= 1 && (dx + dy > 0); // Adjacent but not on entity
  }
  
  // Check if player is in one of the blocked directions (where interaction is valid)
  // If door blocks West, the player must be TO the West (where the blocking occurs)
  for (const blockedDir of blockedDirections) {
    const [dx, dy] = DIRECTION_OFFSETS[blockedDir];
    const validX = entityX + dx;
    const validY = entityY + dy;
    
    if (playerX === validX && playerY === validY) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if player is adjacent to a world entity (environment object).
 * Handles multi-tile entities (like trees that span multiple tiles).
 * 
 * A player is adjacent if they are within 1 tile of ANY tile that the entity
 * occupies, AND there is no wall/door/gate edge between the player tile and
 * the entity tile (for blocked entity tiles) or no melee-blocking obstacle
 * (for non-blocked entity tiles).
 */
export function checkAdjacentToEnvironment(
  ctx: ActionContext,
  playerState: PlayerState,
  entityState: WorldEntityState,
  forceAdjacent: boolean,
  allowDiagonal: boolean = true
): boolean {
  const playerX = playerState.x;
  const playerY = playerState.y;
  
  // Calculate the bounding box of the entity in tile space.
  // Use Math.max(Math.trunc(...), 1) to match how the pathing grid treats entity extents,
  // ensuring sub-1 sizes (e.g. 0.8) still occupy at least one tile.
  const tileWidth = Math.max(Math.trunc(entityState.width), 1);
  const tileLength = Math.max(Math.trunc(entityState.length), 1);
  const entityMinX = entityState.x;
  const entityMinY = entityState.y;
  const entityMaxX = entityState.x + tileWidth - 1;
  const entityMaxY = entityState.y + tileLength - 1;
  
  // Check if player is standing on the entity
  const isOnEntity = playerX >= entityMinX && playerX <= entityMaxX && 
                     playerY >= entityMinY && playerY <= entityMaxY;
  
  // Handle the special case when player is on the entity
  if (isOnEntity) {
    // forceAdjacent = true: Solid entities (trees/rocks) - can't stand on them
    // forceAdjacent = false: Door-like entities - standing on them is allowed
    return !forceAdjacent;
  }

  const grid = ctx.pathfindingSystem.getPathingGridForLevel(playerState.mapLevel);

  for (let entityTileX = entityMinX; entityTileX <= entityMaxX; entityTileX++) {
    for (let entityTileY = entityMinY; entityTileY <= entityMaxY; entityTileY++) {
      const dx = Math.abs(playerX - entityTileX);
      const dy = Math.abs(playerY - entityTileY);

      const isAdjacent = allowDiagonal
        ? dx <= 1 && dy <= 1
        : (dx === 0 && dy === 1) || (dx === 1 && dy === 0);

      if (!isAdjacent) {
        continue;
      }

      if (grid) {
        const playerGrid = worldToGrid(playerX, playerY, grid);
        const entityGrid = worldToGrid(entityTileX, entityTileY, grid);
        const entityTileBlocked = grid.getOrAllBlockedValue(entityGrid.x, entityGrid.y) === 0xff;

        if (entityTileBlocked) {
          // For blocked tiles (solid objects), only reject if a wall/door/gate
          // edge exists between the two tiles. Object occupancy alone is fine.
          if (grid.isWallEdgeBlocked(playerGrid.x, playerGrid.y, entityGrid.x, entityGrid.y)) {
            continue;
          }
        } else if (ctx.losSystem && ctx.losSystem.isMeleeBlocked(
          playerX,
          playerY,
          entityTileX,
          entityTileY,
          playerState.mapLevel
        )) {
          continue;
        }
      }

      return true;
    }
  }

  return false;
}
