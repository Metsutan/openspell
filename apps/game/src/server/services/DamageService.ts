/**
 * DamageService.ts - Handles damage calculation and packet building.
 * 
 * Responsibilities:
 * - Calculate damage dealt (returns 0 for now, algorithm TBD)
 * - Build ShowDamage packets
 * - Get attack speed for entities (NPCs from definition, players from weapon)
 * 
 * Uses VisibilitySystem patterns to broadcast damage to nearby players.
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { buildShowDamagePayload } from "../../protocol/packets/actions/ShowDamage";
import type { ItemCatalog, ItemDefinition } from "../../world/items/ItemCatalog";
import type { SpellCatalog } from "../../world/spells/SpellCatalog";
import type { EntityDefinition } from "../../world/entities/EntityCatalog";
import type { PlayerState } from "../../world/PlayerState";
import type { NPCState } from "../state/EntityState";
import { updateNpcBoostedStats } from "../state/EntityState";
import type { EventBus } from "../events/EventBus";
import { createEntityDamagedEvent, createEntityHitpointsChangedEvent, createFiredProjectileEvent, type EntityRef, type Position } from "../events/GameEvents";
import { SKILLS } from "../../world/PlayerState";
import { PlayerSetting, CombatStyleValues } from "../../protocol/enums/PlayerSetting";

/** Default attack speed in ticks if not specified */
const DEFAULT_ATTACK_SPEED = 6;

export interface DamageServiceConfig {
  itemCatalog: ItemCatalog | null;
  spellCatalog: SpellCatalog | null;
  eventBus: EventBus;
}

/**
 * Service for calculating and broadcasting combat damage.
 */
export class DamageService {
  constructor(private readonly config: DamageServiceConfig) {}

  /**
   * Calculates ranged damage using OSRS-style formulas.
   * Keeps prayer/void/gear modifiers as placeholders for future work.
   */
  calculateRangeDamage(
    attacker: PlayerState | NPCState,
    target: PlayerState | NPCState
  ): number {
    const attackRoll = this.calculateRangedAttackRoll(attacker);
    const defenseRoll = this.calculateRangedDefenseRoll(target);
    const hitChance = this.calculateHitChance(attackRoll, defenseRoll);
    const hitRoll = Math.random();
    if (hitRoll > hitChance) {
      return 0;
    }

    const maxHit = this.calculateRangedMaxHit(attacker);
    if (maxHit <= 0) {
      return 0;
    }

    const damage = Math.floor(Math.random() * maxHit) + 1;
    return damage;
  }

  /**
   * Magic damage roll based on spell definition.
   * Rolls between 1 and maxDamage for the spell.
   */
  calculateMagicDamage(spellId: number): number {
    const spell = this.config.spellCatalog?.getDefinitionById(spellId);
    const maxDamage = spell?.maxDamage ?? 0;
    if (maxDamage <= 0) {
      return 0;
    }
    return Math.floor(Math.random() * maxDamage) + 1;
  }

  /**
   * Calculates magic spell damage with hit chance.
   * Uses magic attack roll (magic level + magic bonus) against magic defense roll.
   */
  calculateMagicSpellDamage(
    attacker: PlayerState | NPCState,
    target: PlayerState | NPCState,
    spellId: number
  ): number {
    const spell = this.config.spellCatalog?.getDefinitionById(spellId);
    const maxDamage = spell?.maxDamage ?? 0;
    if (maxDamage <= 0) {
      return 0;
    }

    const attackRoll = this.calculateMagicAttackRoll(attacker);
    const defenseRoll = this.calculateMagicDefenseRoll(target);
    const hitChance = this.calculateHitChance(attackRoll, defenseRoll);
    const hitRoll = Math.random();
    if (hitRoll > hitChance) {
      return 0;
    }

    const damage = Math.floor(Math.random() * maxDamage) + 1;
    return damage;
  }

