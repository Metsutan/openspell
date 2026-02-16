import { promises as fs } from "fs";
import path from "path";
import { OPPOSITE_DIR, DIRECTION_OFFSETS, PathingDirection } from "./pathfinding";
import {
    MAP_LEVELS,
    setLocationBoundsForMapLevel,
    type MapLevel
} from "./Location";
import { computeCoordinateBoundsFromDimension, setMapLevelDimensions } from "./MapDimensions";
import { worldToGrid } from "./gridTransforms";

type PngReadResult = {
    width: number;
    height: number;
    data: Buffer;
};

type PngModule = {
    PNG: {
        sync: {
            read(buffer: Buffer, options?: unknown): PngReadResult;
        };
    };
};

const PNG = (require("pngjs") as PngModule).PNG;

export enum Dir {
    N = 0,
    E = 1,
    S = 2,
    W = 3,
    NE = 4,
    SE = 5,
    SW = 6,
    NW = 7,
    None = 8,
}

export enum TileFlags {
    Open = 1,
    SouthWall = 2,
    WestWall = 4,
    Closed = 8,
}

// Static assets path - configurable via environment variable
// Default assumes shared-assets structure for Docker compatibility
const DEFAULT_STATIC_ASSETS_ROOT = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "shared-assets",
    "base",
    "static"
);
const STATIC_ASSETS_ROOT = process.env.STATIC_ASSETS_PATH 
    ? path.resolve(process.env.STATIC_ASSETS_PATH)
    : DEFAULT_STATIC_ASSETS_ROOT;

const DEFAULT_ENTITIES_FILE = process.env.WORLD_ENTITIES_FILE || "worldentities.26.carbon";
const DEFAULT_ENTITY_DEFS_FILE = process.env.WORLD_ENTITY_DEFS_FILE || "worldentitydefs.13.carbon";

export interface WorldEntityDefinition {
    _id: number;
    type: string;
    name: string | null;
    desc: string | null;
    actions: string[] | null;
    respawnTicks: number | null;
    resourceProbability: number | null;
    maxResourcesPerSpawn: number | null;
    minResourcesPerSpawn: number | null;
    useItemWithEntityActions: unknown;
    canProjectile: boolean;
    [key: string]: unknown;
}

export interface RawWorldEntity {
    _id: number;
    type: string;
    dir?: string | null;
    lvl: number;
    x: number;
    y: number;
    z: number;
    l: number;
    w: number;
    h: number;
    solid?: boolean;
    mesh?: string | null;
    canProjectile?: boolean;
    [key: string]: unknown;
}

export interface WorldEntityInstance {
    id: number;
    definitionId: number;
    definition?: WorldEntityDefinition;
    type: string;
    dir?: string | null;
    orientation: Dir;
    level: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    size: {
        width: number;
        length: number;
        height: number;
    };
    solid: boolean;
    mesh?: string | null;
    canProjectile?: boolean;
    metadata: Record<string, unknown>;
}

export interface HeightmapLayerConfig {
    name: string;
    relativePath: string;
    mapLevel?: MapLevel;
}

export interface HeightmapLayer {
    name: string;
    width: number;
    height: number;
    tiles: Uint8Array;
    closedTiles: ClosedTilesData;
}

export interface WorldModelLoadOptions {
    assetStaticPath?: string;
    entityFileName?: string;
    entityDefinitionFileName?: string;
    heightmapLayers?: readonly HeightmapLayerConfig[];
}

export interface PathingGridBuildOptions {
    layerName: string;
    mapLevel: number;
    worldEntities?: readonly WorldEntityInstance[];
}

const DEFAULT_HEIGHTMAP_LAYERS: HeightmapLayerConfig[] = [
    {
        name: "earthoverworld",
        relativePath: "assets/heightmaps/earthoverworldpath.png",
        mapLevel: MAP_LEVELS.Overworld
    },
    {
        name: "earthsky",
        relativePath: "assets/heightmaps/earthskypath.png",
        mapLevel: MAP_LEVELS.Sky
    },
    {
        name: "earthunderground",
        relativePath: "assets/heightmaps/earthundergroundpath.png",
        mapLevel: MAP_LEVELS.Underground
    },
];

