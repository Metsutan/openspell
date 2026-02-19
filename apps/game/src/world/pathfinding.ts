import type { PathingGrid } from "./WorldModel";

const ADJACENT_COST = 2;
const DIAGONAL_COST = 3;

export enum PathingDirection {
    North = 0,
    NorthEast = 1,
    East = 2,
    SouthEast = 3,
    South = 4,
    SouthWest = 5,
    West = 6,
    NorthWest = 7,
}

const DIRECTION_AND_COST: Array<[PathingDirection, number]> = [
    [PathingDirection.North, ADJACENT_COST],
    [PathingDirection.South, ADJACENT_COST],
    [PathingDirection.East, ADJACENT_COST],
    [PathingDirection.West, ADJACENT_COST],
    [PathingDirection.NorthEast, DIAGONAL_COST],
    [PathingDirection.SouthEast, DIAGONAL_COST],
    [PathingDirection.SouthWest, DIAGONAL_COST],
    [PathingDirection.NorthWest, DIAGONAL_COST]
];

// Direction offsets matching Rust implementation:
// North = +Y (world coordinates where Y increases upward)
export const DIRECTION_OFFSETS: Record<PathingDirection, [number, number]> = {
    [PathingDirection.North]: [0, 1],
    [PathingDirection.South]: [0, -1],
    [PathingDirection.East]: [1, 0],
    [PathingDirection.West]: [-1, 0],
    [PathingDirection.NorthEast]: [1, 1],
    [PathingDirection.SouthEast]: [1, -1],
    [PathingDirection.SouthWest]: [-1, -1],
    [PathingDirection.NorthWest]: [-1, 1],
};
export const OPPOSITE_DIR: Record<PathingDirection, PathingDirection> = {
    [PathingDirection.North]: PathingDirection.South,
    [PathingDirection.NorthEast]: PathingDirection.SouthWest,
    [PathingDirection.East]: PathingDirection.West,
    [PathingDirection.SouthEast]: PathingDirection.NorthWest,
    [PathingDirection.South]: PathingDirection.North,
    [PathingDirection.SouthWest]: PathingDirection.NorthEast,
    [PathingDirection.West]: PathingDirection.East,
    [PathingDirection.NorthWest]: PathingDirection.SouthEast,
  };

  

const CARDINAL_DIRECTIONS: PathingDirection[] = [
    PathingDirection.North,
    PathingDirection.South,
    PathingDirection.East,
    PathingDirection.West
];

class MinHeapIndex {
    private items: number[] = [];
    constructor(private readonly key: (idx: number) => number) { }

    get size() { return this.items.length; }

    push(idx: number) {
        const a = this.items;
        a.push(idx);
        this.siftUp(a.length - 1);
    }

    pop(): number | undefined {
        const a = this.items;
        if (a.length === 0) return undefined;
        const top = a[0];
        const last = a.pop()!;
        if (a.length > 0) {
            a[0] = last;
            this.siftDown(0);
        }
        return top;
    }

    private siftUp(i: number) {
        const a = this.items;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.key(a[i]) >= this.key(a[p])) break;
            [a[i], a[p]] = [a[p], a[i]];
            i = p;
        }
    }

    private siftDown(i: number) {
        const a = this.items;
        const n = a.length;
        while (true) {
            let s = i;
            const l = i * 2 + 1;
            const r = l + 1;
            if (l < n && this.key(a[l]) < this.key(a[s])) s = l;
            if (r < n && this.key(a[r]) < this.key(a[s])) s = r;
            if (s === i) break;
            [a[i], a[s]] = [a[s], a[i]];
            i = s;
        }
    }

    clear() { this.items.length = 0; }
}


class Node {
    constructor(public readonly cost: number, public readonly index: number) { }
}

export class Point {
    constructor(public readonly x: number, public readonly y: number) { }

    static fromIndex(index: number, width: number): Point {
        return new Point(index % width, Math.floor(index / width));
    }

    toIndex(width: number): number {
        return this.y * width + this.x;
    }
}

function heuristic(a: Point, b: Point): number {
    const dx = (a.x - b.x) ** 2;
    const dy = (a.y - b.y) ** 2;
    return Math.sqrt(dx + dy);
}

const INF = Number.POSITIVE_INFINITY;