  /**
   * Calculates damage dealt by an attacker to a target.
   * Rolls for hit using accuracy vs defense, then rolls damage if hit succeeds.
   * 
   * Performance optimization: Accuracy and defense rolls are computed first,
   * allowing early exit on miss without calculating maximum hit (saves equipment iteration).
   * 
   * Process:
   * 1. Calculate accuracy roll (attacker) - Heavy: iterates equipment for accuracy bonuses
   * 2. Calculate defense roll (target) - Heavy: iterates equipment for defense bonuses
   * 3. Determine hit chance based on accuracy vs defense - Light: simple math
   * 4. Roll to see if attack hits - Light: random check
   * 5. Early exit if miss (returns 0)
   * 6. Calculate maximum hit - Heavy: iterates equipment for strength bonuses
   * 7. Roll damage between 0 and maxHit (OSRS-style)
   * 
   * @param attacker The entity dealing damage
   * @param target The entity receiving damage
   * @returns Damage amount (0 if miss, 0-maxHit if hit)
   */
  calculateDamage(
    attacker: PlayerState | NPCState,
    target: PlayerState | NPCState
  ): number {
    
    // Calculate accuracy roll (attacker's chance to hit)
    const accuracyRoll = this.calculateAccuracyRoll(attacker, target);
    
    // Calculate defense roll (target's chance to avoid)
    const defenseRoll = this.calculateDefenseRoll(target, attacker);
    
    // Determine hit chance based on accuracy vs defense
    const hitChance = this.calculateHitChance(accuracyRoll, defenseRoll);
    
    // Roll to see if we hit
    const hitRoll = Math.random();
    if (hitRoll > hitChance) {
      // Miss! Early exit saves maxHit calculation
      return 0;
    }

    // Calculate maximum possible hit (only if attack lands)
    const maxHit = this.getMaximumHit(attacker);
    if (maxHit <= 0) {
      return 0;
    }
    
    // Hit! Roll damage between 0 and maxHit (inclusive), OSRS-style
    const damage = Math.floor(Math.random() * (maxHit + 1));
    return damage;
  }

  /**
   * Calculates the maximum hit for an attacker.
   * Formula: floor((effectiveStrength * (totalStrengthBonus + 64) + 320) / 640)
   * 
   * @param attacker The entity attacking
   * @returns Maximum hit (floor of base damage)
   */
  getMaximumHit(attacker: PlayerState | NPCState): number {
    const effectiveStrength = this.getEffectiveStrength(attacker);
    const totalStrengthBonus = this.getTotalStrengthBonus(attacker);
    
    const baseDamage = (effectiveStrength * (totalStrengthBonus + 64) + 320) / 640;
    return Math.floor(baseDamage);
  }

  /**
   * Calculates the accuracy roll for an attacker.
   * Formula: floor(effectiveAccuracy * (equipmentAccuracyBonus + 64) * targetGearBonus)
   * 
   * @param attacker The entity attacking
   * @param target The entity being attacked (for target-specific gear bonuses)
   * @returns Accuracy roll value
   */
  private calculateAccuracyRoll(attacker: PlayerState | NPCState, target: PlayerState | NPCState): number {
    const effectiveAccuracy = this.getEffectiveAccuracy(attacker);
    const accuracyBonus = this.getTotalAccuracyBonus(attacker);
    
    // TODO: Implement target-specific gear bonus (e.g., dragon weapons vs dragons)
    const targetGearBonus = 1.0;
    
    const accuracyRoll = effectiveAccuracy * (accuracyBonus + 64) * targetGearBonus;
    return Math.floor(accuracyRoll);
  }

  /**
   * Calculates the defense roll for a target.
   * Formula: effectiveDefense * (defenseBonus + 64)
   * 
   * @param target The entity defending
   * @param attacker The entity attacking (for future attack-type specific defense)
   * @returns Defense roll value
   */
  private calculateDefenseRoll(target: PlayerState | NPCState, attacker: PlayerState | NPCState): number {
    const effectiveDefense = this.getEffectiveDefense(target);
    const defenseBonus = this.getTotalDefenseBonus(target);
    
    const defenseRoll = effectiveDefense * (defenseBonus + 64);
    return Math.floor(defenseRoll);
  }