const DIRECTION_LOOKUP: Record<string, Dir> = {
    n: Dir.N,
    e: Dir.E,
    s: Dir.S,
    w: Dir.W,
    ne: Dir.NE,
    se: Dir.SE,
    sw: Dir.SW,
    nw: Dir.NW,
    none: Dir.None,
};

export class WorldModel {
    private constructor(
        private readonly entityDefinitions: Map<number, WorldEntityDefinition>,
        private readonly entities: WorldEntityInstance[],
        private readonly heightmaps: Map<string, HeightmapLayer>
    ) { }

    static async initialize(
        options?: WorldModelLoadOptions
    ): Promise<WorldModel> {
        const basePath = options?.assetStaticPath ?? STATIC_ASSETS_ROOT;
        const entityFile = path.join(
            basePath,
            options?.entityFileName ?? DEFAULT_ENTITIES_FILE
        );
        const definitionFile = path.join(
            basePath,
            options?.entityDefinitionFileName ?? DEFAULT_ENTITY_DEFS_FILE
        );

        const [rawEntities, definitions] = await Promise.all([
            loadJsonFile<RawWorldEntity[]>(entityFile),
            loadJsonFile<WorldEntityDefinition[]>(definitionFile),
        ]);

        const definitionsById = new Map<number, WorldEntityDefinition>();
        const definitionsByType = new Map<string, WorldEntityDefinition>();
        for (const definition of definitions) {
            definitionsById.set(definition._id, definition);
            if (definition.type) {
                definitionsByType.set(definition.type.toLowerCase(), definition);
            }
        }

        const parsedEntities = rawEntities.map((raw, index) =>
            normalizeEntity(raw, index, definitionsByType)
        );

        const layersToLoad =
            options?.heightmapLayers ?? DEFAULT_HEIGHTMAP_LAYERS;

        const loadedHeightmaps = await Promise.all(
            layersToLoad.map(async (layerConfig) => {
                const layerPath = path.join(
                    basePath,
                    layerConfig.relativePath
                );
                const layer = await loadHeightmapLayer(layerConfig.name, layerPath);
                return { config: layerConfig, layer };
            })
        );

        const heightmapEntries = new Map<string, HeightmapLayer>();
        for (const { config, layer } of loadedHeightmaps) {
            heightmapEntries.set(config.name, layer);
            if (config.mapLevel !== undefined) {
                const dimension = { width: layer.width, height: layer.height };
                setMapLevelDimensions(config.mapLevel, dimension);
                const bounds = computeCoordinateBoundsFromDimension(dimension);
                setLocationBoundsForMapLevel(config.mapLevel, bounds);
            }
        }

        return new WorldModel(
            definitionsById,
            parsedEntities,
            heightmapEntries
        );
    }

    getEntityDefinitions(): readonly WorldEntityDefinition[] {
        return Array.from(this.entityDefinitions.values());
    }

    getDefinitionById(definitionId: number): WorldEntityDefinition | undefined {
        return this.entityDefinitions.get(definitionId);
    }

    getEntities(): readonly WorldEntityInstance[] {
        return this.entities;
    }

    getEntitiesByType(type: string): WorldEntityInstance[] {
        return this.entities.filter((entity) => entity.type === type);
    }

    getHeightmapLayer(name: string): HeightmapLayer | undefined {
        return this.heightmaps.get(name);
    }

    getTileFlagsAt(
        layerName: string,
        worldX: number,
        worldY: number
    ): TileFlags | undefined {
        const layer = this.heightmaps.get(layerName);
        if (!layer) {
            return undefined;
        }

        const tileX = Math.floor(worldX);
        const tileY = Math.floor(worldY);
        if (
            tileX < 0 ||
            tileY < 0 ||
            tileX >= layer.width ||
            tileY >= layer.height
        ) {
            return undefined;
        }

        const index = tileY * layer.width + tileX;
        return layer.tiles[index] as TileFlags;
    }

    isTileWalkable(layerName: string, x: number, y: number): boolean {
        const flags = this.getTileFlagsAt(layerName, x, y);
        if (flags === undefined) {
            return false;
        }
        return (flags & TileFlags.Open) !== 0 && (flags & TileFlags.Closed) === 0;
    }