type ScoresWorkspace = {
    gridSize: number;
    gScore: Float64Array;
    fScore: Float64Array;
    comeFrom: Int32Array;
    touched: Int32Array;
    touchedCount: number;
    touchedFlag: Uint8Array;
};

let ASTAR_WS: ScoresWorkspace | null = null;

function createWorkspace(gridSize: number): ScoresWorkspace {
    return {
        gridSize,
        gScore: new Float64Array(gridSize),
        fScore: new Float64Array(gridSize),
        comeFrom: new Int32Array(gridSize),
        touched: new Int32Array(gridSize),
        touchedCount: 0,
        touchedFlag: new Uint8Array(gridSize)
    };
}

function ensureWorkspace(ws: ScoresWorkspace | null, gridSize: number): ScoresWorkspace {
    if (!ws || ws.gridSize !== gridSize) return createWorkspace(gridSize);
    return ws;
}

function beginRun(ws: ScoresWorkspace) {
    for (let i = 0; i < ws.touchedCount; i++) {
        const idx = ws.touched[i];
        ws.gScore[idx] = INF;
        ws.fScore[idx] = INF;
        ws.comeFrom[idx] = -1;
        ws.touchedFlag[idx] = 0;
    }
    ws.touchedCount = 0;
}

function touch(ws: ScoresWorkspace, idx: number) {
    if (ws.touchedFlag[idx] === 0) {
        ws.touchedFlag[idx] = 1;
        ws.touched[ws.touchedCount++] = idx;
        ws.gScore[idx] = INF;
        ws.fScore[idx] = INF;
        ws.comeFrom[idx] = -1;
    }
}

function isWithinBounds(x: number, y: number, width: number, height: number): boolean {
    return x >= 0 && y >= 0 && x < width && y < height;
}

function reconstructPathFromIntParents(comeFrom: Int32Array, width: number, endIndex: number): Point[] {
    const path: Point[] = [];
    let cur = endIndex;
    while (cur !== -1) {
        path.push(Point.fromIndex(cur, width));
        cur = comeFrom[cur];
    }
    return path.reverse();
}

function heuristicXY(x: number, y: number, goal: Point): number {
    return heuristic(new Point(x, y), goal);
}

// Reuse heap too (avoid per-search allocation)
let OPEN_HEAP: MinHeapIndex | null = null;
let OPEN_HEAP_WS: ScoresWorkspace | null = null;

/**
 * Performs A* pathfinding search with optional radius limit.
 * 
 * @param grid - The pathfinding grid
 * @param start - Starting point
 * @param goal - Goal point (for heuristic)
 * @param goalMatchers - Function to check if a tile is a valid goal
 * @param maxSearchRadius - Maximum tile distance from start to search (null = unlimited)
 * @returns Path from start to goal, or null if no path found
 */
