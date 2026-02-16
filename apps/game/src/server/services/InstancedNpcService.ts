import fs from "fs/promises";
import path from "path";
import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import type { PlayerState } from "../../world/PlayerState";
import type { EntityCatalog, EntityDefinition, EntityMovementArea } from "../../world/entities/EntityCatalog";
import type { NPCState, NPCCombatStat } from "../state/EntityState";
import type { SpatialIndexManager } from "../systems/SpatialIndexManager";
import type { EventBus } from "../events/EventBus";
import type { TargetingService } from "./TargetingService";
import type { MapLevel } from "../../world/Location";
import { QuestProgressService } from "./QuestProgressService";
import {
  createEntityForcedPublicMessageEvent,
  createNPCAddedEvent,
  createNPCRemovedEvent
} from "../events/GameEvents";

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

const INSTANCED_NPCS_FILENAME = process.env.INSTANCED_NPC_ENTITIES_FILE || "instancednpcentities.5.carbon";
const INSTANCED_NPCS_FILE = path.join(STATIC_ASSETS_DIR, INSTANCED_NPCS_FILENAME);

interface RawInstancedNpcDefinition {
  _id: number;
  desc?: string;
  maxIdleTicks?: number;
  spawnAtPlayerCurrentPosition?: boolean;
  spawnInChatMessages?: string[] | null;
  npcdef_id: number;
  movementAreaMinX: number;
  movementAreaMaxX: number;
  movementAreaMinY: number;
  movementAreaMaxY: number;
  mapLevel: number;
  x: number;
  y: number;
  shopdef_id?: number | null;
  conversationdef_id?: number | null;
  isAlwaysAggroOverride?: boolean;
  lootOverrideId?: number | null;
  linkedInstanceNPCDeadGroup?: number[] | null;
  playerEventActionsWhenKilled?: unknown[] | null;
}

interface LinkedInstanceNpcsDeadRequirement {
  type: "linkedinstancenpscdead";
  instancenpcids?: number[];
}

interface AdvanceQuestAction {
  type: "AdvanceQuest";
  questid?: number;
  checkpoint?: number;
  completed?: boolean;
  requirements?: unknown[] | null;
}

export interface InstancedNpcServiceConfig {
  entityCatalog: EntityCatalog;
  npcStates: Map<number, NPCState>;
  spatialIndex: SpatialIndexManager;
  eventBus: EventBus;
  targetingService: TargetingService;
  getPlayerState: (userId: number) => PlayerState | null;
  cancelMovementPlan: (entityRef: { type: EntityType; id: number }) => void;
  enqueueUserMessage?: (userId: number, action: number, payload: unknown[]) => void;
}

export type SpawnInstancedNpcResult =
  | { ok: true; npc: NPCState }
  | {
      ok: false;
      reason:
        | "unknown_config"
        | "owner_missing"
        | "missing_definition"
        | "already_has_active_instanced_npc";
    };

export type SpawnInstancedNpcGroupResult =
  | { ok: true; npcs: NPCState[] }
  | {
      ok: false;
      reason:
        | "unknown_config"
        | "owner_missing"
        | "missing_definition"
        | "already_has_active_instanced_npc";
    };

export class InstancedNpcService {
  private readonly definitions = new Map<number, RawInstancedNpcDefinition>();
  private readonly killedInstanceNpcConfigIdsByUserId = new Map<number, Set<number>>();
  private nextRuntimeNpcId = 1;
  private readonly questProgressService: QuestProgressService;

  constructor(private readonly config: InstancedNpcServiceConfig) {
    this.recomputeNextRuntimeNpcId();
    this.questProgressService = new QuestProgressService({
      enqueueUserMessage: config.enqueueUserMessage
        ? ((userId, action, payload) => config.enqueueUserMessage!(userId, action, payload))
        : undefined
    });
  }

  static async load(config: InstancedNpcServiceConfig): Promise<InstancedNpcService> {
    const service = new InstancedNpcService(config);
    await service.loadDefinitions();
    return service;
  }

  public spawnInstancedNpc(configId: number, ownerUserId: number): SpawnInstancedNpcResult {
    return this.spawnInstancedNpcInternal(configId, ownerUserId, false);
  }