    isTileBlocked(layerName: string, x: number, y: number): boolean {
        const flags = this.getTileFlagsAt(layerName, x, y);
        if (flags === undefined) {
            return true;
        }
        return (flags & TileFlags.Closed) !== 0;
    }

    getClosedTilesLayer(name: string): ClosedTilesData | undefined {
        return this.heightmaps.get(name)?.closedTiles;
    }

    buildPathingGrid(
        options: PathingGridBuildOptions
    ): PathingGrid | undefined {
        const layer = this.heightmaps.get(options.layerName);
        if (!layer) return undefined;

        const entities = options.worldEntities ?? this.entities;

        const clone = layer.closedTiles.clone();

        // 1) Mix "occupancy" solids into the closed tile bitmap
        clone.mixInBlockingWorldEntities(entities, options.mapLevel);

        // 2) Build the directional grid (closed tiles should become 0xFF in makePathingGrid)
        const grid = clone.makePathingGrid();

        // 3) Mix edge blockers (walls/doors) into the PathingGrid flags
        grid.mixInBlockingWorldEntities(entities, options.mapLevel);

        return grid;
    }
}

function normalizeEntity(
    raw: RawWorldEntity,
    index: number,
    definitions: Map<string, WorldEntityDefinition>
): WorldEntityInstance {
    const {
        type,
        dir,
        lvl,
        x,
        y,
        z,
        l,
        w,
        h,
        solid = false,
        mesh = null,
        canProjectile,
        ...rest
    } = raw;

    const metadata = rest as Record<string, unknown>;
    const typeKey = type?.toLowerCase() ?? "";
    const definition = typeKey ? definitions.get(typeKey) : undefined;

    return {
        id: index,
        definitionId: definition?._id ?? -1,
        definition,
        type,
        dir,
        orientation: parseDirection(dir),
        level: lvl,
        position: { x, y, z },
        size: { width: w, length: l, height: h },
        solid,
        mesh,
        canProjectile,
        metadata,
    };
}

function parseDirection(value?: string | null): Dir {
    if (!value) {
        return Dir.None;
    }
    const normalized = value.toLowerCase();
    return DIRECTION_LOOKUP[normalized] ?? Dir.None;
}

async function loadJsonFile<T>(filePath: string): Promise<T> {
    const contents = await fs.readFile(filePath, "utf-8");
    return JSON.parse(contents) as T;
}

async function loadHeightmapLayer(
    name: string,
    filePath: string
): Promise<HeightmapLayer> {
    const buffer = await fs.readFile(filePath);
    const png = PNG.sync.read(buffer);
    const width = png.width;
    const height = png.height;
    const tiles = new Uint8Array(width * height);
    const closedTilesData = new Uint8Array(width * height);

    // Flip Y-axis: PNG has origin at top-left, world has origin at bottom-left
    // This matches the Rust implementation: data[(height - 1 - y) * width + x]
    for (let row = 0; row < height; row += 1) {
        for (let col = 0; col < width; col += 1) {
            const pixelIndex = (row * width + col) * 4;
            const flippedIndex = (height - 1 - row) * width + col;
            tiles[flippedIndex] = interpretPixelAsFlags(
                png.data[pixelIndex],
                png.data[pixelIndex + 1],
                png.data[pixelIndex + 2],
                png.data[pixelIndex + 3]
            );
            closedTilesData[flippedIndex] = (tiles[flippedIndex] & TileFlags.Closed) !== 0 ? 1 : 0;
        }
    }

    return {
        name,
        width,
        height,
        tiles,
        closedTiles: new ClosedTilesData(closedTilesData, width),
    };
}

function interpretPixelAsFlags(r: number, g: number, b: number, a: number): TileFlags {
    // Decide what transparency means for your data. Commonly: transparent = open.
    if (a === 0) return TileFlags.Open;

    // Block if red channel > 0 (matches Rust: pixel.to_rgba()[0] > 0)
    if (r > 0) return TileFlags.Closed;

    // Otherwise open (including black)
    return TileFlags.Open;
}

export class PathingFlags {
    private static readonly FULL_MASK = 0xff;

    constructor(private value = 0) { }