function performAstarSearch(
    grid: PathingGrid,
    start: Point,
    goal: Point,
    goalMatchers: (index: number) => boolean,
    maxSearchRadius: number | null = null
): Point[] | null {
    const width = grid.getWidth();
    const height = grid.getHeight();
    const gridSize = width * height;

    if (gridSize === 0) return null;

    if (!isWithinBounds(start.x, start.y, width, height) || !isWithinBounds(goal.x, goal.y, width, height)) {
        return null;
    }

    ASTAR_WS = ensureWorkspace(ASTAR_WS, gridSize);
    const ws = ASTAR_WS;
    beginRun(ws);

    // The heap comparator closes over `ws`. If workspace changes (e.g. switching
    // between 1024x1024 and 480x480 map grids), we must rebuild the heap so it
    // reads fScore from the current workspace.
    if (!OPEN_HEAP || OPEN_HEAP_WS !== ws) {
        OPEN_HEAP = new MinHeapIndex((idx) => ws.fScore[idx]);
        OPEN_HEAP_WS = ws;
    }
    const openSet = OPEN_HEAP;
    openSet.clear();

    const startIndex = start.x + start.y * width;
    touch(ws, startIndex);
    ws.gScore[startIndex] = 0;
    ws.fScore[startIndex] = heuristic(start, goal) * ADJACENT_COST;
    openSet.push(startIndex);

    // Pre-compute radius limit if specified
    const radiusSquared = maxSearchRadius !== null ? maxSearchRadius * maxSearchRadius : null;

    while (openSet.size > 0) {
        const index = openSet.pop()!;
        touch(ws, index);

        const x = index % width;
        const y = (index / width) | 0;

        // Enforce hard search radius boundary from the start tile.
        // This must happen before goal checks so out-of-radius goals are rejected.
        if (radiusSquared !== null) {
            const dx = x - start.x;
            const dy = y - start.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > radiusSquared) {
                continue;
            }
        }

        if (goalMatchers(index)) {
            return reconstructPathFromIntParents(ws.comeFrom, width, index);
        }

        const currentF = ws.fScore[index];
        // If you ever push duplicates, this stale check still works:
        // (But now you don't have 'current.cost', so do:
        // if (currentF !== ws.fScore[index]) continue;  // not useful
        // Better: keep duplicates and rely on gScore check below.

        const currentG = ws.gScore[index];
        const flags = grid.getOrAllBlockedValue(x, y);

        for (const [direction, directionCost] of DIRECTION_AND_COST) {
            // 1) blocked edge from current cell?
            if ((flags & (1 << direction)) !== 0) continue;
          
            const [dx, dy] = DIRECTION_OFFSETS[direction];
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

            // Keep neighbors outside radius out of the open set entirely.
            if (radiusSquared !== null) {
              const ndx = nx - start.x;
              const ndy = ny - start.y;
              const nDistSq = ndx * ndx + ndy * ndy;
              if (nDistSq > radiusSquared) continue;
            }
          
            // 2) destination tile closed?
            const nFlags = grid.getOrAllBlockedValue(nx, ny);
            if (nFlags === 0xff) continue; // or if you have a CLOSED_BIT, test that
          
            // 3) diagonal corner cutting prevention
            const isDiagonal =
              direction === PathingDirection.NorthEast ||
              direction === PathingDirection.SouthEast ||
              direction === PathingDirection.SouthWest ||
              direction === PathingDirection.NorthWest;
          
            if (isDiagonal) {
              let d1: PathingDirection;
              let d2: PathingDirection;
          
              switch (direction) {
                case PathingDirection.NorthEast:
                  d1 = PathingDirection.North; d2 = PathingDirection.East; break;
                case PathingDirection.SouthEast:
                  d1 = PathingDirection.South; d2 = PathingDirection.East; break;
                case PathingDirection.SouthWest:
                  d1 = PathingDirection.South; d2 = PathingDirection.West; break;
                case PathingDirection.NorthWest:
                  d1 = PathingDirection.North; d2 = PathingDirection.West; break;
              }
          
              // both adjacent cardinals must be allowed from the source tile
              if ((flags & (1 << d1)) !== 0) continue;
              if ((flags & (1 << d2)) !== 0) continue;
          
              // optionally also require the intermediate tiles not closed:
              // (prevents diagonal squeezing past solid blocks)
              const [dx1, dy1] = DIRECTION_OFFSETS[d1];
              const [dx2, dy2] = DIRECTION_OFFSETS[d2];
              if (grid.getOrAllBlockedValue(x + dx1, y + dy1) === 0xff) continue;
              if (grid.getOrAllBlockedValue(x + dx2, y + dy2) === 0xff) continue;
            }
          
            const neighborIndex = nx + ny * width;
            touch(ws, neighborIndex);
          
            const tentativeG = currentG + directionCost;
            if (tentativeG < ws.gScore[neighborIndex]) {
              ws.comeFrom[neighborIndex] = index;
              ws.gScore[neighborIndex] = tentativeG;
              ws.fScore[neighborIndex] = tentativeG + heuristicXY(nx, ny, goal) * ADJACENT_COST;
              openSet.push(neighborIndex);
            }
          }
    }
    return null;
}

/**
 * A* pathfinding from start to goal.
 * 
 * @param grid - The pathfinding grid
 * @param start - Starting point
 * @param goal - Goal point
 * @param maxSearchRadius - Optional: Maximum tile distance from start to search (null = unlimited)
 * @returns Path from start to goal, or null if no path found within radius
 */
export function astarPathfinding(
    grid: PathingGrid, 
    start: Point, 
    goal: Point,
    maxSearchRadius: number | null = null
): Point[] | null {
    const goalIndex = goal.toIndex(grid.getWidth());
    const goalMatcher = (index: number) => index === goalIndex;
    return performAstarSearch(grid, start, goal, goalMatcher, maxSearchRadius);
}