  /**
   * Calculates hit chance based on accuracy roll vs defense roll.
   * 
   * Formula:
   * - If attackRoll > defenseRoll: 1 - ((defenseRoll + 2) / (2 * (attackRoll + 1)))
   * - Otherwise: attackRoll / (2 * (defenseRoll + 1))
   * 
   * @param attackRoll Attacker's accuracy roll
   * @param defenseRoll Target's defense roll
   * @returns Hit chance (0.0 to 1.0)
   */
  private calculateHitChance(attackRoll: number, defenseRoll: number): number {
    if (attackRoll > defenseRoll) {
      return 1 - ((defenseRoll + 2) / (2 * (attackRoll + 1)));
    } else {
      return attackRoll / (2 * (defenseRoll + 1));
    }
  }

  private calculateRangedMaxHit(attacker: PlayerState | NPCState): number {
    const rangedLevel = this.getRangedLevel(attacker);
    const boost = this.getRangedBoost(attacker);
    const prayerBonus = this.getRangedPrayerBonus(attacker);
    const styleBonus = this.getRangedStyleBonus(attacker);
    const voidModifier = this.getRangedVoidModifier(attacker, "strength");
    const rangedStrengthBonus = this.getRangedStrengthBonus(attacker);
    const gearBonus = this.getRangedGearBonus(attacker, "damage");
    const specialBonus = this.getRangedSpecialBonus(attacker);

    const effectiveRangedStrength = Math.floor(
      (Math.floor((rangedLevel + boost) * prayerBonus) + styleBonus + 8) * voidModifier
    );

    const baseDamage = Math.floor(
      0.5 + (effectiveRangedStrength * (rangedStrengthBonus + 64)) / 640
    );

    const maxHit = Math.floor(baseDamage * gearBonus);
    const finalMaxHit = Math.floor(maxHit * specialBonus);
    const ammoCap = this.getRangedAmmoMaxHitCap(attacker);
    if (ammoCap !== null) {
      return Math.min(finalMaxHit, ammoCap);
    }
    return finalMaxHit;
  }

  private calculateRangedAttackRoll(attacker: PlayerState | NPCState): number {
    const rangedLevel = this.getRangedLevel(attacker);
    const boost = this.getRangedBoost(attacker);
    const prayerBonus = this.getRangedPrayerBonus(attacker);
    const styleBonus = this.getRangedStyleBonus(attacker);
    const voidModifier = this.getRangedVoidModifier(attacker, "accuracy");
    const rangedAttackBonus = this.getRangedAttackBonus(attacker);
    const gearBonus = this.getRangedGearBonus(attacker, "accuracy");

    const effectiveRangedAttack = Math.floor(
      (Math.floor((rangedLevel + boost) * prayerBonus) + styleBonus + 8) * voidModifier
    );

    return Math.floor(effectiveRangedAttack * (rangedAttackBonus + 64) * gearBonus);
  }

  private calculateRangedDefenseRoll(target: PlayerState | NPCState): number {
    const defenseLevel = this.getDefenseLevelForRangedRoll(target);
    const defenseBonus = this.getTotalDefenseBonus(target);
    return Math.floor((defenseLevel + 9) * (defenseBonus + 64));
  }

  private getDefenseLevelForRangedRoll(target: PlayerState | NPCState): number {
    if ("userId" in target) {
      return target.getSkillBoostedLevel("defense");
    }
    return target.defenseLevel;
  }

  private getRangedLevel(attacker: PlayerState | NPCState): number {
    if ("userId" in attacker) {
      return attacker.getSkillBoostedLevel("range");
    }
    return attacker.rangeLevel;
  }

  private getRangedBoost(attacker: PlayerState | NPCState): number {
    void attacker;
    return 0;
  }

  private getRangedPrayerBonus(attacker: PlayerState | NPCState): number {
    void attacker;
    return 1;
  }

  private getRangedVoidModifier(attacker: PlayerState | NPCState, _type: "accuracy" | "strength"): number {
    void attacker;
    return 1;
  }

  private getRangedGearBonus(attacker: PlayerState | NPCState, _type: "accuracy" | "damage"): number {
    void attacker;
    return 1;
  }

  private getRangedSpecialBonus(attacker: PlayerState | NPCState): number {
    void attacker;
    return 1;
  }

