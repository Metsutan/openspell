/**
 * MonsterDropService.ts - Handles monster loot drops when NPCs die
 * 
 * Architecture:
 * - Loads and parses npcloot.carbon file containing drop tables
 * - Provides efficient loot rolling using cumulative probability distribution
 * - Spawns dropped items using ItemManager
 * - Supports rare loot, root loot, treasure maps, base loot, and regular loot
 * 
 * Loot Roll Order:
 * 1. Check rareLootProbability - if successful, roll on rare loot table
 * 2. Check rootLoot.probability - if successful, roll on root loot table
 * 3. Check treasureMap.odds - if successful, drop treasure map
 * 4. Drop all baseLoot items (guaranteed drops like bones)
 * 5. Roll on regular loot table (may drop nothing if probabilities don't sum to 1.0)
 * 
 * Probability Distribution:
 * - Uses cumulative probability arrays for O(log n) lookup via binary search
 * - Example: odds [0.3, 0.2, 0.15] becomes cumulative [0.3, 0.5, 0.65]
 * - Roll of 0.4 falls in range [0.3, 0.5] → second item
 */

import fs from "fs/promises";
import path from "path";
import { ItemManager } from "../../world/systems/ItemManager";
import type { MapLevel } from "../../world/Location";
import type { EntityCatalog } from "../../world/entities/EntityCatalog";
import type { TreasureMapService } from "./TreasureMapService";

// Static assets path
const DEFAULT_STATIC_ASSETS_DIR = path.resolve(
  __dirname,
  "../../../../../",
  "apps",
  "shared-assets",
  "base",
  "static"
);
const STATIC_ASSETS_DIR = process.env.STATIC_ASSETS_PATH 
  ? path.resolve(process.env.STATIC_ASSETS_PATH)
  : DEFAULT_STATIC_ASSETS_DIR;

const LOOT_TABLE_FILENAME = process.env.NPC_LOOT_FILE || "npcloot.18.carbon";
const LOOT_TABLE_FILE = path.join(STATIC_ASSETS_DIR, LOOT_TABLE_FILENAME);

/**
 * Represents a single loot item with its drop chance.
 */
export interface LootItem {
  itemId: number;
  name: string;
  amount: number;
  isIOU: boolean;
  odds: number;
}

/**
 * Base loot item (guaranteed drop).
 */
export interface BaseLootItem {
  itemId: number;
  name: string;
  amount: number;
  isIOU: boolean;
}

/**
 * Treasure map drop configuration.
 */
export interface TreasureMapDrop {
  level: number;
  odds: number;
}

/**
 * Root loot reference (points to a rootLootTable).
 */
export interface RootLootReference {
  id: number;
  probability: number;
}

/**
 * A compiled loot table with cumulative probability distribution.
 */
export interface CompiledLootTable {
  _id: number;
  npc?: string;
  rareLootProbability: number;
  rootLoot: RootLootReference | null;
  treasureMap: TreasureMapDrop | null;
  baseLoot: BaseLootItem[];
  loot: LootItem[];
  // Cumulative distribution for efficient rolling
  cumulativeLoot: CumulativeLootEntry[];
}

/**
 * Cumulative probability entry for binary search.
 */
interface CumulativeLootEntry {
  cumulativeProbability: number;
  item: LootItem;
}

/**
 * Rare loot table structure.
 */
interface RareLootTable {
  _id: number;
  rareLootProbability: number;
  rootLoot: any;
  loot: LootItem[];
  cumulativeLoot: CumulativeLootEntry[];
}

/**
 * Root loot table structure.
 */
interface RootLootTable {
  _id: number;
  desc: string;
  rareLootProbability: number;
  rootLoot: any;
  loot: LootItem[];
  cumulativeLoot: CumulativeLootEntry[];
}

/**
 * Raw loot data structure from npcloot.carbon.
 */
interface RawLootData {
  rareLootTable: {
    _id: number;
    rareLootProbability: number;
    rootLoot: any;
    loot: LootItem[];
  };
  rootLootTables: Array<{
    _id: number;
    desc: string;
    rareLootProbability: number;
    rootLoot: any;
    loot: LootItem[];
  }>;
  npcLootTables: Array<{
    _id: number;
    npc?: string;
    rareLootProbability: number;
    rootLoot: RootLootReference | null;
    treasureMap?: TreasureMapDrop | null;
    baseLoot?: BaseLootItem[];
    loot: LootItem[];
  }>;
}

/**
 * Result of a loot roll.
 */
export interface LootDrop {
  itemId: number;
  amount: number;
  isIOU: boolean;
  treasureMapTier?: number;
  treasureMapOwnerUserId?: number;
}

export interface MonsterDropServiceConfig {
  itemManager: ItemManager;
  entityCatalog: EntityCatalog;
  treasureMapService: TreasureMapService;
}

/**
 * Service for handling monster loot drops.
 */
export class MonsterDropService {
  private rareLootTable: RareLootTable | null = null;
  private rootLootTables: Map<number, RootLootTable> = new Map();
  private npcLootTables: Map<number, CompiledLootTable> = new Map();

  constructor(private readonly config: MonsterDropServiceConfig) {}