export function astarPathfindingWithOffset(
    grid: PathingGrid,
    toMapXOffset: number,
    toMapYOffset: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
): Array<[number, number]> | null {
    const path = astarPathfinding(
        grid,
        new Point(toMapXOffset + fromX, toMapYOffset + fromY),
        new Point(toMapXOffset + toX, toMapYOffset + toY)
    );

    if (!path) return null;

    return path.map((point) => [point.x - toMapXOffset, point.y - toMapYOffset]);
}



/**
 * A* pathfinding to adjacent tile of goal (for entities blocking the goal tile).
 * 
 * @param grid - The pathfinding grid
 * @param start - Starting point
 * @param goal - Goal point (will path to adjacent tile)
 * @param maxSearchRadius - Optional: Maximum tile distance from start to search (null = unlimited)
 * @returns Path from start to tile adjacent to goal, or null if no path found
 */
export function astarPathfindingAdjacent(
    grid: PathingGrid,
    start: Point,
    goal: Point,
    maxSearchRadius: number | null = null
): Point[] | null {
    const width = grid.getWidth();
    const height = grid.getHeight();
    if (width === 0 || height === 0) return null;

    const goalIndex = goal.x + goal.y * width;
    const goalIndexes = [goalIndex, goalIndex, goalIndex, goalIndex, goalIndex];
    
    const endpointFlags = grid.getOrAllBlockedValue(goal.x, goal.y);

    CARDINAL_DIRECTIONS.forEach((direction, idx) => {
        if (endpointFlags & (1 << direction)) return;
        const [dx, dy] = DIRECTION_OFFSETS[direction];
        const nx = goal.x + dx;
        const ny = goal.y + dy;
        if (!isWithinBounds(nx, ny, width, height)) return;
        goalIndexes[idx] = nx + ny * width;
    });

    const g0 = goalIndexes[0], g1 = goalIndexes[1], g2 = goalIndexes[2], g3 = goalIndexes[3], g4 = goalIndexes[4];
    const goalMatcher = (i: number) => i === g0 || i === g1 || i === g2 || i === g3 || i === g4;
    return performAstarSearch(grid, start, goal, goalMatcher, maxSearchRadius);
}

export function astarPathfindingWithOffsetAdjacent(
    grid: PathingGrid,
    toMapXOffset: number,
    toMapYOffset: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
): Array<[number, number]> | null {
    const path = astarPathfindingAdjacent(
        grid,
        new Point(toMapXOffset + fromX, toMapYOffset + fromY),
        new Point(toMapXOffset + toX, toMapYOffset + toY)
    );

    if (!path) return null;

    return path.map((point) => [point.x - toMapXOffset, point.y - toMapYOffset]);
}