  private getRangedStyleBonus(attacker: PlayerState | NPCState): number {
    if ("userId" in attacker) {
      const combatStyle = attacker.settings[PlayerSetting.CombatStyle];
      if (combatStyle === CombatStyleValues.Accurate) {
        return 3;
      }
    }
    return 0;
  }

  private getRangedStrengthBonus(attacker: PlayerState | NPCState): number {
    if ("userId" in attacker) {
      return attacker.rangeBonus;
    }
    return attacker.definition.combat?.rangeBonus ?? 0;
  }

  private getRangedAttackBonus(attacker: PlayerState | NPCState): number {
    if ("userId" in attacker) {
      return attacker.rangeBonus;
    }
    return attacker.definition.combat?.rangeBonus ?? 0;
  }

  private getRangedAmmoMaxHitCap(attacker: PlayerState | NPCState): number | null {
    if (!("userId" in attacker)) {
      return null;
    }

    const projectileId = attacker.equipment.projectile?.[0];
    if (!projectileId) {
      return null;
    }

    const maxHitByAmmo: Record<number, number> = {
      334: 8,  // bronze arrows
      335: 10, // iron arrows
      336: 13, // steel arrows
      337: 16, // palladium arrows
      338: 20, // coronium arrows
      339: 24  // celadon arrows
    };

    return maxHitByAmmo[projectileId] ?? null;
  }

  private calculateMagicAttackRoll(attacker: PlayerState | NPCState): number {
    if ("userId" in attacker) {
      // Player: E_a = M_lvl * P_e + 8 (P_e = 1, no prayers)
      const magicLevel = attacker.getSkillBoostedLevel("magic");
      const effectiveLevel = magicLevel + 8;
      return Math.floor(effectiveLevel * (attacker.magicBonus + 64));
    }
    // Monster: E_a = M_lvl + 9
    const magicLevel = attacker.magicLevel;
    const effectiveLevel = magicLevel + 9;
    const magicBonus = attacker.definition.combat?.magicBonus ?? 0;
    return Math.floor(effectiveLevel * (magicBonus + 64));
  }
  
  private calculateMagicDefenseRoll(target: PlayerState | NPCState): number {
    if ("userId" in target) {
      // Player: E_d = M_lvl * 0.7 + D_lvl * 0.3 + 8, using rangeBonus as magic def
      const magicLevel = target.getSkillBoostedLevel("magic");
      const defenseLevel = target.getSkillBoostedLevel("defense");
      const effectiveLevel = Math.floor(magicLevel * 0.7 + defenseLevel * 0.3) + 8;
      return Math.floor(effectiveLevel * (target.rangeBonus + 64));
    }
    // Monster: E_d = M_lvl + 9, uses magic defense bonus (magicBonus here)
    const magicLevel = target.magicLevel;
    const effectiveLevel = magicLevel + 9;
    const magicDefBonus = target.definition.combat?.rangeBonus ?? 0;
    return Math.floor(effectiveLevel * (magicDefBonus + 64));
  }

  /**
   * Calculates effective strength for an attacker.
   * Formula: floor(floor(floor(strength + tempBuffs) * percentageBonuses) + styleBonus + 8)
   * 
   * @param attacker The entity attacking
   * @returns Effective strength level
   */
  private getEffectiveStrength(attacker: PlayerState | NPCState): number {
    // Get base strength level (use boosted level for players)
    let strengthLevel: number;
    if ('userId' in attacker) {
      // Player - use boosted level (accounts for potions, prayers, etc.)
      strengthLevel = attacker.getSkillBoostedLevel('strength');
    } else {
      // NPC
      strengthLevel = attacker.strengthLevel;
    }

    // TODO: Add temporary strength level buffs (potions, prayers, etc.)
    const tempBuffs = 0;
    const strengthWithBuffs = strengthLevel + tempBuffs;

    // TODO: Add percentage bonuses (prayers, gear set effects, etc.)
    const percentageBonuses = 1.0;
    const strengthWithPercentages = Math.floor(strengthWithBuffs * percentageBonuses);

    // Calculate style bonus
    const styleBonus = this.getStrengthStyleBonus(attacker);

    // Final effective strength
    return Math.floor(strengthWithPercentages + styleBonus + 8);
  }

