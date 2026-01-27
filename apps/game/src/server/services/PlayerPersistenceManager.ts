import { getPrisma, sendWorldHeartbeat, recomputeHiscores } from "../../db";
import { MAP_LEVELS, type MapLevel } from "../../world/Location";
import {
  PlayerState,
  createDefaultAppearance,
  createDefaultEquipment,
  createDefaultSkills,
  createEmptyInventory,
  getLevelForExp,
  isEquipmentSlot,
  isSkillSlug,
  parsePlayerAbilities,
  parsePlayerSettings,
  serializePlayerAbilities,
  serializePlayerSettings,
  type EquipmentSlot,
  type FullInventory
} from "../../world/PlayerState";
import { NormalizedPlayerStateWrites, type PlayerStateSnapshotDTO } from "../dtos";
import { States } from "../../protocol/enums/States";
import { calculateTotalWeight, calculateTotalEquippedWeight } from "../../world/systems/WeightCalculator";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import { BankingService } from "./BankingService";
import { DefaultPacketBuilder } from "../systems/PacketBuilder";
import { SKILL_SLUGS, type SkillSlug } from "../../world/PlayerState";
import { QuestProgressService, type QuestProgress } from "./QuestProgressService";

const AUTO_SAVE_INTERVAL_MS = 30_000;
const SAVE_DEBOUNCE_MS = 3_000;

export class PlayerPersistenceManager {
  private autosaveTimer: NodeJS.Timeout | null = null;
  private autosaveRunning = false;
  private readonly playerSaveInFlight = new Set<number>();
  private itemCatalog?: ItemCatalog;
  private bankingService?: BankingService; // BankingService reference for bank saves
  private skillIdCache: Map<string, number> | null = null; // Cache for skill slug -> ID mapping
  private questProgressService: QuestProgressService; // Quest progress service

  constructor(
    private readonly dbEnabled: boolean,
    private readonly playerStates: Map<number, PlayerState>,
    private readonly serverId: number = 1
  ) {
    this.questProgressService = new QuestProgressService();
  }

  /**
   * Sets the item catalog for weight calculations.
   * Should be called after the catalog is loaded.
   */
  setItemCatalog(catalog: ItemCatalog) {
    this.itemCatalog = catalog;
  }

  /**
   * Sets the banking service for bank saves during autosave.
   * Should be called after BankingService is initialized.
   */
  setBankingService(bankingService: BankingService) {
    this.bankingService = bankingService;
  }

  startAutosaveLoop() {
    if (!this.dbEnabled || this.autosaveTimer) return;
    this.autosaveTimer = setInterval(() => {
      void this.runAutosaveLoop();
    }, AUTO_SAVE_INTERVAL_MS);
  }

  stopAutosaveLoop() {
    if (!this.autosaveTimer) return;
    clearInterval(this.autosaveTimer);
    this.autosaveTimer = null;
  }

  private async runAutosaveLoop() {
    if (this.autosaveRunning) return;
    this.autosaveRunning = true;
    const nowMs = Date.now();
    try {
      for (const playerState of this.playerStates.values()) {
        try {
          await this.trySavePlayerState(playerState.userId, { nowMs });
        } catch (error) {
          console.error("[db] autosave failed:", (error as Error)?.message ?? error);
        }
      }
      
      // Clean up stale OnlineUser entries for this server
      try {
        await this.cleanupStaleOnlineUsers();
      } catch (error) {
        console.error("[db] OnlineUser cleanup failed:", (error as Error)?.message ?? error);
      }

      // Send heartbeat to API server to indicate this server is still alive
      try {
        await sendWorldHeartbeat(this.serverId);
      } catch (error) {
        // Heartbeat failures are non-fatal (API might be down)
        console.warn("[db] heartbeat failed:", (error as Error)?.message ?? error);
      }

      // Sync hiscores for players whose skills changed
      // This is expensive (updates ranks for all players), so only do it when needed
      try {
        await this.syncHiscoresForDirtyPlayers();
      } catch (error) {
        console.warn("[db] hiscores sync failed:", (error as Error)?.message ?? error);
      }
    } finally {
      this.autosaveRunning = false;
    }
  }