  public spawnInstancedNpcGroup(configIds: number[], ownerUserId: number): SpawnInstancedNpcGroupResult {
    if (this.hasActiveInstancedNpcForOwner(ownerUserId)) {
      return { ok: false, reason: "already_has_active_instanced_npc" };
    }

    const owner = this.config.getPlayerState(ownerUserId);
    if (!owner) {
      return { ok: false, reason: "owner_missing" };
    }

    for (const configId of configIds) {
      const def = this.definitions.get(configId);
      if (!def) {
        console.warn(`[InstancedNpcService] Unknown instanced NPC id ${configId}`);
        return { ok: false, reason: "unknown_config" };
      }
      const baseDefinition = this.config.entityCatalog.getDefinitionById(def.npcdef_id);
      if (!baseDefinition) {
        console.warn(`[InstancedNpcService] Missing npcdef ${def.npcdef_id} for instanced id ${configId}`);
        return { ok: false, reason: "missing_definition" };
      }
    }

    const npcs: NPCState[] = [];
    for (const configId of configIds) {
      const result = this.spawnInstancedNpcInternal(configId, ownerUserId, true);
      if (!result.ok) {
        return result;
      }
      npcs.push(result.npc);
    }
    return { ok: true, npcs };
  }

  private spawnInstancedNpcInternal(
    configId: number,
    ownerUserId: number,
    skipOwnerActiveCheck: boolean
  ): SpawnInstancedNpcResult {
    const def = this.definitions.get(configId);
    if (!def) {
      console.warn(`[InstancedNpcService] Unknown instanced NPC id ${configId}`);
      return { ok: false, reason: "unknown_config" };
    }

    const owner = this.config.getPlayerState(ownerUserId);
    if (!owner) {
      return { ok: false, reason: "owner_missing" };
    }

    if (!skipOwnerActiveCheck && this.hasActiveInstancedNpcForOwner(ownerUserId)) {
      return { ok: false, reason: "already_has_active_instanced_npc" };
    }

    const baseDefinition = this.config.entityCatalog.getDefinitionById(def.npcdef_id);
    if (!baseDefinition) {
      console.warn(`[InstancedNpcService] Missing npcdef ${def.npcdef_id} for instanced id ${configId}`);
      return { ok: false, reason: "missing_definition" };
    }

    const runtimeDefinition = this.cloneDefinitionWithOverrides(baseDefinition, !!def.isAlwaysAggroOverride);
    const spawnPosition = this.resolveSpawnPosition(def, owner);
    const movementArea = this.resolveMovementArea(def, owner);
    const template = this.findTemplateNpcByDefinitionId(def.npcdef_id);
    const runtimeNpcId = this.allocateRuntimeNpcId();
    const aggroRadius = runtimeDefinition.combat?.aggroRadius ?? 0;

    const npc: NPCState = {
      id: runtimeNpcId,
      definitionId: runtimeDefinition.id,
      definition: runtimeDefinition,
      mapLevel: spawnPosition.mapLevel,
      x: spawnPosition.x,
      y: spawnPosition.y,
      respawnX: spawnPosition.x,
      respawnY: spawnPosition.y,
      movementArea,
      conversationId: def.conversationdef_id ?? template?.conversationId ?? null,
      shopId: def.shopdef_id ?? template?.shopId ?? null,
      hitpointsLevel: runtimeDefinition.combat?.hitpoints ?? 1,
      accuracyLevel: runtimeDefinition.combat?.accuracy ?? 1,
      strengthLevel: runtimeDefinition.combat?.strength ?? 1,
      defenseLevel: runtimeDefinition.combat?.defense ?? 1,
      magicLevel: runtimeDefinition.combat?.magic ?? 1,
      rangeLevel: runtimeDefinition.combat?.range ?? 1,
      boostedStats: new Set<NPCCombatStat>(),
      nextWanderAtMs: this.computeInitialNextWanderAtMs(runtimeDefinition),
      currentState: States.IdleState,
      aggroRadius,
      aggroTarget: null,
      aggroDroppedTargetId: null,
      combatDelay: 0,
      instanced: {
        configId,
        ownerUserId,
        maxIdleTicks: Math.max(1, Number(def.maxIdleTicks ?? 100)),
        idleTicks: 0,
        lootOverrideId: def.lootOverrideId ?? null,
        linkedInstanceNPCDeadGroup: def.linkedInstanceNPCDeadGroup ?? null,
        playerEventActionsWhenKilled: def.playerEventActionsWhenKilled ?? null
      }
    };

    this.config.npcStates.set(npc.id, npc);
    this.config.spatialIndex.addNPC({
      id: npc.id,
      definitionId: npc.definitionId,
      mapLevel: npc.mapLevel,
      x: npc.x,
      y: npc.y,
      hitpointsLevel: npc.hitpointsLevel,
      currentState: npc.currentState,
      aggroRadius: npc.aggroRadius
    });
    this.config.eventBus.emit(createNPCAddedEvent(
      npc.id,
      npc.definitionId,
      { mapLevel: npc.mapLevel, x: npc.x, y: npc.y },
      {
        npcId: npc.id,
        definitionId: npc.definitionId,
        hitpointsLevel: npc.hitpointsLevel,
        currentState: npc.currentState,
        aggroRadius: npc.aggroRadius
      }
    ));

    if (Array.isArray(def.spawnInChatMessages)) {
      for (const message of def.spawnInChatMessages) {
        if (typeof message !== "string" || message.trim().length === 0) {
          continue;
        }
        this.config.eventBus.emit(createEntityForcedPublicMessageEvent(
          { type: EntityType.NPC, id: npc.id },
          message,
          { mapLevel: npc.mapLevel, x: npc.x, y: npc.y }
        ));
      }
    }

    return { ok: true, npc };
  }

