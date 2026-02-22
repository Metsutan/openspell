import fs from "fs/promises";
import path from "path";
import type { MapLevel } from "../../world/Location";
import type { PlayerState } from "../../world/PlayerState";
import type { EventBus } from "../events/EventBus";
import type { ItemDespawnedEvent } from "../events/GameEvents";

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

const SPECIAL_COORDS_FILENAME = process.env.SPECIAL_COORDS_FILE || "specialcoordinatesdefs.3.carbon";
const SPECIAL_COORDS_FILE = path.join(STATIC_ASSETS_DIR, SPECIAL_COORDS_FILENAME);

type TreasureMapTier = 1 | 2 | 3;

interface TreasureMapCoordinate {
  x: number;
  y: number;
  level: MapLevel;
}

interface TreasureMapOwnerState {
  tier: TreasureMapTier;
  coordinate: TreasureMapCoordinate;
}

interface GroundTreasureMapOwnership {
  userId: number;
  tier: TreasureMapTier;
}

interface RawSpecialCoordinatesData {
  treasureMapCoordinates?: {
    treasureMap1?: Array<{ x: number; y: number; level: number }>;
    treasureMap2?: Array<{ x: number; y: number; level: number }>;
    treasureMap3?: Array<{ x: number; y: number; level: number }>;
  };
}

export interface TreasureMapServiceConfig {
  playerStatesByUserId: Map<number, PlayerState>;
  eventBus: EventBus;
}

export interface PreparedTreasureMapDrop {
  itemId: number;
  tier: TreasureMapTier;
  coordinate: TreasureMapCoordinate;
}

export interface ResolvedTreasureMapDigLocation {
  tier: TreasureMapTier;
  itemId: number;
  lootTableId: number;
}

export interface PersistedTreasureMapOwnership {
  userId: number;
  persistenceId: number;
  tier: TreasureMapTier;
  itemId: number;
  x: number;
  y: number;
  mapLevel: MapLevel;
}

export class TreasureMapService {
  public static readonly TIER1_ITEM_ID = 442;
  public static readonly TIER2_ITEM_ID = 443;
  public static readonly TIER3_ITEM_ID = 456;

  private static readonly ITEM_ID_BY_TIER: Record<TreasureMapTier, number> = {
    1: TreasureMapService.TIER1_ITEM_ID,
    2: TreasureMapService.TIER2_ITEM_ID,
    3: TreasureMapService.TIER3_ITEM_ID
  };
  private static readonly LOOT_TABLE_ID_BY_TIER: Record<TreasureMapTier, number> = {
    1: 18,
    2: 19,
    3: 20
  };

  private static readonly TIER_BY_ITEM_ID = new Map<number, TreasureMapTier>([
    [TreasureMapService.TIER1_ITEM_ID, 1],
    [TreasureMapService.TIER2_ITEM_ID, 2],
    [TreasureMapService.TIER3_ITEM_ID, 3]
  ]);

  private readonly coordinatesByTier = new Map<TreasureMapTier, TreasureMapCoordinate[]>();
  private readonly ownerStateByUserIdAndTier = new Map<string, TreasureMapOwnerState>();
  private readonly floorOwnershipByGroundItemId = new Map<number, GroundTreasureMapOwnership>();

  private constructor(private readonly config: TreasureMapServiceConfig) {}

  static async load(config: TreasureMapServiceConfig): Promise<TreasureMapService> {
    const service = new TreasureMapService(config);
    await service.loadCoordinates();
    service.registerEventHandlers();
    return service;
  }

  isTreasureMapItemId(itemId: number): boolean {
    return TreasureMapService.TIER_BY_ITEM_ID.has(itemId);
  }

  getTreasureMapTierByItemId(itemId: number): TreasureMapTier | null {
    return TreasureMapService.TIER_BY_ITEM_ID.get(itemId) ?? null;
  }

  getTreasureMapItemIdByTier(tier: number): number | null {
    if (tier !== 1 && tier !== 2 && tier !== 3) {
      return null;
    }
    return TreasureMapService.ITEM_ID_BY_TIER[tier];
  }

  hydratePlayerTreasureMaps(userId: number, ownerships: PersistedTreasureMapOwnership[]): void {
    for (const tier of [1, 2, 3] as const) {
      this.ownerStateByUserIdAndTier.delete(this.key(userId, tier));
    }

    for (const ownership of ownerships) {
      const tier = ownership.tier;
      if (tier !== 1 && tier !== 2 && tier !== 3) {
        continue;
      }
      if (!this.playerOwnsTier(userId, tier)) {
        continue;
      }

      this.ownerStateByUserIdAndTier.set(this.key(userId, tier), {
        tier,
        coordinate: {
          x: ownership.x,
          y: ownership.y,
          level: ownership.mapLevel
        }
      });
    }
  }

