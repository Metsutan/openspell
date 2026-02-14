import fs from "fs/promises";
import path from "path";
import { SKILLS, isSkillSlug, type PlayerState, type SkillSlug } from "../../world/PlayerState";
import { RequirementsChecker, type Requirement } from "./RequirementsChecker";
import type { ItemCatalog } from "../../world/items/ItemCatalog";

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

const WORLD_ENTITY_LOOT_DEFS_FILENAME = process.env.WORLD_ENTITY_LOOT_FILE || "worldentitylootdefs.12.carbon";
const WORLD_ENTITY_LOOT_DEFS_FILE = path.join(STATIC_ASSETS_DIR, WORLD_ENTITY_LOOT_DEFS_FILENAME);

export interface WorldEntityLootItem {
  itemId: number;
  name: string;
  amount: number;
  isIOU: boolean;
  odds: number;
}

export interface WorldEntityBaseLootItem {
  itemId: number;
  name: string;
  amount: number;
  isIOU: boolean;
}

export interface WorldEntityXpReward {
  skill: string;
  amount: number;
}

export interface WorldEntityLootTransferItem {
  id?: number;
  itemId?: number;
  isIOU?: boolean;
  isiou?: boolean;
  amt?: number;
  amount?: number;
}

export interface WorldEntityLootResultAction {
  desc?: string;
  type?: string;
  playerGiveItems?: WorldEntityLootTransferItem[];
}

export interface WorldEntityLootDefinition {
  _id: number;
  desc: string;
  xpRewards: WorldEntityXpReward[];
  requirements: Requirement[];
  baseProbabilityOfSuccess: number;
  maxLvlProbabilityOfSuccess: number;
  respawnTicks: number;
  oddsOfHavingLootOnRespawn: number;
  searchStartResult?: WorldEntityLootResultAction[];
  searchEndResult?: WorldEntityLootResultAction[];
  baseLoot: WorldEntityBaseLootItem[];
  loot: WorldEntityLootItem[];
  minRandomizedStackableFactor?: number;
  showLootReceivedNotification?: boolean;
  rolls?: number[];
}

interface CumulativeLootEntry {
  cumulativeProbability: number;
  item: WorldEntityLootItem;
}

interface CompiledWorldEntityLootDefinition extends WorldEntityLootDefinition {
  cumulativeLoot: CumulativeLootEntry[];
}

type SkillRequirementWithCurrentLevel = Requirement & {
  type: "skill";
  skill: string;
  level: number;
  operator?: string;
  checkCurrentLevel?: boolean;
};

export interface WorldEntityLootAttemptResult {
  passedRequirements: boolean;
  successChance: number;
  succeeded: boolean;
  hasLoot: boolean;
  respawnTicks: number;
  drops: Array<{ itemId: number; amount: number; isIOU: boolean }>;
  failureReason?: string;
  xpRewards: WorldEntityXpReward[];
}

export interface WorldEntityLootRequirementCheckResult {
  passed: boolean;
  failureReason?: string;
  unmetSkillRequirement?: {
    skill: string;
    level: number;
    operator: string;
  };
}

export class WorldEntityLootService {
  private readonly lootById = new Map<number, CompiledWorldEntityLootDefinition>();
  private readonly requirementsChecker = new RequirementsChecker();

  static async load(): Promise<WorldEntityLootService> {
    const service = new WorldEntityLootService();
    await service.loadLootDefinitions();
    return service;
  }

  private async loadLootDefinitions(): Promise<void> {
    const data = await fs.readFile(WORLD_ENTITY_LOOT_DEFS_FILE, "utf8");
    const defs = JSON.parse(data) as WorldEntityLootDefinition[];
    for (const def of defs) {
      this.lootById.set(def._id, {
        ...def,
        xpRewards: Array.isArray(def.xpRewards) ? def.xpRewards : [],
        requirements: Array.isArray(def.requirements) ? def.requirements : [],
        baseLoot: Array.isArray(def.baseLoot) ? def.baseLoot : [],
        loot: Array.isArray(def.loot) ? def.loot : [],
        cumulativeLoot: this.compileCumulativeDistribution(Array.isArray(def.loot) ? def.loot : [])
      });
    }
    console.log(`[WorldEntityLootService] Loaded ${this.lootById.size} world entity loot definitions`);
  }

  public getLootDefinition(lootId: number): WorldEntityLootDefinition | null {
    return this.lootById.get(lootId) ?? null;
  }

  public getStartResultMessages(lootId: number): string[] {
    const lootDef = this.lootById.get(lootId);
    if (!lootDef || !Array.isArray(lootDef.searchStartResult)) {
      return [];
    }
    return lootDef.searchStartResult
      .map((entry) => entry?.desc)
      .filter((desc): desc is string => typeof desc === "string" && desc.trim().length > 0);
  }

