/**
 * Quest Progress Service
 * 
 * Manages player quest progress including checkpoints and completion status.
 * Integrates with PlayerPersistenceManager for saving/loading quest data.
 */
import fs from "fs";
import path from "path";
import { GameAction } from "../../protocol/enums/GameAction";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { buildQuestProgressedPayload } from "../../protocol/packets/actions/QuestProgressed";
import { isSkillSlug, type PlayerState, type SkillSlug } from "../../world/PlayerState";

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
const QUEST_DEFS_FILENAME = process.env.QUEST_DEFS_FILE || "questdefs.3.carbon";
const QUEST_DEFS_FILE = path.join(STATIC_ASSETS_DIR, QUEST_DEFS_FILENAME);

interface QuestRewardExp {
  skill: string;
  minAmount: number;
  maxAmount: number;
}

interface QuestRewardItem {
  itemId: number;
  amt: number;
  isIOU: boolean;
}

interface QuestDefinition {
  _id: number;
  name: string;
  reward: {
    exp: QuestRewardExp[] | null;
    items: QuestRewardItem[] | null;
    extra: string[] | null;
  };
  checkpoints: Array<{ _id: number; hint: string }>;
}

/**
 * Quest progress entry for a single quest
 */
export interface QuestProgress {
  questId: number;
  checkpoint: number;
  completed: boolean;
}

/**
 * Service for managing player quest progress
 */
type EnqueueUserMessageCallback = (userId: number, action: GameAction, payload: unknown[]) => void;

export interface QuestProgressServiceDependencies {
  enqueueUserMessage?: EnqueueUserMessageCallback;
  messageService?: {
    sendServerInfo: (userId: number, message: string, style?: MessageStyle) => void;
  };
  inventoryService?: {
    giveItem: (targetUserId: number, itemId: number, amount: number, isIOU?: number) => { added: number };
  };
  experienceService?: {
    addSkillXp: (player: PlayerState, skillSlug: SkillSlug, xp: number, options?: { sendGainedExp?: boolean }) => void;
  };
  itemCatalog?: {
    getDefinitionById: (id: number) => { name: string; isNamePlural: boolean } | undefined;
  };
}

export class QuestProgressService {
  private static questDefinitionsCache: Map<number, QuestDefinition> | null = null;
  private readonly questDefinitions: Map<number, QuestDefinition>;

  constructor(private readonly deps: QuestProgressServiceDependencies = {}) {
    this.questDefinitions = QuestProgressService.getQuestDefinitions();
  }

  private static getQuestDefinitions(): Map<number, QuestDefinition> {
    if (QuestProgressService.questDefinitionsCache) {
      return QuestProgressService.questDefinitionsCache;
    }

    try {
      const data = fs.readFileSync(QUEST_DEFS_FILE, "utf8");
      const parsed = JSON.parse(data) as QuestDefinition[];
      const byId = new Map<number, QuestDefinition>();
      for (const quest of parsed) {
        if (Number.isInteger(quest?._id)) {
          byId.set(quest._id, quest);
        }
      }
      QuestProgressService.questDefinitionsCache = byId;
      return byId;
    } catch (error) {
      console.warn("[QuestProgressService] Failed to load quest definitions:", (error as Error)?.message ?? error);
      QuestProgressService.questDefinitionsCache = new Map<number, QuestDefinition>();
      return QuestProgressService.questDefinitionsCache;
    }
  }

  /**
   * Gets the current checkpoint for a quest
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns The current checkpoint (0 if not started)
   */
  getQuestCheckpoint(questProgress: Map<number, QuestProgress>, questId: number): number {
    return questProgress.get(questId)?.checkpoint ?? 0;
  }

  /**
   * Gets the quest progress entry for a quest
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns The quest progress entry or null if not started
   */
  getQuestProgress(questProgress: Map<number, QuestProgress>, questId: number): QuestProgress | null {
    return questProgress.get(questId) ?? null;
  }

  /**
   * Checks if a player has started a quest
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns True if the quest has been started
   */
  hasStartedQuest(questProgress: Map<number, QuestProgress>, questId: number): boolean {
    const progress = questProgress.get(questId);
    return progress !== undefined && progress.checkpoint > 0;
  }

  /**
   * Checks if a quest is completed
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID to check
   * @returns True if the quest is marked as completed
   */
  isQuestCompleted(questProgress: Map<number, QuestProgress>, questId: number): boolean {
    return questProgress.get(questId)?.completed ?? false;
  }

