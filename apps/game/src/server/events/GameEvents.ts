/**
 * GameEvents.ts - Type definitions for all game events.
 * 
 * The event system is designed around high-level game actions that affect
 * visibility and spatial indexing. Events are processed immediately (synchronously)
 * as JavaScript is single-threaded.
 * 
 * Event categories:
 * - Entity Events: Player/NPC added, removed, moved, teleported
 * - Item Events: Item spawned, despawned (items don't move)
 * - World Entity Events: Trees, rocks, doors, etc.
 */

import type { MapLevel } from "../../world/Location";
import type { EntityType } from "../../protocol/enums/EntityType";
import type { States } from "../../protocol/enums/States";
import type { PlayerState } from "../../world/PlayerState";
import type { Target } from "../../world/targeting/Target";

// ============================================================================
// Position Types
// ============================================================================

/**
 * A position in the game world.
 */
export interface Position {
  mapLevel: MapLevel;
  x: number;
  y: number;
}

/**
 * Entity reference (matches Target type for consistency).
 */
export interface EntityRef {
  type: EntityType;
  id: number;
}

// ============================================================================
// Base Event Types
// ============================================================================

/**
 * Base interface for all game events.
 */
export interface GameEventBase {
  type: string;
  timestamp: number;
}

// ============================================================================
// Player Events
// ============================================================================

export interface PlayerAddedEvent extends GameEventBase {
  type: "PlayerAdded";
  userId: number;
  username: string;
  position: Position;
  playerState: PlayerState;
}

export interface PlayerRemovedEvent extends GameEventBase {
  type: "PlayerRemoved";
  userId: number;
  username: string;
  lastPosition: Position;
}

export interface PlayerMovedEvent extends GameEventBase {
  type: "PlayerMoved";
  userId: number;
  oldPosition: Position;
  newPosition: Position;
}

export interface PlayerTeleportedEvent extends GameEventBase {
  type: "PlayerTeleported";
  userId: number;
  oldPosition: Position;
  newPosition: Position;
  teleportType: number;
  spellId?: number;
}

export interface PlayerStartedTargetingEvent extends GameEventBase {
  type: "PlayerStartedTargeting";
  userId: number;
  target: Target;
  position: Position;
}

export interface PlayerStoppedTargetingEvent extends GameEventBase {
  type: "PlayerStoppedTargeting";
  userId: number;
}

export interface PlayerStartedSkillingEvent extends GameEventBase {
  type: "PlayerStartedSkilling";
  userId: number;
  targetId: number | null;
  skillClientRef: number;
  targetType: EntityType;
  position: Position;
}

export interface PlayerCastedInventorySpellEvent extends GameEventBase {
  type: "PlayerCastedInventorySpell";
  userId: number;
  spellId: number;
  targetItemId: number;
  position: Position;
}

export interface PlayerWentThroughDoorEvent extends GameEventBase {
  type: "PlayerWentThroughDoor";
  userId: number;
  oldPosition: Position;
  newPosition: Position;
  /** The world entity ID of the door */
  doorEntityId: number;
}

export interface PlayerDiedEvent extends GameEventBase {
  type: "PlayerDied";
  /** The player who died */
  victimUserId: number;
  /** The entity that killed them (null if environmental death) */
  killerEntityId: number | null;
  /** Position where death occurred */
  deathPosition: Position;
}

export interface PlayerEquipmentChangedEvent extends GameEventBase {
  type: "PlayerEquipmentChanged";
  /** The player who changed equipment */
  userId: number;
  /** The equipment slot that changed */
  slot: string;
  /** The item ID equipped (0 if unequipped) */
  itemId: number;
  /** The item ID that was unequipped (only set when unequipping, 0 otherwise) */
  unequippedItemId?: number;
}

// ============================================================================
// NPC Events
// ============================================================================

/**
 * NPC spawn data for visibility notifications.
 */
export interface NPCSpawnData {
  npcId: number;
  definitionId: number;
  hitpointsLevel: number;
  currentState: States;
  aggroRadius?: number;
}

export interface NPCAddedEvent extends GameEventBase {
  type: "NPCAdded";
  npcId: number;
  definitionId: number;
  position: Position;
  spawnData: NPCSpawnData;
}

export interface NPCRemovedEvent extends GameEventBase {
  type: "NPCRemoved";
  npcId: number;
  lastPosition: Position;
  reason: "died" | "despawned" | "removed";
}

export interface NPCMovedEvent extends GameEventBase {
  type: "NPCMoved";
  npcId: number;
  oldPosition: Position;
  newPosition: Position;
}

