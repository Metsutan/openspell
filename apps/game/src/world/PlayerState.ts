import { clampLocationCoordinate, isMapLevel, MapLevel, MAP_LEVELS } from "./Location";
import type { EquipmentStack } from "./items/EquipmentStack";
import { States } from "../protocol/enums/States";
import { PlayerSetting, VALID_COMBAT_STYLE } from "../protocol/enums/PlayerSetting";
import type { Action } from "../protocol/enums/Actions";
import type { EntityType } from "../protocol/enums/EntityType";
import type { QuestProgress } from "../server/services/QuestProgressService";

/**
 * Pending action - tracks a player's intent to perform an action on an entity
 * Used when the player needs to pathfind to an entity before performing an action
 */
export type PendingAction = {
  action: Action;
  entityType: EntityType;
  entityId: number;
  retryCount?: number; // Number of times we've re-pathfinded (for moving targets)
  lastKnownX?: number; // Last known X position of target entity (for tracking movement)
  lastKnownY?: number; // Last known Y position of target entity (for tracking movement)
  waitTicks?: number; // Number of ticks to wait before executing (for doors, etc.)
};

/**
 * Inventory item tuple: [itemId, amount, isIOU]
 * - itemId: The item definition ID
 * - amount: Stack size (1 for non-stackable items)
 * - isIOU: 0 for regular items, 1 for IOU/bank note representation
 */
export type GroundItem = [itemId: number, amount: number, isIOU: number, x: number, y: number, mapLevel: MapLevel];
export type InventoryItem = [itemId: number, amount: number, isIOU: number];
export type FullInventory = (InventoryItem | null)[];

/**
 * Bank item tuple: [itemId, amount]
 * - itemId: The item definition ID
 * - amount: Stack size
 * 
 * Note: Bank items cannot be IOUs (they are always physical items)
 */
export type BankItem = [itemId: number, amount: number];

/**
 * Skill state tracking both actual level (from XP) and boosted level (current effective level).
 * - level: The actual level calculated from XP
 * - boostedLevel: The current effective level (can be boosted/drained by potions, prayers, etc.)
 * - xp: Experience points
 */
export type SkillState = { 
  level: number; 
  boostedLevel: number; 
  xp: number;
};

export enum PlayerAbility {
  Stamina = 0,
  SpecialAttack = 1
}

export type PlayerAbilities = Record<PlayerAbility, number>;

const ABILITY_MIN_VALUE = 0;
const ABILITY_MAX_VALUE = 10000;
const ABILITY_PRECISION = 100; // 0.01 precision

const DEFAULT_PLAYER_ABILITIES: PlayerAbilities = {
  [PlayerAbility.Stamina]: 10000,
  [PlayerAbility.SpecialAttack]: 10000
};

export function clampAbilityValue(value: number): number {
  if (!Number.isFinite(value)) return ABILITY_MIN_VALUE;
  const clamped = Math.max(ABILITY_MIN_VALUE, Math.min(ABILITY_MAX_VALUE, value));
  return Math.round(clamped * ABILITY_PRECISION) / ABILITY_PRECISION;
}

export function createDefaultAbilities(): PlayerAbilities {
  return { ...DEFAULT_PLAYER_ABILITIES };
}

function readAbilityEntry(entries: unknown[], index: PlayerAbility): number {
  const raw = entries[index];
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return DEFAULT_PLAYER_ABILITIES[index];
  }
  return clampAbilityValue(raw);
}

export function parsePlayerAbilities(value: unknown): PlayerAbilities {
  if (!Array.isArray(value)) {
    return createDefaultAbilities();
  }
  return {
    [PlayerAbility.Stamina]: readAbilityEntry(value, PlayerAbility.Stamina),
    [PlayerAbility.SpecialAttack]: readAbilityEntry(value, PlayerAbility.SpecialAttack)
  };
}

export function serializePlayerAbilities(abilities: PlayerAbilities): number[] {
  return [
    clampAbilityValue(abilities[PlayerAbility.Stamina]),
    clampAbilityValue(abilities[PlayerAbility.SpecialAttack])
  ];
}

export type PlayerSettings = Record<PlayerSetting, number>;

const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  [PlayerSetting.IsSprinting]: 0,
  [PlayerSetting.AutoRetaliate]: 1,
  [PlayerSetting.CombatStyle]: 7,
  [PlayerSetting.PublicChat]: 1,
  [PlayerSetting.GlobalChat]: 1
};

function sanitizeSettingValue(setting: PlayerSetting, rawValue: number | undefined): number {
  switch (setting) {
    case PlayerSetting.IsSprinting:
    case PlayerSetting.AutoRetaliate:
    case PlayerSetting.PublicChat:
    case PlayerSetting.GlobalChat:
      return rawValue === 1 ? 1 : 0;
    case PlayerSetting.CombatStyle: {
      if (!Number.isFinite(rawValue ?? NaN)) {
        return DEFAULT_PLAYER_SETTINGS[setting];
      }
      const candidate = Math.round(rawValue as number);
      return VALID_COMBAT_STYLE.has(candidate) ? candidate : DEFAULT_PLAYER_SETTINGS[setting];
    }
    default:
      return DEFAULT_PLAYER_SETTINGS[setting];
  }
}

