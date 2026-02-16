/**
 * PathfindingSystem.ts - Handles NPC pathfinding and movement planning.
 * 
 * Manages NPC pathfinding: finding paths for wandering, pursuit, and aggro behavior.
 * This system computes paths but does not execute movement (that's handled by MovementSystem).
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { AggroSystem } from "./AggroSystem";
import { StateMachine } from "../StateMachine";
import type { NPCState } from "../state/EntityState";
import type { EntityRef } from "../events/GameEvents";
import type { PlayerState } from "../../world/PlayerState";
import type { TargetingService } from "../services/TargetingService";
import { WildernessService } from "../services/WildernessService";
import type { EntityMovementArea } from "../../world/entities/EntityCatalog";
import type { MapLevel } from "../../world/Location";
import { Point, greedyStepToward, greedyStepTowardAdjacent } from "../../world/pathfinding";
import { gridToWorld, worldToGrid } from "../../world/gridTransforms";
import { isCardinallyAdjacent } from "../../world/SpatialIndex";
import type { PathingGrid } from "../../world/WorldModel";
import type { WorldModel } from "../../world/WorldModel";
import type { LineOfSightSystem } from "../../world/LineOfSight";
import { MAGIC_RANGE_DEFAULT, getPlayerAttackRange, isWithinRange } from "../actions/utils/combatMode";
import type { SpellCatalog } from "../../world/spells/SpellCatalog";

/**
 * Movement plan for an entity with optional completion callback
 */
export interface MovementPlan {
  entityRef: EntityRef;
  mapLevel: MapLevel;
  path: Point[];
  nextIndex: number;
  speed: number;
  onComplete?: () => void;
  preserveStateOnStart?: boolean;
  preserveStateOnComplete?: boolean;
}

export type PathfindingSystemConfig = {
  npcStates: Map<number, NPCState>;
  playerStates: Map<number, PlayerState>;
  movementPlans: Map<string, MovementPlan>;
  aggroSystem: AggroSystem;
  targetingService: TargetingService;
  stateMachine: StateMachine;
  worldModel: WorldModel | null;
  pathingGridCache: Map<MapLevel, PathingGrid>;
  pathingLayerByMapLevel: Record<MapLevel, string>;
  makeEntityKey: (entityRef: EntityRef) => string;
  losSystem: LineOfSightSystem | null;
  spellCatalog: SpellCatalog | null;
};

export class PathfindingSystem {
  constructor(private readonly config: PathfindingSystemConfig) {}

  private static readonly DEFAULT_NPC_RANGED_ATTACK_RANGE = 5;

  /**
   * Updates player movement planning (pathfinding).
   * Currently players use event-driven pathfinding (client-initiated),
   * so this method is a placeholder for future server-driven player pathfinding.
   * Should be called once per server tick before MovementSystem.updatePlayers().
   */
  updatePlayers(): void {
    for (const player of this.config.playerStates.values()) {
      if (player.currentState === States.PlayerDeadState) continue;

      const target = this.config.targetingService.getPlayerTarget(player.userId);
      if (!target || (target.type !== EntityType.Player && target.type !== EntityType.NPC)) continue;

      const isInCombatState = player.currentState === States.MeleeCombatState ||
                              player.currentState === States.RangeCombatState ||
                              player.currentState === States.MagicCombatState;
      if (!isInCombatState) continue;

      const targetPlayer = target.type === EntityType.Player ? this.config.playerStates.get(target.id) : null;
      const targetNpc = target.type === EntityType.NPC ? this.config.npcStates.get(target.id) : null;
      const targetEntity = targetPlayer ?? targetNpc;
      if (!targetEntity) {
        this.config.targetingService.clearPlayerTarget(player.userId);
        continue;
      }

      if (
        (targetPlayer && targetPlayer.currentState === States.PlayerDeadState) ||
        (targetNpc && targetNpc.currentState === States.NPCDeadState)
      ) {
        this.config.targetingService.clearPlayerTarget(player.userId);
        continue;
      }

      if (targetEntity.mapLevel !== player.mapLevel) {
        this.config.targetingService.clearPlayerTarget(player.userId);
        continue;
      }

      if (targetPlayer && !this.canPlayerPursue(player, targetPlayer)) {
        this.config.targetingService.clearPlayerTarget(player.userId);
        this.config.stateMachine.setState({ type: EntityType.Player, id: player.userId }, States.IdleState);
        continue;
      }

      const entityRef: EntityRef = { type: EntityType.Player, id: player.userId };
      const entityKey = this.config.makeEntityKey(entityRef);

      const attackRange = getPlayerAttackRange(player, this.config.spellCatalog);
      const withinRange = isWithinRange(player.x, player.y, targetEntity.x, targetEntity.y, attackRange);

      if (withinRange) {
        const hasLOS = this.checkLineOfSight(player.x, player.y, targetEntity.x, targetEntity.y, player.mapLevel);
        if (hasLOS) {
          if (this.config.movementPlans.has(entityKey)) {
            this.deleteMovementPlan(entityRef);
          }
          continue;
        }
      }

      if (!this.config.movementPlans.has(entityKey)) {
        const maxSteps = player.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
        const path = this.findPlayerPursuitPath(player, targetEntity.x, targetEntity.y, maxSteps);
        if (path && path.length > 1) {
          const speed = player.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
          this.scheduleMovementPlan(entityRef, player.mapLevel, path, speed, undefined, {
            preserveStateOnStart: true,
            preserveStateOnComplete: true
          });
        }
      }
    }
  }

