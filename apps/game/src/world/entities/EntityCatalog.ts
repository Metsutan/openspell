import fs from "fs/promises";
import path from "path";

// Static entities path - configurable via environment variable
// Default assumes shared-assets structure for Docker compatibility
const DEFAULT_STATIC_ENTITIES_DIR = path.resolve(
  __dirname,
  "../../../../..",
  "apps",
  "shared-assets",
  "base",
  "static"
);
const STATIC_ENTITIES_DIR = process.env.STATIC_ASSETS_PATH 
  ? path.resolve(process.env.STATIC_ASSETS_PATH)
  : DEFAULT_STATIC_ENTITIES_DIR;

const ENTITY_DEFS_FILENAME = process.env.NPC_ENTITY_DEFS_FILE || "npcentitydefs.22.carbon";
const ENTITIES_FILENAME = process.env.NPC_ENTITIES_FILE || "npcentities.16.carbon";

const ENTITY_DEFS_FILE = path.join(STATIC_ENTITIES_DIR, ENTITY_DEFS_FILENAME);
const ENTITIES_FILE = path.join(STATIC_ENTITIES_DIR, ENTITIES_FILENAME);

export interface EntityCombatStats {
  level: number;
  hitpoints: number;
  accuracy: number;
  strength: number;
  defense: number;
  magic: number;
  range: number;
  accuracyBonus: number;
  strengthBonus: number;
  defenseBonus: number;
  magicBonus: number;
  rangeBonus: number;
  speed: number;
  aggroRadius: number;
  isAlwaysAggro: boolean;
  respawnLength: number;
  lootTableId: number;
  autoCastSpellIds?: number[];
  /**
   * Optional ranged attack distance override (tiles).
   * If omitted, ranged NPCs use CombatSystem default.
   */
  attackRange?: number;
}

export interface EntityAppearance {
  hair: number;
  beard: number;
  shirt: number;
  body: number;
  pants: number;
  helmet: number | null;
  chest: number | null;
  legs: number | null;
  projectile: number | null;
  gloves: number | null;
  boots: number | null;
  back: number | null;
  neck: number | null;
  weapon: number | null;
  shield: number | null;
  width: number;
  height: number;
  creatureType?: string;
  creatureSpriteId?: number;
  animationSpeed?: number;
  opacity?: number;
  filter?: string;
}

export interface EntityDefinition {
  id: number;
  name: string;
  description: string;
  moveEagerness: number;
  canShop: boolean;
  pickpocketId?: number | null;
  combat?: EntityCombatStats;
  appearance: EntityAppearance;
}

export interface EntityMovementArea {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface EntityPosition {
  mapLevel: number;
  x: number;
  y: number;
}

export class EntityInstance {
  constructor(
    public readonly id: number,
    public readonly description: string,
    public readonly definitionId: number,
    public readonly movementArea: EntityMovementArea,
    public readonly shopId: number | null,
    public readonly conversationId: number | null,
    private position: EntityPosition,
    private readonly definition: EntityDefinition
  ) {}

  getDefinition(): EntityDefinition {
    return this.definition;
  }

  getPosition(): EntityPosition {
    return { ...this.position };
  }

  moveTo(x: number, y: number): boolean {
    if (!this.isWithinMovementArea(x, y)) return false;
    this.position = { ...this.position, x, y };
    return true;
  }

  isWithinMovementArea(x: number, y: number): boolean {
    const { minX, maxX, minY, maxY } = this.movementArea;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
}

export class EntityCatalog {
  constructor(
    private readonly definitionsById: Map<number, EntityDefinition>,
    private readonly instancesById: Map<number, EntityInstance>
  ) {}

  static async load(): Promise<EntityCatalog> {
    const data = await Promise.all([
      fs.readFile(ENTITY_DEFS_FILE, "utf8"),
      fs.readFile(ENTITIES_FILE, "utf8")
    ]);

    const rawDefs = JSON.parse(data[0]) as RawEntityDefinition[];
    const rawEntities = JSON.parse(data[1]) as RawEntityInstance[];

    const definitionsById = new Map<number, EntityDefinition>();
    for (const raw of rawDefs) {
      const definition: EntityDefinition = {
        id: raw._id,
        name: raw.name,
        description: raw.description,
        moveEagerness: raw.moveEagerness ?? 0,
        canShop: raw.canShop ?? false,
        pickpocketId: raw.pickpocketId ?? null,
        combat: raw.combat ? { ...raw.combat } : undefined,
        appearance: { ...raw.appearance }
      };
      definitionsById.set(definition.id, definition);
    }

    const instancesById = new Map<number, EntityInstance>();
    for (const raw of rawEntities) {
      const definition = definitionsById.get(raw.npcdef_id);
      if (!definition) continue;
      const movementArea = {
        minX: raw.movementAreaMinX,
        maxX: raw.movementAreaMaxX,
        minY: raw.movementAreaMinY,
        maxY: raw.movementAreaMaxY
      };
      const position = {
        mapLevel: raw.mapLevel,
        x: raw.x,
        y: raw.y
      };
      const instance = new EntityInstance(
        raw._id,
        raw.desc,
        raw.npcdef_id,
        movementArea,
        raw.shopdef_id ?? null,
        raw.conversationdef_id ?? null,
        position,
        definition
      );
      instancesById.set(instance.id, instance);
    }

    return new EntityCatalog(definitionsById, instancesById);
  }

  getDefinitionById(id: number): EntityDefinition | undefined {
    return this.definitionsById.get(id);
  }

  getInstanceById(id: number): EntityInstance | undefined {
    return this.instancesById.get(id);
  }

  getInstances(): EntityInstance[] {
    return Array.from(this.instancesById.values());
  }

  getDefinitions(): EntityDefinition[] {
    return Array.from(this.definitionsById.values());
  }

  getInstancesByDefinition(defId: number): EntityInstance[] {
    return this.getInstances().filter((instance) => instance.definitionId === defId);
  }
}

interface RawEntityDefinition {
  _id: number;
  name: string;
  description: string;
  moveEagerness?: number;
  canShop?: boolean;
  pickpocketId?: number | null;
  combat?: EntityCombatStats;
  appearance: EntityAppearance;
}

interface RawEntityInstance {
  _id: number;
  desc: string;
  npcdef_id: number;
  movementAreaMinX: number;
  movementAreaMaxX: number;
  movementAreaMinY: number;
  movementAreaMaxY: number;
  mapLevel: number;
  x: number;
  y: number;
  shopdef_id?: number | null;
  conversationdef_id?: number | null;
}
