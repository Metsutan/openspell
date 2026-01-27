import fs from "fs/promises";
import path from "path";
import type { MapLevel } from "../Location";

// Static items path - configurable via environment variable
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

const ITEM_DEFS_FILENAME = process.env.ITEM_DEFS_FILE || "itemdefs.33.carbon";
const GROUND_ITEMS_FILENAME = process.env.GROUND_ITEMS_FILE || "grounditems.12.carbon";

const ITEM_DEFS_FILE = path.join(STATIC_ASSETS_DIR, ITEM_DEFS_FILENAME);
const GROUND_ITEMS_FILE = path.join(STATIC_ASSETS_DIR, GROUND_ITEMS_FILENAME);

/**
 * Edible effect types and their effects on skills.
 */
export interface EdibleEffect {
  type: string;
  effect: {
    skill: string;
    amount: number;
  };
}

/**
 * Equipment requirements for equipping an item.
 */
export interface EquippableRequirement {
  skill: string;
  level: number;
}

/**
 * Equipment stat effects when worn.
 */
export interface EquippableEffect {
  skill: string;
  amount: number;
}

/**
 * Experience gained from obtaining an item.
 */
export interface ExpFromObtaining {
  skill: string;
  amount: number;
}

/**
 * Recipe information for crafting items.
 */
export interface ItemRecipe {
  ingredients: Array<{ itemId: number; amount: number }>;
  skill: string;
  levelRequired: number;
  expGained: number;
}

/**
 * Item-on-item action entry from itemdefs.
 */
export interface ItemOnItemActionItem {
  id: number;
  amount: number;
  isIOU: boolean;
}

export interface ItemOnItemAction {
  targetItemId: number;
  skillToCreate: string;
  canCreateMultiple: boolean;
  resultItems: ItemOnItemActionItem[] | null;
  itemsToRemove: ItemOnItemActionItem[] | null;
  resultEntityId: number | null;
}

/**
 * Item definition loaded from itemdefs.
 */
export interface ItemDefinition {
  id: number;
  name: string;
  description: string;
  isNamePlural: boolean;
  cost: number;
  isStackable: boolean;
  isTradeable: boolean;
  isForMission: boolean;
  isMembers: boolean;
  canIOU: boolean;
  inventoryActions: string[] | null;
  edibleEffects: EdibleEffect[] | null;
  edibleResult: ItemOnItemActionItem | null;
  equippableEffects: EquippableEffect[] | null;
  equippableRequirements: EquippableRequirement[] | null;
  equipmentType: string | null;
  equipmentSpriteId: number | null;
  equipmentSpriteSheet: string | null;
  removeEquipmentOnEquip: string[] | null;
  resourceProbability: number | null;
  expFromObtaining: ExpFromObtaining | null;
  recipe: ItemRecipe | null;
  useItemOnItemActions: ItemOnItemAction[] | null;
  metalType: string | null;
  weight: number;
}

/**
 * Ground item spawn definition loaded from grounditems.
 */
export interface GroundItemSpawn {
  id: number;
  itemId: number;
  isIOU: boolean;
  amount: number;
  respawnTicks: number;
  mapLevel: MapLevel;
  x: number;
  y: number;
}

/**
 * Ground item instance with position and item data.
 */
export class GroundItemInstance {
  constructor(
    public readonly id: number,
    public readonly itemId: number,
    public readonly isIOU: boolean,
    public readonly amount: number,
    public readonly respawnTicks: number,
    public readonly mapLevel: MapLevel,
    public readonly x: number,
    public readonly y: number,
    private readonly definition: ItemDefinition | undefined
  ) {}

  getDefinition(): ItemDefinition | undefined {
    return this.definition;
  }

  getName(): string {
    return this.definition?.name ?? "Unknown Item";
  }
}

/**
 * Catalog of item definitions and ground item spawn locations.
 * Mirrors the structure of EntityCatalog for consistency.
 */
export class ItemCatalog {
  constructor(
    private readonly definitionsById: Map<number, ItemDefinition>,
    private readonly groundItemsById: Map<number, GroundItemInstance>
  ) {}