  /**
   * Loads and parses the loot tables from npcloot.carbon file.
   */
  static async load(config: MonsterDropServiceConfig): Promise<MonsterDropService> {
    const service = new MonsterDropService(config);
    await service.loadLootTables();
    return service;
  }

  /**
   * Loads loot tables from file and compiles cumulative distributions.
   */
  private async loadLootTables(): Promise<void> {
    try {
      const data = await fs.readFile(LOOT_TABLE_FILE, "utf8");
      const rawData = JSON.parse(data) as RawLootData;

      // Load rare loot table
      if (rawData.rareLootTable) {
        this.rareLootTable = {
          ...rawData.rareLootTable,
          cumulativeLoot: this.compileCumulativeDistribution(rawData.rareLootTable.loot)
        };
      }

      // Load root loot tables
      for (const rootTable of rawData.rootLootTables) {
        this.rootLootTables.set(rootTable._id, {
          ...rootTable,
          cumulativeLoot: this.compileCumulativeDistribution(rootTable.loot)
        });
      }

      // Load NPC loot tables
      for (const npcTable of rawData.npcLootTables) {
        this.npcLootTables.set(npcTable._id, {
          _id: npcTable._id,
          npc: npcTable.npc,
          rareLootProbability: npcTable.rareLootProbability,
          rootLoot: npcTable.rootLoot,
          treasureMap: npcTable.treasureMap ?? null,
          baseLoot: npcTable.baseLoot ?? [],
          loot: npcTable.loot,
          cumulativeLoot: this.compileCumulativeDistribution(npcTable.loot)
        });
      }

      console.log(`[MonsterDropService] Loaded ${this.npcLootTables.size} NPC loot tables, ${this.rootLootTables.size} root tables`);
    } catch (error) {
      console.error("[MonsterDropService] Failed to load loot tables:", error);
      throw error;
    }
  }

  /**
   * Compiles a cumulative probability distribution from loot items.
   * This enables O(log n) binary search for loot rolling.
   * 
   * Example:
   * Input:  [{ odds: 0.3 }, { odds: 0.2 }, { odds: 0.15 }]
   * Output: [{ cumulative: 0.3, item }, { cumulative: 0.5, item }, { cumulative: 0.65, item }]
   * 
   * A roll of 0.4 would fall in range [0.3, 0.5] and return the second item.
   */
  private compileCumulativeDistribution(loot: LootItem[]): CumulativeLootEntry[] {
    const cumulative: CumulativeLootEntry[] = [];
    let sum = 0;

    for (const item of loot) {
      sum += item.odds;
      cumulative.push({
        cumulativeProbability: sum,
        item
      });
    }

    return cumulative;
  }

  /**
   * Rolls on a cumulative loot table using binary search.
   * Returns the item if successful, null if nothing rolled.
   * 
   * @param cumulativeTable - Compiled cumulative distribution
   * @param roll - Random value between 0 and 1
   * @returns The rolled item or null
   */
  private rollOnCumulativeTable(cumulativeTable: CumulativeLootEntry[], roll: number): LootItem | null {
    if (cumulativeTable.length === 0) return null;

    // Binary search for the cumulative range that contains our roll
    let left = 0;
    let right = cumulativeTable.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const entry = cumulativeTable[mid];
      const prevCumulative = mid > 0 ? cumulativeTable[mid - 1].cumulativeProbability : 0;

      // Check if roll falls in this range [prevCumulative, entry.cumulativeProbability)
      if (roll >= prevCumulative && roll < entry.cumulativeProbability) {
        return entry.item;
      }

      if (roll < prevCumulative) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Roll exceeded all probabilities - drop nothing
    return null;
  }