  /**
   * Updates NPC movement planning (pathfinding).
   * Determines NPC movement plans for wandering and pursuit.
   * Should be called once per server tick after MovementSystem.updatePlayers().
   */
  updateNPCs(): void {
    if (this.config.npcStates.size === 0) return;
    const nowMs = Date.now();

    for (const npc of this.config.npcStates.values()) {
      const entityRef: EntityRef = { type: EntityType.NPC, id: npc.id };
      const entityKey = this.config.makeEntityKey(entityRef);

      // Skip NPCs in conversation state - they should stand still
      if (npc.currentState === States.NPCConversationState) {
        continue;
      }

      // If NPC has an aggro target, handle pursuit/combat
      if (npc.aggroTarget) {
        this.handleNpcAggroPathfinding(npc, entityRef, entityKey);
        continue;
      }

      // Normal wandering behavior for non-aggro'd NPCs
      const eagerness = this.normalizeMoveEagerness(npc.definition.moveEagerness);
      if (eagerness === 0) continue;
      if (this.config.movementPlans.has(entityKey)) continue;
      if (nowMs < npc.nextWanderAtMs) continue;

      const destination = this.pickRandomPointWithinArea(npc.movementArea);
      const burstSteps = this.getRandomBurstSteps();
      const path = this.findGreedyPath(
        npc.x,
        npc.y,
        destination.x,
        destination.y,
        npc.mapLevel,
        burstSteps,
        npc.movementArea
      );
      const idleDelayMs = this.computeNextIdleDelayMs(eagerness);
      npc.nextWanderAtMs = nowMs + idleDelayMs;
      if (!path) continue;
      this.scheduleMovementPlan(entityRef, npc.mapLevel, path, 1);
    }
  }


  /**
   * Gets the pathing grid for a specific map level.
   * Caches grids for performance.
   * 
   * @param mapLevel The map level to get the grid for
   * @returns The pathing grid or undefined if not available
   */
  getPathingGridForLevel(mapLevel: MapLevel): PathingGrid | undefined {
    if (this.config.pathingGridCache.has(mapLevel)) {
      return this.config.pathingGridCache.get(mapLevel);
    }
    if (!this.config.worldModel) return undefined;
    const layerName = this.config.pathingLayerByMapLevel[mapLevel];
    if (!layerName) return undefined;
    const grid = this.config.worldModel.buildPathingGrid({
      layerName,
      mapLevel
    });
    if (grid) {
      this.config.pathingGridCache.set(mapLevel, grid);
    }
    return grid;
  }

  // ==================== Private Helper Methods ====================

  /**
   * Checks line of sight between two positions.
   * Returns true if there's clear LOS, or if LOS system is unavailable.
   */
  private checkLineOfSight(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    mapLevel: MapLevel
  ): boolean {
    if (!this.config.losSystem) {
      // No LOS system available - assume clear
      return true;
    }
    const result = this.config.losSystem.checkLOS(fromX, fromY, toX, toY, mapLevel);
    return result.hasLOS;
  }