    static new(): PathingFlags {
        return new PathingFlags();
    }

    static allBlocked(): PathingFlags {
        return new PathingFlags(PathingFlags.FULL_MASK);
    }

    set(direction: PathingDirection): void {
        this.value |= 1 << direction;
    }

    isBlocked(direction: PathingDirection): boolean {
        return (this.value & (1 << direction)) !== 0;
    }

    copy(): PathingFlags {
        return new PathingFlags(this.value);
    }

    getValue(): number {
        return this.value;
    }
}

/**
 * PathingGrid stores directional blocking information for both movement and projectiles.
 * 
 * Each tile has two flag bytes:
 * - flags: Directional blocking for pathfinding (solid entities, walls)
 * - projectileFlags: Directional blocking for projectiles (only entities with canProjectile=false)
 * 
 * A tile can block pathfinding but not projectiles (e.g., fence with canProjectile=true).
 */
export class PathingGrid {
    constructor(
      private readonly flags: Uint8Array, // Pathfinding flags: length = width*height
      private readonly width: number,
      private readonly projectileFlags: Uint8Array = new Uint8Array(flags.length) // Projectile flags
    ) {}
  
    getWidth() { return this.width; }
    getHeight() { return (this.flags.length / this.width) | 0; }
  
    /**
     * Hot-path accessor for A* pathfinding.
     * Returns pathfinding flags for a tile (0xff = fully blocked).
     */
    getOrAllBlockedValue(x: number, y: number): number {
      const h = this.getHeight();
      if (x < 0 || y < 0 || x >= this.width || y >= h || this.flags.length === 0) return 0xff;
      return this.flags[y * this.width + x];
    }

    /**
     * Checks if a projectile is blocked when moving from (fromX, fromY) to (toX, toY).
     * 
     * Uses the pre-computed projectile blocking flags to efficiently check if
     * any walls/entities with canProjectile=false block the line between two adjacent tiles.
     * 
     * This method handles:
     * - Cardinal directions (N, E, S, W)
     * - Diagonal directions (NE, SE, SW, NW)
     * - Out of bounds checks (treats as blocked)
     * 
     * @param fromX - Starting tile X coordinate
     * @param fromY - Starting tile Y coordinate  
     * @param toX - Target tile X coordinate
     * @param toY - Target tile Y coordinate
     * @returns true if projectile is blocked, false if clear LOS
     */
    isProjectileBlocked(fromX: number, fromY: number, toX: number, toY: number): boolean {
      const width = this.width;
      const height = this.getHeight();
      
      // Bounds check
      if (fromX < 0 || fromY < 0 || fromX >= width || fromY >= height) return true;
      if (toX < 0 || toY < 0 || toX >= width || toY >= height) return true;
      
      // Check if target tile is fully blocked (0xff means impassable, blocks projectiles)
      const toIdx = toY * width + toX;
      if (this.projectileFlags[toIdx] === 0xff) return true;
      
      // Calculate direction from start to end
      const dx = toX - fromX;
      const dy = toY - fromY;
      
      // Determine which direction we're moving
      let direction: PathingDirection | null = null;
      
      if (dx === 0 && dy === 1) direction = PathingDirection.North;
      else if (dx === 0 && dy === -1) direction = PathingDirection.South;
      else if (dx === 1 && dy === 0) direction = PathingDirection.East;
      else if (dx === -1 && dy === 0) direction = PathingDirection.West;
      else if (dx === 1 && dy === 1) direction = PathingDirection.NorthEast;
      else if (dx === 1 && dy === -1) direction = PathingDirection.SouthEast;
      else if (dx === -1 && dy === -1) direction = PathingDirection.SouthWest;
      else if (dx === -1 && dy === 1) direction = PathingDirection.NorthWest;
      else {
        // Non-adjacent tiles - caller should check intermediate tiles
        return false;
      }
      
      // Check if this direction is blocked by projectile-blocking entity
      const fromIdx = fromY * width + fromX;
      return (this.projectileFlags[fromIdx] & (1 << direction)) !== 0;
    }