  /**
   * Generates loot drops for a killed NPC.
   * 
   * @param npcDefinitionId - The NPC's definition ID
   * @param mapLevel - Map level where NPC died
   * @param x - X coordinate where NPC died
   * @param y - Y coordinate where NPC died
   * @param killerUserId - User ID of the player who killed the NPC (for item visibility)
   * @returns Array of dropped items
   */
  public generateLoot(
    npcDefinitionId: number,
    mapLevel: MapLevel,
    x: number,
    y: number,
    killerUserId: number | null,
    lootTableIdOverride: number | null = null
  ): LootDrop[] {
    // Get NPC definition to find loot table ID
    const npcDef = this.config.entityCatalog.getDefinitionById(npcDefinitionId);
    if (!npcDef || !npcDef.combat) {
      return [];
    }

    const lootTableId = lootTableIdOverride ?? npcDef.combat.lootTableId;
    if (lootTableId === 0 || lootTableId === undefined) {
      // No loot table configured
      return [];
    }

    const lootTable = this.npcLootTables.get(lootTableId);
    if (!lootTable) {
      console.warn(`[MonsterDropService] Loot table ${lootTableId} not found for NPC ${npcDef.name} (def ${npcDefinitionId})`);
      return [];
    }

    const drops: LootDrop[] = [];

    // 1. Roll for rare loot
    if (lootTable.rareLootProbability > 0 && Math.random() < lootTable.rareLootProbability) {
      const rareItem = this.rollOnRareLootTable();
      if (rareItem) {
        drops.push({
          itemId: rareItem.itemId,
          amount: rareItem.amount,
          isIOU: rareItem.isIOU
        });
      }
    }

    // 2. Roll for root loot
    if (lootTable.rootLoot && Math.random() < lootTable.rootLoot.probability) {
      const rootItem = this.rollOnRootLootTable(lootTable.rootLoot.id);
      if (rootItem) {
        drops.push({
          itemId: rootItem.itemId,
          amount: rootItem.amount,
          isIOU: rootItem.isIOU
        });
      }
    }

    // 3. Roll for treasure map (only if killer doesn't already own same tier)
    if (lootTable.treasureMap && killerUserId !== null) {
      const mapTier = lootTable.treasureMap.level;
      if (this.config.treasureMapService.canRollTreasureMapDrop(killerUserId, mapTier)) {
        if (Math.random() < lootTable.treasureMap.odds) {
          const preparedDrop = this.config.treasureMapService.prepareTreasureMapDrop(killerUserId, mapTier);
          if (preparedDrop) {
            drops.push({
              itemId: preparedDrop.itemId,
              amount: 1,
              isIOU: false,
              treasureMapTier: preparedDrop.tier,
              treasureMapOwnerUserId: killerUserId
            });
          }
        }
      }
    }

    // 4. Add base loot (guaranteed drops)
    for (const baseItem of lootTable.baseLoot) {
      drops.push({
        itemId: baseItem.itemId,
        amount: baseItem.amount,
        isIOU: baseItem.isIOU
      });
    }

    // 5. Roll on regular loot table
    const roll = Math.random();
    const regularItem = this.rollOnCumulativeTable(lootTable.cumulativeLoot, roll);
    if (regularItem) {
      drops.push({
        itemId: regularItem.itemId,
        amount: regularItem.amount,
        isIOU: regularItem.isIOU
      });
    }

    return drops;
  }

  /**
   * Spawns loot drops into the world at the specified position.
   * 
   * @param drops - Array of loot drops to spawn
   * @param mapLevel - Map level to spawn at
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param killerUserId - User ID of player who gets initial visibility (null = visible to all)
   */
  public spawnLoot(
    drops: LootDrop[],
    mapLevel: MapLevel,
    x: number,
    y: number,
    killerUserId: number | null
  ): void {
    for (const drop of drops) {
      const spawned = this.config.itemManager.spawnGroundItem(
        drop.itemId,
        drop.amount,
        drop.isIOU,
        mapLevel,
        x,
        y,
        ItemManager.MONSTER_DROP_DESPAWN_TICKS,
        killerUserId
      );
      if (
        spawned &&
        drop.treasureMapTier &&
        typeof drop.treasureMapOwnerUserId === "number"
      ) {
        // Treasure maps are owner-bound and should never become visible to other players.
        spawned.visibleToAllAtTick = null;
        this.config.treasureMapService.registerSpawnedTreasureMapGroundItem(
          spawned.id,
          drop.treasureMapOwnerUserId,
          drop.treasureMapTier
        );
      }
    }
  }

  /**
   * Generate and spawn loot for a killed NPC in one call.
   * 
   * @param npcDefinitionId - The NPC's definition ID
   * @param mapLevel - Map level where NPC died
   * @param x - X coordinate where NPC died
   * @param y - Y coordinate where NPC died
   * @param killerUserId - User ID of the player who killed the NPC
   */
  public dropLoot(
    npcDefinitionId: number,
    mapLevel: MapLevel,
    x: number,
    y: number,
    killerUserId: number | null,
    lootTableIdOverride: number | null = null
  ): void {
    const drops = this.generateLoot(npcDefinitionId, mapLevel, x, y, killerUserId, lootTableIdOverride);
    
    if (drops.length > 0) {
      const npcDef = this.config.entityCatalog.getDefinitionById(npcDefinitionId);
      console.log(`[MonsterDropService] ${npcDef?.name ?? `NPC ${npcDefinitionId}`} dropped ${drops.length} item(s)`);
      this.spawnLoot(drops, mapLevel, x, y, killerUserId);
    }
  }

  /**
   * Rolls on the rare loot table.
   */
  private rollOnRareLootTable(): LootItem | null {
    if (!this.rareLootTable) return null;
    const roll = Math.random();
    return this.rollOnCumulativeTable(this.rareLootTable.cumulativeLoot, roll);
  }

  /**
   * Rolls on a root loot table by ID.
   */
  private rollOnRootLootTable(rootLootId: number): LootItem | null {
    const rootTable = this.rootLootTables.get(rootLootId);
    if (!rootTable) return null;
    const roll = Math.random();
    return this.rollOnCumulativeTable(rootTable.cumulativeLoot, roll);
  }

  /**
   * Gets loot table info for debugging.
   */
  public getLootTableInfo(lootTableId: number): CompiledLootTable | undefined {
    return this.npcLootTables.get(lootTableId);
  }

  /**
   * Gets the total number of loaded loot tables.
   */
  public getLootTableCount(): number {
    return this.npcLootTables.size;
  }
}
