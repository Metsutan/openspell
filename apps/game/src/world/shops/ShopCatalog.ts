/**
 * ShopCatalog.ts - Loads and manages shop definitions.
 */

import fs from "fs/promises";
import path from "path";

// Static shops path - configurable via environment variable
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

const SHOP_DEFS_FILENAME = process.env.SHOP_DEFS_FILE || "shopdefs.carbon";
const SHOP_DEFS_FILE = path.join(STATIC_ASSETS_DIR, SHOP_DEFS_FILENAME);

/**
 * Shop item definition from catalog.
 */
export interface ShopItemDefinition {
  /** Item definition ID */
  id: number;
  /** Initial/maximum stock amount */
  amount: number;
  /** Cost in gold */
  cost: number;
  /** Ticks between restocks */
  restockSpeed: number;
}

/**
 * Shop definition from catalog.
 */
export interface ShopDefinition {
  _id: number;
  name: string;
  description: string;
  canBuyTemporaryItems: boolean;
  items: ShopItemDefinition[];
}

/**
 * Manages shop definitions loaded from shopdefs.11.carbon.
 */
export class ShopCatalog {
  private constructor(
    private readonly definitionsById: Map<number, ShopDefinition>
  ) {}

  /**
   * Loads shop definitions from disk.
   */
  static async load(): Promise<ShopCatalog> {
    const defsData = await fs.readFile(SHOP_DEFS_FILE, "utf8");
    const rawDefs = JSON.parse(defsData) as ShopDefinition[];

    const definitionsById = new Map<number, ShopDefinition>();
    for (const raw of rawDefs) {
      definitionsById.set(raw._id, raw);
    }

    console.log(`[ShopCatalog] Loaded ${definitionsById.size} shop definitions.`);
    return new ShopCatalog(definitionsById);
  }

  /**
   * Gets a shop definition by ID.
   */
  getShopById(id: number): ShopDefinition | undefined {
    return this.definitionsById.get(id);
  }

  /**
   * Gets all shop definitions.
   */
  getAllShops(): ShopDefinition[] {
    return Array.from(this.definitionsById.values());
  }
}