export interface NPCTeleportedEvent extends GameEventBase {
  type: "NPCTeleported";
  npcId: number;
  oldPosition: Position;
  newPosition: Position;
}

// ============================================================================
// NPC Aggro Events
// ============================================================================

export interface NPCStartedAggroEvent extends GameEventBase {
  type: "NPCStartedAggro";
  npcId: number;
  target: Target;
  position: Position;
}

export interface NPCStoppedAggroEvent extends GameEventBase {
  type: "NPCStoppedAggro";
  npcId: number;
}

// ============================================================================
// Item Events (Ground Items)
// ============================================================================

export interface ItemSpawnData {
  itemId: number;
  amount: number;
  isIOU: boolean;
}

export interface ItemSpawnedEvent extends GameEventBase {
  type: "ItemSpawned";
  entityId: number;
  position: Position;
  spawnData: ItemSpawnData;
}

export interface ItemDespawnedEvent extends GameEventBase {
  type: "ItemDespawned";
  entityId: number;
  lastPosition: Position;
  reason: "picked_up" | "despawned" | "removed";
}

export interface ItemRespawnedEvent extends GameEventBase {
  type: "ItemRespawned";
  entityId: number;
  position: Position;
  spawnData: ItemSpawnData;
}

export interface ItemBecameVisibleToAllEvent extends GameEventBase {
  type: "ItemBecameVisibleToAll";
  entityId: number;
  position: Position;
  spawnData: ItemSpawnData;
}

// ============================================================================
// World Entity Events (Trees, Rocks, Doors, etc.)
// ============================================================================

export interface WorldEntitySpawnData {
  definitionId: number;
  type: string;
  resourcesRemaining: number | null;
}

export interface WorldEntityAddedEvent extends GameEventBase {
  type: "WorldEntityAdded";
  entityId: number;
  position: Position;
  spawnData: WorldEntitySpawnData;
}

export interface WorldEntityRemovedEvent extends GameEventBase {
  type: "WorldEntityRemoved";
  entityId: number;
  lastPosition: Position;
}

export interface WorldEntityExhaustedEvent extends GameEventBase {
  type: "WorldEntityExhausted";
  entityId: number;
  position: Position;
  respawnAtTick: number;
}

export interface WorldEntityReplenishedEvent extends GameEventBase {
  type: "WorldEntityReplenished";
  entityId: number;
  position: Position;
  resourcesRemaining: number;
}

// ============================================================================
// Combat Events
// ============================================================================

export interface EntityDamagedEvent extends GameEventBase {
  type: "EntityDamaged";
  attackerRef: EntityRef;
  targetRef: EntityRef;
  damage: number;
  targetPosition: Position;
}

export interface EntityHitpointsChangedEvent extends GameEventBase {
  type: "EntityHitpointsChanged";
  entityRef: EntityRef;
  currentHitpoints: number;
  position: Position;
}

export interface EntityForcedPublicMessageEvent extends GameEventBase {
  type: "EntityForcedPublicMessage";
  entityRef: EntityRef;
  message: string;
  position: Position;
}

export interface FiredProjectileEvent extends GameEventBase {
  type: "FiredProjectile";
  projectileId: number;
  rangerRef: EntityRef;
  targetRef: EntityRef;
  damage: number;
  isConfused: boolean;
  targetPosition: Position;
}

// ============================================================================
// Skill Events
// ============================================================================

export interface PlayerSkillLevelIncreasedEvent extends GameEventBase {
  type: "PlayerSkillLevelIncreased";
  userId: number;
  skillClientRef: number;
  levelsGained: number;
  newLevel: number;
  position: Position;
}

export interface PlayerCombatLevelIncreasedEvent extends GameEventBase {
  type: "PlayerCombatLevelIncreased";
  userId: number;
  newCombatLevel: number;
  position: Position;
}

// ============================================================================
// State Change Events
// ============================================================================

export interface EntityStateChangedEvent extends GameEventBase {
  type: "EntityStateChanged";
  entityRef: EntityRef;
  oldState: States;
  newState: States;
}

// ============================================================================
// Union Types
// ============================================================================

export type PlayerEvent =
  | PlayerAddedEvent
  | PlayerRemovedEvent
  | PlayerMovedEvent
  | PlayerTeleportedEvent
  | PlayerStartedTargetingEvent
  | PlayerStoppedTargetingEvent
  | PlayerStartedSkillingEvent
  | PlayerCastedInventorySpellEvent
  | PlayerWentThroughDoorEvent
  | PlayerDiedEvent
  | PlayerEquipmentChangedEvent;

export type NPCEvent =
  | NPCAddedEvent
  | NPCRemovedEvent
  | NPCMovedEvent
  | NPCTeleportedEvent
  | NPCStartedAggroEvent
  | NPCStoppedAggroEvent;

