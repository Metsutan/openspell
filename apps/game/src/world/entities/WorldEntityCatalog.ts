import fs from "fs/promises";
import path from "path";
import type { MapLevel } from "../Location";

// Static world entities path - configurable via environment variable
// Default assumes shared-assets structure for Docker compatibility
const DEFAULT_STATIC_ASSETS_DIR = path.resolve(
  __dirname,
  "../../../../..",
  "apps",
  "shared-assets",
  "base",
  "static"
);
const STATIC_ASSETS_DIR = process.env.STATIC_ASSETS_PATH 
  ? path.resolve(process.env.STATIC_ASSETS_PATH)
  : DEFAULT_STATIC_ASSETS_DIR;

// Uses same env variables as WorldModel.ts for consistency
const WORLD_ENTITY_DEFS_FILENAME = process.env.WORLD_ENTITY_DEFS_FILE || "worldentitydefs.13.carbon";
const WORLD_ENTITIES_FILENAME = process.env.WORLD_ENTITIES_FILE || "worldentities.26.carbon";

const WORLD_ENTITY_DEFS_FILE = path.join(STATIC_ASSETS_DIR, WORLD_ENTITY_DEFS_FILENAME);
const WORLD_ENTITIES_FILE = path.join(STATIC_ASSETS_DIR, WORLD_ENTITIES_FILENAME);

/**
 * Action that can be performed when using an item on a world entity.
 */
export interface UseItemWithEntityAction {
  itemId: number;
  action: string;
}

/**
 * World entity definition loaded from worldentitydefs.
 * Defines properties shared by all instances of a world entity type.
 */
export interface WorldEntityDefinition {
  id: number;
  type: string;
  name: string | null;
  description: string | null;
  actions: string[] | null;
  respawnTicks: number | null;
  resourceProbability: number | null;
  maxResourcesPerSpawn: number | null;
  minResourcesPerSpawn: number | null;
  useItemWithEntityActions: UseItemWithEntityAction[] | null;
  canProjectile: boolean;
  worldEntityLootId: number | null;
}

/**
 * World entity instance loaded from worldentities.
 * Represents a specific placed instance in the world.
 */
export interface WorldEntityInstance {
  id: number;
  type: string;
  definitionId: number;
  worldEntityLootIdOverride: number | null;
  direction: string;
  mapLevel: MapLevel;
  x: number;
  y: number;
  z: number;
  xOffset: number;
  yOffset: number;
  length: number;
  width: number;
  height: number;
  solid: boolean;
  mesh: string | null;
  material: string | null;
  gloss: number | null;
  alpha: number;
  light: unknown | null;
  canProjectile: boolean;
}

/**
 * Catalog of world entity definitions and instances.
 * Mirrors the structure of EntityCatalog and ItemCatalog for consistency.
 * 
 * World entities are static environment objects like trees, rocks, doors, etc.
 * Unlike NPCs, they don't move. Unlike ground items, they don't disappear when picked up.
 * They may have resources that can be depleted and respawn over time.
 */
export class WorldEntityCatalog {
  constructor(
    private readonly definitionsByType: Map<string, WorldEntityDefinition>,
    private readonly definitionsById: Map<number, WorldEntityDefinition>,
    private readonly instancesById: Map<number, WorldEntityInstance>
  ) {}

