/**
 * ExperienceService.ts - Unified XP system for all skills
 * 
 * This service is responsible for:
 * - Combat XP: Calculating XP from damage and combat style
 * - Non-combat XP: Awarding XP for gathering skills (woodcutting, mining, etc.)
 * - Distributing XP to appropriate skills
 * - Checking for level ups and sending appropriate packets
 * - Broadcasting level up events to nearby players
 * 
 * All systems should use this service for XP gains to ensure:
 * - Consistent level up messages
 * - Proper packet handling (GainedExp vs IncreaseCombatExp)
 * - Proper event broadcasting for level ups
 */

import { GameAction } from "../../protocol/enums/GameAction";
import { buildGainedExpPayload } from "../../protocol/packets/actions/GainedExp";
import { buildIncreaseCombatExpPayload } from "../../protocol/packets/actions/IncreaseCombatExp";
import { buildSkillCurrentLevelChangedPayload } from "../../protocol/packets/actions/SkillCurrentLevelChanged";
import { 
  SKILLS, 
  skillToClientRef,
  type PlayerState,
  type SkillSlug 
} from "../../world/PlayerState";
import type { SpellDefinition } from "../../world/spells/SpellCatalog";
import { DefaultPacketBuilder } from "../systems/PacketBuilder";
import { EntityType } from "../../protocol/enums/EntityType";
import type { NPCState } from "../state/EntityState";
import { updateNpcBoostedStats } from "../state/EntityState";
import type { EventBus } from "../events/EventBus";
import { 
  createEntityHitpointsChangedEvent,
  createPlayerSkillLevelIncreasedEvent,
  createPlayerCombatLevelIncreasedEvent,
  type Position
} from "../events/GameEvents";

/**
 * Combat style enum matching the client protocol.
 */
export enum CombatStyle {
  None = 0,
  Accurate = 1,    // Accuracy only
  Aggressive = 2,  // Strength only
  Controlled = 3,  // Accuracy + Strength
  Defensive = 4,   // Defense only
  AccurateDefensive = 5, // Accuracy + Defense
  AggressiveDefensive = 6, // Strength + Defense
  Shared = 7       // Accuracy + Strength + Defense
}

/**
 * Set of skill slugs that are considered combat skills.
 * These skills should use IncreaseCombatExp packets instead of GainedExp.
 */
const COMBAT_SKILLS: Set<SkillSlug> = new Set([
  SKILLS.hitpoints,
  SKILLS.accuracy,
  SKILLS.defense,
  SKILLS.strength,
  SKILLS.range,
  SKILLS.magic
]);

/**
 * Skills where the client derives XP from ObtainedResource.
 * Suppress GainedExp to avoid double XP display.
 */
const RESOURCE_XP_SKILLS: Set<SkillSlug> = new Set([
  SKILLS.forestry,
  SKILLS.fishing,
  SKILLS.mining,
  SKILLS.harvesting
]);

/**
 * Skills where the client derives XP from CreatedItem.
 * Suppress GainedExp to avoid double XP display.
 */
const CREATED_ITEM_XP_SKILLS: Set<SkillSlug> = new Set([
  SKILLS.crafting,
  SKILLS.smithing,
  SKILLS.potionmaking,
  SKILLS.enchanting
]);

export interface ExperienceServiceConfig {
  /** Enqueue a message to a specific user */
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  /** Event bus for broadcasting to nearby players via visibility system */
  eventBus: EventBus;
  /** Get player position for event broadcasting */
  getPlayerPosition: (userId: number) => Position | null;
}

export class ExperienceService {
  constructor(private readonly config: ExperienceServiceConfig) {}

  /**
   * Calculates combat experience for a given damage amount and combat style.
   * Matches client-side formula exactly.
   */
  static getCombatExperienceForDamage(damageAmount: number, combatStyle: CombatStyle): number {
    if (damageAmount === 0) return 0;

    switch (combatStyle) {
      case CombatStyle.None:
      default:
        return 0;
      case CombatStyle.Accurate:
      case CombatStyle.Aggressive:
      case CombatStyle.Defensive:
        return 4 * damageAmount;
      case CombatStyle.Controlled:
      case CombatStyle.AccurateDefensive:
      case CombatStyle.AggressiveDefensive:
        return 2 * damageAmount;
      case CombatStyle.Shared:
        return Math.round(damageAmount * (4 / 3));
    }
  }