  /**
   * Handles NPC behavior when aggro'd on a target.
   * 
   * This is called during the normal NPC movement update cycle, which runs
   * after players have moved. NPCs naturally see updated player positions
   * via the spatial index, so they react to player movement in the same tick.
   * 
   * This method handles:
   * - Initial state transitions when aggro is first acquired
   * - Combat state when in attack range with LOS
   * - Pursuit pathfinding toward the target
   * - Range-aware behavior (melee vs ranged NPCs)
   */
  private handleNpcAggroPathfinding(npc: NPCState, entityRef: EntityRef, entityKey: string): void {
    const targetPos = this.config.aggroSystem.getTargetPosition(npc.aggroTarget!);
    if (!targetPos) {
      // Target no longer exists
      this.config.aggroSystem.dropNpcAggro(npc.id);
      this.config.stateMachine.setState(entityRef, States.IdleState);
      return;
    }

    const targetRef = npc.aggroTarget!;
    const npcMagicSpellId = this.getNpcAutoCastSpellId(npc, targetRef);
    const isMagic = npcMagicSpellId !== null;
    const isRanged = !isMagic && this.isNpcRangedAttacker(npc);
    const attackRange = isMagic
      ? this.getNpcMagicAttackRange(npcMagicSpellId)
      : isRanged
        ? this.getNpcRangedAttackRange(npc)
        : 1;

    // Calculate Chebyshev distance (max of dx, dy)
    const dx = Math.abs(npc.x - targetPos.x);
    const dy = Math.abs(npc.y - targetPos.y);
    const distance = Math.max(dx, dy);

    // Check if within attack range
    const withinRange = (isMagic || isRanged)
      ? isWithinRange(npc.x, npc.y, targetPos.x, targetPos.y, attackRange)
      : isCardinallyAdjacent(npc.x, npc.y, targetPos.x, targetPos.y);

    if (withinRange) {
      // Within attack range - check line of sight
      const hasLOS = this.checkLineOfSight(npc.x, npc.y, targetPos.x, targetPos.y, npc.mapLevel);
      
      if (hasLOS) {
        // Within range AND has LOS - stop moving and enter/stay in combat state.
        // Important: always clear plan so caster NPCs don't keep stepping to melee.
        if (this.config.movementPlans.has(entityKey)) {
          this.config.movementPlans.delete(entityKey);
        }
        const desiredCombatState = (isMagic || isRanged) ? States.RangeCombatState : States.MeleeCombatState;
        if (npc.currentState !== desiredCombatState) {
          this.config.stateMachine.setState(entityRef, desiredCombatState);
        }
        return;
      }
      
      // Within range but NO LOS - continue pursuing to get LOS
      // Fall through to pathfinding below
    }

    // Not in attack range OR no LOS - ensure we're in pursuit state
    if (npc.currentState !== States.MovingTowardTargetState) {
      this.config.stateMachine.setState(entityRef, States.MovingTowardTargetState);
    }

    // Pathfind toward target if no movement plan exists
    // This naturally reacts to player movement since we run after players have moved
    if (!this.config.movementPlans.has(entityKey)) {
      const path = this.findPursuitPath(npc, targetPos.x, targetPos.y, attackRange);
      if (path && path.length > 1) {
        // Schedule movement plan (will be executed by MovementSystem)
        this.scheduleMovementPlan(entityRef, npc.mapLevel, path, 1);
      }
    }
  }

  /**
   * Finds a pursuit path using greedy stepper algorithms.
   * Creates a single-step path each time to allow reactive pursuit.
   * 
   * For ranged NPCs (range > 1):
   * - Uses greedyStepTowardAdjacent for RuneScape-like pursuit
   * - Stops pathing if in range and has LOS to attack
   * 
   * For melee NPCs (range = 1):
   * - Uses greedyStepTowardAdjacent to stop when cardinally adjacent
   * 
   * @param npc The NPC to find a path for
   * @param targetX The target X coordinate
   * @param targetY The target Y coordinate
   * @param attackRange The NPC's attack range (default 1)
   * @returns A path (array of points) or null if no valid path
   */
  private findPursuitPath(
    npc: NPCState,
    targetX: number,
    targetY: number,
    attackRange: number = 1
  ): Point[] | null {
    const grid = this.getPathingGridForLevel(npc.mapLevel);
    if (!grid) return null;

    // Convert world -> grid
    const npcGrid = worldToGrid(npc.x, npc.y, grid);
    const targetGrid = worldToGrid(targetX, targetY, grid);

    // Get area bounds in grid space
    const areaMin = worldToGrid(npc.movementArea.minX, npc.movementArea.minY, grid);
    const areaMax = worldToGrid(npc.movementArea.maxX, npc.movementArea.maxY, grid);
    const minGX = Math.min(areaMin.x, areaMax.x);
    const maxGX = Math.max(areaMin.x, areaMax.x);
    const minGY = Math.min(areaMin.y, areaMax.y);
    const maxGY = Math.max(areaMin.y, areaMax.y);

    const path: Point[] = [gridToWorld(npcGrid, grid)];

    let next: [number, number] | null;

    if (attackRange > 1) {
      const dx = Math.abs(npc.x - targetX);
      const dy = Math.abs(npc.y - targetY);
      const distance = Math.max(dx, dy);
      const withinRange = distance > 0 && distance <= attackRange;

      if (withinRange && this.checkLineOfSight(npc.x, npc.y, targetX, targetY, npc.mapLevel)) {
        return null;
      }
    }

    // RuneScape-like "dumb" pursuit for both melee and ranged
    next = greedyStepTowardAdjacent(grid, npcGrid.x, npcGrid.y, targetGrid.x, targetGrid.y);

    if (!next) return null;

    const [nx, ny] = next;

    // Enforce movement area bounds - NPC can't leave their area while pursuing
    if (nx < minGX || nx > maxGX || ny < minGY || ny > maxGY) {
      return null;
    }

    path.push(gridToWorld(new Point(nx, ny), grid));
    return path;
  }