    /**
     * Checks if movement is blocked when moving from (fromX, fromY) to (toX, toY).
     *
     * Uses pathfinding flags (not projectile flags), so this reflects whether melee
     * can actually step/strike across an edge (e.g., fence/wall blocking movement).
     *
     * @returns true if movement is blocked, false if passable
     */
    isMovementBlocked(fromX: number, fromY: number, toX: number, toY: number): boolean {
      const width = this.width;
      const height = this.getHeight();

      if (fromX < 0 || fromY < 0 || fromX >= width || fromY >= height) return true;
      if (toX < 0 || toY < 0 || toX >= width || toY >= height) return true;

      const toIdx = toY * width + toX;
      if (this.flags[toIdx] === 0xff) return true;

      const dx = toX - fromX;
      const dy = toY - fromY;

      let direction: PathingDirection | null = null;

      if (dx === 0 && dy === 1) direction = PathingDirection.North;
      else if (dx === 0 && dy === -1) direction = PathingDirection.South;
      else if (dx === 1 && dy === 0) direction = PathingDirection.East;
      else if (dx === -1 && dy === 0) direction = PathingDirection.West;
      else if (dx === 1 && dy === 1) direction = PathingDirection.NorthEast;
      else if (dx === 1 && dy === -1) direction = PathingDirection.SouthEast;
      else if (dx === -1 && dy === -1) direction = PathingDirection.SouthWest;
      else if (dx === -1 && dy === 1) direction = PathingDirection.NorthWest;
      else {
        // Non-adjacent movement should be validated through pathfinding.
        return true;
      }

      const fromIdx = fromY * width + fromX;
      return (this.flags[fromIdx] & (1 << direction)) !== 0;
    }
  
    /**
     * Blocks a single direction from a tile (if in bounds).
     * 
     * @param direction - The PathingDirection to block
     * @param x - Tile X coordinate
     * @param y - Tile Y coordinate
     * @param forProjectiles - If true, blocks projectiles; if false, blocks pathfinding
     */
    private blockDirection(direction: PathingDirection, x: number, y: number, forProjectiles: boolean): void {
        const width = this.width;
        const height = this.getHeight();
        if (x >= 0 && x < width && y >= 0 && y < height) {
            const idx = y * width + x;
            const flag = 1 << direction;
            if (forProjectiles) {
                this.projectileFlags[idx] |= flag;
            } else {
                this.flags[idx] |= flag;
            }
        }
    }