  /**
   * Removes OnlineUser entries for this server that are not in the playerStates map.
   * This ensures that only actively connected players are marked as online.
   */
  private async cleanupStaleOnlineUsers() {
    if (!this.dbEnabled) return;
    
    const prisma = getPrisma();
    const activeUserIds = Array.from(this.playerStates.keys());
    
    // Delete OnlineUser entries for this server that are NOT in the active player list
    await prisma.onlineUser.deleteMany({
      where: {
        serverId: this.serverId,
        userId: {
          notIn: activeUserIds.length > 0 ? activeUserIds : [-1] // Use [-1] if no active users to avoid empty array
        }
      }
    });
  }

  /**
   * Recomputes hiscores for players whose skills have changed.
   * Skills are already saved to DB by persistPlayerState(), so this only needs to:
   * 1. Recompute "overall" skill for each changed player
   * 2. Recalculate ranks for all skills
   * 
   * This is done in one API call with all changed user IDs.
   */
  private async syncHiscoresForDirtyPlayers() {
    if (!this.dbEnabled) return;
    
    const changedUserIds: number[] = [];
    
    // Collect user IDs whose skills changed
    for (const playerState of this.playerStates.values()) {
      if (playerState.skillsDirty) {
        changedUserIds.push(playerState.userId);
      }
    }
    
    if (changedUserIds.length === 0) return;
    
    console.log(`[hiscores] Recomputing overall and ranks for ${changedUserIds.length} player(s)...`);
    
    try {
      // One API call to recompute "overall" and recalculate ranks
      await recomputeHiscores(changedUserIds, this.serverId);
      
      // Mark all skills clean after successful sync
      for (const userId of changedUserIds) {
        const playerState = this.playerStates.get(userId);
        if (playerState) {
          playerState.markSkillsClean();
        }
      }
    } catch (error) {
      // Non-fatal: hiscores will be recomputed on next autosave cycle
      console.warn(`[hiscores] Failed to recompute:`, (error as Error)?.message ?? error);
    }
  }

  async trySavePlayerState(userId: number, options?: { force?: boolean; nowMs?: number }) {
    console.log(`[db] trySavePlayerState called for user ${userId}, force: ${options?.force}, dbEnabled: ${this.dbEnabled}`);
    
    if (!this.dbEnabled) {
      console.log(`[db] Skipping save for user ${userId} - database disabled`);
      return;
    }
    const playerState = this.playerStates.get(userId);
    if (!playerState) {
      console.log(`[db] Skipping save for user ${userId} - player state not found`);
      return;
    }

    const nowMs = options?.nowMs ?? Date.now();
    const forceSave = Boolean(options?.force);
    
    console.log(`[db] User ${userId} - dirty: ${playerState.dirty}, forceSave: ${forceSave}`);

    if (!forceSave && !playerState.dirty) {
      return;
    }

    if (!forceSave) {
      const sinceLastSave = nowMs - playerState.lastSaveAt;
      const sinceDirty = nowMs - playerState.lastDirtyAt;
      if (sinceLastSave < AUTO_SAVE_INTERVAL_MS || sinceDirty < SAVE_DEBOUNCE_MS) {
        return;
      }
    }

    // If a save is already in flight
    if (this.playerSaveInFlight.has(userId)) {
      // If this is a forced save, wait for the in-flight save to complete
      if (forceSave) {
        let retries = 0;
        while (this.playerSaveInFlight.has(userId) && retries < 100) {
          await new Promise(resolve => setTimeout(resolve, 10));
          retries++;
        }
        // If still in flight after 1 second, give up to avoid deadlock
        if (this.playerSaveInFlight.has(userId)) {
          console.warn(`[db] Force save for user ${userId} timed out waiting for in-flight save`);
          return;
        }
      } else {
        // Non-forced save, just skip
        return;
      }
    }
    
    this.playerSaveInFlight.add(userId);
    try {
      console.log(`[db] Calling persistPlayerState for user ${userId}...`);
      await this.persistPlayerState(playerState, nowMs);
      console.log(`[db] persistPlayerState returned successfully for user ${userId}`);
    } catch (error) {
      console.error(`[db] ✗✗✗ FATAL: persistPlayerState failed for user ${userId}:`, error);
      console.error(`[db] Error message:`, (error as Error)?.message);
      console.error(`[db] Error stack:`, (error as Error)?.stack);
      throw error; // Re-throw so caller knows it failed
    } finally {
      this.playerSaveInFlight.delete(userId);
    }
  }