export type ItemEvent =
  | ItemSpawnedEvent
  | ItemDespawnedEvent
  | ItemRespawnedEvent
  | ItemBecameVisibleToAllEvent;

export type WorldEntityEvent =
  | WorldEntityAddedEvent
  | WorldEntityRemovedEvent
  | WorldEntityExhaustedEvent
  | WorldEntityReplenishedEvent;

export type CombatEvent =
  | EntityDamagedEvent
  | EntityHitpointsChangedEvent
  | EntityForcedPublicMessageEvent
  | FiredProjectileEvent;

export type SkillEvent = 
  | PlayerSkillLevelIncreasedEvent
  | PlayerCombatLevelIncreasedEvent;

export type StateEvent = EntityStateChangedEvent;

export type GameEvent =
  | PlayerEvent
  | NPCEvent
  | ItemEvent
  | WorldEntityEvent
  | CombatEvent
  | SkillEvent
  | StateEvent;

export type GameEventType = GameEvent["type"];

// ============================================================================
// Event Factory Functions
// ============================================================================

function createTimestamp(): number {
  return Date.now();
}

export function createPlayerAddedEvent(
  userId: number,
  username: string,
  position: Position,
  playerState: PlayerState
): PlayerAddedEvent {
  return {
    type: "PlayerAdded",
    timestamp: createTimestamp(),
    userId,
    username,
    position,
    playerState
  };
}

export function createPlayerRemovedEvent(
  userId: number,
  username: string,
  lastPosition: Position
): PlayerRemovedEvent {
  return {
    type: "PlayerRemoved",
    timestamp: createTimestamp(),
    userId,
    username,
    lastPosition
  };
}

export function createPlayerMovedEvent(
  userId: number,
  oldPosition: Position,
  newPosition: Position
): PlayerMovedEvent {
  return {
    type: "PlayerMoved",
    timestamp: createTimestamp(),
    userId,
    oldPosition,
    newPosition
  };
}

export function createPlayerTeleportedEvent(
  userId: number,
  oldPosition: Position,
  newPosition: Position,
  teleportType: number,
  spellId?: number
): PlayerTeleportedEvent {
  return {
    type: "PlayerTeleported",
    timestamp: createTimestamp(),
    userId,
    oldPosition,
    newPosition,
    teleportType,
    spellId
  };
}

export function createPlayerStartedTargetingEvent(
  userId: number,
  target: Target,
  position: Position
): PlayerStartedTargetingEvent {
  return {
    type: "PlayerStartedTargeting",
    timestamp: createTimestamp(),
    userId,
    target,
    position
  };
}

export function createPlayerStoppedTargetingEvent(
  userId: number
): PlayerStoppedTargetingEvent {
  return {
    type: "PlayerStoppedTargeting",
    timestamp: createTimestamp(),
    userId
  };
}

export function createPlayerStartedSkillingEvent(
  userId: number,
  targetId: number | null,
  skillClientRef: number,
  targetType: EntityType,
  position: Position
): PlayerStartedSkillingEvent {
  return {
    type: "PlayerStartedSkilling",
    timestamp: createTimestamp(),
    userId,
    targetId,
    skillClientRef,
    targetType,
    position
  };
}

export function createPlayerCastedInventorySpellEvent(
  userId: number,
  spellId: number,
  targetItemId: number,
  position: Position
): PlayerCastedInventorySpellEvent {
  return {
    type: "PlayerCastedInventorySpell",
    timestamp: createTimestamp(),
    userId,
    spellId,
    targetItemId,
    position
  };
}

export function createPlayerWentThroughDoorEvent(
  userId: number,
  oldPosition: Position,
  newPosition: Position,
  doorEntityId: number
): PlayerWentThroughDoorEvent {
  return {
    type: "PlayerWentThroughDoor",
    timestamp: createTimestamp(),
    userId,
    oldPosition,
    newPosition,
    doorEntityId
  };
}

export function createPlayerDiedEvent(
  victimUserId: number,
  killerEntityId: number | null,
  deathPosition: Position
): PlayerDiedEvent {
  return {
    type: "PlayerDied",
    timestamp: createTimestamp(),
    victimUserId,
    killerEntityId,
    deathPosition
  };
}

  export function createNPCMovedEvent(
  npcId: number,
  oldPosition: Position,
  newPosition: Position
): NPCMovedEvent {
  return {
    type: "NPCMoved",
    timestamp: createTimestamp(),
    npcId,
    oldPosition,
    newPosition
  };
}

