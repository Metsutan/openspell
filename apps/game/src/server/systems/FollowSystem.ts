import { Action } from "../../protocol/enums/Actions";
import { EntityType } from "../../protocol/enums/EntityType";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { States } from "../../protocol/enums/States";
import { Point, greedyStepTowardAdjacent } from "../../world/pathfinding";
import { gridToWorld, worldToGrid } from "../../world/gridTransforms";
import type { PlayerState } from "../../world/PlayerState";
import type { TargetingService } from "../services/TargetingService";
import type { TradingService } from "../services/TradingService";
import type { PathfindingSystem } from "./PathfindingSystem";
import type { MovementSystem } from "./MovementSystem";
import type { EntityRef } from "../events/GameEvents";
import type { StateMachine } from "../StateMachine";
import type { MessageService } from "../services/MessageService";
import type { SpellCatalog } from "../../world/spells/SpellCatalog";
import { WildernessService } from "../services/WildernessService";
import { getPlayerAttackRange, getPlayerCombatMode, isWithinRange } from "../actions/utils/combatMode";

export type FollowSystemConfig = {
  playerStates: Map<number, PlayerState>;
  targetingService: TargetingService;
  getTradingService: () => TradingService;
  pathfindingSystem: PathfindingSystem;
  movementSystem: MovementSystem;
  stateMachine: StateMachine;
  getMessageService: () => MessageService;
  getSpellCatalog: () => SpellCatalog | null;
  hasLineOfSight: (fromX: number, fromY: number, toX: number, toY: number, mapLevel: number) => boolean;
  canMeleeReach: (fromX: number, fromY: number, toX: number, toY: number, mapLevel: number) => boolean;
};

/**
 * Player follow pass that runs after normal player movement each tick.
 * Followers use the same greedy step style as NPC pursuit and move in the same
 * tick as their leader.
 */
export class FollowSystem {
  constructor(private readonly config: FollowSystemConfig) {}

  /**
   * Runs before normal player movement.
   * Applies pursuit policy per action:
   * - Follow: always greedy (cancel A* immediately)
   * - TradeWith: preserve A* route (path around obstacles)
   * - Attack: preserve A* route first, then greedy fallback
   */
  prepareForTick(): void {
    for (const player of this.config.playerStates.values()) {
      const target = this.getPursuitTarget(player);
      if (!target) continue;

      const targetPlayer = this.config.playerStates.get(target.targetUserId);
      if (!targetPlayer || !this.canPursue(player, targetPlayer)) {
        this.stopPursuit(player.userId);
        continue;
      }

      const entityRef: EntityRef = { type: EntityType.Player, id: player.userId };
      if (!this.config.pathfindingSystem.hasMovementPlan(entityRef)) {
        continue;
      }

      if (target.action === Action.Follow) {
        // Follow should be "dumb chase" immediately.
        this.config.pathfindingSystem.deleteMovementPlan(entityRef);
        continue;
      }

      if (target.action === Action.TradeWith) {
        // Trade should keep initial A* route to avoid wall/fence hugging.
        continue;
      }

      if (target.action === Action.Attack) {
        // Attack should also keep initial A* route and only use greedy after A* completes.
        continue;
      }
    }
  }