  public update(): void {
    for (const npc of this.config.npcStates.values()) {
      if (!npc.instanced) {
        continue;
      }

      npc.instanced.idleTicks += 1;
      if (npc.instanced.idleTicks >= npc.instanced.maxIdleTicks) {
        this.despawnInstancedNpc(npc.id);
      }
    }
  }

  public resetIdleTicksForCombat(npcId: number): void {
    const npc = this.config.npcStates.get(npcId);
    if (!npc?.instanced) {
      return;
    }
    npc.instanced.idleTicks = 0;
  }

  public handleInstancedNpcKilled(npc: NPCState): void {
    const instanced = npc.instanced;
    if (!instanced) {
      return;
    }

    const ownerUserId = instanced.ownerUserId;
    const owner = this.config.getPlayerState(ownerUserId);
    if (!owner) {
      return;
    }

    this.markInstancedNpcConfigKilled(ownerUserId, instanced.configId);
    this.executePlayerEventActionsWhenKilled(owner, instanced.playerEventActionsWhenKilled);
  }

  public handlePlayerLogout(userId: number): void {
    const npcsToDespawn: number[] = [];
    for (const npc of this.config.npcStates.values()) {
      if (npc.instanced?.ownerUserId === userId) {
        npcsToDespawn.push(npc.id);
      }
    }

    for (const npcId of npcsToDespawn) {
      this.despawnInstancedNpc(npcId);
    }

    // "single logged-in session" semantics: clear progress on logout
    this.killedInstanceNpcConfigIdsByUserId.delete(userId);
  }

  public despawnInstancedNpc(npcId: number): boolean {
    const npc = this.config.npcStates.get(npcId);
    if (!npc) {
      return false;
    }

    this.config.cancelMovementPlan({ type: EntityType.NPC, id: npcId });
    this.config.targetingService.clearTargetsOnEntity({ type: EntityType.NPC, id: npcId });
    this.config.npcStates.delete(npcId);
    this.config.spatialIndex.removeNPC(npcId);
    this.config.eventBus.emit(createNPCRemovedEvent(
      npcId,
      { mapLevel: npc.mapLevel, x: npc.x, y: npc.y },
      "despawned"
    ));
    return true;
  }

  public getActiveInstancedNpcConfigIdsForOwner(ownerUserId: number): number[] {
    const activeConfigIds: number[] = [];
    for (const npc of this.config.npcStates.values()) {
      if (npc.instanced?.ownerUserId === ownerUserId) {
        activeConfigIds.push(npc.instanced.configId);
      }
    }
    return activeConfigIds;
  }

  private async loadDefinitions(): Promise<void> {
    const fileContent = await fs.readFile(INSTANCED_NPCS_FILE, "utf8");
    const rows = JSON.parse(fileContent) as RawInstancedNpcDefinition[];
    this.definitions.clear();
    for (const row of rows) {
      this.definitions.set(row._id, row);
    }
    console.log(`[InstancedNpcService] Loaded ${this.definitions.size} instanced NPC definitions`);
  }

  private recomputeNextRuntimeNpcId(): void {
    let maxId = 0;
    for (const id of this.config.npcStates.keys()) {
      if (id > maxId) maxId = id;
    }
    this.nextRuntimeNpcId = maxId + 1;
  }

  private allocateRuntimeNpcId(): number {
    while (this.config.npcStates.has(this.nextRuntimeNpcId)) {
      this.nextRuntimeNpcId += 1;
    }
    const id = this.nextRuntimeNpcId;
    this.nextRuntimeNpcId += 1;
    return id;
  }

  private resolveSpawnPosition(def: RawInstancedNpcDefinition, owner: PlayerState): { mapLevel: MapLevel; x: number; y: number } {
    if (def.spawnAtPlayerCurrentPosition) {
      return {
        mapLevel: owner.mapLevel as MapLevel,
        x: owner.x,
        y: owner.y
      };
    }
    return {
      mapLevel: def.mapLevel as MapLevel,
      x: def.x,
      y: def.y
    };
  }