function getRawSettingValue(storage: unknown, setting: PlayerSetting): unknown {
  if (Array.isArray(storage)) {
    return storage[setting];
  }
  if (storage && typeof storage === "object") {
    const record = storage as Record<string | number, unknown>;
    return record[setting] ?? record[setting.toString()];
  }
  return undefined;
}

export function createDefaultSettings(): PlayerSettings {
  return {
    [PlayerSetting.IsSprinting]: sanitizeSettingValue(PlayerSetting.IsSprinting, DEFAULT_PLAYER_SETTINGS[PlayerSetting.IsSprinting]),
    [PlayerSetting.AutoRetaliate]: sanitizeSettingValue(PlayerSetting.AutoRetaliate, DEFAULT_PLAYER_SETTINGS[PlayerSetting.AutoRetaliate]),
    [PlayerSetting.CombatStyle]: sanitizeSettingValue(PlayerSetting.CombatStyle, DEFAULT_PLAYER_SETTINGS[PlayerSetting.CombatStyle]),
    [PlayerSetting.PublicChat]: sanitizeSettingValue(PlayerSetting.PublicChat, DEFAULT_PLAYER_SETTINGS[PlayerSetting.PublicChat]),
    [PlayerSetting.GlobalChat]: sanitizeSettingValue(PlayerSetting.GlobalChat, DEFAULT_PLAYER_SETTINGS[PlayerSetting.GlobalChat])
  };
}

function readSettingEntry(storage: unknown, setting: PlayerSetting): number {
  const raw = getRawSettingValue(storage, setting);
  return sanitizeSettingValue(
    setting,
    typeof raw === "number" && Number.isFinite(raw) ? raw : undefined
  );
}

export function parsePlayerSettings(value: unknown): PlayerSettings {
  if (!Array.isArray(value) && !(value && typeof value === "object")) {
    return createDefaultSettings();
  }
  return {
    [PlayerSetting.IsSprinting]: readSettingEntry(value, PlayerSetting.IsSprinting),
    [PlayerSetting.AutoRetaliate]: readSettingEntry(value, PlayerSetting.AutoRetaliate),
    [PlayerSetting.CombatStyle]: readSettingEntry(value, PlayerSetting.CombatStyle),
    [PlayerSetting.PublicChat]: readSettingEntry(value, PlayerSetting.PublicChat),
    [PlayerSetting.GlobalChat]: readSettingEntry(value, PlayerSetting.GlobalChat)
  };
}

export function serializePlayerSettings(settings: PlayerSettings): PlayerSettings {
  return {
    [PlayerSetting.IsSprinting]: sanitizeSettingValue(PlayerSetting.IsSprinting, settings[PlayerSetting.IsSprinting]),
    [PlayerSetting.AutoRetaliate]: sanitizeSettingValue(
      PlayerSetting.AutoRetaliate,
      settings[PlayerSetting.AutoRetaliate]
    ),
    [PlayerSetting.CombatStyle]: sanitizeSettingValue(PlayerSetting.CombatStyle, settings[PlayerSetting.CombatStyle]),
    [PlayerSetting.PublicChat]: sanitizeSettingValue(PlayerSetting.PublicChat, settings[PlayerSetting.PublicChat]),
    [PlayerSetting.GlobalChat]: sanitizeSettingValue(PlayerSetting.GlobalChat, settings[PlayerSetting.GlobalChat])
  };
}

export const INVENTORY_SLOT_COUNT = 28;

export const EQUIPMENT_SLOTS = [
  "helmet",
  "chest",
  "legs",
  "boots",
  "neck",
  "weapon",
  "shield",
  "back",
  "gloves",
  "projectile"
] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

/**
 * Simplified skill access system.
 * 
 * Usage examples:
 *   const athleticsLevel = playerState.getSkillLevel(SKILLS.athletics);
 *   const hitpointsXp = playerState.getSkillXp(SKILLS.hitpoints);
 *   playerState.addSkillXp(SKILLS.fishing, 100);
 *   const { level, xp } = playerState.getSkillState(SKILLS.magic);
 * 
 * Direct access (read-only):
 *   const level = playerState.skills.athletics.level;
 *   const xp = playerState.skills.athletics.xp;
 */
export const SKILLS = {
  overall: "overall",
  hitpoints: "hitpoints",
  accuracy: "accuracy",
  strength: "strength",
  defense: "defense",
  magic: "magic",
  range: "range",
  fishing: "fishing",
  cooking: "cooking",
  forestry: "forestry",
  mining: "mining",
  smithing: "smithing",
  crafting: "crafting",
  harvesting: "harvesting",
  crime: "crime",
  potionmaking: "potionmaking",
  enchanting: "enchanting",
  athletics: "athletics"
} as const;

export type SkillSlug = (typeof SKILLS)[keyof typeof SKILLS];