  getPersistedTreasureMapsForPlayer(
    userId: number,
    persistenceId: number,
    playerStateOverride?: PlayerState
  ): PersistedTreasureMapOwnership[] {
    const rows: PersistedTreasureMapOwnership[] = [];
    const playerState = playerStateOverride ?? this.config.playerStatesByUserId.get(userId) ?? null;
    for (const tier of [1, 2, 3] as const) {
      if (playerState && !this.playerOwnsTierForPlayerState(playerState, userId, tier)) {
        continue;
      }

      const ownerState = this.ownerStateByUserIdAndTier.get(this.key(userId, tier));
      if (!ownerState) {
        continue;
      }

      rows.push({
        userId,
        persistenceId,
        tier,
        itemId: TreasureMapService.ITEM_ID_BY_TIER[tier],
        x: ownerState.coordinate.x,
        y: ownerState.coordinate.y,
        mapLevel: ownerState.coordinate.level
      });
    }
    return rows;
  }

  resolveTreasureMapDigLocation(userId: number, mapLevel: MapLevel, x: number, y: number): ResolvedTreasureMapDigLocation | null {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) {
      return null;
    }

    for (const tier of [1, 2, 3] as const) {
      const ownerState = this.ownerStateByUserIdAndTier.get(this.key(userId, tier));
      if (!ownerState) {
        continue;
      }
      if (
        ownerState.coordinate.level !== mapLevel ||
        ownerState.coordinate.x !== x ||
        ownerState.coordinate.y !== y
      ) {
        continue;
      }

      const mapItemId = TreasureMapService.ITEM_ID_BY_TIER[tier];
      if (player.countItem(mapItemId, 0) < 1) {
        continue;
      }

      return {
        tier,
        itemId: mapItemId,
        lootTableId: TreasureMapService.LOOT_TABLE_ID_BY_TIER[tier]
      };
    }