  /**
   * Runs after normal player movement.
   * Schedules and executes one greedy pursuit pass for players actively
   * pursuing another player via Follow, TradeWith, or Attack.
   */
  update(): void {
    const playersToAdvance = new Set<number>();
    const attackPostMoveChecks = new Set<number>();

    for (const player of this.config.playerStates.values()) {
      const target = this.getPursuitTarget(player);
      if (!target) continue;

      const targetPlayer = this.config.playerStates.get(target.targetUserId);
      if (!targetPlayer || !this.canPursue(player, targetPlayer)) {
        this.stopPursuit(player.userId);
        continue;
      }

      const entityRef: EntityRef = { type: EntityType.Player, id: player.userId };
      const hasMovementPlan = this.config.pathfindingSystem.hasMovementPlan(entityRef);
      if (hasMovementPlan) {
        if (target.action === Action.TradeWith) {
          // Trade keeps following the initial A* plan until it completes.
          continue;
        }
        if (target.action === Action.Attack) {
          // Attack also keeps following the initial A* plan until it completes.
          continue;
        }
      }

      const isAdjacent = this.isAdjacentWithLOS(player, targetPlayer);
      if (target.action === Action.TradeWith && isAdjacent) {
        this.config.getTradingService().requestTrade(player.userId, targetPlayer.userId);
        player.pendingAction = null;
        continue;
      }

      if (target.action === Action.Attack) {
        if (!this.canPlayerAttack(player, targetPlayer)) {
          this.stopPursuit(player.userId);
          continue;
        }

        if (this.isInAttackRange(player, targetPlayer)) {
          this.startPlayerCombat(player, targetPlayer);
          continue;
        }
      }

      if (target.action === Action.Follow && isAdjacent) {
        // Stay glued to target - no movement while already adjacent.
        continue;
      }

      const speed = player.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
      const path = this.buildFollowPath(player, targetPlayer, speed);
      if (!path || path.length <= 1) {
        continue;
      }

      this.config.pathfindingSystem.scheduleMovementPlan(
        entityRef,
        player.mapLevel,
        path,
        speed,
        undefined,
        { preserveStateOnStart: true, preserveStateOnComplete: true }
      );
      playersToAdvance.add(player.userId);
      if (target.action === Action.Attack) {
        attackPostMoveChecks.add(player.userId);
      }
    }

    // Combat-state PvP chase also runs in this post-player-movement pass
    // so attackers can step immediately after runners move.
    for (const player of this.config.playerStates.values()) {
      if (player.pendingAction?.entityType === EntityType.Player) {
        // Pending-action pursuits (follow/trade/initial attack) are already handled above.
        continue;
      }
      if (!this.isPlayerInCombatState(player)) {
        continue;
      }

      const target = this.config.targetingService.getPlayerTarget(player.userId);
      if (!target || target.type !== EntityType.Player) {
        continue;
      }

      const targetPlayer = this.config.playerStates.get(target.id);
      if (!targetPlayer || !this.canPursue(player, targetPlayer)) {
        continue;
      }

      if (!this.canPlayerAttack(player, targetPlayer)) {
        continue;
      }

      // Already in range this tick, no movement needed.
      if (this.isInAttackRange(player, targetPlayer)) {
        continue;
      }

      const speed = player.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
      const path = this.buildFollowPath(player, targetPlayer, speed);
      if (!path || path.length <= 1) {
        continue;
      }

      const entityRef: EntityRef = { type: EntityType.Player, id: player.userId };
      this.config.pathfindingSystem.scheduleMovementPlan(
        entityRef,
        player.mapLevel,
        path,
        speed,
        undefined,
        { preserveStateOnStart: true, preserveStateOnComplete: true }
      );
      playersToAdvance.add(player.userId);
    }

    this.config.movementSystem.updatePlayersByIds(playersToAdvance);

    // Critical for same-tick chase combat:
    // after pursuit movement, check whether attackers are now in range and
    // switch them to combat state before CombatSystem.processPlayerCombat().
    for (const userId of attackPostMoveChecks) {
      const player = this.config.playerStates.get(userId);
      if (!player) continue;

      const target = this.getPursuitTarget(player);
      if (!target || target.action !== Action.Attack) continue;

      const targetPlayer = this.config.playerStates.get(target.targetUserId);
      if (!targetPlayer || !this.canPursue(player, targetPlayer)) {
        this.stopPursuit(userId);
        continue;
      }

      if (!this.canPlayerAttack(player, targetPlayer)) {
        this.stopPursuit(userId);
        continue;
      }

      if (this.isInAttackRange(player, targetPlayer)) {
        this.startPlayerCombat(player, targetPlayer);
      }
    }
  }

  private getPursuitTarget(
    player: PlayerState
  ): { targetUserId: number; action: Action.Follow | Action.TradeWith | Action.Attack } | null {
    const pending = player.pendingAction;
    if (
      !pending ||
      pending.entityType !== EntityType.Player ||
      (pending.action !== Action.Follow && pending.action !== Action.TradeWith && pending.action !== Action.Attack)
    ) {
      return null;
    }

    const target = this.config.targetingService.getPlayerTarget(player.userId);
    if (!target || target.type !== EntityType.Player || target.id !== pending.entityId) {
      return null;
    }

    return {
      targetUserId: pending.entityId,
      action: pending.action as Action.Follow | Action.TradeWith | Action.Attack
    };
  }

  private canPursue(player: PlayerState, target: PlayerState): boolean {
    if (player.userId === target.userId) return false;
    if (player.currentState === States.PlayerDeadState) return false;
    if (target.currentState === States.PlayerDeadState) return false;
    if (player.mapLevel !== target.mapLevel) return false;
    return true;
  }