// Array of all skill slugs (for iteration)
export const SKILL_SLUGS: readonly SkillSlug[] = Object.values(SKILLS);

// Client protocol references (0-16)
export enum SkillClientReference {
  Hitpoints = 0,
  Accuracy = 1,
  Strength = 2,
  Defense = 3,
  Magic = 4,
  Fishing = 5,
  Cooking = 6,
  Forestry = 7,
  Mining = 8,
  Crafting = 9,
  Crime = 10,
  Potionmaking = 11,
  Smithing = 12,
  Harvesting = 13,
  Enchanting = 14,
  Range = 15,
  Athletics = 16
}

// Mapping from client reference to skill slug
const CLIENT_REF_TO_SKILL: Record<SkillClientReference, Exclude<SkillSlug, "overall">> = {
  [SkillClientReference.Hitpoints]: SKILLS.hitpoints,
  [SkillClientReference.Accuracy]: SKILLS.accuracy,
  [SkillClientReference.Strength]: SKILLS.strength,
  [SkillClientReference.Defense]: SKILLS.defense,
  [SkillClientReference.Magic]: SKILLS.magic,
  [SkillClientReference.Fishing]: SKILLS.fishing,
  [SkillClientReference.Cooking]: SKILLS.cooking,
  [SkillClientReference.Forestry]: SKILLS.forestry,
  [SkillClientReference.Mining]: SKILLS.mining,
  [SkillClientReference.Crafting]: SKILLS.crafting,
  [SkillClientReference.Crime]: SKILLS.crime,
  [SkillClientReference.Potionmaking]: SKILLS.potionmaking,
  [SkillClientReference.Smithing]: SKILLS.smithing,
  [SkillClientReference.Harvesting]: SKILLS.harvesting,
  [SkillClientReference.Enchanting]: SKILLS.enchanting,
  [SkillClientReference.Range]: SKILLS.range,
  [SkillClientReference.Athletics]: SKILLS.athletics
};

// Mapping from skill slug to client reference
const SKILL_TO_CLIENT_REF: Record<SkillSlug, SkillClientReference | null> = {
  [SKILLS.overall]: null,
  [SKILLS.hitpoints]: SkillClientReference.Hitpoints,
  [SKILLS.accuracy]: SkillClientReference.Accuracy,
  [SKILLS.strength]: SkillClientReference.Strength,
  [SKILLS.defense]: SkillClientReference.Defense,
  [SKILLS.magic]: SkillClientReference.Magic,
  [SKILLS.range]: SkillClientReference.Range,
  [SKILLS.fishing]: SkillClientReference.Fishing,
  [SKILLS.cooking]: SkillClientReference.Cooking,
  [SKILLS.forestry]: SkillClientReference.Forestry,
  [SKILLS.mining]: SkillClientReference.Mining,
  [SKILLS.smithing]: SkillClientReference.Smithing,
  [SKILLS.crafting]: SkillClientReference.Crafting,
  [SKILLS.harvesting]: SkillClientReference.Harvesting,
  [SKILLS.crime]: SkillClientReference.Crime,
  [SKILLS.potionmaking]: SkillClientReference.Potionmaking,
  [SKILLS.enchanting]: SkillClientReference.Enchanting,
  [SKILLS.athletics]: SkillClientReference.Athletics
};

const EXP_AT_LEVEL = [0, 0, 99, 210, 333, 470, 622, 791, 978, 1185, 1414, 1667, 1947, 2256, 2598, 2976, 3393, 3854, 4363, 4925, 5546, 6232, 6989, 7825, 8749, 9769, 10896, 12141, 13516, 15035, 16713, 18567, 20616, 22880, 25382, 28147, 31202, 34579, 38311, 42436, 46996, 52037, 57609, 63769, 70579, 78108, 86433, 95637, 105814, 117067, 129510, 143269, 158484, 175309, 193915, 214491, 237246, 262410, 290240, 321018, 355057, 392703, 434338, 480386, 531315, 587643, 649943, 718848, 795059, 879351, 972582, 1075701, 1189756, 1315908, 1455440, 1609773, 1780476, 1969287, 2178128, 2409124, 2664626, 2947234, 3259825, 3605580, 3988019, 4411034, 4878932, 5396475, 5968931, 6602127, 7302510, 8077208, 8934109, 9881935, 10930335, 12089982, 13372681, 14791491, 16360855, 18096750, 20016848];
export function getExpAtLevel(level: number): number {
  return EXP_AT_LEVEL[level];
}

/**
 * Calculate the level for a given XP amount using the EXP_AT_LEVEL table.
 * Returns the highest level where the required XP is less than or equal to the given XP.
 */
export function getLevelForExp(xp: number): number {
  if (xp <= 0) return 1;
  
  // Find the highest level where the required XP is <= the given XP
  for (let level = EXP_AT_LEVEL.length - 1; level >= 1; level--) {
    if (xp >= EXP_AT_LEVEL[level]) {
      return level;
    }
  }
  return 1;
}