  private resolveMovementArea(def: RawInstancedNpcDefinition, owner: PlayerState): EntityMovementArea {
    if (def.spawnAtPlayerCurrentPosition) {
      return {
        minX: owner.x + def.movementAreaMinX,
        maxX: owner.x + def.movementAreaMaxX,
        minY: owner.y + def.movementAreaMinY,
        maxY: owner.y + def.movementAreaMaxY
      };
    }
    return {
      minX: def.movementAreaMinX,
      maxX: def.movementAreaMaxX,
      minY: def.movementAreaMinY,
      maxY: def.movementAreaMaxY
    };
  }

  private cloneDefinitionWithOverrides(base: EntityDefinition, isAlwaysAggroOverride: boolean): EntityDefinition {
    const cloned: EntityDefinition = {
      ...base,
      appearance: { ...base.appearance },
      combat: base.combat ? { ...base.combat } : undefined
    };
    if (isAlwaysAggroOverride && cloned.combat) {
      cloned.combat.isAlwaysAggro = true;
    }
    return cloned;
  }

  private findTemplateNpcByDefinitionId(definitionId: number): NPCState | null {
    for (const npc of this.config.npcStates.values()) {
      if (npc.definitionId === definitionId && npc.instanced === null) {
        return npc;
      }
    }
    return null;
  }

  private computeInitialNextWanderAtMs(definition: EntityDefinition): number {
    const eagerness = definition.moveEagerness ?? 0;
    const normalizedEagerness = !Number.isFinite(eagerness) ? 0 : Math.max(0, Math.min(1, eagerness));
    const minMs = 600;
    const maxMs = 15_000;
    const baseMs = maxMs + (minMs - maxMs) * normalizedEagerness;
    const jitter = 0.7 + Math.random() * 0.6;
    const idleDelayMs = Math.max(1, Math.round(baseMs * jitter));
    return normalizedEagerness > 0 ? Date.now() + idleDelayMs : Number.POSITIVE_INFINITY;
  }

  private hasActiveInstancedNpcForOwner(ownerUserId: number): boolean {
    for (const npc of this.config.npcStates.values()) {
      if (npc.instanced?.ownerUserId === ownerUserId) {
        return true;
      }
    }
    return false;
  }

  private markInstancedNpcConfigKilled(userId: number, configId: number): void {
    let killedSet = this.killedInstanceNpcConfigIdsByUserId.get(userId);
    if (!killedSet) {
      killedSet = new Set<number>();
      this.killedInstanceNpcConfigIdsByUserId.set(userId, killedSet);
    }
    killedSet.add(configId);
  }

  private executePlayerEventActionsWhenKilled(
    owner: PlayerState,
    actions: unknown[] | null
  ): void {
    if (!Array.isArray(actions) || actions.length === 0) {
      return;
    }

    for (const action of actions) {
      const typedAction = action as { type?: string };
      if (typedAction.type !== "AdvanceQuest") {
        continue;
      }

      const advanceQuest = action as AdvanceQuestAction;
      if (!this.checkActionRequirements(owner.userId, advanceQuest.requirements ?? null)) {
        continue;
      }

      const questId = Number(advanceQuest.questid);
      const checkpoint = Number(advanceQuest.checkpoint);
      if (!Number.isInteger(questId) || !Number.isInteger(checkpoint) || questId < 0 || checkpoint < 0) {
        continue;
      }

      this.questProgressService.applyQuestProgressToPlayer(owner, questId, checkpoint, {
        completed: advanceQuest.completed === true
      });
    }
  }

  private checkActionRequirements(userId: number, requirements: unknown[] | null): boolean {
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return true;
    }

    for (const requirement of requirements) {
      const typedRequirement = requirement as { type?: string };
      if (typedRequirement.type === "linkedinstancenpscdead") {
        if (!this.checkLinkedInstancedNpcsDeadRequirement(userId, requirement as LinkedInstanceNpcsDeadRequirement)) {
          return false;
        }
      } else {
        // Unknown requirement types are treated as unmet for safety.
        console.warn(`[InstancedNpcService] Unknown requirement type: ${typedRequirement.type}`);
        return false;
      }
    }

    return true;
  }

  private checkLinkedInstancedNpcsDeadRequirement(
    userId: number,
    requirement: LinkedInstanceNpcsDeadRequirement
  ): boolean {
    const ids = Array.isArray(requirement.instancenpcids) ? requirement.instancenpcids : [];
    if (ids.length === 0) {
      return true;
    }

    const killed = this.killedInstanceNpcConfigIdsByUserId.get(userId);
    if (!killed) {
      return false;
    }

    for (const id of ids) {
      if (!Number.isInteger(id) || !killed.has(id)) {
        return false;
      }
    }

    return true;
  }
}