  /**
   * Finds a greedy path for NPC wandering.
   * Uses greedy step-by-step pathfinding within movement area bounds.
   * 
   * @param npcX Starting X coordinate
   * @param npcY Starting Y coordinate
   * @param targetX Target X coordinate
   * @param targetY Target Y coordinate
   * @param mapLevel The map level
   * @param maxSteps Maximum number of steps in the path
   * @param area The movement area bounds
   * @returns A path (array of points) or null if no valid path
   */
  private findGreedyPath(
    npcX: number,
    npcY: number,
    targetX: number,
    targetY: number,
    mapLevel: MapLevel,
    maxSteps: number,
    area: EntityMovementArea
  ): Point[] | null {
    const grid = this.getPathingGridForLevel(mapLevel);
    if (!grid) return null;

    // Convert world->grid
    let p = worldToGrid(npcX, npcY, grid);
    const t = worldToGrid(targetX, targetY, grid);

    const areaMin = worldToGrid(area.minX, area.minY, grid);
    const areaMax = worldToGrid(area.maxX, area.maxY, grid);
    const minGX = Math.min(areaMin.x, areaMax.x);
    const maxGX = Math.max(areaMin.x, areaMax.x);
    const minGY = Math.min(areaMin.y, areaMax.y);
    const maxGY = Math.max(areaMin.y, areaMax.y);

    const path: Point[] = [gridToWorld(p, grid)];

    for (let i = 0; i < maxSteps; i++) {
      // If already at target, stop
      if (p.x === t.x && p.y === t.y) break;

      const next = greedyStepToward(grid, p.x, p.y, t.x, t.y);
      if (!next) break;

      const [nx, ny] = next;

      // Enforce movement area bounds (in grid space)
      if (nx < minGX || nx > maxGX || ny < minGY || ny > maxGY) break;

      p = new Point(nx, ny);
      path.push(gridToWorld(p, grid));
    }

    return path.length > 1 ? path : null;
  }

  /**
   * Picks a random point within a movement area.
   */
  private pickRandomPointWithinArea(area: EntityMovementArea): { x: number; y: number } {
    const minX = Math.min(area.minX, area.maxX);
    const maxX = Math.max(area.minX, area.maxX);
    const minY = Math.min(area.minY, area.maxY);
    const maxY = Math.max(area.minY, area.maxY);
    const width = Math.max(0, maxX - minX);
    const height = Math.max(0, maxY - minY);
    const x = minX + Math.floor(Math.random() * (width + 1));
    const y = minY + Math.floor(Math.random() * (height + 1));
    return { x, y };
  }