  private async persistPlayerState(playerState: PlayerState, nowMs: number) {
    console.log(`[db] persistPlayerState starting for user ${playerState.userId}`);
    const persistenceId = this.requirePersistenceId(playerState.persistenceId, "persistPlayerState");
    const prisma = getPrisma();  
    const nextVersion = playerState.saveVersion + 1;
    const snapshot = this.buildPlayerSnapshot(playerState, nowMs, nextVersion);
    const { location, equipment, inventory } = this.buildNormalizedWrites(playerState);

    console.log(`[db] Built normalized writes for user ${playerState.userId}`);

    // Calculate session time since last save or connection
    const sessionTimeMs = nowMs - playerState.connectedAt;
    const newTimePlayed = playerState.timePlayed + sessionTimeMs;

    // Load skill ID mappings if not cached
    if (!this.skillIdCache) {
      console.log(`[db] Loading skill ID cache...`);
      await this.loadSkillIdCache();
    }

    console.log(`[db] Starting Prisma transaction for user ${playerState.userId}...`);
    try {
      await prisma.$transaction(async (tx) => {
        console.log(`[db] >> Inside transaction for user ${playerState.userId}`);
        
        try {
          // Update user's total time played
          console.log(`[db] >> Updating user timePlayed...`);
          await tx.user.update({
            where: { id: playerState.userId },
            data: { timePlayed: newTimePlayed }
          });
          console.log(`[db] >> User timePlayed updated`);
        } catch (err) {
          console.error(`[db] ERROR updating user timePlayed:`, err);
          throw err;
        }

        try {
          console.log(`[db] >> Upserting player location...`);
          await tx.playerLocation.upsert({
            where: {
              userId_persistenceId: {
                userId: playerState.userId,
                persistenceId
              }
            },
            create: { userId: playerState.userId, persistenceId, ...location },
            update: location
          });
          console.log(`[db] >> Player location upserted: x=${location.x}, y=${location.y}, mapLevel=${location.mapLevel}`);
        } catch (err) {
          console.error(`[db] ERROR upserting player location:`, err);
          throw err;
        }

      for (const row of equipment) {
        await tx.playerEquipment.upsert({
          where: {
            userId_persistenceId_slot: {
              userId: row.userId,
              persistenceId: row.persistenceId,
              slot: row.slot
            }
          },
          create: row,
          update: { itemDefId: row.itemDefId, amount: row.amount }
        });
      }

      await tx.playerInventory.deleteMany({
        where: { userId: playerState.userId, persistenceId }
      });
      if (inventory.length > 0) {
        await tx.playerInventory.createMany({ data: inventory });
      }

      await tx.playerAbility.upsert({
        where: {
          userId_persistenceId: {
            userId: playerState.userId,
            persistenceId
          }
        },
        update: {
          values: serializePlayerAbilities(playerState.abilities)
        },
        create: {
          userId: playerState.userId,
          persistenceId,
          values: serializePlayerAbilities(playerState.abilities)
        }
      });

      await tx.playerSetting.upsert({
        where: {
          userId_persistenceId: {
            userId: playerState.userId,
            persistenceId
          }
        },
        update: {
          data: serializePlayerSettings(playerState.settings)
        },
        create: {
          userId: playerState.userId,
          persistenceId,
          data: serializePlayerSettings(playerState.settings)
        }
      });

      // Save skills to PlayerSkill table (primary storage)
      for (const slug of SKILL_SLUGS) {
        if (slug === 'overall') continue; // Skip overall, it's calculated
        
        const skillId = this.skillIdCache?.get(slug);
        if (!skillId) {
          console.warn(`[db] No skillId found for slug: ${slug}`);
          continue;
        }

        const skillState = playerState.skills[slug];
        if (!skillState) continue;
        const normalizedBoostedLevel = Number.isFinite(skillState.boostedLevel)
          ? skillState.boostedLevel
          : skillState.level;

        await tx.playerSkill.upsert({
          where: {
            userId_persistenceId_skillId: {
              userId: playerState.userId,
              persistenceId,
              skillId: skillId
            }
          },
          update: {
            level: skillState.level,
            boostedLevel: normalizedBoostedLevel,
            experience: BigInt(Math.floor(skillState.xp))
          },
          create: {
            userId: playerState.userId,
            persistenceId,
            skillId: skillId,
            level: skillState.level,
            boostedLevel: normalizedBoostedLevel,
            experience: BigInt(Math.floor(skillState.xp))
          }
        });
      }

      // Save snapshot as backup (emergency recovery)
      await tx.playerStateSnapshot.upsert({
        where: {
          userId_persistenceId: {
            userId: playerState.userId,
            persistenceId
          }
        },
        update: {
          state: snapshot,
          version: nextVersion
        },
        create: {
          userId: playerState.userId,
          persistenceId,
          state: snapshot,
          version: nextVersion
        }
      });

      // Save quest progress if dirty
      if (playerState.questProgressDirty) {
        console.log(`[db] >> Saving quest progress for user ${playerState.userId}...`);
        
        // Get all quest progress entries
        const questProgressArray = this.questProgressService.serializeQuestProgress(playerState.questProgress);
        
        // Delete existing quest progress for this user
        await tx.playerQuest.deleteMany({
          where: { userId: playerState.userId, persistenceId }
        });
        
        // Insert new quest progress entries
        if (questProgressArray.length > 0) {
          await tx.playerQuest.createMany({
            data: questProgressArray.map(progress => ({
              userId: playerState.userId,
              persistenceId,
              questId: progress.questId,
              checkpoint: progress.checkpoint,
              completed: progress.completed
            }))
          });
        }
        
        console.log(`[db] >> Quest progress saved: ${questProgressArray.length} quests`);
      }

      // Save bank if it's loaded in memory (outside transaction for safety)
      // Bank is saved separately since it's a large JSONB blob
      
      console.log(`[db] >> Transaction operations complete, committing...`);
    });
    
    console.log(`[db] ✓ Transaction completed for user ${playerState.userId}`);
    
    } catch (transactionError) {
      console.error(`[db] ✗✗✗ CRITICAL: Transaction failed for user ${playerState.userId}:`, transactionError);
      console.error(`[db] Transaction error stack:`, (transactionError as Error)?.stack);
      throw transactionError; // Re-throw to propagate to caller
    }
    
    // Save bank after main transaction (if loaded and banking service available)
    if (playerState.bank && this.bankingService) {
      console.log(`[db] Saving bank for user ${playerState.userId}...`);
      try {
        await this.bankingService.saveBankToDatabase(playerState);
        console.log(`[db] ✓ Bank saved for user ${playerState.userId}`);
      } catch (error) {
        console.error(`[db] Failed to save bank for user ${playerState.userId}:`, (error as Error)?.message ?? error);
        // Non-fatal: player state was saved, bank can be retried
      }
    }
    
    // Update in-memory state and reset session timer
    playerState.timePlayed = newTimePlayed;
    playerState.connectedAt = nowMs;
    playerState.noteSaved(nowMs, nextVersion);
    
    // Mark quest progress as clean after successful save
    if (playerState.questProgressDirty) {
      playerState.markQuestProgressClean();
    }
    
    console.log(`[db] ✓✓ persistPlayerState fully complete for user ${playerState.userId}`);
  }

