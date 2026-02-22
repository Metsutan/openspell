/**
 * PickpocketService.ts - Handles pickpocketing NPCs
 * 
 * Architecture:
 * - Loads and parses pickpocketdefs.5.carbon file containing pickpocket tables
 * - Uses DelaySystem for 2-tick non-blocking delay before attempt
 * - Validates requirements (crime level)
 * - Calculates success probability based on player's crime level
 * - Distributes loot on success via InventoryService
 * - Handles failure with stun mechanics and damage
 * 
 * Workflow:
 * 1. Player clicks pickpocket -> start 2-tick delay, send StartedSkilling
 * 2. Delay completes -> attempt pickpocket
 * 3. Success: Send GainedExp, add items, set idle
 * 4. Failure: Apply damage, send ForcePublicMessage, send EntityStunned, start blocking stun delay
 */

import fs from "fs/promises";
import path from "path";
import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { SkillClientReference } from "../../world/PlayerState";
import type { PlayerState } from "../../world/PlayerState";
import { SKILLS } from "../../world/PlayerState";
import type { InventoryService } from "./InventoryService";
import type { EntityCatalog } from "../../world/entities/EntityCatalog";
import type { MessageService } from "./MessageService";
import type { DamageService } from "./DamageService";
import type { ExperienceService } from "./ExperienceService";
import type { TargetingService } from "./TargetingService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { CombatSystem } from "../systems/CombatSystem";
import type { NPCState } from "../state/EntityState";
import type { PacketAuditService } from "./PacketAuditService";
import { buildEntityStunnedPayload } from "../../protocol/packets/actions/EntityStunned";
import { buildStartedTargetingPayload } from "../../protocol/packets/actions/StartedTargeting";
import { buildStoppedTargetingPayload } from "../../protocol/packets/actions/StoppedTargeting";
import { createEntityForcedPublicMessageEvent, createPlayerStartedSkillingEvent } from "../events/GameEvents";

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

const PICKPOCKET_DEFS_FILENAME = "pickpocketdefs.5.carbon";
const PICKPOCKET_DEFS_FILE = path.join(STATIC_ASSETS_DIR, PICKPOCKET_DEFS_FILENAME);

/** Number of ticks delay before pickpocket attempt */
const PICKPOCKET_DELAY_TICKS = 4;

/**
 * Requirement for pickpocketing.
 */
interface PickpocketRequirement {
  desc: string;
  type: string;
  skill: string;
  level: number;
  operator: string;
  checkCurrentLevel: boolean;
}

/**
 * Loot item that can be obtained from pickpocketing.
 */
interface PickpocketLootItem {
  itemId: number;
  name: string;
  isIOU: boolean;
  amount: number;
  odds: number;
}

/**
 * Base loot item (guaranteed on success).
 */
interface PickpocketBaseLootItem {
  itemId: number;
  name: string;
  isIOU: boolean;
  amount: number;
}

/**
 * Pickpocket definition for a specific NPC type.
 */
interface PickpocketDefinition {
  _id: number;
  desc: string;
  xp: number;
  requirements: PickpocketRequirement[];
  baseProbabilityOfSuccess: number;
  maxLvlProbabilityOfSuccess: number;
  stunTicks: number;
  stunDamage: number;
  stunMessage: string;
  rareLootProbability: number;
  rootLoot: any;
  baseLoot: PickpocketBaseLootItem[];
  loot: PickpocketLootItem[];
}

/**
 * Raw data structure from pickpocketdefs.5.carbon.
 */
interface RawPickpocketData {
  pickpocketing: PickpocketDefinition[];
}

export interface PickpocketServiceConfig {
  inventoryService: InventoryService;
  entityCatalog: EntityCatalog;
  messageService: MessageService;
  damageService: DamageService;
  experienceService: ExperienceService;
  targetingService: TargetingService;
  delaySystem: DelaySystem;
  combatSystem: CombatSystem;
  stateMachine: StateMachine;
  eventBus: EventBus;
  playerStatesByUserId: Map<number, PlayerState>;
  npcStates: Map<number, NPCState>;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  packetAudit?: PacketAuditService | null;
}

/**
 * Service for handling pickpocketing mechanics.
 */
export class PickpocketService {
  private pickpocketDefs: Map<number, PickpocketDefinition> = new Map();

