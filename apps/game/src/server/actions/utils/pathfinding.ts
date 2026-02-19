/**
 * Pathfinding utilities for action handlers
 */
import { astarPathfinding, Point } from "../../../world/pathfinding";
import { gridToWorld, worldToGrid } from "../../../world/gridTransforms";
import type { MapLevel } from "../../../world/Location";
import type { ActionContext } from "../types";

const DEFAULT_CLICK_MAX_SEARCH_RADIUS = 64;

/**
 * Builds a movement path using A* pathfinding.
 * Shared utility for action handlers that need pathfinding.
 */
export function buildMovementPath(
  ctx: ActionContext,
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  mapLevel: MapLevel
): Point[] | null {
  const grid = ctx.pathfindingSystem.getPathingGridForLevel(mapLevel);
  if (!grid) {
    return null;
  }

  const gridStart = worldToGrid(startX, startY, grid);
  const gridTarget = worldToGrid(targetX, targetY, grid);
  const candidate = astarPathfinding(
    grid,
    gridStart,
    gridTarget,
    DEFAULT_CLICK_MAX_SEARCH_RADIUS
  );
  
  if (candidate && candidate.length > 1) {
    return candidate.map((p) => gridToWorld(p, grid));
  }

  return null;
}

/**
 * Builds a movement path to a target or adjacent to it if the target is blocked.
 * This is useful for interacting with NPCs, items on tables, or blocked tiles.
 * 
 * When finding adjacent tiles, prioritizes tiles with line of sight to the target.
 * This prevents pathfinding to tiles on the opposite side of walls.
 * 
 * Tries in order:
 * 1. Path directly to target (if walkable and forceAdjacent is false)
 * 2. Path to adjacent tiles with LOS, sorted by distance (cardinal first, then diagonal if allowed)
 * 3. Path to adjacent tiles without LOS (fallback if no LOS tiles available)
 * 
 * For door-like entities (forceAdjacent=false, allowDiagonal=false):
 * - Tries direct path first (player inside room standing on door)
 * - Falls back to cardinal adjacent only if direct path blocked (player outside room)
 * - Only N, S, E, W adjacency allowed (no diagonals) since doors have specific entry/exit points
 * - Adjacency check must accept BOTH on entity OR cardinally adjacent to handle both cases
 * 
 * @param ctx - Action context containing pathfinding and LOS systems
 * @param startX - Starting X coordinate (world space)
 * @param startY - Starting Y coordinate (world space) 
 * @param targetX - Target X coordinate (world space)
 * @param targetY - Target Y coordinate (world space)
 * @param mapLevel - Map level to pathfind on
 * @param forceAdjacent - If true, always path adjacent even if target is walkable (for NPCs, solid objects)
 * @param maxSearchRadius - Optional: Maximum tile distance from start to search (null = unlimited)
 * @param allowDiagonal - If false, only consider cardinal adjacency (N, S, E, W), not diagonals (for doors)
 * @returns Path to target or adjacent tile, or null if no path found
 */
export function buildMovementPathAdjacent(
  ctx: ActionContext,
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  mapLevel: MapLevel,
  forceAdjacent: boolean = false,
  maxSearchRadius: number | null = DEFAULT_CLICK_MAX_SEARCH_RADIUS,
  allowDiagonal: boolean = true
): Point[] | null {
  const grid = ctx.pathfindingSystem.getPathingGridForLevel(mapLevel);
  if (!grid) {
    return null;
  }

  const gridStart = worldToGrid(startX, startY, grid);
  const gridTarget = worldToGrid(targetX, targetY, grid);

  // Try direct path first (if target is walkable and not forced to be adjacent)
  if (!forceAdjacent) {
    const directPath = astarPathfinding(grid, gridStart, gridTarget, maxSearchRadius);
    if (directPath && directPath.length > 1) {
      return directPath.map((p) => gridToWorld(p, grid));
    }
  }

  // Target is blocked or unreachable or forceAdjacent is true - try adjacent tiles
  // Sort adjacent tiles by distance from start point (closest first)
  const allAdjacentOffsets = [
    [0, 1],   // North
    [1, 0],   // East
    [0, -1],  // South
    [-1, 0],  // West
    [1, 1],   // NE
    [1, -1],  // SE
    [-1, -1], // SW
    [-1, 1]   // NW
  ];

  // Filter to cardinal directions only if diagonal movement not allowed
  const adjacentOffsets = allowDiagonal 
    ? allAdjacentOffsets 
    : allAdjacentOffsets.slice(0, 4); // Only cardinal directions (N, E, S, W)

  // Calculate distance from start to each adjacent tile and sort by closest
  const adjacentWithDistance = adjacentOffsets.map(([dx, dy]) => {
    const adjX = gridTarget.x + dx;
    const adjY = gridTarget.y + dy;
    const distSq = (adjX - gridStart.x) ** 2 + (adjY - gridStart.y) ** 2;
    return { dx, dy, adjX, adjY, distSq };
  });

  // Sort by distance (shortest first)
  adjacentWithDistance.sort((a, b) => a.distSq - b.distSq);

  // Check LOS for each adjacent tile if LOS system is available
  const tilesWithLOS: typeof adjacentWithDistance = [];
  const tilesWithoutLOS: typeof adjacentWithDistance = [];

  for (const tile of adjacentWithDistance) {
    // Check if adjacent tile is walkable (not 0xff)
    const tileValue = grid.getOrAllBlockedValue(tile.adjX, tile.adjY);
    if (tileValue === 0xff) {
      continue; // Skip blocked tiles
    }

    // Convert grid coordinates to world coordinates for LOS check
    const worldAdj = gridToWorld(new Point(tile.adjX, tile.adjY), grid);
    
    // Check LOS from adjacent tile to target
    if (ctx.losSystem) {
      const losResult = ctx.losSystem.checkLOS(worldAdj.x, worldAdj.y, targetX, targetY, mapLevel);
      if (losResult.hasLOS) {
        tilesWithLOS.push(tile);
      } else {
        tilesWithoutLOS.push(tile);
      }
    } else {
      // No LOS system - treat all tiles equally
      tilesWithLOS.push(tile);
    }
  }

  // Try tiles with LOS first (prevents pathfinding through walls)
  for (const { adjX, adjY } of tilesWithLOS) {
    const adjPoint = new Point(adjX, adjY);
    const path = astarPathfinding(grid, gridStart, adjPoint, maxSearchRadius);
    
    if (path && path.length > 1) {
      return path.map((p) => gridToWorld(p, grid));
    }
  }

  // Fallback: Try tiles without LOS (in case all LOS tiles are unreachable)
  for (const { adjX, adjY } of tilesWithoutLOS) {
    const adjPoint = new Point(adjX, adjY);
    const path = astarPathfinding(grid, gridStart, adjPoint, maxSearchRadius);
    
    if (path && path.length > 1) {
      return path.map((p) => gridToWorld(p, grid));
    }
  }

  // No path found to target or any adjacent tile
  return null;
}