  /**
   * Preloads the skill ID cache at server startup.
   * This prevents slow first-save during shutdown.
   */
  async preloadSkillCache(): Promise<void> {
    await this.loadSkillIdCache();
  }

  /**
   * Loads the skill ID cache from the database.
   * This maps skill slugs to their database IDs for efficient upserts.
   */
  private async loadSkillIdCache() {
    if (!this.dbEnabled) {
      this.skillIdCache = new Map();
      return;
    }

    const prisma = getPrisma();
    const skills = await prisma.skill.findMany({
      select: { id: true, slug: true }
    });

    this.skillIdCache = new Map();
    for (const skill of skills) {
      this.skillIdCache.set(skill.slug, skill.id);
    }

    console.log(`[db] Loaded ${this.skillIdCache.size} skill ID mappings`);
  }

  private buildPlayerSnapshot(playerState: PlayerState, savedAt: number, version: number): PlayerStateSnapshotDTO {
    return {
      version,
      username: playerState.username,
      location: {
        mapLevel: playerState.mapLevel,
        x: playerState.x,
        y: playerState.y
      },
      skills: playerState.skills,
      equipment: playerState.equipment,
      inventory: playerState.inventory,
      appearance: playerState.appearance,
      abilities: playerState.abilities,
      settings: playerState.settings,
      metadata: {
        lastDirtyAt: playerState.lastDirtyAt,
        savedAt
      }
    };
  }