export function isSkillSlug(value: unknown): value is SkillSlug {
  return typeof value === "string" && (SKILL_SLUGS as readonly string[]).includes(value as SkillSlug);
}

export function skillToClientRef(slug: SkillSlug): SkillClientReference | null {
  return SKILL_TO_CLIENT_REF[slug];
}

export function clientRefToSkill(ref: SkillClientReference): Exclude<SkillSlug, "overall"> {
  return CLIENT_REF_TO_SKILL[ref];
}

export type PlayerSkills = Record<SkillSlug, SkillState>;

export function createDefaultSkills(): PlayerSkills {
  const skills: Partial<Record<SkillSlug, SkillState>> = {};
  for (const slug of SKILL_SLUGS) {
    const defaultLevel = slug === SKILLS.hitpoints ? 10 : 1;
    skills[slug] = { level: defaultLevel, boostedLevel: defaultLevel, xp: 0 };
  }
  return skills as PlayerSkills;
}

export type PlayerEquipment = Record<EquipmentSlot, EquipmentStack | null>;

export function createDefaultEquipment(): PlayerEquipment {
  const equipment: Partial<PlayerEquipment> = {};
  for (const slot of EQUIPMENT_SLOTS) {
    equipment[slot] = null;
  }
  return equipment as PlayerEquipment;
}

export function isEquipmentSlot(value: unknown): value is EquipmentSlot {
  return typeof value === "string" && (EQUIPMENT_SLOTS as readonly string[]).includes(value as EquipmentSlot);
}

export type PlayerAppearance = {
  hairStyleId: number;
  beardStyleId: number;
  shirtId: number;
  bodyTypeId: number;
  legsId: number;
};

export function createDefaultAppearance(): PlayerAppearance {
  return {
    hairStyleId: 1,
    beardStyleId: 1,
    shirtId: 1,
    bodyTypeId: 0,
    legsId: 5
  };
}

export function createEmptyInventory(): FullInventory {
  return Array(INVENTORY_SLOT_COUNT).fill(null);
}

export function ensureInventoryLength(inventory: FullInventory): FullInventory {
  const normalized = inventory.slice(0, INVENTORY_SLOT_COUNT);
  while (normalized.length < INVENTORY_SLOT_COUNT) normalized.push(null);
  return normalized;
}

export class PlayerState {
  public readonly abilities: PlayerAbilities;
  public readonly settings: PlayerSettings;
  public currentState: States;
  public timePlayed: number; // Total time played in milliseconds
  public connectedAt: number; // Timestamp when player connected (for session time calculation)
  public readonly playerType: number; // Player type: 0=Default, 1=Admin, 2=Mod, 3=PlayerMod
  public inventoryWeight: number; // Weight from inventory items (excludes IOU items)
  public equippedWeight: number; // Weight from equipped items
  public pendingAction: PendingAction | null = null; // Pending action to execute after pathfinding
  public currentShopId: number | null = null; // Shop ID the player is currently browsing (null if not shopping)
  public bank: (BankItem | null)[] | null = null; // Bank storage (500 slots), loaded lazily on first bank access
  public combatDelay: number = 0; // Combat cooldown in ticks. When 0, player can attack.
  public lastLocalMessageTick: number = Number.NEGATIVE_INFINITY; // Tick of last local chat message.
  public lastEdibleActionTick: number = Number.NEGATIVE_INFINITY; // Tick of last eat/drink action.
  public combatLevel: number = 3; // Cached combat level (recalculated when combat skills change)
  public autoCastSpellId: number | null = null; // Selected auto-cast spell (ephemeral, not persisted)
  public singleCastSpellId: number | null = null; // Single-cast spell queued for next magic attack
  public readonly questProgress: Map<number, QuestProgress>; // Quest progress tracking (questId -> progress)
  
  // Cached equipment bonuses (recalculated on equip/unequip)
  public accuracyBonus: number = 0; // Total accuracy bonus from all equipped items
  public strengthBonus: number = 0; // Total strength bonus from all equipped items
  public defenseBonus: number = 0; // Total defense bonus from all equipped items
  public magicBonus: number = 0; // Total magic bonus from all equipped items
  public rangeBonus: number = 0; // Total range bonus from all equipped items
  public skillBonuses: Record<string, number> = {}; // Skill bonuses (e.g., forestry: 5)
  private readonly boostedSkillSlugs = new Set<SkillSlug>();

