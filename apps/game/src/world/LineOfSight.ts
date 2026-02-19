import type { MapLevel } from "./Location";
import type { WorldModel, PathingGrid } from "./WorldModel";
import { worldToGrid } from "./gridTransforms";
import { PathingDirection } from "./pathfinding";

/**
 * Point on a 2D grid
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Result of a line of sight check
 */
export interface LOSResult {
  hasLOS: boolean;
  blockedAt?: Point2D;
}

/**
 * Line of Sight system using Bresenham's Line Algorithm with PathingGrid.
 * 
 * Uses the pre-computed projectile blocking flags from PathingGrid for efficient LOS checks.
 * This avoids iterating through all entities on every check.
 * 
 * Only entities with canProjectile=false block line of sight.
 * Fully blocked tiles (0xff) also block projectiles.
 */
export class LineOfSightSystem {
  private readonly pathingGridCache = new Map<MapLevel, PathingGrid | null>();
  
  constructor(private readonly worldModel: WorldModel) {}

  /**
   * Gets or builds the pathfinding grid for a map level.
   * Caches grids for performance.
   */
  private getPathingGrid(mapLevel: MapLevel): PathingGrid | null {
    if (this.pathingGridCache.has(mapLevel)) {
      return this.pathingGridCache.get(mapLevel)!;
    }
    
    // Determine layer name based on map level
    let layerName: string;
    if (mapLevel === 0) layerName = "earthunderground";
    else if (mapLevel === 1) layerName = "earthoverworld";
    else if (mapLevel === 2) layerName = "earthsky";
    else return null;
    
    // Build pathing grid (includes projectile flags)
    const grid = this.worldModel.buildPathingGrid({
      layerName,
      mapLevel,
      worldEntities: this.worldModel.getEntities()
    });
    
    this.pathingGridCache.set(mapLevel, grid ?? null);
    return grid ?? null;
  }

  /**
   * Checks if there's line of sight between two world coordinates.
   * 
   * Uses Bresenham's algorithm to trace the line, then checks each segment
   * against the pre-computed projectile blocking grid for efficiency.
   * 
   * This avoids iterating through all entities - the grid is pre-built with
   * only entities that have canProjectile=false.
   * 
   * @param fromX Starting X coordinate (world space)
   * @param fromY Starting Y coordinate (world Z coordinate)
   * @param toX Target X coordinate (world space)
   * @param toY Target Y coordinate (world Z coordinate)
   * @param mapLevel The map level to check on
   * @returns LOSResult with hasLOS boolean and optional blocking point
   */
  checkLOS(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    mapLevel: MapLevel
  ): LOSResult {
    const grid = this.getPathingGrid(mapLevel);
    if (!grid) {
      // No grid available - assume LOS is clear
      return { hasLOS: true };
    }

    // Get the line points using Bresenham's algorithm
    const linePoints = bresenhamLine(
      Math.floor(fromX),
      Math.floor(fromY),
      Math.floor(toX),
      Math.floor(toY)
    );

    // Convert world coordinates to grid coordinates
    const gridPoints = linePoints.map(p => worldToGrid(p.x, p.y, grid));

    // Check each segment of the line for projectile blocking
    for (let i = 0; i < gridPoints.length - 1; i++) {
      const from = gridPoints[i];
      const to = gridPoints[i + 1];
      
      // Check if projectile is blocked moving from this tile to the next
      if (grid.isProjectileBlocked(from.x, from.y, to.x, to.y)) {
        return {
          hasLOS: false,
          blockedAt: linePoints[i + 1]
        };
      }
    }

    return { hasLOS: true };
  }

  /**
   * Checks whether melee movement/adjacent striking is blocked between two tiles.
   * Uses movement/pathing blockers (walls/fences), not projectile blockers.
   */
  isMeleeBlocked(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    mapLevel: MapLevel
  ): boolean {
    const grid = this.getPathingGrid(mapLevel);
    if (!grid) {
      return false;
    }

    const from = worldToGrid(Math.floor(fromX), Math.floor(fromY), grid);
    const to = worldToGrid(Math.floor(toX), Math.floor(toY), grid);

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Keep existing semantics for non-adjacent checks.
    if (absDx > 1 || absDy > 1) {
      return grid.isMovementBlocked(from.x, from.y, to.x, to.y);
    }

    // Same tile is never "melee blocked".
    if (absDx === 0 && absDy === 0) {
      return false;
    }

    // For diagonal adjacency, allow interaction if at least one of the two
    // cardinal approach edges is clear. This preserves wall/fence blocking
    // while avoiding over-strict diagonal rejection.
    if (absDx === 1 && absDy === 1) {
      const fromFlags = grid.getOrAllBlockedValue(from.x, from.y);
      const stepX = dx > 0 ? 1 : -1;
      const stepY = dy > 0 ? 1 : -1;

      const xDir = stepX > 0 ? PathingDirection.East : PathingDirection.West;
      const yDir = stepY > 0 ? PathingDirection.North : PathingDirection.South;

      const xEdgeBlocked = (fromFlags & (1 << xDir)) !== 0;
      const yEdgeBlocked = (fromFlags & (1 << yDir)) !== 0;

      const xTileBlocked = grid.getOrAllBlockedValue(from.x + stepX, from.y) === 0xff;
      const yTileBlocked = grid.getOrAllBlockedValue(from.x, from.y + stepY) === 0xff;

      const xPathBlocked = xEdgeBlocked || xTileBlocked;
      const yPathBlocked = yEdgeBlocked || yTileBlocked;

      return xPathBlocked && yPathBlocked;
    }

    // Cardinal adjacency uses directional movement blockers directly.
    return grid.isMovementBlocked(from.x, from.y, to.x, to.y);
  }

  /**
   * REMOVED: Old entity iteration method (replaced with PathingGrid).
   * 
   * The LOS system now uses pre-computed projectile blocking flags from PathingGrid
   * instead of iterating through entities on every check. This is much more efficient
   * and correctly handles directional wall blocking.
   */

  /**
   * Quick check if two points are within a certain range.
   * Uses Chebyshev distance (max of dx, dy) for tile-based range.
   */
  isWithinRange(x1: number, y1: number, x2: number, y2: number, range: number): boolean {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return Math.max(dx, dy) <= range;
  }

  /**
   * Checks if a target is within melee range (adjacent, including diagonals).
   */
  isAdjacentTo(x1: number, y1: number, x2: number, y2: number): boolean {
    return this.isWithinRange(x1, y1, x2, y2, 1);
  }
}

/**
 * Bresenham's Line Algorithm
 * Returns all integer grid points along the line from (x0, y0) to (x1, y1).
 * This is the standard algorithm used for line-of-sight in grid-based games.
 * 
 * @param x0 Starting X coordinate
 * @param y0 Starting Y coordinate
 * @param x1 Ending X coordinate
 * @param y1 Ending Y coordinate
 * @returns Array of points along the line
 */
export function bresenhamLine(x0: number, y0: number, x1: number, y1: number): Point2D[] {
  const points: Point2D[] = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);

  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  let err = dx - dy;
  let x = x0;
  let y = y0;

  while (true) {
    points.push({ x, y });

    // Reached the end point
    if (x === x1 && y === y1) {
      break;
    }

    const e2 = 2 * err;

    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }

    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return points;
}