  private buildNormalizedWrites(playerState: PlayerState): NormalizedPlayerStateWrites {
    const location = {
      mapLevel: playerState.mapLevel,
      x: playerState.x,
      y: playerState.y
    };

    const equipment = Object.entries(playerState.equipment).map(([slot, value]) => {
      const tuple = value ?? null;
      return {
        userId: playerState.userId,
        persistenceId: playerState.persistenceId,
        slot: slot as EquipmentSlot,
        itemDefId: tuple ? tuple[0] : null,
        amount: tuple ? tuple[1] : null
      };
    });

    const inventoryRows: Array<{
      userId: number;
      persistenceId: number;
      slot: number;
      itemId: number;
      amount: number;
      isIOU: number;
    }> = [];

    playerState.inventory.forEach((slotValue, index) => {
      if (!slotValue) return;
      inventoryRows.push({
        userId: playerState.userId,
        persistenceId: playerState.persistenceId,
        slot: index,
        itemId: slotValue[0],
        amount: slotValue[1],
        isIOU: slotValue[2] ?? 0
      });
    });

    return { location, equipment, inventory: inventoryRows };
  }

  async loadPlayerState(userId: number, username = "", persistenceId?: number): Promise<PlayerState> {
    if (!this.dbEnabled) {
      throw new Error("Database is not enabled");
    }
    const persistenceKey = this.requirePersistenceId(persistenceId, "loadPlayerState");

    const prisma = getPrisma();

    // Load user's timePlayed and playerType
    const userRow = await prisma.user.findUnique({
      where: { id: userId },
      select: { timePlayed: true, playerType: true, displayName: true }
    });
    const timePlayed = userRow?.timePlayed ?? 0;
    const playerType = userRow?.playerType ?? 0;
    const displayName = userRow?.displayName ?? username;

    let mapLevel: MapLevel = MAP_LEVELS.Overworld;
    let x = 0;
    let y = 0;

    const locRow = await prisma.playerLocation.findUnique({
      where: {
        userId_persistenceId: {
          userId,
          persistenceId: persistenceKey
        }
      }
    });
    if (!locRow) {
      await prisma.playerLocation.create({
        data: { userId, persistenceId: persistenceKey, mapLevel: MAP_LEVELS.Overworld, x: 78, y: -93 }
      });
    } else {
      mapLevel = locRow.mapLevel as MapLevel;
      x = locRow.x;
      y = locRow.y;
    }

    const skills = createDefaultSkills();
    const skillRows = await prisma.playerSkill.findMany({
      where: { userId, persistenceId: persistenceKey },
      include: { skill: { select: { slug: true } } }
    });

    for (const r of skillRows) {
      const slug = r.skill?.slug;
      if (!isSkillSlug(slug)) continue;
      const xpBig = r.experience ?? BigInt(0);
      const xpNum = xpBig <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(xpBig) : Number.MAX_SAFE_INTEGER;
      const actualLevel = Number.isFinite(r.level) ? Math.max(1, r.level ?? 1) : getLevelForExp(xpNum);
      const boostedLevel = Number.isFinite(r.boostedLevel)
        ? Math.max(0, r.boostedLevel ?? actualLevel)
        : actualLevel; // Default to actual level if not set
      skills[slug] = { level: actualLevel, boostedLevel, xp: xpNum };
    }

    const equipment = createDefaultEquipment();
    const equipmentRows = await prisma.playerEquipment.findMany({
      where: { userId, persistenceId: persistenceKey }
    });

    for (const row of equipmentRows) {
      const slot = row.slot;
      if (!isEquipmentSlot(slot)) continue;
      if (row.itemDefId == null || row.amount == null) {
        equipment[slot] = null;
        continue;
      }
      equipment[slot] = [row.itemDefId, row.amount];
    }

    const inventory = await this.loadPlayerInventory(userId, persistenceKey);
    const appearance = createDefaultAppearance();
    const abilityRow = await prisma.playerAbility.findUnique({
      where: {
        userId_persistenceId: {
          userId,
          persistenceId: persistenceKey
        }
      }
    });
    const abilities = parsePlayerAbilities(abilityRow?.values);
    const settingsRow = await prisma.playerSetting.findUnique({
      where: {
        userId_persistenceId: {
          userId,
          persistenceId: persistenceKey
        }
      }
    });
    const settings = parsePlayerSettings(settingsRow?.data);

    // Load quest progress
    const questProgress = await this.loadPlayerQuestProgress(userId, persistenceKey);

    // Calculate initial weights from inventory and equipment
    const inventoryWeight = this.itemCatalog ? calculateTotalWeight(inventory, this.itemCatalog) : 0;
    const equippedWeight = this.itemCatalog ? calculateTotalEquippedWeight(equipment, this.itemCatalog) : 0;

    const playerState = new PlayerState(
      userId,
      persistenceKey,
      username,
      displayName,
      mapLevel,
      x,
      y,
      skills,
      equipment,
      inventory,
      appearance,
      abilities,
      settings,
      questProgress,
      States.IdleState,
      timePlayed,
      playerType,
      inventoryWeight,
      equippedWeight
    );
    
    // Initialize combat level based on combat skills
    playerState.updateCombatLevel(DefaultPacketBuilder.calculateCombatLevel(playerState));
    
    playerState.markClean();

    return playerState;
  }