    /**
     * Mix in directional edge blockers for walls/doors/gates.
     * Builds both pathfinding blocks AND projectile blocks.
     * 
     * Pathfinding blocks: All solid entities block movement
     * Projectile blocks: Only entities with canProjectile=false block projectiles
     * 
     * For "s" walls (horizontal): blocks N/S crossing and all diagonals that would clip the wall
     * For "w" walls (vertical): blocks E/W crossing and all diagonals that would clip the wall
     */
    mixInBlockingWorldEntities(
      worldEntities: readonly WorldEntityInstance[],
      mapLevel: number
    ): void {      
      for (const entity of worldEntities) {
        if (!entity.solid || entity.level !== mapLevel) continue;
  
        const p = worldToGrid(entity.position.x, entity.position.z, this);
        const entityX = p.x;
        const entityY = p.y;
        const entityWidth = Math.max(Math.trunc(entity.size.width), 1);
        const dir = (entity.dir ?? "").toLowerCase();
        const type = entity.type.toLowerCase();
  
        // Determine if this entity blocks projectiles
        // canProjectile defaults to false (blocks projectiles) if not specified
        const blocksProjectiles = entity.canProjectile !== true;
  
        // Handle walls, doors, opendoors, gates - they block edge crossings
        if (type === "wall" || type === "door" || type === "opendoor" || type === "gate") {
            if (dir === "s") {
                // Horizontal wall along y = entityY, spanning x..x+entityWidth-1
                // This wall blocks movement between (x, y-1) and (x, y)
                for (let x = entityX; x < entityX + entityWidth; x++) {
                    // Block cardinal directions for pathfinding
                    this.blockDirection(PathingDirection.South, x, entityY, false);
                    this.blockDirection(PathingDirection.North, x, entityY - 1, false);
                    
                    // Block diagonals that would cross/clip the wall
                    this.blockDirection(PathingDirection.SouthEast, x - 1, entityY, false);
                    this.blockDirection(PathingDirection.NorthEast, x - 1, entityY - 1, false);
                    this.blockDirection(PathingDirection.SouthEast, x, entityY, false);
                    this.blockDirection(PathingDirection.NorthEast, x, entityY - 1, false);
                    this.blockDirection(PathingDirection.SouthWest, x, entityY, false);
                    this.blockDirection(PathingDirection.NorthWest, x, entityY - 1, false);
                    this.blockDirection(PathingDirection.SouthWest, x + 1, entityY, false);
                    this.blockDirection(PathingDirection.NorthWest, x + 1, entityY - 1, false);
                    
                    // Also block for projectiles if entity blocks projectiles
                    if (blocksProjectiles) {
                        this.blockDirection(PathingDirection.South, x, entityY, true);
                        this.blockDirection(PathingDirection.North, x, entityY - 1, true);
                        this.blockDirection(PathingDirection.SouthEast, x - 1, entityY, true);
                        this.blockDirection(PathingDirection.NorthEast, x - 1, entityY - 1, true);
                        this.blockDirection(PathingDirection.SouthEast, x, entityY, true);
                        this.blockDirection(PathingDirection.NorthEast, x, entityY - 1, true);
                        this.blockDirection(PathingDirection.SouthWest, x, entityY, true);
                        this.blockDirection(PathingDirection.NorthWest, x, entityY - 1, true);
                        this.blockDirection(PathingDirection.SouthWest, x + 1, entityY, true);
                        this.blockDirection(PathingDirection.NorthWest, x + 1, entityY - 1, true);
                    }
                }
            } else if (dir === "w") {
                // Vertical wall along x = entityX, spanning y..y+entityWidth-1
                // This wall blocks movement between (x-1, y) and (x, y)
                for (let y = entityY; y < entityY + entityWidth; y++) {
                    // Block cardinal directions for pathfinding
                    this.blockDirection(PathingDirection.West, entityX, y, false);
                    this.blockDirection(PathingDirection.East, entityX - 1, y, false);
                    
                    // Block diagonals that would cross/clip the wall
                    this.blockDirection(PathingDirection.SouthWest, entityX, y + 1, false);
                    this.blockDirection(PathingDirection.SouthEast, entityX - 1, y + 1, false);
                    this.blockDirection(PathingDirection.SouthWest, entityX, y, false);
                    this.blockDirection(PathingDirection.SouthEast, entityX - 1, y, false);
                    this.blockDirection(PathingDirection.NorthWest, entityX, y, false);
                    this.blockDirection(PathingDirection.NorthEast, entityX - 1, y, false);
                    this.blockDirection(PathingDirection.NorthWest, entityX, y - 1, false);
                    this.blockDirection(PathingDirection.NorthEast, entityX - 1, y - 1, false);
                    
                    // Also block for projectiles if entity blocks projectiles
                    if (blocksProjectiles) {
                        this.blockDirection(PathingDirection.West, entityX, y, true);
                        this.blockDirection(PathingDirection.East, entityX - 1, y, true);
                        this.blockDirection(PathingDirection.SouthWest, entityX, y + 1, true);
                        this.blockDirection(PathingDirection.SouthEast, entityX - 1, y + 1, true);
                        this.blockDirection(PathingDirection.SouthWest, entityX, y, true);
                        this.blockDirection(PathingDirection.SouthEast, entityX - 1, y, true);
                        this.blockDirection(PathingDirection.NorthWest, entityX, y, true);
                        this.blockDirection(PathingDirection.NorthEast, entityX - 1, y, true);
                        this.blockDirection(PathingDirection.NorthWest, entityX, y - 1, true);
                        this.blockDirection(PathingDirection.NorthEast, entityX - 1, y - 1, true);
                    }
                }
            }
        }
      }
    }
  }
  

export class ClosedTilesData {
    constructor(
        private readonly data: Uint8Array,
        public readonly width: number
    ) { }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    get height(): number {
        return Math.floor(this.data.length / this.width);
    }