  /**
   * Sets the checkpoint for a quest and marks the quest progress as dirty
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   * @param checkpoint The new checkpoint value
   * @param completed Whether the quest is completed (optional)
   * @returns The updated quest progress entry
   */
  setQuestCheckpoint(
    questProgress: Map<number, QuestProgress>,
    questId: number,
    checkpoint: number,
    completed?: boolean
  ): QuestProgress {
    const existing = questProgress.get(questId);
    const updatedProgress: QuestProgress = {
      questId,
      checkpoint,
      completed: completed ?? existing?.completed ?? false
    };
    
    questProgress.set(questId, updatedProgress);
    return updatedProgress;
  }

  /**
   * Advances a quest to the next checkpoint
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   * @param markCompleted Whether to mark the quest as completed when advancing
   * @returns The updated quest progress entry
   */
  advanceQuestCheckpoint(
    questProgress: Map<number, QuestProgress>,
    questId: number,
    markCompleted: boolean = false
  ): QuestProgress {
    const current = this.getQuestCheckpoint(questProgress, questId);
    return this.setQuestCheckpoint(questProgress, questId, current + 1, markCompleted);
  }

  /**
   * Marks a quest as completed
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   * @param finalCheckpoint The final checkpoint value (optional, keeps current if not provided)
   * @returns The updated quest progress entry
   */
  completeQuest(
    questProgress: Map<number, QuestProgress>,
    questId: number,
    finalCheckpoint?: number
  ): QuestProgress {
    const current = questProgress.get(questId);
    const checkpoint = finalCheckpoint ?? current?.checkpoint ?? 0;
    
    const updatedProgress: QuestProgress = {
      questId,
      checkpoint,
      completed: true
    };
    
    questProgress.set(questId, updatedProgress);
    return updatedProgress;
  }

  /**
   * Resets a quest to the beginning (checkpoint 0, not completed)
   * 
   * @param questProgress Map of quest progress
   * @param questId The quest ID
   */
  resetQuest(questProgress: Map<number, QuestProgress>, questId: number): void {
    questProgress.delete(questId);
  }

  /**
   * Gets all quest IDs that the player has started
   * 
   * @param questProgress Map of quest progress
   * @returns Array of quest IDs
   */
  getStartedQuestIds(questProgress: Map<number, QuestProgress>): number[] {
    return Array.from(questProgress.keys()).filter(questId => {
      const progress = questProgress.get(questId);
      return progress && progress.checkpoint > 0;
    });
  }

  /**
   * Gets all completed quest IDs
   * 
   * @param questProgress Map of quest progress
   * @returns Array of completed quest IDs
   */
  getCompletedQuestIds(questProgress: Map<number, QuestProgress>): number[] {
    return Array.from(questProgress.entries())
      .filter(([_, progress]) => progress.completed)
      .map(([questId, _]) => questId);
  }

  /**
   * Converts a Map of quest progress to an array for database storage
   * 
   * @param questProgress Map of quest progress
   * @returns Array of quest progress entries
   */
  serializeQuestProgress(questProgress: Map<number, QuestProgress>): QuestProgress[] {
    return Array.from(questProgress.values());
  }

  /**
   * Converts an array of quest progress from database to a Map
   * 
   * @param questProgressArray Array of quest progress entries
   * @returns Map of quest progress
   */
  deserializeQuestProgress(questProgressArray: QuestProgress[]): Map<number, QuestProgress> {
    const map = new Map<number, QuestProgress>();
    for (const progress of questProgressArray) {
      map.set(progress.questId, progress);
    }
    return map;
  }

  /**
   * Creates an empty quest progress map
   * 
   * @returns Empty Map
   */
  createEmptyQuestProgress(): Map<number, QuestProgress> {
    return new Map<number, QuestProgress>();
  }

