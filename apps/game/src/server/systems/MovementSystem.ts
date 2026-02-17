/**
 * MovementSystem.ts - Handles entity movement execution.
 * 
 * Executes movement plans created by PathfindingSystem.
 * Separates movement execution from pathfinding logic.
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { IsSprintingValues, PlayerSetting } from "../../protocol/enums/PlayerSetting";
import type { EntityRef, Position } from "../events/GameEvents";
import { createPlayerMovedEvent, createNPCMovedEvent } from "../events/GameEvents";
import type { MapLevel } from "../../world/Location";
import { Point, astarPathfinding } from "../../world/pathfinding";
import type { PlayerState } from "../../world/PlayerState";
import { SKILLS, PlayerAbility } from "../../world/PlayerState";
import type { NPCState } from "../state/EntityState";
import type { SpatialIndexManager } from "./SpatialIndexManager";
import type { StateMachine } from "../StateMachine";
import type { EventBus } from "../events/EventBus";
import type { MovementPlan } from "./PathfindingSystem";
import { GameAction } from "../../protocol/enums/GameAction";
import { buildPlayerSettingChangedPayload } from "../../protocol/packets/actions/PlayerSettingChanged";
import type { WorldModel } from "../../world/WorldModel";
import { gridToWorld, worldToGrid } from "../../world/gridTransforms";
import type { LineOfSightSystem } from "../../world/LineOfSight";

export type MovementSystemConfig = {
  movementPlans: Map<string, MovementPlan>;
  playerStates: Map<number, PlayerState>;
  npcStates: Map<number, NPCState>;
  spatialIndex: SpatialIndexManager;
  stateMachine: StateMachine;
  eventBus: EventBus;
  makeEntityKey: (entityRef: EntityRef) => string;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  worldModel: WorldModel | null;
  pathingLayerByMapLevel: Record<MapLevel, string>;
  losSystem: LineOfSightSystem | null;
};

export class MovementSystem {
  constructor(private readonly config: MovementSystemConfig) {}

  /**
   * Updates player movement.
   * Executes movement plans for all players.
   * Should be called once per server tick after PathfindingSystem.updatePlayers().
   */
  updatePlayers(): void {
    if (this.config.movementPlans.size === 0) return;

    // Process only player movement plans
    for (const [entityKey, plan] of Array.from(this.config.movementPlans.entries())) {
      if (plan.entityRef.type !== EntityType.Player) continue;
      this.advanceMovementPlan(entityKey, plan);
    }
  }

  /**
   * Updates movement for a specific set of players only.
   * Useful for phased movement passes (e.g. follow pass after normal movement).
   */
  updatePlayersByIds(playerIds: ReadonlySet<number>): void {
    if (playerIds.size === 0 || this.config.movementPlans.size === 0) return;

    for (const [entityKey, plan] of Array.from(this.config.movementPlans.entries())) {
      if (plan.entityRef.type !== EntityType.Player) continue;
      if (!playerIds.has(plan.entityRef.id)) continue;
      this.advanceMovementPlan(entityKey, plan);
    }
  }

  /**
   * Updates NPC movement.
   * Executes movement plans for all NPCs.
   * Should be called once per server tick after PathfindingSystem.updateNPCs().
   */
  updateNPCs(): void {
    if (this.config.movementPlans.size === 0) return;

    // Process only NPC movement plans
    for (const [entityKey, plan] of Array.from(this.config.movementPlans.entries())) {
      if (plan.entityRef.type !== EntityType.NPC) continue;
      this.advanceMovementPlan(entityKey, plan);
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Advances a movement plan by one or more steps based on entity speed.
   */
  private advanceMovementPlan(entityKey: string, plan: MovementPlan): void {
    if (plan.nextIndex >= plan.path.length) {
      this.clearMovementPlan(entityKey, plan);
      return;
    }

    let playerState: PlayerState | undefined;
    // Update player speed dynamically (sprinting can change)
    if (plan.entityRef.type === EntityType.Player) {
      playerState = this.config.playerStates.get(plan.entityRef.id);
      if (!playerState) {
        this.config.movementPlans.delete(entityKey);
        return;
      }
      plan.speed = this.getPlayerMovementSpeed(playerState);
      
      // Check if tracking an NPC that has moved - trigger re-pathfind if necessary
      if (playerState.pendingAction?.entityType === EntityType.NPC) {
        this.checkAndUpdateNPCPath(playerState, plan, entityKey);
      }
    }

    // Advance by speed number of steps
    let lastPoint: Point | null = null;
    for (let steps = 0; steps < plan.speed && plan.nextIndex < plan.path.length; steps += 1) {
      lastPoint = plan.path[plan.nextIndex++];
    }

    if (!lastPoint) {
      this.clearMovementPlan(entityKey, plan);
      return;
    }

    const moved = this.applyMovementStep(plan, lastPoint);
    if (!moved) {
      this.clearMovementPlan(entityKey, plan);
      return;
    }
    if (playerState) {
      const isStaminaDepleted = this.reducePlayerStamina(playerState);
      if (isStaminaDepleted) {
        playerState.updateSetting(PlayerSetting.IsSprinting, IsSprintingValues.Off);
        this.config.enqueueUserMessage(
          playerState.userId,
          GameAction.PlayerSettingChanged,
          buildPlayerSettingChangedPayload({
            Setting: PlayerSetting.IsSprinting,
            Value: 0
          })
        );
      }
    }
    // Check if path is complete
    if (plan.nextIndex >= plan.path.length) {
      this.clearMovementPlan(entityKey, plan);
    }
  }

  /**
   * Applies a movement step to an entity.
   * Updates entity position, spatial index, and emits movement events.
   */
  private applyMovementStep(plan: MovementPlan, point: Point): boolean {
    const entityRef = plan.entityRef;

    if (entityRef.type === EntityType.Player) {
      const playerState = this.config.playerStates.get(entityRef.id);
      if (!playerState) return false;

      // Defensive guard: if the player changed map levels (teleport/door) while this plan
      // was queued, this plan is stale and must not continue stepping.
      if (playerState.mapLevel !== plan.mapLevel) {
        return false;
      }

      // Capture old position before updating
      const oldPosition = {
        mapLevel: playerState.mapLevel,
        x: playerState.x,
        y: playerState.y
      };

      // Update player position
      playerState.updateLocation(plan.mapLevel, point.x, point.y);

      // Update spatial index
      this.config.spatialIndex.addOrUpdatePlayer(playerState);

      // Emit PlayerMoved event
      const newPosition: Position = {
        mapLevel: playerState.mapLevel,
        x: playerState.x,
        y: playerState.y
      };
      this.config.eventBus.emit(createPlayerMovedEvent(
        playerState.userId,
        oldPosition,
        newPosition
      ));

      return true;
    }

    if (entityRef.type === EntityType.NPC) {
      const npc = this.config.npcStates.get(entityRef.id);
      if (!npc) return false;

      // Capture old position before updating
      const oldPosition = {
        mapLevel: npc.mapLevel,
        x: npc.x,
        y: npc.y
      };

      // Update NPC position
      npc.mapLevel = plan.mapLevel;
      npc.x = point.x;
      npc.y = point.y;

      // Update spatial index for NPC
      this.config.spatialIndex.updateNPCByState(npc);

      // Emit NPCMoved event
      const newPosition: Position = {
        mapLevel: npc.mapLevel,
        x: npc.x,
        y: npc.y
      };
      this.config.eventBus.emit(createNPCMovedEvent(
        npc.id,
        oldPosition,
        newPosition
      ));

      return true;
    }

    return false;
  }

  /**
   * Clears a movement plan and transitions entity to idle state.
   * Executes the onComplete callback if present.
   */
  private clearMovementPlan(entityKey: string, plan: MovementPlan): void {
    this.config.movementPlans.delete(entityKey);
    if (!plan.preserveStateOnComplete) {
      this.config.stateMachine.setState(plan.entityRef, States.IdleState);
    }
    
    // Execute completion callback if present
    if (plan.onComplete) {
      plan.onComplete();
    }
  }

  /**
   * Gets the movement speed for a player based on their settings.
   */
  private getPlayerMovementSpeed(playerState: PlayerState): number {
    return playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  }

  private reducePlayerStamina(playerState: PlayerState): boolean {
    const isSprinting = playerState.settings[PlayerSetting.IsSprinting] === 1 ? true : false;
    if(process.env.DISABLE_STAMINA === 'true' || !isSprinting) {
      return false;
    }

    // UnitsLost = ⌊ 60 + (clamp(weight, 0, 64) / 64) ⌋ × (1 - athletics / 300)
    const clampedWeight = Math.min(Math.max(playerState.getTotalWeight(), 0), 64);
    // Use effective level (includes potions + equipment bonuses)
    const athleticsLevel = playerState.getEffectiveLevel(SKILLS.athletics);
    const unitsLost = Math.floor(60 + (67 * clampedWeight / 64) * (1 - athleticsLevel / 300));
    
    // Update stamina ability
    const currentStamina = playerState.abilities[PlayerAbility.Stamina];
    const newStamina = playerState.updateAbility(PlayerAbility.Stamina, currentStamina - unitsLost);
    return newStamina <= 0 ? true : false;
  }

  /**
   * Checks if NPC being tracked has moved and attempts seamless re-pathfinding.
   * 
   * **Key behavior:**
   * - Only triggers if NPC has moved significantly AND current path endpoint is no longer valid
   * - Uses limited radius pathfinding (8-16 tiles) for efficiency
   * - If pathfinding succeeds: Seamlessly replaces path without stopping player
   * - If pathfinding fails: Player continues on original path (will retry later)
   * - Updates lastKnownX/Y only on successful re-pathfind
   * 
   * **Optimization:**
   * - Checks if current path still leads to valid adjacent tile
   * - Only re-paths if NPC moved AND current destination is no longer adjacent
   * 
   * This runs every tick during player movement, so must be computationally cheap.
   * 
   * @param playerState - The player tracking an NPC
   * @param plan - Current movement plan
   * @param entityKey - Entity key for the movement plan
   */
  private checkAndUpdateNPCPath(playerState: PlayerState, plan: MovementPlan, entityKey: string): void {
    const pendingAction = playerState.pendingAction;
    if (!pendingAction || pendingAction.entityType !== EntityType.NPC) return;

    const npcState = this.config.npcStates.get(pendingAction.entityId);
    if (!npcState) return;

    // Check if NPC has moved from last known position
    const lastX = (pendingAction as any).lastKnownX as number | undefined;
    const lastY = (pendingAction as any).lastKnownY as number | undefined;
    
    if (lastX === undefined || lastY === undefined) return;
    
    const hasMoved = lastX !== npcState.x || lastY !== npcState.y;
    if (!hasMoved) return;

    // NPC moved! Check if current path endpoint is still valid (adjacent to NPC's new position with LOS)
    if (plan.path.length > 0) {
      const pathEndpoint = plan.path[plan.path.length - 1];
      const endDx = Math.abs(pathEndpoint.x - npcState.x);
      const endDy = Math.abs(pathEndpoint.y - npcState.y);
      const isEndpointAdjacent = endDx <= 1 && endDy <= 1 && (endDx + endDy > 0);

      if (isEndpointAdjacent) {
        // Check if endpoint has LOS to NPC's new position (prevents interaction through walls)
        let hasLOS = true; // Default to true if no LOS system
        if (this.config.losSystem) {
          const losResult = this.config.losSystem.checkLOS(
            pathEndpoint.x,
            pathEndpoint.y,
            npcState.x,
            npcState.y,
            playerState.mapLevel
          );
          hasLOS = losResult.hasLOS;
        }

        if (hasLOS) {
          // Current path still leads to valid adjacent tile with LOS - just update lastKnownX/Y
          (pendingAction as any).lastKnownX = npcState.x;
          (pendingAction as any).lastKnownY = npcState.y;
          return;
        }
        // Endpoint is adjacent but no LOS - fall through to re-pathfind
      }
    }

    // Current path endpoint is no longer valid - need to re-pathfind
    const dx = Math.abs(playerState.x - npcState.x);
    const dy = Math.abs(playerState.y - npcState.y);
    const distance = Math.max(dx, dy); // Chebyshev distance

    // Only attempt re-pathfind if within reasonable range (cheap pathfinding)
    const MAX_DYNAMIC_REPATHFIND_DISTANCE = 20;
    if (distance > MAX_DYNAMIC_REPATHFIND_DISTANCE) {
      // Too far away - continue on current path
      return;
    }

    // Attempt limited-radius pathfinding
    const newPath = this.attemptLimitedPathfindToNPC(playerState, npcState, distance);

    if (!newPath || newPath.length <= 1) {
      // Re-pathfind failed - continue on current path
      return;
    }

    // Success! Seamlessly replace the current path
    
    // Replace the path in the existing plan
    plan.path = newPath;
    
    // Skip the first point if it's the player's current position
    // This ensures sprinting speed is respected (move 2 tiles per tick if sprinting)
    if (newPath.length > 0 && newPath[0].x === playerState.x && newPath[0].y === playerState.y) {
      plan.nextIndex = 1; // Skip current position
    } else {
      plan.nextIndex = 0;
    }
    
    // Update last known position to NPC's current position
    (pendingAction as any).lastKnownX = npcState.x;
    (pendingAction as any).lastKnownY = npcState.y;
  }

  /**
   * Attempts to find a path to an NPC using limited-radius pathfinding.
   * 
   * Uses progressively larger radius based on distance:
   * - Close (< 6 tiles): 8 tile radius
   * - Medium (6-12 tiles): 12 tile radius  
   * - Far (> 12 tiles): 16 tile radius
   * 
   * **LOS-Aware**: Prioritizes adjacent tiles with line of sight to prevent pathing through walls.
   * 
   * Attempts to path to adjacent tiles since NPCs are not walkable.
   * Returns null if pathfinding fails or WorldModel not available.
   */
  private attemptLimitedPathfindToNPC(
    playerState: PlayerState,
    npcState: NPCState,
    distance: number
  ): Point[] | null {
    if (!this.config.worldModel) return null;

    // Calculate search radius based on distance
    let searchRadius: number;
    if (distance < 6) {
      searchRadius = 8;
    } else if (distance < 12) {
      searchRadius = 12;
    } else {
      searchRadius = 16;
    }

    const layerName = this.config.pathingLayerByMapLevel[playerState.mapLevel];
    if (!layerName) return null;

    const pathingGrid = this.config.worldModel.buildPathingGrid({
      layerName,
      mapLevel: playerState.mapLevel
    });
    if (!pathingGrid) return null;

    try {
      // Convert world coordinates to grid coordinates
      const gridStart = worldToGrid(playerState.x, playerState.y, pathingGrid);
      const gridNPC = worldToGrid(npcState.x, npcState.y, pathingGrid);

      // Try to path to each adjacent tile (NPC itself is not walkable)
      const adjacentOffsets = [
        [0, 1],   // North
        [1, 0],   // East
        [0, -1],  // South
        [-1, 0],  // West
        [1, 1],   // NE
        [1, -1],  // SE
        [-1, -1], // SW
        [-1, 1]   // NW
      ];

      // Calculate distances and sort by closest
      const adjacentTiles = adjacentOffsets
        .map(([dx, dy]) => {
          const adjX = gridNPC.x + dx;
          const adjY = gridNPC.y + dy;
          const distSq = (adjX - gridStart.x) ** 2 + (adjY - gridStart.y) ** 2;
          return { adjX, adjY, distSq };
        })
        .sort((a, b) => a.distSq - b.distSq);

      // Separate tiles with LOS from tiles without LOS (if LOS system available)
      const tilesWithLOS: typeof adjacentTiles = [];
      const tilesWithoutLOS: typeof adjacentTiles = [];

      for (const tile of adjacentTiles) {
        // Check if tile is walkable
        const tileValue = pathingGrid.getOrAllBlockedValue(tile.adjX, tile.adjY);
        if (tileValue === 0xff) continue; // Skip fully blocked tiles

        // Convert grid coordinates to world coordinates for LOS check
        const worldAdj = gridToWorld(new Point(tile.adjX, tile.adjY), pathingGrid);

        // Check LOS from adjacent tile to NPC position
        if (this.config.losSystem) {
          const losResult = this.config.losSystem.checkLOS(
            worldAdj.x,
            worldAdj.y,
            npcState.x,
            npcState.y,
            playerState.mapLevel
          );

          if (losResult.hasLOS) {
            tilesWithLOS.push(tile);
          } else {
            tilesWithoutLOS.push(tile);
          }
        } else {
          // No LOS system - treat all tiles equally
          tilesWithLOS.push(tile);
        }
      }

      // Try pathfinding to tiles with LOS first (prevents pathing through walls)
      for (const { adjX, adjY } of tilesWithLOS) {
        const adjPoint = new Point(adjX, adjY);
        const gridPath = astarPathfinding(pathingGrid, gridStart, adjPoint, searchRadius);

        if (gridPath && gridPath.length > 1) {
          // Convert grid path to world coordinates
          return gridPath.map((p) => gridToWorld(p, pathingGrid));
        }
      }

      // Fallback: Try tiles without LOS (in case all LOS tiles are unreachable)
      for (const { adjX, adjY } of tilesWithoutLOS) {
        const adjPoint = new Point(adjX, adjY);
        const gridPath = astarPathfinding(pathingGrid, gridStart, adjPoint, searchRadius);

        if (gridPath && gridPath.length > 1) {
          // Convert grid path to world coordinates
          return gridPath.map((p) => gridToWorld(p, pathingGrid));
        }
      }

      return null;
    } catch (error) {
      console.warn(`[MovementSystem] Pathfinding error:`, error);
      return null;
    }
  }
}