  /**
   * Calculates hitpoints experience for a given damage amount.
   * Hitpoints always gets (4/3) * damage.
   */
  static getHitpointsExperienceForDamage(damageAmount: number): number {
    if (damageAmount === 0) return 0;
    return Math.floor(damageAmount * (4 / 3));
  }

  /**
   * Awards combat experience to a player based on damage dealt and combat style.
   * Sends ONE IncreaseCombatExp packet to the client (client handles XP distribution).
   * Server also distributes XP to skills for server-side tracking and level up detection.
   * 
   * @param attacker The player who dealt damage
   * @param damage Amount of damage dealt
   * @param combatStyle The combat style used
   */
  awardCombatExperience(attacker: PlayerState, damage: number, combatStyle: CombatStyle): void {
    if (damage <= 0) return;

    // Send ONE IncreaseCombatExp packet to client
    // Client will handle XP distribution to skills based on damage and combat style
    const increaseCombatExpPayload = buildIncreaseCombatExpPayload({
      Style: combatStyle,
      DamageAmount: damage
    });
    this.config.enqueueUserMessage(attacker.userId, GameAction.IncreaseCombatExp, increaseCombatExpPayload);

    // Calculate base combat XP (for server-side tracking)
    const combatXp = ExperienceService.getCombatExperienceForDamage(damage, combatStyle);
    
    // Calculate hitpoints XP (for server-side tracking)
    const hitpointsXp = ExperienceService.getHitpointsExperienceForDamage(damage);

    // Track old combat level for change detection
    const oldCombatLevel = attacker.combatLevel;

    // Distribute combat XP to appropriate skills on server (for level up detection)
    // These calls only update server state, no packets sent (client handles its own XP)
    switch (combatStyle) {
      case CombatStyle.Accurate:
        this.addCombatSkillXpServerSide(attacker, SKILLS.accuracy, combatXp);
        break;
      case CombatStyle.Aggressive:
        this.addCombatSkillXpServerSide(attacker, SKILLS.strength, combatXp);
        break;
      case CombatStyle.Controlled:
        this.addCombatSkillXpServerSide(attacker, SKILLS.accuracy, combatXp);
        this.addCombatSkillXpServerSide(attacker, SKILLS.strength, combatXp);
        break;
      case CombatStyle.Defensive:
        this.addCombatSkillXpServerSide(attacker, SKILLS.defense, combatXp);
        break;
      case CombatStyle.AccurateDefensive:
        this.addCombatSkillXpServerSide(attacker, SKILLS.accuracy, combatXp);
        this.addCombatSkillXpServerSide(attacker, SKILLS.defense, combatXp);
        break;
      case CombatStyle.AggressiveDefensive:
        this.addCombatSkillXpServerSide(attacker, SKILLS.strength, combatXp);
        this.addCombatSkillXpServerSide(attacker, SKILLS.defense, combatXp);
        break;
      case CombatStyle.Shared:
        this.addCombatSkillXpServerSide(attacker, SKILLS.accuracy, combatXp);
        this.addCombatSkillXpServerSide(attacker, SKILLS.strength, combatXp);
        this.addCombatSkillXpServerSide(attacker, SKILLS.defense, combatXp);
        break;
    }

    // Always award hitpoints XP
    this.addCombatSkillXpServerSide(attacker, SKILLS.hitpoints, hitpointsXp);

    // Check if combat level changed
    const newCombatLevel = DefaultPacketBuilder.calculateCombatLevel(attacker);
    if (newCombatLevel !== oldCombatLevel) {
      attacker.updateCombatLevel(newCombatLevel);
      
      // Broadcast combat level change via event bus
      const position = this.config.getPlayerPosition(attacker.userId);
      if (position) {
        this.config.eventBus.emit(createPlayerCombatLevelIncreasedEvent(
          attacker.userId,
          newCombatLevel,
          position
        ));
      }
    }
  }

