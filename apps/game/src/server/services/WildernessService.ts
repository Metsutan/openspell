import { MAP_LEVELS, type MapLevel } from "../../world/Location";

export interface Rectangle {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface WildernessRegion extends Rectangle {
  mapLevel: MapLevel;
}

export interface ExclusionZone extends Rectangle {
  name: string;
}

export class WildernessService {
  private static readonly LEVEL_LENGTH = 8;
  private static readonly MAX_TELEPORT_WILDERNESS_LEVEL = 20;
  private static readonly DEEP_WILDERNESS_LEVEL = 21;
  public static readonly TELEPORT_BLOCK_MESSAGE = "A strange force is blocking your teleporation spell";

  private static readonly WILDERNESS_REGIONS: WildernessRegion[] = [
    { minX: 152, minY: -516, maxX: 516, maxY: -137, mapLevel: MAP_LEVELS.Overworld },
    { minX: 104, minY: -516, maxX: 151, maxY: -472, mapLevel: MAP_LEVELS.Overworld },
    { minX: 152, minY: -516, maxX: 516, maxY: -137, mapLevel: MAP_LEVELS.Underground },
    { minX: 104, minY: -516, maxX: 151, maxY: -472, mapLevel: MAP_LEVELS.Underground }
  ];

  private static readonly EXCLUSION_ZONES: ExclusionZone[] = [
    // Add exclusion zones as needed.
  ];

  private static isPointInRectangle(x: number, y: number, rect: Rectangle): boolean {
    return x >= rect.minX && x <= rect.maxX && y >= rect.minY && y <= rect.maxY;
  }

  private static isInWildernessRegion(x: number, y: number, mapLevel: MapLevel): boolean {
    return this.WILDERNESS_REGIONS
      .filter(region => region.mapLevel === mapLevel)
      .some(region => this.isPointInRectangle(x, y, region));
  }

  private static isInExclusionZone(x: number, y: number): boolean {
    return this.EXCLUSION_ZONES.some(zone => this.isPointInRectangle(x, y, zone));
  }

  public static isInWilderness(x: number, y: number, mapLevel: MapLevel): boolean {
    switch (mapLevel) {
      case MAP_LEVELS.Overworld:
      case MAP_LEVELS.Underground:
        if (this.isInWildernessRegion(x, y, mapLevel)) {
          return !this.isInExclusionZone(x, y);
        }
        return false;
      case MAP_LEVELS.Sky:
      default:
        return false;
    }
  }

  public static getWildernessLevel(x: number, y: number, mapLevel: MapLevel): number {
    if (!this.isInWilderness(x, y, mapLevel)) {
      return 0;
    }

    const primaryRegion = this.WILDERNESS_REGIONS.find(region => region.mapLevel === mapLevel);
    if (!primaryRegion) {
      return 0;
    }

    if (y <= primaryRegion.maxY) {
      return Math.ceil((primaryRegion.maxY + 1 - y) / this.LEVEL_LENGTH);
    }

    return 0;
  }

  public static isInDeepWilderness(x: number, y: number, mapLevel: MapLevel): boolean {
    return this.getWildernessLevel(x, y, mapLevel) >= this.DEEP_WILDERNESS_LEVEL;
  }

  public static canTeleport(x: number, y: number, mapLevel: MapLevel): boolean {
    return this.getWildernessLevel(x, y, mapLevel) <= this.MAX_TELEPORT_WILDERNESS_LEVEL;
  }

  public static getWildernessInfo(x: number, y: number, mapLevel: MapLevel) {
    const inWilderness = this.isInWilderness(x, y, mapLevel);
    const wildernessLevel = this.getWildernessLevel(x, y, mapLevel);

    return {
      inWilderness,
      level: wildernessLevel,
      isDeep: wildernessLevel >= this.DEEP_WILDERNESS_LEVEL
    };
  }

  public static canAttackByCombatLevel(
    attackerLevel: number,
    targetLevel: number,
    wildernessLevel: number
  ): boolean {
    if (wildernessLevel <= 0) return false;
    return Math.abs(attackerLevel - targetLevel) <= wildernessLevel;
  }
}