  /**
   * Applies quest progress to a player state and notifies the client.
   * This centralizes quest updates so callers don't need to send QuestProgressed packets manually.
   */
  applyQuestProgressToPlayer(
    playerState: PlayerState,
    questId: number,
    checkpoint: number,
    options: { completed?: boolean; notifyClient?: boolean } = {}
  ): QuestProgress {
    const previous = playerState.getQuestProgress(questId);
    const previousCheckpoint = previous?.checkpoint ?? 0;
    const wasCompleted = previous?.completed ?? false;
    let completed = options.completed === true;

    const questDef = this.questDefinitions.get(questId);
    const finalCheckpoint = this.getFinalCheckpoint(questDef);
    if (!completed && finalCheckpoint !== null && checkpoint >= finalCheckpoint) {
      completed = true;
    }

    if (completed) {
      playerState.completeQuest(questId, checkpoint);
    } else {
      playerState.setQuestCheckpoint(questId, checkpoint);
    }

    const updated = playerState.getQuestProgress(questId);
    if (!updated) {
      throw new Error(`[QuestProgressService] Failed to apply quest progress for quest ${questId}`);
    }

    const changed =
      previous === null ||
      previous.checkpoint !== updated.checkpoint ||
      previous.completed !== updated.completed;

    const shouldNotifyClient = options.notifyClient ?? true;
    if (changed && shouldNotifyClient && this.deps.enqueueUserMessage) {
      const payload = buildQuestProgressedPayload({
        QuestID: questId,
        CurrentCheckpoint: updated.checkpoint
      });
      this.deps.enqueueUserMessage(playerState.userId, GameAction.QuestProgressed, payload);
    }

    // Started quest message: first time transitioning out of checkpoint 0.
    if (questDef && previousCheckpoint <= 0 && updated.checkpoint > 0) {
      this.deps.messageService?.sendServerInfo(
        playerState.userId,
        `You have started ${questDef.name}!`,
        MessageStyle.Lime
      );
    }

    // Completion message + rewards are granted once, at completion transition.
    if (questDef && !wasCompleted && updated.completed) {
      this.deps.messageService?.sendServerInfo(
        playerState.userId,
        `You completed ${questDef.name}!`,
        MessageStyle.Lime
      );
      this.applyQuestRewards(playerState, questDef);
    }

    return updated;
  }

  private getFinalCheckpoint(questDef: QuestDefinition | undefined): number | null {
    if (!questDef || !Array.isArray(questDef.checkpoints) || questDef.checkpoints.length === 0) {
      return null;
    }
    let maxCheckpoint = Number.NEGATIVE_INFINITY;
    for (const checkpoint of questDef.checkpoints) {
      if (Number.isInteger(checkpoint?._id) && checkpoint._id > maxCheckpoint) {
        maxCheckpoint = checkpoint._id;
      }
    }
    return Number.isFinite(maxCheckpoint) ? maxCheckpoint : null;
  }

  private applyQuestRewards(playerState: PlayerState, questDef: QuestDefinition): void {
    const userId = playerState.userId;

    // Item rewards
    const itemRewards = questDef.reward?.items ?? [];
    for (const reward of itemRewards) {
      const itemId = Number(reward?.itemId);
      const amount = Math.max(0, Math.floor(Number(reward?.amt)));
      const isIOU = reward?.isIOU === true ? 1 : 0;
      if (!Number.isInteger(itemId) || itemId <= 0 || amount <= 0) {
        continue;
      }

      const result = this.deps.inventoryService?.giveItem(userId, itemId, amount, isIOU);
      if (result && result.added > 0) {
        const itemDef = this.deps.itemCatalog?.getDefinitionById(itemId);
        const itemName = itemDef?.name ?? `Item #${itemId}`;
        const message = this.buildItemRewardMessage(itemName, itemDef?.isNamePlural === true, result.added);
        this.deps.messageService?.sendServerInfo(userId, message, MessageStyle.Magenta);
      }
    }

    // XP rewards
    const expRewards = questDef.reward?.exp ?? [];
    for (const reward of expRewards) {
      if (!isSkillSlug(reward?.skill)) {
        continue;
      }
      const minAmount = Math.max(0, Math.floor(Number(reward?.minAmount)));
      const maxAmount = Math.max(minAmount, Math.floor(Number(reward?.maxAmount)));
      const xpAmount = this.getRandomIntInclusive(minAmount, maxAmount);
      if (xpAmount <= 0) {
        continue;
      }

      this.deps.experienceService?.addSkillXp(playerState, reward.skill, xpAmount, { sendGainedExp: true });
      const skillName = reward.skill.charAt(0).toUpperCase() + reward.skill.slice(1);
      this.deps.messageService?.sendServerInfo(
        userId,
        `You received ${xpAmount} ${skillName} experience.`,
        MessageStyle.Magenta
      );
    }

    // Extra reward text lines
    const extraRewards = questDef.reward?.extra ?? [];
    for (const extra of extraRewards) {
      if (typeof extra === "string" && extra.trim().length > 0) {
        this.deps.messageService?.sendServerInfo(userId, extra.trim(), MessageStyle.Magenta);
      }
    }
  }

  private buildItemRewardMessage(itemName: string, isNamePlural: boolean, amount: number): string {
    if (amount <= 1) {
      return `You received a ${itemName}`;
    }
    if (isNamePlural) {
      return `You received some ${itemName}`;
    }
    return `You received ${amount} ${itemName}${amount === 1 ? "" : "s"}`;
  }

  private getRandomIntInclusive(min: number, max: number): number {
    if (max <= min) {
      return min;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