/**
 * Builds a movement path to any tile within a given range of a target.
 * Prefers tiles with LOS to the target, then falls back to non-LOS tiles.
 *
 * @param ctx - Action context containing pathfinding and LOS systems
 * @param startX - Starting X coordinate (world space)
 * @param startY - Starting Y coordinate (world space)
 * @param targetX - Target X coordinate (world space)
 * @param targetY - Target Y coordinate (world space)
 * @param mapLevel - Map level to pathfind on
 * @param range - Chebyshev range to target (1 = adjacent, 5 = ranged, etc.)
 * @param maxSearchRadius - Optional: Maximum tile distance from start to search (null = unlimited)
 * @returns Path to a tile within range, or null if no path found
 */
export function buildMovementPathWithinRange(
  ctx: ActionContext,
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  mapLevel: MapLevel,
  range: number,
  maxSearchRadius: number | null = DEFAULT_CLICK_MAX_SEARCH_RADIUS,
  requireLOS: boolean = false
): Point[] | null {
  if (range <= 1) {
    return buildMovementPathAdjacent(
      ctx,
      startX,
      startY,
      targetX,
      targetY,
      mapLevel,
      true,
      maxSearchRadius
    );
  }

  const grid = ctx.pathfindingSystem.getPathingGridForLevel(mapLevel);
  if (!grid) {
    return null;
  }

  const gridStart = worldToGrid(startX, startY, grid);

  const tilesWithLOS: Array<{ x: number; y: number; distSq: number }> = [];
  const tilesWithoutLOS: Array<{ x: number; y: number; distSq: number }> = [];

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      if (distance === 0 || distance > range) {
        continue;
      }

      const candidateX = targetX + dx;
      const candidateY = targetY + dy;
      const gridCandidate = worldToGrid(candidateX, candidateY, grid);
      const tileValue = grid.getOrAllBlockedValue(gridCandidate.x, gridCandidate.y);
      if (tileValue === 0xff) {
        continue;
      }

      const distSq = (gridCandidate.x - gridStart.x) ** 2 + (gridCandidate.y - gridStart.y) ** 2;

      if (ctx.losSystem) {
        const losResult = ctx.losSystem.checkLOS(candidateX, candidateY, targetX, targetY, mapLevel);
        if (losResult.hasLOS) {
          tilesWithLOS.push({ x: gridCandidate.x, y: gridCandidate.y, distSq });
        } else {
          tilesWithoutLOS.push({ x: gridCandidate.x, y: gridCandidate.y, distSq });
        }
      } else {
        tilesWithLOS.push({ x: gridCandidate.x, y: gridCandidate.y, distSq });
      }
    }
  }

  tilesWithLOS.sort((a, b) => a.distSq - b.distSq);
  tilesWithoutLOS.sort((a, b) => a.distSq - b.distSq);

  for (const { x, y } of tilesWithLOS) {
    const path = astarPathfinding(grid, gridStart, new Point(x, y), maxSearchRadius);
    if (path && path.length > 1) {
      return path.map((p) => gridToWorld(p, grid));
    }
  }

  if (!requireLOS) {
    for (const { x, y } of tilesWithoutLOS) {
      const path = astarPathfinding(grid, gridStart, new Point(x, y), maxSearchRadius);
      if (path && path.length > 1) {
        return path.map((p) => gridToWorld(p, grid));
      }
    }
  }

  return null;
}