  /**
   * PUBLIC: Adds XP to ANY skill (combat or non-combat) with proper packets and level ups.
   * This is the UNIFIED method that all systems should use for XP gains.
   * 
   * Behavior:
   * - Non-combat skills: Sends GainedExp packet
   * - Combat skills: Does NOT send GainedExp (client already handled IncreaseCombatExp)
   * - Both: Emit PlayerSkillLevelIncreased event if level up occurs
   * 
   * Usage examples:
   * - Woodcutting: experienceService.addSkillXp(player, SKILLS.forestry, 20)
   * - Mining: experienceService.addSkillXp(player, SKILLS.mining, 50)
   * - Fishing: experienceService.addSkillXp(player, SKILLS.fishing, 100)
   * 
   * @param player The player receiving XP
   * @param skillSlug The skill to add XP to
   * @param xp Amount of XP to add
   */
  public addSkillXp(
    player: PlayerState,
    skillSlug: SkillSlug,
    xp: number,
    options?: { forceGainedExp?: boolean }
  ): void {
    if (xp <= 0) return;

    const skillClientRef = skillToClientRef(skillSlug);
    if (skillClientRef === null) return; // Skip 'overall'

    const isCombatSkill = COMBAT_SKILLS.has(skillSlug);
    const forceGainedExp = options?.forceGainedExp === true;

    // Add XP using PlayerState method (which marks dirty and handles boosted level)
    const result = player.addSkillXp(skillSlug, xp);

    // Send GainedExp packet for NON-combat skills only (except client-derived XP skills)
    // Combat skills already received IncreaseCombatExp packet
    if (
      (!isCombatSkill || forceGainedExp) &&
      !RESOURCE_XP_SKILLS.has(skillSlug) &&
      !CREATED_ITEM_XP_SKILLS.has(skillSlug)
    ) {
      const gainedExpPayload = buildGainedExpPayload({
        Skill: skillClientRef,
        Amount: xp
      });
      this.config.enqueueUserMessage(player.userId, GameAction.GainedExp, gainedExpPayload);
    }

    // If level increased, broadcast PlayerSkillLevelIncreased via event bus
    if (result.leveledUp) {
      const position = this.config.getPlayerPosition(player.userId);
      if (position) {
        this.config.eventBus.emit(createPlayerSkillLevelIncreasedEvent(
          player.userId,
          skillClientRef,
          result.levelsGained,
          result.newState.level,
          position
        ));
      }
    }
  }

  /**
   * PRIVATE: Server-side XP tracking for combat skills.
   * Calls the unified addSkillXp() method.
   * 
   * @deprecated This is just a wrapper - prefer calling addSkillXp() directly
   */
  private addCombatSkillXpServerSide(
    player: PlayerState, 
    skillSlug: SkillSlug, 
    xp: number
  ): void {
    // Just delegate to the unified method
    this.addSkillXp(player, skillSlug, xp);
  }

  /**
   * Awards ranged XP for damage dealt.
   * Ranged attacks always grant 4 ranged XP per damage and 1 hitpoints XP per damage.
   */
  public awardRangedExperience(attacker: PlayerState, damage: number): void {
    if (damage <= 0) return;

    const oldCombatLevel = attacker.combatLevel;
    const rangeXp = 4 * damage;
    const hitpointsXp = damage;

    this.addSkillXp(attacker, SKILLS.range, rangeXp);
    this.addSkillXp(attacker, SKILLS.hitpoints, hitpointsXp);

    const newCombatLevel = DefaultPacketBuilder.calculateCombatLevel(attacker);
    if (newCombatLevel !== oldCombatLevel) {
      attacker.updateCombatLevel(newCombatLevel);
      const position = this.config.getPlayerPosition(attacker.userId);
      if (position) {
        this.config.eventBus.emit(createPlayerCombatLevelIncreasedEvent(
          attacker.userId,
          newCombatLevel,
          position
        ));
      }
    }
  }