  constructor(
    public readonly userId: number,
    public readonly persistenceId: number,
    public username: string,
    public displayName: string,
    public mapLevel: MapLevel,
    public x: number,
    public y: number,
    public readonly skills: PlayerSkills,
    public readonly equipment: PlayerEquipment,
    public readonly inventory: FullInventory,
    public readonly appearance: PlayerAppearance,
    abilities: PlayerAbilities,
    settings: PlayerSettings,
    questProgress: Map<number, QuestProgress>,
    currentState: States = States.IdleState,
    timePlayed: number = 0,
    playerType: number = 0,
    inventoryWeight: number = 0,
    equippedWeight: number = 0
  ) {
    this.abilities = {
      [PlayerAbility.Stamina]: clampAbilityValue(abilities[PlayerAbility.Stamina]),
      [PlayerAbility.SpecialAttack]: clampAbilityValue(abilities[PlayerAbility.SpecialAttack])
    };
    this.settings = serializePlayerSettings(settings);
    this.questProgress = questProgress;
    this.currentState = currentState;
    this.timePlayed = Math.max(0, timePlayed);
    this.connectedAt = Date.now();
    this.playerType = playerType;
    this.inventoryWeight = Math.max(0, inventoryWeight);
    this.equippedWeight = Math.max(0, equippedWeight);
    this.markClean();
    this.rebuildBoostedSkillTracking();
  }
  public dirty = false;
  public lastDirtyAt = 0;
  public lastSaveAt = 0;
  public saveVersion = 0;
  public skillsDirty = false; // Tracks if skills changed and need hiscore sync
  public lastHiscoreSyncAt = 0; // Timestamp of last hiscore sync
  public questProgressDirty = false; // Tracks if quest progress changed and needs to be saved

  private flagDirty() {
    this.dirty = true;
    this.lastDirtyAt = Date.now();
  }

  private flagSkillsDirty() {
    this.flagDirty();
    this.skillsDirty = true;
  }

  private flagQuestProgressDirty() {
    this.flagDirty();
    this.questProgressDirty = true;
  }

  public markClean() {
    this.dirty = false;
    this.lastDirtyAt = 0;
    this.lastSaveAt = Date.now();
    this.saveVersion = 0;
  }

  public markSkillsClean() {
    this.skillsDirty = false;
    this.lastHiscoreSyncAt = Date.now();
  }

  public markQuestProgressClean() {
    this.questProgressDirty = false;
  }

  updateAbility(ability: PlayerAbility, value: number): number {
    const nextValue = clampAbilityValue(value);
    if (this.abilities[ability] === nextValue) return nextValue;
    this.abilities[ability] = nextValue;
    this.flagDirty();
    return nextValue;
  }

  updateSetting(setting: PlayerSetting, value: number): boolean {
    const nextValue = sanitizeSettingValue(setting, value);
    if (this.settings[setting] === nextValue) return false;
    this.settings[setting] = nextValue;
    this.flagDirty();
    return true;
  }

  public noteSaved(savedAt: number, version: number) {
    this.dirty = false;
    this.lastDirtyAt = 0;
    this.lastSaveAt = savedAt;
    this.saveVersion = version;
  }

  updateLocation(mapLevel: MapLevel, x: number, y: number) {
    if (!isMapLevel(mapLevel)) {
      throw new Error(`updateLocation: invalid mapLevel ${mapLevel}`);
    }
    this.mapLevel = mapLevel;
    this.x = x
    this.y = y
    this.flagDirty();
  }

  updateAppearance(appearance: Partial<PlayerAppearance>) {
    if (appearance.hairStyleId !== undefined) {
      this.appearance.hairStyleId = appearance.hairStyleId;
    }
    if (appearance.beardStyleId !== undefined) {
      this.appearance.beardStyleId = appearance.beardStyleId;
    }
    if (appearance.shirtId !== undefined) {
      this.appearance.shirtId = appearance.shirtId;
    }
    if (appearance.bodyTypeId !== undefined) {
      this.appearance.bodyTypeId = appearance.bodyTypeId;
    }
    if (appearance.legsId !== undefined) {
      this.appearance.legsId = appearance.legsId;
    }
    this.flagDirty();
  }

  /**
   * Gets the actual skill level (from XP) for a given skill.
   * For most game mechanics, use getEffectiveLevel() instead.
   * Usage: playerState.getSkillLevel(SKILLS.athletics)
   */
  getSkillLevel(slug: SkillSlug): number {
    return this.skills[slug]?.level ?? 1;
  }

  /**
   * Gets the boosted skill level (current effective level) for a given skill.
   * This includes temporary effects like potions and prayers, but NOT equipment bonuses.
   * For most game mechanics, use getEffectiveLevel() instead.
   * Usage: playerState.getSkillBoostedLevel(SKILLS.athletics)
   */
  getSkillBoostedLevel(slug: SkillSlug): number {
    return this.skills[slug]?.boostedLevel ?? 1;
  }

  /**
   * Gets the total effective level for a skill including all bonuses.
   * This is the complete level used for game mechanics:
   * - Base boosted level (includes potions, prayers, etc.)
   * - Equipment bonuses (like forestry +5 from a pendant)
   * 
   * This is what should be used for:
   * - Skill requirement checks (can player chop this tree?)
   * - Success rate calculations (does player succeed at mining this ore?)
   * - Any game mechanic that depends on skill level
   * 
   * Usage: playerState.getEffectiveLevel(SKILLS.forestry)
   */
  getEffectiveLevel(slug: SkillSlug): number {
    const boostedLevel = this.getSkillBoostedLevel(slug);
    const equipmentBonus = this.getSkillBonus(slug);
    return boostedLevel + equipmentBonus;
  }