function sign(n: number): -1 | 0 | 1 {
    return n > 0 ? 1 : n < 0 ? -1 : 0;
  }
  
  // Maps delta to direction, matching DIRECTION_OFFSETS (North = +Y)
  function dirFromDelta(dx: number, dy: number): PathingDirection | null {
    if (dx === 0 && dy === 1) return PathingDirection.North;
    if (dx === 1 && dy === 1) return PathingDirection.NorthEast;
    if (dx === 1 && dy === 0) return PathingDirection.East;
    if (dx === 1 && dy === -1) return PathingDirection.SouthEast;
    if (dx === 0 && dy === -1) return PathingDirection.South;
    if (dx === -1 && dy === -1) return PathingDirection.SouthWest;
    if (dx === -1 && dy === 0) return PathingDirection.West;
    if (dx === -1 && dy === 1) return PathingDirection.NorthWest;
    return null;
  }
  
  function canStep(grid: PathingGrid, x: number, y: number, dir: PathingDirection): boolean {
    const flags = grid.getOrAllBlockedValue(x, y);
    // 1) Is this direction blocked from the current cell?
    if ((flags & (1 << dir)) !== 0) return false;
  
    const [dx, dy] = DIRECTION_OFFSETS[dir];
    const nx = x + dx, ny = y + dy;
  
    // 2) Is the destination tile fully closed?
    if (grid.getOrAllBlockedValue(nx, ny) === 0xff) return false;
  
    // 3) For diagonals: prevent corner cutting
    // Must check both cardinal directions are allowed AND intermediate tiles aren't closed
    if (dir === PathingDirection.NorthEast) {
      if ((flags & (1 << PathingDirection.North)) !== 0) return false;
      if ((flags & (1 << PathingDirection.East)) !== 0) return false;
      // Check intermediate tiles aren't fully closed (matching A* logic)
      if (grid.getOrAllBlockedValue(x, y + 1) === 0xff) return false; // North tile
      if (grid.getOrAllBlockedValue(x + 1, y) === 0xff) return false; // East tile
    } else if (dir === PathingDirection.SouthEast) {
      if ((flags & (1 << PathingDirection.South)) !== 0) return false;
      if ((flags & (1 << PathingDirection.East)) !== 0) return false;
      if (grid.getOrAllBlockedValue(x, y - 1) === 0xff) return false; // South tile
      if (grid.getOrAllBlockedValue(x + 1, y) === 0xff) return false; // East tile
    } else if (dir === PathingDirection.SouthWest) {
      if ((flags & (1 << PathingDirection.South)) !== 0) return false;
      if ((flags & (1 << PathingDirection.West)) !== 0) return false;
      if (grid.getOrAllBlockedValue(x, y - 1) === 0xff) return false; // South tile
      if (grid.getOrAllBlockedValue(x - 1, y) === 0xff) return false; // West tile
    } else if (dir === PathingDirection.NorthWest) {
      if ((flags & (1 << PathingDirection.North)) !== 0) return false;
      if ((flags & (1 << PathingDirection.West)) !== 0) return false;
      if (grid.getOrAllBlockedValue(x, y + 1) === 0xff) return false; // North tile
      if (grid.getOrAllBlockedValue(x - 1, y) === 0xff) return false; // West tile
    }
  
    return true;
  }
  
  export function greedyStepToward(grid: PathingGrid, x: number, y: number, tx: number, ty: number): [number, number] | null {
    const dx = sign(tx - x);
    const dy = sign(ty - y);

    // Candidate ordering: try diagonals last (or first) depending on your style.
    // This order tends to “hug” cardinals and avoids diagonal jitter.
    const baseCandidates: [number, number][] = [
      [dx, 0],
      [0, dy],
      [dx, dy],
      // fallbacks if the preferred axis is blocked:
      [dx, -dy],
      [-dx, dy],
    ];
    const candidates = baseCandidates.filter(([cx, cy]) => cx !== 0 || cy !== 0);
  
    for (const [cx, cy] of candidates) {
      const dir = dirFromDelta(cx, cy);
      if (dir === null) continue;
      if (!canStep(grid, x, y, dir)) continue;
      return [x + cx, y + cy];
    }
    return null;
  }

  /**
   * Simplified step check for "dumb" pursuit - no corner-cutting prevention.
   * Only checks:
   * 1. Direction isn't blocked by an edge (wall/door/fence)
   * 2. Destination tile isn't fully closed
   * 
   * This allows NPCs to move diagonally past blocked adjacent tiles,
   * which is the expected RuneScape-like "dumb" pursuit behavior.
   */
  function canStepDumb(grid: PathingGrid, x: number, y: number, dir: PathingDirection): boolean {
    const flags = grid.getOrAllBlockedValue(x, y);
    
    // Is this direction blocked from the current cell (edge blocker)?
    if ((flags & (1 << dir)) !== 0) return false;

    const [dx, dy] = DIRECTION_OFFSETS[dir];
    const nx = x + dx, ny = y + dy;

    // Is the destination tile fully closed?
    if (grid.getOrAllBlockedValue(nx, ny) === 0xff) return false;

    // No corner-cutting check - allow diagonal past blocked adjacent tiles
    return true;
  }

  /**
   * Greedy "dumb" step toward a target, stopping when cardinally adjacent.
   * 
   * RuneScape-like behavior:
   * - Diagonal movement IS allowed and preferred when it achieves adjacency faster
   * - NPCs should follow diagonal player movement with diagonal movement
   * - NO pathfinding around obstacles - if blocked, stay stuck
   * 
   * Priority order:
   * 1. If diagonal step achieves cardinal adjacency → take it (fastest path)
   * 2. If already aligned, move directly toward target
   * 3. Otherwise, move diagonally toward target (closes both axes)
   * 4. If diagonal blocked, try cardinal toward alignment
   * 5. If all blocked → stay stuck
   */
  export function greedyStepTowardAdjacent(
    grid: PathingGrid,
    x: number,
    y: number,
    tx: number,
    ty: number
  ): [number, number] | null {
    const rawDx = tx - x;
    const rawDy = ty - y;
    const dx = sign(rawDx);
    const dy = sign(rawDy);
    const absDx = Math.abs(rawDx);
    const absDy = Math.abs(rawDy);

    // If already on the target tile, try to step off in any cardinal direction.
    if (rawDx === 0 && rawDy === 0) {
      const escape: [number, number][] = [
        [0, 1],  // north
        [0, -1], // south
        [1, 0],  // east
        [-1, 0], // west
      ];
      for (const [ex, ey] of escape) {
        const dir = dirFromDelta(ex, ey);
        if (dir === null) continue;
        if (!canStepDumb(grid, x, y, dir)) continue;
        return [x + ex, y + ey];
      }
      return null;
    }

    // Already cardinally adjacent - stay put
    if (absDx + absDy === 1) {
      return null;
    }

    // PRIORITY 1: Check if a diagonal step would achieve cardinal adjacency
    // This is the key optimization - diagonal is fastest when it gets us adjacent
    if (dx !== 0 && dy !== 0) {
      const diagX = x + dx;
      const diagY = y + dy;
      const distAfterDiagX = Math.abs(tx - diagX);
      const distAfterDiagY = Math.abs(ty - diagY);
      
      // Would diagonal position be cardinally adjacent to target?
      if (distAfterDiagX + distAfterDiagY === 1) {
        const diagDir = dirFromDelta(dx, dy);
        if (diagDir !== null && canStepDumb(grid, x, y, diagDir)) {
          return [diagX, diagY];
        }
      }
    }

    // PRIORITY 2: Already aligned on X axis - move directly toward target on Y
    if (rawDx === 0) {
      const dir = dirFromDelta(0, dy);
      if (dir !== null && canStepDumb(grid, x, y, dir)) {
        return [x, y + dy];
      }
      // Blocked - stay stuck
      return null;
    }

    // PRIORITY 2: Already aligned on Y axis - move directly toward target on X
    if (rawDy === 0) {
      const dir = dirFromDelta(dx, 0);
      if (dir !== null && canStepDumb(grid, x, y, dir)) {
        return [x + dx, y];
      }
      // Blocked - stay stuck
      return null;
    }

    // PRIORITY 3: Diagonally offset - prefer diagonal movement toward target
    // This closes distance on both axes simultaneously
    const diagDir = dirFromDelta(dx, dy);
    if (diagDir !== null && canStepDumb(grid, x, y, diagDir)) {
      const nx = x + dx;
      const ny = y + dy;
      if (!(nx === tx && ny === ty)) { // Don't step onto target
        return [nx, ny];
      }
    }

    // PRIORITY 4: Diagonal blocked - try cardinal moves toward alignment
    // Prefer the axis that's closer to alignment
    if (absDx <= absDy) {
      // X is closer - try moving on X
      const xDir = dirFromDelta(dx, 0);
      if (xDir !== null && canStepDumb(grid, x, y, xDir)) {
        const nx = x + dx;
        if (!(nx === tx && y === ty)) {
          return [nx, y];
        }
      }
      // X blocked - try Y
      const yDir = dirFromDelta(0, dy);
      if (yDir !== null && canStepDumb(grid, x, y, yDir)) {
        const ny = y + dy;
        if (!(x === tx && ny === ty)) {
          return [x, ny];
        }
      }
    } else {
      // Y is closer - try moving on Y
      const yDir = dirFromDelta(0, dy);
      if (yDir !== null && canStepDumb(grid, x, y, yDir)) {
        const ny = y + dy;
        if (!(x === tx && ny === ty)) {
          return [x, ny];
        }
      }
      // Y blocked - try X
      const xDir = dirFromDelta(dx, 0);
      if (xDir !== null && canStepDumb(grid, x, y, xDir)) {
        const nx = x + dx;
        if (!(nx === tx && y === ty)) {
          return [nx, y];
        }
      }
    }

    // All options blocked - stay stuck
    return null;
  }
  