  /**
   * Awards magic XP based on spell definition and damage dealt.
   * Magic XP: base spell exp + damage
   * Hitpoints XP: damage
   */
  public awardMagicExperience(
    attacker: PlayerState,
    spellDef: SpellDefinition | null,
    damage: number
  ): void {
    const baseExp = spellDef?.exp ?? 0;
    const magicXp = Math.max(0, baseExp + damage);
    const hitpointsXp = Math.max(0, damage);

    if (magicXp <= 0 && hitpointsXp <= 0) return;

    const oldCombatLevel = attacker.combatLevel;

    if (magicXp > 0) {
      this.addSkillXp(attacker, SKILLS.magic, magicXp);
    }
    if (hitpointsXp > 0) {
      this.addSkillXp(attacker, SKILLS.hitpoints, hitpointsXp);
    }

    const newCombatLevel = DefaultPacketBuilder.calculateCombatLevel(attacker);
    if (newCombatLevel !== oldCombatLevel) {
      attacker.updateCombatLevel(newCombatLevel);
      const position = this.config.getPlayerPosition(attacker.userId);
      if (position) {
        this.config.eventBus.emit(createPlayerCombatLevelIncreasedEvent(
          attacker.userId,
          newCombatLevel,
          position
        ));
      }
    }
  }


  /**
   * Applies damage to a target and sends hitpoints update packet.
   * 
   * @param target The entity taking damage
   * @param damage Amount of damage to apply
   */
  applyDamageToTarget(target: PlayerState | NPCState, damage: number): void {
    if (damage <= 0) return;

    if ('userId' in target) {
      // Target is a player
      this.applyDamageToPlayer(target, damage);
    } else {
      // Target is an NPC
      this.applyDamageToNPC(target, damage);
    }
  }

  /**
   * Applies damage to a player and broadcasts hitpoints change.
   * 
   * Note: Death detection is handled by the caller (CombatSystem) after damage is applied.
   * This ensures the killer information is properly tracked at the point of death.
   */
  private applyDamageToPlayer(player: PlayerState, damage: number): void {
    const hitpointsState = player.getSkillState(SKILLS.hitpoints);
    const newHitpoints = Math.max(0, hitpointsState.boostedLevel - damage);
    
    // Update boosted hitpoints level (current HP)
    player.setBoostedLevel(SKILLS.hitpoints, newHitpoints);

    // Send SkillCurrentLevelChanged packet to the player
    const hitpointsClientRef = skillToClientRef(SKILLS.hitpoints); // 0
    const skillCurrentLevelChangedPayload = buildSkillCurrentLevelChangedPayload({
      Skill: hitpointsClientRef,
      CurrentLevel: newHitpoints
    });
    this.config.enqueueUserMessage(player.userId, GameAction.SkillCurrentLevelChanged, skillCurrentLevelChangedPayload);

    // Broadcast hitpoints change via event bus
    const position = this.config.getPlayerPosition(player.userId);
    if (position) {
      this.config.eventBus.emit(createEntityHitpointsChangedEvent(
        { type: EntityType.Player, id: player.userId },
        newHitpoints,
        position
      ));
    }
  }

  /**
   * Applies damage to an NPC and broadcasts hitpoints change.
   * 
   * Note: Death detection is handled by the caller (CombatSystem) after damage is applied.
   * This keeps death handling logic centralized in one place.
   */
  private applyDamageToNPC(npc: NPCState, damage: number): void {
    const newHitpoints = Math.max(0, npc.hitpointsLevel - damage);
    npc.hitpointsLevel = newHitpoints;
    updateNpcBoostedStats(npc, "hitpoints");

    // Broadcast hitpoints change via event bus
    const position: Position = {
      mapLevel: npc.mapLevel,
      x: npc.x,
      y: npc.y
    };
    this.config.eventBus.emit(createEntityHitpointsChangedEvent(
      { type: EntityType.NPC, id: npc.id },
      newHitpoints,
      position
    ));
  }
}