  public checkLootRequirements(
    playerState: PlayerState,
    lootId: number
  ): WorldEntityLootRequirementCheckResult {
    const lootDef = this.lootById.get(lootId);
    if (!lootDef) {
      return {
        passed: false,
        failureReason: `Loot definition ${lootId} not found`
      };
    }

    return this.checkRequirements(playerState, lootDef.requirements);
  }

  public attemptLoot(
    playerState: PlayerState,
    lootId: number,
    successSkill: SkillSlug = SKILLS.crime,
    itemCatalog: ItemCatalog | null = null
  ): WorldEntityLootAttemptResult {
    const lootDef = this.lootById.get(lootId);
    if (!lootDef) {
      return {
        passedRequirements: false,
        successChance: 0,
        succeeded: false,
        hasLoot: false,
        respawnTicks: 0,
        drops: [],
        failureReason: `Loot definition ${lootId} not found`,
        xpRewards: []
      };
    }

    const requirementResult = this.checkRequirements(playerState, lootDef.requirements);
    if (!requirementResult.passed) {
      return {
        passedRequirements: false,
        successChance: 0,
        succeeded: false,
        hasLoot: false,
        respawnTicks: lootDef.respawnTicks ?? 0,
        drops: [],
        failureReason: requirementResult.failureReason,
        xpRewards: []
      };
    }

    const effectiveLevel = playerState.getEffectiveLevel(successSkill);
    const successChance = this.calculateSuccessChance(
      lootDef.baseProbabilityOfSuccess,
      lootDef.maxLvlProbabilityOfSuccess,
      effectiveLevel
    );

    const succeeded = Math.random() < successChance;
    if (!succeeded) {
      return {
        passedRequirements: true,
        successChance,
        succeeded: false,
        hasLoot: false,
        respawnTicks: lootDef.respawnTicks ?? 0,
        drops: [],
        xpRewards: []
      };
    }

    const hasLoot = Math.random() < (lootDef.oddsOfHavingLootOnRespawn ?? 1);
    if (!hasLoot) {
      return {
        passedRequirements: true,
        successChance,
        succeeded: true,
        hasLoot: false,
        respawnTicks: lootDef.respawnTicks ?? 0,
        drops: [],
        xpRewards: lootDef.xpRewards
      };
    }

    const drops: Array<{ itemId: number; amount: number; isIOU: boolean }> = [];
    for (const baseLoot of lootDef.baseLoot) {
      const adjustedAmount = this.randomizeStackableAmount(
        baseLoot.itemId,
        baseLoot.amount,
        baseLoot.isIOU,
        lootDef.minRandomizedStackableFactor,
        itemCatalog
      );
      drops.push({
        itemId: baseLoot.itemId,
        amount: adjustedAmount,
        isIOU: baseLoot.isIOU
      });
    }

    const extraLootDrops = this.rollLootTable(lootDef, itemCatalog);
    drops.push(...extraLootDrops);

    return {
      passedRequirements: true,
      successChance,
      succeeded: true,
      hasLoot: drops.length > 0,
      respawnTicks: lootDef.respawnTicks ?? 0,
      drops,
      xpRewards: lootDef.xpRewards
    };
  }

  private rollLootTable(
    lootDef: CompiledWorldEntityLootDefinition,
    itemCatalog: ItemCatalog | null
  ): Array<{ itemId: number; amount: number; isIOU: boolean }> {
    const drops: Array<{ itemId: number; amount: number; isIOU: boolean }> = [];

    // There is always one guaranteed roll.
    const guaranteedRoll = this.rollOnCumulativeTable(lootDef.cumulativeLoot, Math.random());
    if (guaranteedRoll) {
      drops.push({
        itemId: guaranteedRoll.itemId,
        amount: this.randomizeStackableAmount(
          guaranteedRoll.itemId,
          guaranteedRoll.amount,
          guaranteedRoll.isIOU,
          lootDef.minRandomizedStackableFactor,
          itemCatalog
        ),
        isIOU: guaranteedRoll.isIOU
      });
    }

    // Additional roll chances from `rolls`.
    if (Array.isArray(lootDef.rolls)) {
      for (const rollChance of lootDef.rolls) {
        const chance = Number.isFinite(rollChance) ? rollChance : 0;
        if (Math.random() >= chance) {
          continue;
        }
        const rolled = this.rollOnCumulativeTable(lootDef.cumulativeLoot, Math.random());
        if (rolled) {
          drops.push({
            itemId: rolled.itemId,
            amount: this.randomizeStackableAmount(
              rolled.itemId,
              rolled.amount,
              rolled.isIOU,
              lootDef.minRandomizedStackableFactor,
              itemCatalog
            ),
            isIOU: rolled.isIOU
          });
        }
      }
    }

    return drops;
  }