  /**
   * Gets the style bonus for strength based on combat style setting.
   * Returns:
   * - 3 for aggressive (strength-only)
   * - 1 for controlled (mixed styles containing strength)
   * - 0 otherwise
   * NPCs use +1.
   * 
   * @param attacker The entity attacking
   * @returns Style bonus for effective strength
   */
  private getStrengthStyleBonus(attacker: PlayerState | NPCState): number {
    if (!('userId' in attacker)) {
      return 1;
    }
    const combatStyle = attacker.settings[PlayerSetting.CombatStyle];
    const hasStrength = (combatStyle & CombatStyleValues.Strength) === CombatStyleValues.Strength;
    if (!hasStrength) {
      return 0;
    }
    return combatStyle === CombatStyleValues.Strength ? 3 : 1;
  }

  /**
   * Calculates effective accuracy for an attacker.
   * Formula: floor(floor(floor(accuracy + tempBuffs) * percentageBonuses) + styleBonus + 8)
   * 
   * @param attacker The entity attacking
   * @returns Effective accuracy level
   */
  private getEffectiveAccuracy(attacker: PlayerState | NPCState): number {
    // Get base accuracy level (use boosted level for players)
    let accuracyLevel: number;
    if ('userId' in attacker) {
      // Player - use boosted level (accounts for potions, prayers, etc.)
      accuracyLevel = attacker.getSkillBoostedLevel('accuracy');
    } else {
      // NPC
      accuracyLevel = attacker.accuracyLevel;
    }

    // TODO: Add temporary accuracy level buffs (potions, prayers, etc.)
    const tempBuffs = 0;
    const accuracyWithBuffs = accuracyLevel + tempBuffs;

    // TODO: Add percentage bonuses (prayers, gear set effects, etc.)
    const percentageBonuses = 1.0;
    const accuracyWithPercentages = Math.floor(accuracyWithBuffs * percentageBonuses);

    // Calculate style bonus (3 for Accuracy style, 1 otherwise)
    const styleBonus = this.getAccuracyStyleBonus(attacker);

    // Final effective accuracy
    return Math.floor(accuracyWithPercentages + styleBonus + 8);
  }

  /**
   * Gets the style bonus for accuracy based on combat style setting.
   * Returns:
   * - 3 for accurate (accurate-only)
   * - 1 for controlled (mixed styles containing accurate)
   * - 0 otherwise
   * NPCs use +1.
   * 
   * @param attacker The entity attacking
   * @returns Style bonus for effective accuracy
   */
  private getAccuracyStyleBonus(attacker: PlayerState | NPCState): number {
    if (!('userId' in attacker)) {
      return 1;
    }
    const combatStyle = attacker.settings[PlayerSetting.CombatStyle];
    const hasAccurate = (combatStyle & CombatStyleValues.Accurate) === CombatStyleValues.Accurate;
    if (!hasAccurate) {
      return 0;
    }
    return combatStyle === CombatStyleValues.Accurate ? 3 : 1;
  }

  /**
   * Calculates effective defense for a target.
   * Formula for players: floor(floor(floor(defense + tempBuffs) * percentageBonuses) + styleBonus + 8)
   * Formula for NPCs: combat.defense + 9
   * 
   * @param target The entity defending
   * @returns Effective defense level
   */
  private getEffectiveDefense(target: PlayerState | NPCState): number {
    // NPCs have simplified defense calculation
    if (!('userId' in target)) {
      const npc = target as NPCState;
      const npcDefense = npc.defenseLevel;
      return npcDefense + 9;
    }

    // Player defense calculation (same pattern as strength/accuracy)
    // Use boosted level (accounts for potions, prayers, etc.)
    const defenseLevel = target.getSkillBoostedLevel('defense');

    // TODO: Add temporary defense level buffs (potions, prayers, etc.)
    const tempBuffs = 0;
    const defenseWithBuffs = defenseLevel + tempBuffs;

    // TODO: Add percentage bonuses (prayers, gear set effects, etc.)
    const percentageBonuses = 1.0;
    const defenseWithPercentages = Math.floor(defenseWithBuffs * percentageBonuses);

    // Calculate style bonus (3 for Defense style, 1 otherwise)
    const styleBonus = this.getDefenseStyleBonus(target);

    // Final effective defense
    return Math.floor(defenseWithPercentages + styleBonus + 8);
  }