  /**
   * Gets the skill XP for a given skill.
   * Usage: playerState.getSkillXp(SKILLS.athletics)
   */
  getSkillXp(slug: SkillSlug): number {
    return this.skills[slug]?.xp ?? 0;
  }

  /**
   * Gets the full skill state (level, boostedLevel, and xp) for a given skill.
   * Usage: const { level, boostedLevel, xp } = playerState.getSkillState(SKILLS.athletics)
   */
  getSkillState(slug: SkillSlug): SkillState {
    return this.skills[slug] ?? { level: 1, boostedLevel: 1, xp: 0 };
  }

  /**
   * Returns the set of skills that are currently boosted or drained.
   * Do not mutate this set directly; use skill update methods instead.
   */
  getBoostedSkillSlugs(): ReadonlySet<SkillSlug> {
    return this.boostedSkillSlugs;
  }

  /**
   * Sets the skill level and XP for a given skill.
   * If boostedLevel is not provided, it will be set equal to the new level.
   * Returns the old combat level (before this change) if this is a combat skill, otherwise null.
   */
  setSkillState(slug: SkillSlug, level: number, xp: number, boostedLevel?: number): number | null {
    const actualLevel = Math.max(1, level);
    const finalBoostedLevel = boostedLevel !== undefined ? Math.max(1, boostedLevel) : actualLevel;
    
    // Store old combat level if this is a combat skill
    const isCombatSkill = slug === SKILLS.hitpoints || slug === SKILLS.accuracy || 
                          slug === SKILLS.defense || slug === SKILLS.strength || 
                          slug === SKILLS.range || slug === SKILLS.magic;
    const oldCombatLevel = isCombatSkill ? this.combatLevel : null;
    
    this.skills[slug] = { 
      level: actualLevel, 
      boostedLevel: finalBoostedLevel, 
      xp: Math.max(0, xp) 
    };
    this.updateBoostedSkillTracking(slug, actualLevel, finalBoostedLevel);
    this.flagSkillsDirty(); // Mark skills for hiscore sync
    
    return oldCombatLevel;
  }

  /**
   * Updates the cached combat level.
   * Should be called after combat skills change.
   */
  updateCombatLevel(newCombatLevel: number) {
    this.combatLevel = newCombatLevel;
  }

  /**
   * Sets the boosted level for a given skill without changing actual level or XP.
   * Used for temporary stat boosts/drains from potions, prayers, etc.
   */
  setBoostedLevel(slug: SkillSlug, boostedLevel: number) {
    const current = this.getSkillState(slug);
    const nextBoostedLevel = Math.max(0, boostedLevel);
    this.skills[slug] = { 
      level: current.level, 
      boostedLevel: nextBoostedLevel, 
      xp: current.xp 
    };
    this.updateBoostedSkillTracking(slug, current.level, nextBoostedLevel);
    this.flagDirty(); // Only flag dirty, not skillsDirty (boosted level is temporary)
  }

  /**
   * Resets the boosted level to match the actual level (removes boosts/drains).
   */
  resetBoostedLevel(slug: SkillSlug) {
    const current = this.getSkillState(slug);
    if (current.boostedLevel !== current.level) {
      this.skills[slug] = { 
        level: current.level, 
        boostedLevel: current.level, 
        xp: current.xp 
      };
      this.updateBoostedSkillTracking(slug, current.level, current.level);
      this.flagDirty();
    }
  }

  private rebuildBoostedSkillTracking() {
    this.boostedSkillSlugs.clear();
    for (const slug of SKILL_SLUGS) {
      const state = this.skills[slug];
      if (!state) continue;
      this.updateBoostedSkillTracking(slug, state.level, state.boostedLevel);
    }
  }

  private updateBoostedSkillTracking(slug: SkillSlug, level: number, boostedLevel: number) {
    if (slug === SKILLS.overall) return;
    if (boostedLevel !== level) {
      this.boostedSkillSlugs.add(slug);
    } else {
      this.boostedSkillSlugs.delete(slug);
    }
  }

  /**
   * Adds XP to a skill. Preserves boostedLevel unless it was equal to level before XP change.
   * Returns information about level ups for caller to handle packets/events.
   * Usage: const result = playerState.addSkillXp(SKILLS.athletics, 100)
   */
  addSkillXp(slug: SkillSlug, xpDelta: number): { 
    newState: SkillState; 
    leveledUp: boolean; 
    oldLevel: number; 
    levelsGained: number;
  } {
    const current = this.getSkillState(slug);
    const oldLevel = current.level;
    const wasBoosted = current.boostedLevel !== current.level;
    const newXp = Math.max(0, current.xp + xpDelta);
    
    // Check if the new XP amount causes a level increase
    const newLevel = getLevelForExp(newXp);
    const leveledUp = newLevel > oldLevel;
    const levelsGained = newLevel - oldLevel;
    
    const updated = {
      level: newLevel,
      boostedLevel: wasBoosted ? current.boostedLevel : newLevel,
      xp: newXp
    };
    this.setSkillState(slug, updated.level, updated.xp, updated.boostedLevel);
    
    return {
      newState: this.getSkillState(slug),
      leveledUp,
      oldLevel,
      levelsGained
    };
  }