  private randomizeStackableAmount(
    itemId: number,
    amount: number,
    isIOU: boolean,
    factor: number | undefined,
    itemCatalog: ItemCatalog | null
  ): number {
    if (!Number.isFinite(amount) || amount <= 0) {
      return 1;
    }

    const itemDef = itemCatalog?.getDefinitionById(itemId);
    const isStackable = isIOU || !!itemDef?.isStackable;
    if (!isStackable) {
      return amount;
    }

    const normalizedFactor = Number.isFinite(factor) ? Math.max(0, Math.min(1, factor as number)) : 0;
    if (normalizedFactor <= 0) {
      return amount;
    }

    const minMultiplier = 1 - normalizedFactor;
    const maxMultiplier = 1 + normalizedFactor;
    const multiplier = minMultiplier + Math.random() * (maxMultiplier - minMultiplier);
    const randomized = Math.round(amount * multiplier);
    return Math.max(1, randomized);
  }

  public applySearchEndResultPlayerGiveItems(
    lootId: number,
    removeItem: (itemId: number, amount: number, isIOU: number) => { removed: number; shortfall: number }
  ): void {
    const lootDef = this.lootById.get(lootId);
    if (!lootDef || !Array.isArray(lootDef.searchEndResult)) {
      return;
    }

    for (const action of lootDef.searchEndResult) {
      if (action?.type !== "PlayerGiveItems" || !Array.isArray(action.playerGiveItems)) {
        continue;
      }
      for (const item of action.playerGiveItems) {
        const itemId = typeof item.id === "number" ? item.id : item.itemId;
        const amount = typeof item.amt === "number" ? item.amt : item.amount;
        const isIOU = item.isIOU ?? item.isiou;
        if (!Number.isFinite(itemId) || !Number.isFinite(amount) || (amount as number) <= 0) {
          continue;
        }
        const normalizedAmount = amount as number;
        removeItem(itemId as number, normalizedAmount, isIOU ? 1 : 0);
      }
    }
  }

  private compileCumulativeDistribution(loot: WorldEntityLootItem[]): CumulativeLootEntry[] {
    const cumulative: CumulativeLootEntry[] = [];
    let sum = 0;

    for (const item of loot) {
      const odds = Number.isFinite(item.odds) ? item.odds : 0;
      sum += odds;
      cumulative.push({
        cumulativeProbability: sum,
        item
      });
    }

    return cumulative;
  }

  private rollOnCumulativeTable(cumulativeTable: CumulativeLootEntry[], roll: number): WorldEntityLootItem | null {
    if (cumulativeTable.length === 0) return null;

    let left = 0;
    let right = cumulativeTable.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const entry = cumulativeTable[mid];
      const prevCumulative = mid > 0 ? cumulativeTable[mid - 1].cumulativeProbability : 0;

      if (roll >= prevCumulative && roll < entry.cumulativeProbability) {
        return entry.item;
      }

      if (roll < prevCumulative) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return null;
  }

  private calculateSuccessChance(baseProbability: number, maxProbability: number, level: number): number {
    const clampedLevel = Math.max(1, Math.min(100, level));
    const progress = (clampedLevel - 1) / 99;
    return baseProbability + (maxProbability - baseProbability) * progress;
  }

  private checkRequirements(
    playerState: PlayerState,
    requirements: Requirement[]
  ): WorldEntityLootRequirementCheckResult {
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return { passed: true };
    }

    for (const requirement of requirements) {
      if (requirement.type === "skill") {
        const result = this.checkSkillRequirement(requirement as SkillRequirementWithCurrentLevel, playerState);
        if (!result.passed) {
          return result;
        }
        continue;
      }

      const result = this.requirementsChecker.checkRequirements([requirement], { playerState });
      if (!result.passed) {
        return result;
      }
    }

    return { passed: true };
  }

  private checkSkillRequirement(
    requirement: SkillRequirementWithCurrentLevel,
    playerState: PlayerState
  ): WorldEntityLootRequirementCheckResult {
    if (!isSkillSlug(requirement.skill)) {
      return { passed: false, failureReason: `Unknown skill: ${requirement.skill}` };
    }

    const operator = requirement.operator ?? ">=";
    const playerLevel = requirement.checkCurrentLevel
      ? playerState.getSkillBoostedLevel(requirement.skill)
      : playerState.getSkillLevel(requirement.skill);

    if (!this.compareNumbers(playerLevel, operator, requirement.level)) {
      return {
        passed: false,
        failureReason: requirement.desc || `${requirement.skill} requirement not met`,
        unmetSkillRequirement: {
          skill: requirement.skill,
          level: requirement.level,
          operator
        }
      };
    }

    return { passed: true };
  }

  private compareNumbers(actual: number, operator: string, expected: number): boolean {
    switch (operator) {
      case "===":
      case "==":
        return actual === expected;
      case ">=":
        return actual >= expected;
      case "<=":
        return actual <= expected;
      case ">":
        return actual > expected;
      case "<":
        return actual < expected;
      case "!=":
      case "!==":
        return actual !== expected;
      default:
        return false;
    }
  }
}