  /**
   * Gets the style bonus for defense based on combat style setting.
   * Returns:
   * - 3 for defensive (defense-only)
   * - 1 for controlled (mixed styles containing defense)
   * - 0 otherwise
   * NPCs use +1.
   * 
   * @param target The entity defending
   * @returns Style bonus for effective defense
   */
  private getDefenseStyleBonus(target: PlayerState | NPCState): number {
    if (!('userId' in target)) {
      return 1;
    }
    const combatStyle = target.settings[PlayerSetting.CombatStyle];
    const hasDefense = (combatStyle & CombatStyleValues.Defense) === CombatStyleValues.Defense;
    if (!hasDefense) {
      return 0;
    }
    return combatStyle === CombatStyleValues.Defense ? 3 : 1;
  }

  /**
   * Gets the total strength bonus from equipment or NPC definition.
   * For players, uses cached bonus from PlayerState.
   * For NPCs, uses combat definition bonus.
   * 
   * @param attacker The entity attacking
   * @returns Total strength bonus
   */
  private getTotalStrengthBonus(attacker: PlayerState | NPCState): number {
    // Players use cached equipment bonus
    if ('userId' in attacker) {
      return attacker.strengthBonus;
    }
    
    // NPCs get strength bonus from their combat definition
    const npc = attacker as NPCState;
    return npc.definition.combat?.strengthBonus ?? 0;
  }

  /**
   * Gets the total accuracy bonus from equipment or NPC definition.
   * For players, uses cached bonus from PlayerState.
   * For NPCs, uses combat definition bonus.
   * 
   * @param attacker The entity attacking
   * @returns Total accuracy bonus
   */
  private getTotalAccuracyBonus(attacker: PlayerState | NPCState): number {
    // Players use cached equipment bonus
    if ('userId' in attacker) {
      return attacker.accuracyBonus;
    }
    
    // NPCs get accuracy bonus from their combat definition
    const npc = attacker as NPCState;
    return npc.definition.combat?.accuracyBonus ?? 0;
  }

  /**
   * Gets the total defense bonus from equipment or NPC definition.
   * For players, uses cached bonus from PlayerState.
   * For NPCs, uses combat definition bonus.
   * 
   * @param target The entity defending
   * @returns Total defense bonus
   */
  private getTotalDefenseBonus(target: PlayerState | NPCState): number {
    // Players use cached equipment bonus
    if ('userId' in target) {
      return target.defenseBonus;
    }
    
    // NPCs get defense bonus from their combat definition
    const npc = target as NPCState;
    return npc.definition.combat?.defenseBonus ?? 0;
  }

  /**
   * Gets the attack speed for an NPC from its definition.
   * Falls back to DEFAULT_ATTACK_SPEED if not defined.
   * 
   * @param npc The NPC state (contains definition)
   * @returns Attack speed in ticks
   */
  getNpcAttackSpeed(npc: NPCState): number {
    // NPC speed comes from combat.speed in the entity definition
    const speed = (npc.definition.combat?.speed ?? 1) * 6;
    if (typeof speed === "number" && Number.isFinite(speed) && speed > 0) {
      return speed;
    }
    return DEFAULT_ATTACK_SPEED;
  }

  /**
   * Gets the attack speed for a player based on their equipped weapon.
   * Falls back to DEFAULT_ATTACK_SPEED if no weapon equipped or weapon has no speed.
   * 
   * @param player The player state
   * @returns Attack speed in ticks
   */
  getPlayerAttackSpeed(player: PlayerState): number {
    const weaponStack = player.equipment.weapon;
    if (!weaponStack) {
      return DEFAULT_ATTACK_SPEED;
    }

    const itemId = weaponStack[0];
    if (!this.config.itemCatalog) {
      return DEFAULT_ATTACK_SPEED;
    }

    const itemDef = this.config.itemCatalog.getDefinitionById(itemId);
    if (!itemDef) {
      return DEFAULT_ATTACK_SPEED;
    }

    // Check for weaponSpeed property on item definition
    // Note: weaponSpeed may not exist in current ItemDefinition - will use default if missing
    const weaponSpeed = (itemDef as ItemDefinition & { weaponSpeed?: number }).weaponSpeed;
    if (typeof weaponSpeed === "number" && Number.isFinite(weaponSpeed) && weaponSpeed > 0) {
      return weaponSpeed;
    }

    return DEFAULT_ATTACK_SPEED;
  }