  /**
   * Gets skill by client protocol reference (used for packet handling).
   */
  getSkillByClientRef(ref: SkillClientReference) {
    const slug = clientRefToSkill(ref);
    return { slug, state: this.getSkillState(slug) };
  }

  /**
   * Updates skill by client protocol reference (used for packet handling).
   */
  updateSkillByClientRef(ref: SkillClientReference, updates: Partial<SkillState>) {
    const slug = clientRefToSkill(ref);
    const current = this.getSkillState(slug);
    const nextLevel = Math.max(1, updates.level ?? current.level);
    const nextXp = Math.max(0, updates.xp ?? current.xp);
    const nextBoostedLevel = updates.boostedLevel !== undefined 
      ? Math.max(1, updates.boostedLevel) 
      : current.boostedLevel;
    this.setSkillState(slug, nextLevel, nextXp, nextBoostedLevel);
  }

  setEquipment(slot: EquipmentSlot, stack: EquipmentStack | null) {
    this.equipment[slot] = stack;
    this.flagDirty();
  }

  getEquipment(slot: EquipmentSlot) {
    return this.equipment[slot];
  }

  equipItem(slot: EquipmentSlot, stack: EquipmentStack | null) {
    this.equipment[slot] = stack;
    this.flagDirty();
  }

  /**
   * Updates the player's current in-memory state (not persisted).
   * @deprecated Use StateMachine.setState instead.
   */
  setState(nextState: States) {
    this.currentState = nextState;
  }

  unequipSlot(slot: EquipmentSlot) {
    this.equipment[slot] = null;
    this.flagDirty();
  }

  // ============================================================================
  // Inventory Methods
  // ============================================================================

  /**
   * Validates if a slot index is within valid inventory bounds.
   */
  isValidSlotIndex(slotIndex: number): boolean {
    return Number.isInteger(slotIndex) && slotIndex >= 0 && slotIndex < INVENTORY_SLOT_COUNT;
  }

  /**
   * Gets the item at a specific inventory slot.
   * @returns The item tuple or null if slot is empty/invalid
   */
  getInventorySlot(slotIndex: number): InventoryItem | null {
    if (!this.isValidSlotIndex(slotIndex)) return null;
    return this.inventory[slotIndex] ?? null;
  }

  /**
   * Finds the first empty slot in the inventory.
   * @returns Slot index or -1 if inventory is full
   */
  findFirstEmptySlot(): number {
    return this.inventory.findIndex((slot) => slot === null);
  }

  /**
   * Counts the number of empty slots in the inventory.
   */
  countEmptySlots(): number {
    return this.inventory.filter((slot) => slot === null).length;
  }

  /**
   * Finds all slots containing a specific item.
   * @param itemId The item ID to search for
   * @param isIOU Optional isIOU filter
   * @returns Array of slot indices
   */
  findSlotsWithItem(itemId: number, isIOU?: number): number[] {
    const slots: number[] = [];
    for (let i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      const item = this.inventory[i];
      if (item && item[0] === itemId) {
        if (isIOU === undefined || item[2] === isIOU) {
          slots.push(i);
        }
      }
    }
    return slots;
  }

  /**
   * Counts the total amount of a specific item in the inventory.
   */
  countItem(itemId: number, isIOU?: number): number {
    let total = 0;
    for (const item of this.inventory) {
      if (item && item[0] === itemId) {
        if (isIOU === undefined || item[2] === isIOU) {
          total += item[1];
        }
      }
    }
    return total;
  }

  /**
   * Checks if the inventory contains at least a certain amount of an item.
   */
  hasItem(itemId: number, amount: number = 1, isIOU?: number): boolean {
    return this.countItem(itemId, isIOU) >= amount;
  }

  /**
   * Marks the inventory as dirty (needs saving).
   * Call this after using InventoryManager to mutate the inventory.
   */
  markInventoryDirty() {
    this.flagDirty();
  }

  /**
   * Marks the bank as dirty (needs saving).
   * Call this after modifying the bank (swap, insert, deposit, withdraw).
   */
  markBankDirty() {
    this.flagDirty();
  }

  /**
   * Checks if the inventory has at least one empty slot.
   */
  hasInventorySpace(): boolean {
    return this.findFirstEmptySlot() !== -1;
  }

  /**
   * Clears the entire inventory.
   */
  clearInventory() {
    for (let i = 0; i < INVENTORY_SLOT_COUNT; i++) {
      this.inventory[i] = null;
    }
    this.flagDirty();
  }

  /**
   * Gets a snapshot of the current inventory.
   * Returns a copy to prevent external mutation.
   */
  getInventorySnapshot(): FullInventory {
    return this.inventory.map((item) => item ? [...item] as InventoryItem : null);
  }

  // ============================================================================
  // Weight Management Methods
  // ============================================================================