  private buildFollowPath(follower: PlayerState, target: PlayerState, maxSteps: number): Point[] | null {
    const grid = this.config.pathfindingSystem.getPathingGridForLevel(follower.mapLevel);
    if (!grid) return null;

    const targetGrid = worldToGrid(target.x, target.y, grid);
    let currentGrid = worldToGrid(follower.x, follower.y, grid);
    const path: Point[] = [gridToWorld(currentGrid, grid)];

    for (let step = 0; step < maxSteps; step += 1) {
      const next = greedyStepTowardAdjacent(
        grid,
        currentGrid.x,
        currentGrid.y,
        targetGrid.x,
        targetGrid.y
      );
      if (!next) break;

      const [nx, ny] = next;
      currentGrid = new Point(nx, ny);
      path.push(gridToWorld(currentGrid, grid));
    }

    return path.length > 1 ? path : null;
  }

  private stopPursuit(userId: number): void {
    const player = this.config.playerStates.get(userId);
    if (
      player?.pendingAction &&
      player.pendingAction.entityType === EntityType.Player &&
      (
        player.pendingAction.action === Action.Follow ||
        player.pendingAction.action === Action.TradeWith ||
        player.pendingAction.action === Action.Attack
      )
    ) {
      player.pendingAction = null;
    }
    this.config.targetingService.clearPlayerTarget(userId);
    this.config.pathfindingSystem.deleteMovementPlan({ type: EntityType.Player, id: userId });
  }

  private chebyshevDistance(a: PlayerState, b: PlayerState): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.max(dx, dy);
  }

  private isAdjacentWithLOS(player: PlayerState, target: PlayerState): boolean {
    const dx = Math.abs(player.x - target.x);
    const dy = Math.abs(player.y - target.y);
    const isAdjacent = dx <= 1 && dy <= 1 && (dx + dy > 0);
    if (!isAdjacent) {
      return false;
    }
    return this.config.hasLineOfSight(player.x, player.y, target.x, target.y, player.mapLevel);
  }

  private canPlayerAttack(player: PlayerState, target: PlayerState): boolean {
    if (
      !WildernessService.isInWilderness(player.x, player.y, player.mapLevel) ||
      !WildernessService.isInWilderness(target.x, target.y, target.mapLevel)
    ) {
      this.config.getMessageService().sendServerInfo(player.userId, "You can only attack players in the wilderness.");
      return false;
    }

    const wildernessLevel = WildernessService.getWildernessLevel(
      player.x,
      player.y,
      player.mapLevel
    );
    if (!WildernessService.canAttackByCombatLevel(player.combatLevel, target.combatLevel, wildernessLevel)) {
      this.config.getMessageService().sendServerInfo(player.userId, "Their combat level is too different.");
      return false;
    }

    return true;
  }

  private isInAttackRange(player: PlayerState, target: PlayerState): boolean {
    const combatMode = getPlayerCombatMode(player);
    const attackRange = getPlayerAttackRange(player, this.config.getSpellCatalog());
    const hasLOS = this.config.hasLineOfSight(player.x, player.y, target.x, target.y, player.mapLevel);

    if (combatMode === "melee") {
      const dx = Math.abs(player.x - target.x);
      const dy = Math.abs(player.y - target.y);
      const isAdjacent = dx <= 1 && dy <= 1 && (dx + dy > 0);
      if (!isAdjacent) {
        return false;
      }
      return this.config.canMeleeReach(player.x, player.y, target.x, target.y, player.mapLevel);
    }

    return isWithinRange(player.x, player.y, target.x, target.y, attackRange) && hasLOS;
  }

  private startPlayerCombat(player: PlayerState, target: PlayerState): void {
    this.config.targetingService.setPlayerTarget(player.userId, { type: EntityType.Player, id: target.userId });
    const combatMode = getPlayerCombatMode(player);
    const nextState = combatMode === "magic"
      ? States.MagicCombatState
      : combatMode === "range"
        ? States.RangeCombatState
        : States.MeleeCombatState;
    this.config.stateMachine.setState({ type: EntityType.Player, id: player.userId }, nextState);
    player.pendingAction = null;
  }

  private isPlayerInCombatState(player: PlayerState): boolean {
    return (
      player.currentState === States.MeleeCombatState ||
      player.currentState === States.RangeCombatState ||
      player.currentState === States.MagicCombatState
    );
  }
}