  /**
   * Loads world entity definitions and instances from static files.
   */
  static async load(): Promise<WorldEntityCatalog> {
    const [defsData, instancesData] = await Promise.all([
      fs.readFile(WORLD_ENTITY_DEFS_FILE, "utf8"),
      fs.readFile(WORLD_ENTITIES_FILE, "utf8")
    ]);

    const rawDefs = JSON.parse(defsData) as RawWorldEntityDefinition[];
    const rawInstances = JSON.parse(instancesData) as RawWorldEntityInstance[];

    // Build definitions maps (by type string and by id)
    const definitionsByType = new Map<string, WorldEntityDefinition>();
    const definitionsById = new Map<number, WorldEntityDefinition>();
    
    for (const raw of rawDefs) {
      const definition: WorldEntityDefinition = {
        id: raw._id,
        type: raw.type,
        name: raw.name ?? null,
        description: raw.desc ?? null,
        actions: raw.actions ?? null,
        respawnTicks: raw.respawnTicks ?? null,
        resourceProbability: raw.resourceProbability ?? null,
        maxResourcesPerSpawn: raw.maxResourcesPerSpawn ?? null,
        minResourcesPerSpawn: raw.minResourcesPerSpawn ?? null,
        useItemWithEntityActions: raw.useItemWithEntityActions ?? null,
        canProjectile: raw.canProjectile ?? true,
        worldEntityLootId: raw.worldEntityLootId ?? null
      };
      definitionsByType.set(definition.type, definition);
      definitionsById.set(definition.id, definition);
    }

    // Build instances map, linking each instance to its definition
    const instancesById = new Map<number, WorldEntityInstance>();
    
    for (const raw of rawInstances) {
      const definition = definitionsByType.get(raw.type);
      if (!definition) {
        // Skip instances with unknown types (shouldn't happen with valid data)
        continue;
      }

      const instance: WorldEntityInstance = {
        id: raw._id,
        type: raw.type,
        definitionId: definition.id,
        worldEntityLootIdOverride: raw.worldEntityLootIdOverride ?? null,
        direction: raw.dir ?? "s",
        mapLevel: raw.lvl as MapLevel,
        x: raw.x,
        y: raw.y,
        z: raw.z ?? 0,
        xOffset: raw.xOff ?? 0,
        yOffset: raw.yOff ?? 0,
        length: raw.l ?? 1,
        width: raw.w ?? 1,
        height: raw.h ?? 1,
        solid: raw.solid ?? false,
        mesh: raw.mesh ?? null,
        material: raw.mat ?? null,
        gloss: raw.gloss ?? null,
        alpha: raw.alpha ?? 1,
        light: raw.light ?? null,
        canProjectile: raw.canProjectile ?? definition.canProjectile
      };
      
      instancesById.set(instance.id, instance);
    }

    return new WorldEntityCatalog(definitionsByType, definitionsById, instancesById);
  }

  /**
   * Gets a definition by its type string (e.g., "normaltree", "ironrocks").
   */
  getDefinitionByType(type: string): WorldEntityDefinition | undefined {
    return this.definitionsByType.get(type);
  }

  /**
   * Gets a definition by its numeric ID.
   */
  getDefinitionById(id: number): WorldEntityDefinition | undefined {
    return this.definitionsById.get(id);
  }

  /**
   * Gets a world entity instance by its ID.
   */
  getInstanceById(id: number): WorldEntityInstance | undefined {
    return this.instancesById.get(id);
  }

  /**
   * Gets all definitions.
   */
  getDefinitions(): WorldEntityDefinition[] {
    return Array.from(this.definitionsById.values());
  }

  /**
   * Gets all instances.
   */
  getInstances(): WorldEntityInstance[] {
    return Array.from(this.instancesById.values());
  }

  /**
   * Gets all instances of a specific entity type.
   */
  getInstancesByType(type: string): WorldEntityInstance[] {
    return this.getInstances().filter((instance) => instance.type === type);
  }

  /**
   * Gets all instances on a specific map level.
   */
  getInstancesByMapLevel(mapLevel: MapLevel): WorldEntityInstance[] {
    return this.getInstances().filter((instance) => instance.mapLevel === mapLevel);
  }

  /**
   * Gets instances that have harvestable resources (trees, rocks, fishing spots, etc.).
   */
  getHarvestableInstances(): WorldEntityInstance[] {
    return this.getInstances().filter((instance) => {
      const def = this.getDefinitionByType(instance.type);
      return def && def.respawnTicks !== null && def.respawnTicks > 0;
    });
  }

  /**
   * Gets the total count of instances.
   */
  getInstanceCount(): number {
    return this.instancesById.size;
  }

  /**
   * Gets the total count of definitions.
   */
  getDefinitionCount(): number {
    return this.definitionsById.size;
  }
}

/**
 * Raw definition structure from worldentitydefs JSON.
 */
interface RawWorldEntityDefinition {
  _id: number;
  type: string;
  name?: string | null;
  desc?: string | null;
  actions?: string[] | null;
  respawnTicks?: number | null;
  resourceProbability?: number | null;
  maxResourcesPerSpawn?: number | null;
  minResourcesPerSpawn?: number | null;
  useItemWithEntityActions?: UseItemWithEntityAction[] | null;
  canProjectile?: boolean;
  worldEntityLootId?: number | null;
}

/**
 * Raw instance structure from worldentities JSON.
 */
interface RawWorldEntityInstance {
  _id: number;
  type: string;
  worldEntityLootIdOverride?: number | null;
  dir?: string;
  lvl: number;
  x: number;
  y: number;
  z?: number;
  xOff?: number;
  yOff?: number;
  l?: number;
  w?: number;
  h?: number;
  solid?: boolean;
  mesh?: string | null;
  mat?: string | null;
  gloss?: number | null;
  alpha?: number;
  light?: unknown | null;
  canProjectile?: boolean;
}