  /**
   * Emits a damage event to the event bus.
   * VisibilitySystem will handle broadcasting ShowDamage packets to appropriate viewers.
   * 
   * @param attackerRef The entity dealing damage
   * @param targetRef The entity receiving damage  
   * @param damage The amount of damage dealt
   * @param targetPosition The position of the target (for visibility calculation)
   */
  broadcastDamage(
    attackerRef: EntityRef,
    targetRef: EntityRef,
    damage: number,
    targetPosition: Position
  ): void {
    // Emit EntityDamaged event - VisibilitySystem will handle packet broadcasting
    this.config.eventBus.emit(createEntityDamagedEvent(
      attackerRef,
      targetRef,
      damage,
      targetPosition
    ));
  }

  /**
   * Emits a fired projectile event to the event bus.
   * VisibilitySystem will handle broadcasting FiredProjectile packets.
   */
  broadcastProjectile(
    projectileId: number,
    rangerRef: EntityRef,
    targetRef: EntityRef,
    damage: number,
    targetPosition: Position,
    isConfused: boolean = false
  ): void {
    this.config.eventBus.emit(createFiredProjectileEvent(
      projectileId,
      rangerRef,
      targetRef,
      damage,
      targetPosition,
      isConfused
    ));
  }

  /**
   * Applies damage to a target entity and broadcasts all necessary packets.
   * This is a convenience method that:
   * 1. Applies damage to target's hitpoints
   * 2. Emits EntityDamaged event (ShowDamage packet)
   * 3. Emits EntityHitpointsChanged event (HitpointsCurrentLevelChanged packet)
   * 
   * Use this for non-combat damage (e.g., pickpocket stun, environmental damage).
   * Combat damage should use CombatSystem which has additional logic.
   * 
   * @param attackerRef The entity dealing damage (can be NPC for pickpocket stun)
   * @param targetState The player or NPC receiving damage
   * @param damage The amount of damage to deal
   * @param targetPosition The position of the target
   * @returns The actual damage dealt (may be less if target dies)
   */
  applyDamage(
    attackerRef: EntityRef,
    targetState: PlayerState | NPCState,
    damage: number,
    targetPosition: Position
  ): number {
    // Get current hitpoints
    let currentHp: number;
    if ('userId' in targetState) {
      // Player
      currentHp = targetState.getSkillBoostedLevel(SKILLS.hitpoints);
    } else {
      // NPC
      currentHp = targetState.hitpointsLevel;
    }

    // Calculate actual damage (can't go below 0 HP)
    const actualDamage = Math.min(damage, currentHp);
    const newHp = currentHp - actualDamage;

    // Apply damage to target
    if ('userId' in targetState) {
      // Player - set boosted level
      targetState.setBoostedLevel(SKILLS.hitpoints, newHp);
    } else {
      // NPC - set hitpoints
      targetState.hitpointsLevel = newHp;
      updateNpcBoostedStats(targetState, "hitpoints");
    }

    // Create target reference
    const targetRef: EntityRef = 'userId' in targetState
      ? { type: EntityType.Player, id: targetState.userId }
      : { type: EntityType.NPC, id: targetState.id };

    // Broadcast damage event (ShowDamage packet)
    if (actualDamage > 0) {
      this.config.eventBus.emit(createEntityDamagedEvent(
        attackerRef,
        targetRef,
        actualDamage,
        targetPosition
      ));
    }

    // Broadcast hitpoints changed event (HitpointsCurrentLevelChanged packet)
    this.config.eventBus.emit(createEntityHitpointsChangedEvent(
      targetRef,
      newHp,
      targetPosition
    ));

    return actualDamage;
  }
}