  constructor(private readonly config: PickpocketServiceConfig) {}

  /**
   * Loads and parses the pickpocket definitions from file.
   */
  static async load(config: PickpocketServiceConfig): Promise<PickpocketService> {
    const service = new PickpocketService(config);
    await service.loadPickpocketDefs();
    return service;
  }

  /**
   * Loads pickpocket definitions from file.
   */
  private async loadPickpocketDefs(): Promise<void> {
    try {
      const data = await fs.readFile(PICKPOCKET_DEFS_FILE, "utf8");
      const rawData = JSON.parse(data) as RawPickpocketData;

      for (const def of rawData.pickpocketing) {
        this.pickpocketDefs.set(def._id, def);
      }

      console.log(`[PickpocketService] Loaded ${this.pickpocketDefs.size} pickpocket definitions`);
    } catch (error) {
      console.error("[PickpocketService] Failed to load pickpocket definitions:", error);
      throw error;
    }
  }

  /**
   * Initiates a pickpocket attempt on an NPC.
   * Starts a 2-tick non-blocking delay before the actual attempt.
   * 
   * @param playerState - The player attempting to pickpocket
   * @param npcState - The NPC being pickpocketed
   * @returns true if pickpocket was initiated, false otherwise
   */
  public initiatePickpocket(playerState: PlayerState, npcState: NPCState): boolean {
    // Get NPC definition to find pickpocket ID
    const npcDef = this.config.entityCatalog.getDefinitionById(npcState.definitionId);
    if (!npcDef || !npcDef.pickpocketId) {
      this.config.messageService.sendServerInfo(playerState.userId, "You can't pickpocket that.");
      return false;
    }

    const pickpocketDef = this.pickpocketDefs.get(npcDef.pickpocketId);
    if (!pickpocketDef) {
      this.config.packetAudit?.logInvalidPacket({
        userId: playerState.userId,
        packetName: "Pickpocket",
        reason: "definition_missing",
        details: { pickpocketId: npcDef.pickpocketId }
      });
      console.warn(`[PickpocketService] Pickpocket definition ${npcDef.pickpocketId} not found for NPC ${npcDef.name}`);
      this.config.messageService.sendServerInfo(playerState.userId, "You can't pickpocket that.");
      return false;
    }

    // Check requirements
    if (!this.checkRequirements(playerState, pickpocketDef)) {
      const reqLevel = pickpocketDef.requirements[0]?.level ?? 1;
      this.config.messageService.sendServerInfo(
        playerState.userId,
        `You need level ${reqLevel} Crime to pickpocket this NPC.`
      );
      return false;
    }

    // Clear target (player stops targeting during pickpocket)
    this.config.targetingService.clearPlayerTarget(playerState.userId);

    // Send Target → Untarget → StartedSkilling sequence in the same tick
    // This ensures the client shows the pickpocket animation correctly,
    // even if the player was already adjacent and didn't pathfind
    
    // 1. Send StartedTargeting packet
    const targetingPayload = buildStartedTargetingPayload({
      EntityID: playerState.userId,
      EntityType: EntityType.Player,
      TargetID: npcState.id,
      TargetType: EntityType.NPC
    });
    this.config.enqueueUserMessage(playerState.userId, GameAction.StartedTargeting, targetingPayload);

    // 2. Send StoppedTargeting packet
    const untargetingPayload = buildStoppedTargetingPayload({
      EntityID: playerState.userId,
      EntityType: EntityType.Player
    });
    this.config.enqueueUserMessage(playerState.userId, GameAction.StoppedTargeting, untargetingPayload);

    // 3. Send StartedSkilling packet
    // Note: Client expects skill reference 10 (Smithing slot) for pickpocket animation
    // This is a client-side quirk - the actual XP goes to Crime skill
    this.config.eventBus.emit(
      createPlayerStartedSkillingEvent(
        playerState.userId,
        npcState.id,
        SkillClientReference.Crime, // = 10
        EntityType.NPC,
        {
          mapLevel: playerState.mapLevel,
          x: playerState.x,
          y: playerState.y
        }
      )
    );

    // Start 2-tick non-blocking delay
    const delayStarted = this.config.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.NonBlocking,
      ticks: PICKPOCKET_DELAY_TICKS,
      state: States.PickpocketingState,
      onComplete: (userId) => this.executePickpocket(userId, npcState.id, pickpocketDef)
    });

    if (!delayStarted) {
      this.config.messageService.sendServerInfo(playerState.userId, "You're already busy.");
      return false;
    }

    return true;
  }

  /**
   * Executes the pickpocket attempt after the delay completes.
   * Called by DelaySystem after 2 ticks.
   */
  private executePickpocket(userId: number, npcId: number, pickpocketDef: PickpocketDefinition): void {
    const player = this.config.playerStatesByUserId.get(userId);
    const npc = this.config.npcStates.get(npcId);

    if (!player) {
      console.warn(`[PickpocketService] Player ${userId} not found for pickpocket execution`);
      return;
    }

    if (!npc) {
      this.config.messageService.sendServerInfo(userId, "They're no longer there.");
      this.config.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
      return;
    }

    // Calculate success probability based on player's crime level
    // Use effective level (includes potions + equipment bonuses)
    const crimeLevel = player.getEffectiveLevel(SKILLS.crime);
    const successChance = this.calculateSuccessChance(pickpocketDef, crimeLevel);

    // Roll for success
    const roll = Math.random();
    const succeeded = roll < successChance;

    if (succeeded) {
      this.handlePickpocketSuccess(player, npc, pickpocketDef);
    } else {
      this.handlePickpocketFailure(player, npc, pickpocketDef);
    }
  }

  /**
   * Checks if player meets the requirements to attempt pickpocketing.
   */
  private checkRequirements(
    playerState: PlayerState,
    pickpocketDef: PickpocketDefinition
  ): boolean {
    for (const requirement of pickpocketDef.requirements) {
      if (requirement.type === "skill") {
        const skillSlug = requirement.skill as any; // "crime"
        const playerLevel = requirement.checkCurrentLevel
          ? playerState.getSkillBoostedLevel(skillSlug)
          : playerState.getSkillLevel(skillSlug);

        switch (requirement.operator) {
          case ">=":
            if (playerLevel < requirement.level) return false;
            break;
          case ">":
            if (playerLevel <= requirement.level) return false;
            break;
          case "<=":
            if (playerLevel > requirement.level) return false;
            break;
          case "<":
            if (playerLevel >= requirement.level) return false;
            break;
          case "==":
            if (playerLevel !== requirement.level) return false;
            break;
          default:
            console.warn(`[PickpocketService] Unknown operator: ${requirement.operator}`);
            return false;
        }
      }
    }
    return true;
  }

  /**
   * Calculates success chance based on player's crime level.
   * Uses linear interpolation between base probability (at requirement level) 
   * and max probability (at level 100).
   */
  private calculateSuccessChance(
    pickpocketDef: PickpocketDefinition,
    crimeLevel: number
  ): number {
    const reqLevel = pickpocketDef.requirements[0]?.level ?? 1;
    const baseProb = pickpocketDef.baseProbabilityOfSuccess;
    const maxProb = pickpocketDef.maxLvlProbabilityOfSuccess;

    // Linear interpolation between requirement level and level 100
    if (crimeLevel <= reqLevel) {
      return baseProb;
    } else if (crimeLevel >= 100) {
      return maxProb;
    } else {
      // Interpolate: baseProb + (maxProb - baseProb) * (level - reqLevel) / (100 - reqLevel)
      const progress = (crimeLevel - reqLevel) / (100 - reqLevel);
      return baseProb + (maxProb - baseProb) * progress;
    }
  }

  /**
   * Handles successful pickpocket - awards XP and loot.
   */
  private handlePickpocketSuccess(
    player: PlayerState,
    npc: NPCState,
    pickpocketDef: PickpocketDefinition
  ): void {

    // Award base loot (guaranteed)
    let hadOverflow = false;
    
    for (const baseLootItem of pickpocketDef.baseLoot) {
      const result = this.config.inventoryService.giveItem(
        player.userId,
        baseLootItem.itemId,
        baseLootItem.amount,
        baseLootItem.isIOU ? 1 : 0
      );
      if (result.overflow > 0) {
        hadOverflow = true;
      }
    }

    // Roll for additional loot
    for (const lootItem of pickpocketDef.loot) {
      const roll = Math.random();
      if (roll < lootItem.odds) {
        const result = this.config.inventoryService.giveItem(
          player.userId,
          lootItem.itemId,
          lootItem.amount,
          lootItem.isIOU ? 1 : 0
        );
        if (result.overflow > 0) {
          hadOverflow = true;
        }
      }
    }

    // Notify player if any items were placed on the ground
    if (hadOverflow) {
      this.config.messageService.sendServerInfo(player.userId, "Some items were placed on the ground.");
    }

    // Award XP through ExperienceService so level-up events/messages are emitted consistently
    const xpAwarded = pickpocketDef.xp;
    this.config.experienceService.addSkillXp(player, SKILLS.crime, xpAwarded, {
      sendGainedExp: true
    });

    // Send EnteredIdleState (completes the pickpocket sequence)
    const idlePayload = this.buildEnteredIdleStatePayload(player.userId, EntityType.Player);
    this.config.enqueueUserMessage(player.userId, GameAction.EnteredIdleState, idlePayload);

    // Transition to idle state via StateMachine
    this.config.stateMachine.setState({ type: EntityType.Player, id: player.userId }, States.IdleState);
  }

  /**
   * Handles failed pickpocket - applies stun mechanics and damage.
   */
  private handlePickpocketFailure(
    player: PlayerState,
    npc: NPCState,
    pickpocketDef: PickpocketDefinition
  ): void {
    //console.log(`[PickpocketService] Player ${player.userId} failed to pickpocket NPC ${npc.id}`);

    const currentHp = player.getSkillBoostedLevel(SKILLS.hitpoints);
    const scaledStunDamage = this.getScaledPickpocketDamage(currentHp, pickpocketDef.stunDamage);

    // Apply damage (NPC attacks player)
    const npcRef = { type: EntityType.NPC, id: npc.id };
    const playerPosition = {
      mapLevel: player.mapLevel,
      x: player.x,
      y: player.y
    };

    this.config.damageService.applyDamage(
      npcRef,
      player,
      scaledStunDamage,
      playerPosition
    );

    // Check if player died from the damage
    const hpAfterDamage = player.getSkillBoostedLevel(SKILLS.hitpoints);
    if (hpAfterDamage <= 0) {
      // Player died from pickpocket stun damage - mark as dying
      this.config.combatSystem.markPlayerDying(player.userId, npcRef);
      // Skip stun mechanics - player is dead
      return;
    }

    // Make NPC say the stun message (broadcast to all nearby players)
    const npcPosition = {
      mapLevel: npc.mapLevel,
      x: npc.x,
      y: npc.y
    };

    this.config.eventBus.emit(createEntityForcedPublicMessageEvent(
      npcRef,
      pickpocketDef.stunMessage,
      npcPosition
    ));

    // Send EntityStunned packet to player
    const stunnedPayload = buildEntityStunnedPayload({
      EntityID: player.userId,
      EntityType: EntityType.Player,
      StunTicks: pickpocketDef.stunTicks
    });
    this.config.enqueueUserMessage(player.userId, GameAction.EntityStunned, stunnedPayload);

    // Start blocking stun delay
    this.config.delaySystem.startDelay({
      userId: player.userId,
      type: DelayType.Blocking,
      ticks: pickpocketDef.stunTicks,
      state: States.StunnedState,
      restoreState: States.IdleState,
      startMessage: "You are stunned."
    });
  }

  /**
   * Gets pickpocket definition info for debugging.
   */
  public getPickpocketDef(pickpocketId: number): PickpocketDefinition | undefined {
    return this.pickpocketDefs.get(pickpocketId);
  }

  /**
   * Gets the total number of loaded pickpocket definitions.
   */
  public getPickpocketDefCount(): number {
    return this.pickpocketDefs.size;
  }

  /**
   * Builds EnteredIdleState payload.
   * Helper to match exact packet format from client traces: [entityId, entityType]
   */
  private buildEnteredIdleStatePayload(entityId: number, entityType: EntityType): unknown[] {
    return [entityId, entityType];
  }

  /**
   * Scales pickpocket stun damage based on current hitpoints.
   * - Below 13 HP: always 1 damage
   * - Below 26 HP: capped at 2 damage
   * - Otherwise: use configured base damage
   */
  private getScaledPickpocketDamage(currentHp: number, baseDamage: number): number {
    if (currentHp < 13) {
      return 1;
    }
    if (currentHp < 26) {
      return Math.min(baseDamage, 2);
    }
    return baseDamage;
  }
}