  /**
   * Gets the total weight (inventory + equipped).
   * Used for stamina calculations and other game mechanics.
   */
  getTotalWeight(): number {
    return this.inventoryWeight + this.equippedWeight;
  }

  /**
   * Adds weight to the player's inventory weight.
   * Weight is clamped to a minimum of 0.
   */
  addInventoryWeight(amount: number) {
    this.inventoryWeight = Math.max(0, this.inventoryWeight + amount);
  }

  /**
   * Subtracts weight from the player's inventory weight.
   * Weight is clamped to a minimum of 0.
   */
  subtractInventoryWeight(amount: number) {
    this.inventoryWeight = Math.max(0, this.inventoryWeight - amount);
  }

  /**
   * Sets the player's inventory weight directly.
   * Weight is clamped to a minimum of 0.
   */
  setInventoryWeight(amount: number) {
    this.inventoryWeight = Math.max(0, amount);
  }

  /**
   * Sets the player's equipped weight directly.
   * Weight is clamped to a minimum of 0.
   */
  setEquippedWeight(amount: number) {
    this.equippedWeight = Math.max(0, amount);
  }

  /**
   * Updates the player's equipped weight.
   * Weight is clamped to a minimum of 0.
   */
  updateEquippedWeight(amount: number) {
    this.equippedWeight = Math.max(0, amount);
  }

  /**
   * Marks the player's equipment as dirty (needs to be saved).
   */
  markEquipmentDirty() {
    this.flagDirty();
  }

  /**
   * Gets the current checkpoint for a quest.
   * 
   * @param questId The quest ID
   * @returns The current checkpoint (0 if not started)
   */
  getQuestCheckpoint(questId: number): number {
    return this.questProgress.get(questId)?.checkpoint ?? 0;
  }

  /**
   * Gets the quest progress for a quest.
   * 
   * @param questId The quest ID
   * @returns The quest progress or null if not started
   */
  getQuestProgress(questId: number): QuestProgress | null {
    return this.questProgress.get(questId) ?? null;
  }

  /**
   * Sets the checkpoint for a quest and marks quest progress as dirty.
   * 
   * @param questId The quest ID
   * @param checkpoint The new checkpoint value
   * @param completed Whether the quest is completed (optional)
   */
  setQuestCheckpoint(questId: number, checkpoint: number, completed?: boolean): void {
    const existing = this.questProgress.get(questId);
    this.questProgress.set(questId, {
      questId,
      checkpoint,
      completed: completed ?? existing?.completed ?? false
    });
    this.flagQuestProgressDirty();
  }

  /**
   * Advances a quest to the next checkpoint.
   * 
   * @param questId The quest ID
   * @param markCompleted Whether to mark the quest as completed when advancing
   */
  advanceQuestCheckpoint(questId: number, markCompleted: boolean = false): void {
    const current = this.getQuestCheckpoint(questId);
    this.setQuestCheckpoint(questId, current + 1, markCompleted);
  }

  /**
   * Marks a quest as completed.
   * 
   * @param questId The quest ID
   * @param finalCheckpoint The final checkpoint value (optional, keeps current if not provided)
   */
  completeQuest(questId: number, finalCheckpoint?: number): void {
    const current = this.questProgress.get(questId);
    const checkpoint = finalCheckpoint ?? current?.checkpoint ?? 0;
    this.questProgress.set(questId, {
      questId,
      checkpoint,
      completed: true
    });
    this.flagQuestProgressDirty();
  }

  /**
   * Checks if a quest is completed.
   * 
   * @param questId The quest ID
   * @returns True if the quest is completed
   */
  isQuestCompleted(questId: number): boolean {
    return this.questProgress.get(questId)?.completed ?? false;
  }

  /**
   * Checks if a player has started a quest.
   * 
   * @param questId The quest ID
   * @returns True if the quest has been started
   */
  hasStartedQuest(questId: number): boolean {
    const progress = this.questProgress.get(questId);
    return progress !== undefined && progress.checkpoint > 0;
  }

  /**
   * Gets a skill bonus from equipment.
   * Used for non-combat skills like forestry, mining, etc.
   * 
   * @param skill The skill slug
   * @returns The bonus amount (0 if no bonus)
   */
  getSkillBonus(skill: SkillSlug): number {
    return this.skillBonuses[skill] ?? 0;
  }

  /**
   * Sets all equipment bonuses at once.
   * Should only be called by EquipmentService after recalculating bonuses.
   * 
   * @param bonuses Object containing all equipment bonuses
   */
  setEquipmentBonuses(bonuses: {
    accuracyBonus: number;
    strengthBonus: number;
    defenseBonus: number;
    magicBonus: number;
    rangeBonus: number;
    skillBonuses: Record<string, number>;
  }): void {
    this.accuracyBonus = bonuses.accuracyBonus;
    this.strengthBonus = bonuses.strengthBonus;
    this.defenseBonus = bonuses.defenseBonus;
    this.magicBonus = bonuses.magicBonus;
    this.rangeBonus = bonuses.rangeBonus;
    this.skillBonuses = { ...bonuses.skillBonuses };
  }
}