  /**
   * Loads item definitions and ground items from static files.
   */
  static async load(): Promise<ItemCatalog> {
    const [defsData, groundItemsData] = await Promise.all([
      fs.readFile(ITEM_DEFS_FILE, "utf8"),
      fs.readFile(GROUND_ITEMS_FILE, "utf8")
    ]);

    const rawDefs = JSON.parse(defsData) as RawItemDefinition[];
    const rawGroundItems = JSON.parse(groundItemsData) as RawGroundItem[];

    const definitionsById = new Map<number, ItemDefinition>();
    for (const raw of rawDefs) {
      const definition: ItemDefinition = {
        id: raw._id,
        name: raw.name,
        description: raw.description,
        isNamePlural: raw.isNamePlural ?? false,
        cost: raw.cost ?? 1,
        isStackable: raw.isStackable ?? false,
        isTradeable: raw.isTradeable ?? false,
        isForMission: raw.isForMission ?? false,
        isMembers: raw.isMembers ?? false,
        canIOU: raw.canIOU ?? true,
        inventoryActions: raw.inventoryActions ?? null,
        edibleEffects: raw.edibleEffects ?? null,
      edibleResult: raw.edibleResult ?? null,
        equippableEffects: raw.equippableEffects ?? null,
        equippableRequirements: raw.equippableRequirements ?? null,
        equipmentType: raw.equipmentType ?? null,
        equipmentSpriteId: raw.equipmentSpriteId ?? null,
        equipmentSpriteSheet: raw.equipmentSpriteSheet ?? null,
        removeEquipmentOnEquip: raw.removeEquipmentOnEquip ?? null,
        resourceProbability: raw.resourceProbability ?? null,
        expFromObtaining: raw.expFromObtaining ?? null,
        recipe: raw.recipe ?? null,
        useItemOnItemActions: raw.useItemOnItemActions ?? null,
        metalType: raw.metalType ?? null,
        weight: raw.weight ?? 0
      };
      definitionsById.set(definition.id, definition);
    }

    const groundItemsById = new Map<number, GroundItemInstance>();
    for (let index = 0; index < rawGroundItems.length; index++) {
      const raw = rawGroundItems[index];
      const definition = definitionsById.get(raw.itemId);
      const instance = new GroundItemInstance(
        index, // Use array index as unique id
        raw.itemId,
        raw.isIOU ?? false,
        raw.amount ?? 1,
        raw.respawnTicks ?? 100,
        raw.mapLevel as MapLevel,
        raw.x,
        raw.y,
        definition
      );
      groundItemsById.set(instance.id, instance);
    }

    return new ItemCatalog(definitionsById, groundItemsById);
  }

  /**
   * Gets an item definition by its ID.
   */
  getDefinitionById(id: number): ItemDefinition | undefined {
    return this.definitionsById.get(id);
  }

  /**
   * Gets a ground item instance by its ID.
   */
  getGroundItemById(id: number): GroundItemInstance | undefined {
    return this.groundItemsById.get(id);
  }

  /**
   * Gets all item definitions.
   */
  getDefinitions(): ItemDefinition[] {
    return Array.from(this.definitionsById.values());
  }

  /**
   * Gets all ground item instances.
   */
  getGroundItems(): GroundItemInstance[] {
    return Array.from(this.groundItemsById.values());
  }

  /**
   * Gets all ground items for a specific item definition ID.
   */
  getGroundItemsByItemId(itemId: number): GroundItemInstance[] {
    return this.getGroundItems().filter((item) => item.itemId === itemId);
  }

  /**
   * Gets all ground items on a specific map level.
   */
  getGroundItemsByMapLevel(mapLevel: MapLevel): GroundItemInstance[] {
    return this.getGroundItems().filter((item) => item.mapLevel === mapLevel);
  }

  /**
   * Gets the total count of ground items.
   */
  getGroundItemCount(): number {
    return this.groundItemsById.size;
  }

  /**
   * Gets the total count of item definitions.
   */
  getDefinitionCount(): number {
    return this.definitionsById.size;
  }
}

/**
 * Raw item definition structure from itemdefs JSON.
 */
interface RawItemDefinition {
  _id: number;
  name: string;
  description: string;
  isNamePlural?: boolean;
  cost?: number;
  isStackable?: boolean;
  isTradeable?: boolean;
  isForMission?: boolean;
  isMembers?: boolean;
  canIOU?: boolean;
  inventoryActions?: string[] | null;
  edibleEffects?: EdibleEffect[] | null;
  edibleResult?: ItemOnItemActionItem | null;
  equippableEffects?: EquippableEffect[] | null;
  equippableRequirements?: EquippableRequirement[] | null;
  equipmentType?: string | null;
  equipmentSpriteId?: number | null;
  equipmentSpriteSheet?: string | null;
  removeEquipmentOnEquip?: string[] | null;
  resourceProbability?: number | null;
  expFromObtaining?: ExpFromObtaining | null;
  recipe?: ItemRecipe | null;
  useItemOnItemActions?: ItemOnItemAction[] | null;
  metalType?: string | null;
  weight?: number;
}

/**
 * Raw ground item structure from grounditems JSON.
 */
interface RawGroundItem {
  itemId: number;
  isIOU?: boolean;
  amount?: number;
  respawnTicks?: number;
  mapLevel: number;
  x: number;
  y: number;
}