  private async loadPlayerInventory(userId: number, persistenceId: number): Promise<FullInventory> {
    const prisma = getPrisma();
    const inventoryRows = await prisma.playerInventory.findMany({
      where: { userId, persistenceId },
      orderBy: { slot: "asc" }
    });

    const inventory = createEmptyInventory();

    for (const row of inventoryRows) {
      if (row.slot >= 0 && row.slot < 28) {
        inventory[row.slot] = [row.itemId, Number(row.amount), row.isIOU];
      }
    }

    return inventory;
  }

  /**
   * Loads player quest progress from the database.
   * 
   * @param userId The user ID
   * @returns Map of quest progress
   */
  private async loadPlayerQuestProgress(userId: number, persistenceId: number): Promise<Map<number, QuestProgress>> {
    const prisma = getPrisma();
    const questRows = await prisma.playerQuest.findMany({
      where: { userId, persistenceId }
    });

    const questProgressArray: QuestProgress[] = questRows.map((row: { questId: any; checkpoint: any; completed: any; }) => ({
      questId: row.questId,
      checkpoint: row.checkpoint,
      completed: row.completed
    }));

    return this.questProgressService.deserializeQuestProgress(questProgressArray);
  }

  private requirePersistenceId(persistenceId: number | null | undefined, context: string): number {
    if (persistenceId && Number.isInteger(persistenceId) && persistenceId > 0) {
      return persistenceId;
    }
    throw new Error(`[db] Missing persistenceId in ${context}`);
  }
}