  /**
   * Normalizes move eagerness value to a valid range [0, 1].
   */
  private normalizeMoveEagerness(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(1, value));
  }

  /**
   * Computes the next idle delay in milliseconds based on eagerness.
   */
  private computeNextIdleDelayMs(eagerness: number): number {
    const minMs = 600;
    const maxMs = 15_000;
    const baseMs = maxMs + (minMs - maxMs) * eagerness;
    const jitter = 0.7 + Math.random() * 0.6;
    return Math.max(1, Math.round(baseMs * jitter));
  }

  /**
   * Gets a random number of burst steps for wandering movement.
   */
  private getRandomBurstSteps(): number {
    const minSteps = 4;
    const maxSteps = 10;
    const range = maxSteps - minSteps + 1;
    return minSteps + Math.floor(Math.random() * range);
  }

  /**
   * Schedules a movement plan for an entity.
   * Sets the entity to MovingState and stores the plan.
   */
  scheduleMovementPlan(
    entityRef: EntityRef,
    mapLevel: MapLevel,
    path: Point[],
    speed: number,
    onComplete?: () => void,
    options?: { preserveStateOnStart?: boolean; preserveStateOnComplete?: boolean }
  ): void {
    if (path.length <= 1) {
      this.cancelMovementPlan(entityRef);
      return;
    }
    if (!options?.preserveStateOnStart) {
      this.config.stateMachine.setState(entityRef, States.MovingState);
    }
    const key = this.config.makeEntityKey(entityRef);
    this.config.movementPlans.set(key, {
      entityRef,
      mapLevel,
      path,
      nextIndex: 1,
      speed,
      onComplete,
      preserveStateOnStart: options?.preserveStateOnStart,
      preserveStateOnComplete: options?.preserveStateOnComplete
    });
  }

  /**
   * Cancels a movement plan for an entity.
   * Removes the plan and sets the entity to IdleState.
   */
  cancelMovementPlan(entityRef: EntityRef): void {
    const key = this.config.makeEntityKey(entityRef);
    this.config.movementPlans.delete(key);
    this.config.stateMachine.setState(entityRef, States.IdleState);
  }

  /**
   * Deletes a movement plan without triggering state transition.
   * Used by StateMachine when it handles state transitions itself.
   */
  deleteMovementPlan(entityRef: EntityRef): void {
    const key = this.config.makeEntityKey(entityRef);
    this.config.movementPlans.delete(key);
  }

  /**
   * Checks if an entity has an active movement plan.
   */
  hasMovementPlan(entityRef: EntityRef): boolean {
    const key = this.config.makeEntityKey(entityRef);
    return this.config.movementPlans.has(key);
  }

  private findPlayerPursuitPath(
    player: PlayerState,
    targetX: number,
    targetY: number,
    maxSteps: number
  ): Point[] | null {
    const grid = this.getPathingGridForLevel(player.mapLevel);
    if (!grid) return null;

    const targetGrid = worldToGrid(targetX, targetY, grid);
    const path: Point[] = [];
    let current = worldToGrid(player.x, player.y, grid);
    path.push(gridToWorld(current, grid));

    for (let step = 0; step < maxSteps; step += 1) {
      const next = greedyStepTowardAdjacent(grid, current.x, current.y, targetGrid.x, targetGrid.y);
      if (!next) break;
      const [nx, ny] = next;
      current = new Point(nx, ny);
      path.push(gridToWorld(current, grid));
    }

    return path.length > 1 ? path : null;
  }

  private canPlayerPursue(player: PlayerState, target: PlayerState): boolean {
    if (!WildernessService.isInWilderness(player.x, player.y, player.mapLevel)) {
      return false;
    }

    if (!WildernessService.isInWilderness(target.x, target.y, target.mapLevel)) {
      return false;
    }

    const wildernessLevel = WildernessService.getWildernessLevel(player.x, player.y, player.mapLevel);
    return WildernessService.canAttackByCombatLevel(player.combatLevel, target.combatLevel, wildernessLevel);
  }

  private isNpcRangedAttacker(npc: NPCState): boolean {
    const combat = npc.definition.combat;
    if (!combat) {
      return false;
    }
    const hasExplicitRangedStats = (combat.range ?? 1) > 1 || (combat.rangeBonus ?? 1) > 1;
    const hasProjectile = npc.definition.appearance.projectile !== null && npc.definition.appearance.projectile !== undefined;
    return hasExplicitRangedStats || hasProjectile;
  }

  private getNpcRangedAttackRange(npc: NPCState): number {
    const configured = npc.definition.combat?.attackRange;
    if (typeof configured === "number" && Number.isFinite(configured)) {
      return Math.max(1, Math.floor(configured));
    }
    return PathfindingSystem.DEFAULT_NPC_RANGED_ATTACK_RANGE;
  }

  private getNpcAutoCastSpellId(npc: NPCState, targetRef: EntityRef): number | null {
    if (targetRef.type !== EntityType.Player) {
      return null;
    }
    const firstSpellId = npc.definition.combat?.autoCastSpellIds?.[0];
    if (typeof firstSpellId !== "number" || !Number.isInteger(firstSpellId) || firstSpellId <= 0) {
      return null;
    }
    const spellDef = this.config.spellCatalog?.getDefinitionById(firstSpellId);
    if (!spellDef || (spellDef.type !== "combat" && spellDef.type !== "status")) {
      return null;
    }
    return firstSpellId;
  }

  private getNpcMagicAttackRange(spellId: number): number {
    const configured = this.config.spellCatalog?.getDefinitionById(spellId)?.range;
    if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
      return Math.floor(configured);
    }
    return MAGIC_RANGE_DEFAULT;
  }
}