    return null;
  }

  canRollTreasureMapDrop(userId: number, tier: number): boolean {
    if (tier !== 1 && tier !== 2 && tier !== 3) {
      return false;
    }
    return !this.playerOwnsTier(userId, tier);
  }

  prepareTreasureMapDrop(userId: number, tier: number): PreparedTreasureMapDrop | null {
    if (tier !== 1 && tier !== 2 && tier !== 3) {
      return null;
    }

    if (this.playerOwnsTier(userId, tier)) {
      return null;
    }

    const coordinate = this.pickRandomCoordinate(tier);
    if (!coordinate) {
      console.warn(`[TreasureMapService] No coordinates configured for tier ${tier}`);
      return null;
    }

    this.ownerStateByUserIdAndTier.set(this.key(userId, tier), {
      tier,
      coordinate
    });
    this.markPlayerTreasureMapDirty(userId);

    return {
      itemId: TreasureMapService.ITEM_ID_BY_TIER[tier],
      tier,
      coordinate
    };
  }

  registerSpawnedTreasureMapGroundItem(groundItemId: number, userId: number, tier: number): void {
    if (tier !== 1 && tier !== 2 && tier !== 3) {
      return;
    }
    this.floorOwnershipByGroundItemId.set(groundItemId, { userId, tier });
  }

  getOwnerForGroundTreasureMap(groundItemId: number): number | null {
    const ownership = this.floorOwnershipByGroundItemId.get(groundItemId);
    return ownership?.userId ?? null;
  }

  onTreasureMapDiscarded(userId: number, itemId: number): void {
    const tier = this.getTreasureMapTierByItemId(itemId);
    if (!tier) {
      return;
    }
    this.removeOwnershipIfNoRemainingMap(userId, tier);
  }

  getLookAtData(userId: number, itemId: number): [number, number, number, number] | null {
    const tier = this.getTreasureMapTierByItemId(itemId);
    if (!tier) {
      return null;
    }

    if (!this.playerOwnsTier(userId, tier)) {
      return null;
    }

    const key = this.key(userId, tier);
    let ownerState = this.ownerStateByUserIdAndTier.get(key);
    if (!ownerState) {
      const coordinate = this.pickRandomCoordinate(tier);
      if (!coordinate) {
        return null;
      }
      ownerState = { tier, coordinate };
      this.ownerStateByUserIdAndTier.set(key, ownerState);
      this.markPlayerTreasureMapDirty(userId);
    }

    return [itemId, ownerState.coordinate.x, ownerState.coordinate.y, ownerState.coordinate.level];
  }

  private async loadCoordinates(): Promise<void> {
    const file = await fs.readFile(SPECIAL_COORDS_FILE, "utf8");
    const parsed = JSON.parse(file) as RawSpecialCoordinatesData;
    const coords = parsed.treasureMapCoordinates;
    if (!coords) {
      throw new Error("[TreasureMapService] Missing treasureMapCoordinates in specialcoordinatesdefs");
    }

    this.coordinatesByTier.set(1, this.normalizeCoordinates(coords.treasureMap1 ?? []));
    this.coordinatesByTier.set(2, this.normalizeCoordinates(coords.treasureMap2 ?? []));
    this.coordinatesByTier.set(3, this.normalizeCoordinates(coords.treasureMap3 ?? []));

    console.log(
      `[TreasureMapService] Loaded coordinates: t1=${this.coordinatesByTier.get(1)?.length ?? 0}, t2=${this.coordinatesByTier.get(2)?.length ?? 0}, t3=${this.coordinatesByTier.get(3)?.length ?? 0}`
    );
  }

  private registerEventHandlers(): void {
    this.config.eventBus.on("ItemDespawned", (event: ItemDespawnedEvent) => {
      const ownership = this.floorOwnershipByGroundItemId.get(event.entityId);
      if (!ownership) {
        return;
      }

      this.floorOwnershipByGroundItemId.delete(event.entityId);

      // Despawn/removed means the map vanished from floor (not moved into inventory).
      if (event.reason === "despawned" || event.reason === "removed") {
        this.removeOwnershipIfNoRemainingMap(ownership.userId, ownership.tier);
      }
    });
  }

  private normalizeCoordinates(values: Array<{ x: number; y: number; level: number }>): TreasureMapCoordinate[] {
    const output: TreasureMapCoordinate[] = [];
    for (const value of values) {
      if (!Number.isFinite(value?.x) || !Number.isFinite(value?.y) || !Number.isFinite(value?.level)) {
        continue;
      }
      output.push({
        x: Math.floor(value.x),
        y: Math.floor(value.y),
        level: value.level as MapLevel
      });
    }
    return output;
  }

  private playerOwnsTier(userId: number, tier: TreasureMapTier): boolean {
    return this.hasTierInInventoryOrBank(userId, tier) || this.hasTierOnFloor(userId, tier);
  }

  private playerOwnsTierForPlayerState(player: PlayerState, userId: number, tier: TreasureMapTier): boolean {
    return this.hasTierInInventoryOrBankForPlayer(player, tier) || this.hasTierOnFloor(userId, tier);
  }

  private hasTierInInventoryOrBank(userId: number, tier: TreasureMapTier): boolean {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) {
      return false;
    }
    return this.hasTierInInventoryOrBankForPlayer(player, tier);
  }

  private hasTierInInventoryOrBankForPlayer(player: PlayerState, tier: TreasureMapTier): boolean {
    const itemId = TreasureMapService.ITEM_ID_BY_TIER[tier];
    if (player.countItem(itemId, 0) > 0) {
      return true;
    }
    if (!player.bank) {
      return false;
    }
    return player.bank.some((slot) => slot !== null && slot[0] === itemId && slot[1] > 0);
  }

  private hasTierOnFloor(userId: number, tier: TreasureMapTier): boolean {
    for (const ownership of this.floorOwnershipByGroundItemId.values()) {
      if (ownership.userId === userId && ownership.tier === tier) {
        return true;
      }
    }
    return false;
  }

  private pickRandomCoordinate(tier: TreasureMapTier): TreasureMapCoordinate | null {
    const coords = this.coordinatesByTier.get(tier);
    if (!coords || coords.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * coords.length);
    return coords[index];
  }

  private removeOwnershipIfNoRemainingMap(userId: number, tier: TreasureMapTier): void {
    if (this.playerOwnsTier(userId, tier)) {
      return;
    }
    if (this.ownerStateByUserIdAndTier.delete(this.key(userId, tier))) {
      this.markPlayerTreasureMapDirty(userId);
    }
  }

  private markPlayerTreasureMapDirty(userId: number): void {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) {
      return;
    }
    // Reuse standard player dirty tracking so autosave persists map state changes.
    player.markInventoryDirty();
  }

  private key(userId: number, tier: TreasureMapTier): string {
    return `${userId}:${tier}`;
  }
}