export function createNPCAddedEvent(
  npcId: number,
  definitionId: number,
  position: Position,
  spawnData: NPCSpawnData
): NPCAddedEvent {
  return {
    type: "NPCAdded",
    timestamp: createTimestamp(),
    npcId,
    definitionId,
    position,
    spawnData
  };
}

export function createNPCRemovedEvent(
  npcId: number,
  lastPosition: Position,
  reason: "died" | "despawned" | "removed"
): NPCRemovedEvent {
  return {
    type: "NPCRemoved",
    timestamp: createTimestamp(),
    npcId,
    lastPosition,
    reason
  };
}

export function createNPCStartedAggroEvent(
  npcId: number,
  target: Target,
  position: Position
): NPCStartedAggroEvent {
  return {
    type: "NPCStartedAggro",
    timestamp: createTimestamp(),
    npcId,
    target,
    position
  };
}

export function createNPCStoppedAggroEvent(
  npcId: number,
): NPCStoppedAggroEvent {
  return {
    type: "NPCStoppedAggro",
    timestamp: createTimestamp(),
    npcId
  };
}

export function createItemSpawnedEvent(
  entityId: number,
  position: Position,
  spawnData: ItemSpawnData
): ItemSpawnedEvent {
  return {
    type: "ItemSpawned",
    timestamp: createTimestamp(),
    entityId,
    position,
    spawnData
  };
}

export function createItemDespawnedEvent(
  entityId: number,
  lastPosition: Position,
  reason: "picked_up" | "despawned" | "removed"
): ItemDespawnedEvent {
  return {
    type: "ItemDespawned",
    timestamp: createTimestamp(),
    entityId,
    lastPosition,
    reason
  };
}

export function createItemRespawnedEvent(
  entityId: number,
  position: Position,
  spawnData: ItemSpawnData
): ItemRespawnedEvent {
  return {
    type: "ItemRespawned",
    timestamp: createTimestamp(),
    entityId,
    position,
    spawnData
  };
}

export function createItemBecameVisibleToAllEvent(
  entityId: number,
  position: Position,
  spawnData: ItemSpawnData
): ItemBecameVisibleToAllEvent {
  return {
    type: "ItemBecameVisibleToAll",
    timestamp: createTimestamp(),
    entityId,
    position,
    spawnData
  };
}

export function createEntityDamagedEvent(
  attackerRef: EntityRef,
  targetRef: EntityRef,
  damage: number,
  targetPosition: Position
): EntityDamagedEvent {
  return {
    type: "EntityDamaged",
    timestamp: createTimestamp(),
    attackerRef,
    targetRef,
    damage,
    targetPosition
  };
}

export function createFiredProjectileEvent(
  projectileId: number,
  rangerRef: EntityRef,
  targetRef: EntityRef,
  damage: number,
  targetPosition: Position,
  isConfused: boolean = false
): FiredProjectileEvent {
  return {
    type: "FiredProjectile",
    timestamp: createTimestamp(),
    projectileId,
    rangerRef,
    targetRef,
    damage,
    isConfused,
    targetPosition
  };
}

export function createEntityStateChangedEvent(
  entityRef: EntityRef,
  oldState: States,
  newState: States
): EntityStateChangedEvent {
  return {
    type: "EntityStateChanged",
    timestamp: createTimestamp(),
    entityRef,
    oldState,
    newState
  };
}

export function createEntityHitpointsChangedEvent(
  entityRef: EntityRef,
  currentHitpoints: number,
  position: Position
): EntityHitpointsChangedEvent {
  return {
    type: "EntityHitpointsChanged",
    timestamp: createTimestamp(),
    entityRef,
    currentHitpoints,
    position
  };
}

export function createEntityForcedPublicMessageEvent(
  entityRef: EntityRef,
  message: string,
  position: Position
): EntityForcedPublicMessageEvent {
  return {
    type: "EntityForcedPublicMessage",
    timestamp: createTimestamp(),
    entityRef,
    message,
    position
  };
}

export function createPlayerSkillLevelIncreasedEvent(
  userId: number,
  skillClientRef: number,
  levelsGained: number,
  newLevel: number,
  position: Position
): PlayerSkillLevelIncreasedEvent {
  return {
    type: "PlayerSkillLevelIncreased",
    timestamp: createTimestamp(),
    userId,
    skillClientRef,
    levelsGained,
    newLevel,
    position
  };
}

export function createPlayerCombatLevelIncreasedEvent(
  userId: number,
  newCombatLevel: number,
  position: Position
): PlayerCombatLevelIncreasedEvent {
  return {
    type: "PlayerCombatLevelIncreased",
    timestamp: createTimestamp(),
    userId,
    newCombatLevel,
    position
  };
}