    getTile(x: number, y: number): boolean {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }
        return this.data[y * this.width + x] !== 0;
    }

    setTile(x: number, y: number, closed: boolean): void {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return;
        }
        this.data[y * this.width + x] = closed ? 1 : 0;
    }

    clone(): ClosedTilesData {
        return new ClosedTilesData(this.data.slice() as Uint8Array, this.width);
    }

    mixInBlockingWorldEntities(
        worldEntities: readonly WorldEntityInstance[],
        mapLevel: number
    ): void {
        const width = this.width;
        const height = this.height;
        for (const entity of worldEntities) {
            if (!entity.solid || entity.level !== mapLevel) {
                continue;
            }

            // IMPORTANT: pick the correct world axes
            const wx = entity.position.x;
            const wy = entity.position.z; // if z is your world "y"

            const p = worldToGrid(wx, wy, this);
            let x = p.x;
            let y = p.y;

            const type = entity.type.toLowerCase();

            if (["wall", "door", "opendoor", "gate"].includes(type)) {
                const dir = (entity.dir ?? "").toLowerCase();
                let xDelta = 0;
                if (dir === "se") {
                    xDelta = 1;
                } else if (dir === "sw") {
                    xDelta = -1;
                } else {
                    continue;
                }

                const entityWidth = Math.max(Math.trunc(entity.size.width), 1);
                for (let i = 0; i < entityWidth; i += 1) {
                    this.setTile(x, y, true);
                    x += xDelta;
                    y += 1;
                }
                continue;
            }

            if (type === "roof" || type === "bridge") {
                continue;
            }

            // For solid entities, mark ALL tiles they occupy based on their size
            // Entity size.width (w) and size.length (l) define the tile footprint
            // The direction affects how width/length map to X/Y axes
            const dir = (entity.dir ?? "").toLowerCase();
            const entityWidth = Math.max(Math.trunc(entity.size.width), 1);
            const entityLength = Math.max(Math.trunc(entity.size.length), 1);
            
            // Determine tile extents based on orientation
            // N/S facing: width extends along X, length along Y
            // E/W facing: width extends along Y, length along X
            let xExtent: number, yExtent: number;
            if (dir === "e" || dir === "w") {
                xExtent = entityLength;
                yExtent = entityWidth;
            } else {
                // Default (n, s, or unspecified): width = X, length = Y
                xExtent = entityWidth;
                yExtent = entityLength;
            }
            
            for (let dy = 0; dy < yExtent; dy++) {
                for (let dx = 0; dx < xExtent; dx++) {
                    const tileX = x + dx;
                    const tileY = y + dy;
                    if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height) {
                        this.setTile(tileX, tileY, true);
                    }
                }
            }
        }
    }

    makePathingGrid(): PathingGrid {
        const width = this.width;
        const height = this.height;
        const pathingFlags = new Uint8Array(width * height);
      
        const directionChecks: ReadonlyArray<
          [PathingDirection, ReadonlyArray<[number, number]>]
        > = [
          [PathingDirection.North, [[0, 1]]],
          [PathingDirection.South, [[0, -1]]],
          [PathingDirection.East,  [[1, 0]]],
          [PathingDirection.West,  [[-1, 0]]],
      
          [PathingDirection.NorthEast, [[1, 0], [0, 1], [1, 1]]],
          [PathingDirection.SouthEast, [[1, 0], [0, -1], [1, -1]]],
          [PathingDirection.SouthWest, [[-1, 0], [0, -1], [-1, -1]]],
          [PathingDirection.NorthWest, [[-1, 0], [0, 1], [-1, 1]]],
        ];
      
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
      
            // If this tile itself is closed, mark it as fully blocked (0xff)
            // This prevents anything from standing on or moving through this tile
            if (this.getTile(x, y)) {
              pathingFlags[idx] = 0xff;
              continue;
            }
      
            for (const [dir, checks] of directionChecks) {
              if (
                checks.some(([dx, dy]) => {
                  const nx = x + dx;
                  const ny = y + dy;
      
                  if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
                    return true; // edge blocks movement
                  }
      
                  return this.getTile(nx, ny); // closed tile blocks movement
                })
              ) {
                pathingFlags[idx] |= (1 << dir);
              }
            }
          }
        }
      
        return new PathingGrid(pathingFlags, width);
      }
}
