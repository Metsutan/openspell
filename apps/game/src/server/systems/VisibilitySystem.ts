/**
 * VisibilitySystem.ts - Event-driven visibility management.
 * 
 * This is the central system that handles visibility calculations for all entities.
 * Instead of every system manually calling spatial index lookups, this system
 * listens to high-level events and computes visibility changes.
 * 
 * For any entity movement/spawn/despawn event:
 * 1. Computes old viewers (players who could see the old position)
 * 2. Computes new viewers (players who can see the new position)
 * 3. Computes: entered = new - old, exited = old - new, persisting = intersection
 * 4. Emits the correct packets
 * 
 * This is how OSRS, WoW, and most MMO engines handle visibility.
 */

import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import type { MapLevel } from "../../world/Location";
import type { PlayerState, SkillSlug, EquipmentSlot } from "../../world/PlayerState";
import { States } from "../../protocol/enums/States";
import { buildShowDamagePayload } from "../../protocol/packets/actions/ShowDamage";
import { buildFiredProjectilePayload } from "../../protocol/packets/actions/FiredProjectile";
import { buildPlayerDiedPayload } from "../../protocol/packets/actions/PlayerDied";
import { buildStartedSkillingPayload } from "../../protocol/packets/actions/StartedSkilling";
import { buildCastedInventorySpellPayload } from "../../protocol/packets/actions/CastedInventorySpell";

import { EventBus } from "../events/EventBus";
import type {
  GameEvent,
  PlayerAddedEvent,
  PlayerRemovedEvent,
  PlayerMovedEvent,
  PlayerTeleportedEvent,
  PlayerWentThroughDoorEvent,
  PlayerDiedEvent,
  PlayerEquipmentChangedEvent,
  NPCAddedEvent,
  NPCRemovedEvent,
  NPCMovedEvent,
  NPCStartedAggroEvent,
  NPCStoppedAggroEvent,
  ItemSpawnedEvent,
  ItemDespawnedEvent,
  ItemRespawnedEvent,
  ItemBecameVisibleToAllEvent,
  EntityDamagedEvent,
  FiredProjectileEvent,
  EntityHitpointsChangedEvent,
  EntityForcedPublicMessageEvent,
  PlayerSkillLevelIncreasedEvent,
  PlayerCombatLevelIncreasedEvent,
  EntityStateChangedEvent,
  Position,
  EntityRef,
  PlayerStartedTargetingEvent,
  PlayerStoppedTargetingEvent,
  PlayerStartedSkillingEvent,
  PlayerCastedInventorySpellEvent
} from "../events/GameEvents";

import {
  SpatialIndexManager,
  ENTITY_VIEW_RADIUS,
  ITEM_VIEW_RADIUS,
  type PlayerSpatialEntry,
  type NPCSpatialEntry,
  type ItemSpatialEntry
} from "./SpatialIndexManager";

import { ResourceExhaustionTracker } from "./ResourceExhaustionTracker";

// ============================================================================
// Packet Types (for dependency injection)
// ============================================================================

/**
 * A packet to be sent to clients.
 */
export interface OutgoingPacket {
  action: GameAction;
  payload: unknown[];
}

/**
 * Interface for packet sending.
 * Allows VisibilitySystem to emit packets without direct dependency on Socket.IO.
 */
export interface PacketSender {
  sendToUser(userId: number, packet: OutgoingPacket): void;
  broadcast(packet: OutgoingPacket): void;
}

/**
 * Interface for building entity packets.
 * Allows customization of packet formats.
 */
export interface PacketBuilder {
  buildPlayerEnteredChunk(player: PlayerState): OutgoingPacket;
  buildNPCEnteredChunk(npc: NPCSpatialEntry): OutgoingPacket;
  buildItemEnteredChunk(item: ItemSpatialEntry): OutgoingPacket;
  buildEntityExitedChunk(entityRef: EntityRef): OutgoingPacket;
  buildEntityMoveTo(entityRef: EntityRef, x: number, y: number): OutgoingPacket;
  buildTeleportTo(entityRef: EntityRef, x: number, y: number, mapLevel: MapLevel, type: number, spellId?: number): OutgoingPacket;
  buildStartedTargeting(entityRef: EntityRef, target: EntityRef): OutgoingPacket;
  buildStoppedTargeting(entityRef: EntityRef): OutgoingPacket;
  buildEnteredIdleState(entityRef: EntityRef): OutgoingPacket;
  buildWentThroughDoor(doorEntityId: number, playerId: number): OutgoingPacket;
}

// ============================================================================
// Visibility State Tracking
// ============================================================================

/**
 * Tracks what each viewer can currently see.
 */
class ViewerState {
  /** Set of entity keys currently visible to each viewer */
  private visibleEntities = new Map<number, Set<string>>();
  
  /** Set of viewer userIds watching each entity */
  private entityWatchers = new Map<string, Set<number>>();

  /**
   * Gets entities visible to a viewer.
   */
  getVisibleEntities(viewerId: number): Set<string> {
    return this.visibleEntities.get(viewerId) ?? new Set();
  }

  /**
   * Gets viewers watching an entity.
   */
  getWatchers(entityKey: string): Set<number> {
    return this.entityWatchers.get(entityKey) ?? new Set();
  }

  /**
   * Marks an entity as visible to a viewer.
   */
  addVisibility(viewerId: number, entityKey: string): void {
    // Add to viewer's visible set
    let visible = this.visibleEntities.get(viewerId);
    if (!visible) {
      visible = new Set();
      this.visibleEntities.set(viewerId, visible);
    }
    visible.add(entityKey);

    // Add viewer to entity's watchers
    let watchers = this.entityWatchers.get(entityKey);
    if (!watchers) {
      watchers = new Set();
      this.entityWatchers.set(entityKey, watchers);
    }
    watchers.add(viewerId);
  }

  /**
   * Marks an entity as no longer visible to a viewer.
   */
  removeVisibility(viewerId: number, entityKey: string): void {
    // Remove from viewer's visible set
    const visible = this.visibleEntities.get(viewerId);
    if (visible) {
      visible.delete(entityKey);
      if (visible.size === 0) {
        this.visibleEntities.delete(viewerId);
      }
    }

    // Remove viewer from entity's watchers
    const watchers = this.entityWatchers.get(entityKey);
    if (watchers) {
      watchers.delete(viewerId);
      if (watchers.size === 0) {
        this.entityWatchers.delete(entityKey);
      }
    }
  }

  /**
   * Clears all visibility data for a viewer (when they log out).
   */
  clearViewer(viewerId: number): void {
    const visible = this.visibleEntities.get(viewerId);
    if (visible) {
      for (const entityKey of visible) {
        const watchers = this.entityWatchers.get(entityKey);
        if (watchers) {
          watchers.delete(viewerId);
          if (watchers.size === 0) {
            this.entityWatchers.delete(entityKey);
          }
        }
      }
      this.visibleEntities.delete(viewerId);
    }
  }

  /**
   * Clears all watchers for an entity (when it despawns).
   */
  clearEntity(entityKey: string): void {
    const watchers = this.entityWatchers.get(entityKey);
    if (watchers) {
      for (const viewerId of watchers) {
        const visible = this.visibleEntities.get(viewerId);
        if (visible) {
          visible.delete(entityKey);
          if (visible.size === 0) {
            this.visibleEntities.delete(viewerId);
          }
        }
      }
      this.entityWatchers.delete(entityKey);
    }
  }

  /**
   * Updates visibility and returns the sets of viewers that entered/exited.
   */
  updateWatchers(
    entityKey: string,
    newWatchers: Set<number>
  ): { entered: Set<number>; exited: Set<number>; persisting: Set<number> } {
    const oldWatchers = this.getWatchers(entityKey);
    
    const entered = new Set<number>();
    const exited = new Set<number>();
    const persisting = new Set<number>();

    // Find who entered and who persists
    for (const viewerId of newWatchers) {
      if (oldWatchers.has(viewerId)) {
        persisting.add(viewerId);
      } else {
        entered.add(viewerId);
      }
    }

    // Find who exited
    for (const viewerId of oldWatchers) {
      if (!newWatchers.has(viewerId)) {
        exited.add(viewerId);
      }
    }

    // Update state
    for (const viewerId of entered) {
      this.addVisibility(viewerId, entityKey);
    }
    for (const viewerId of exited) {
      this.removeVisibility(viewerId, entityKey);
    }

    return { entered, exited, persisting };
  }
}

// ============================================================================
// VisibilitySystem
// ============================================================================

export interface VisibilitySystemConfig {
  spatialIndex: SpatialIndexManager;
  eventBus: EventBus;
  packetSender: PacketSender;
  packetBuilder: PacketBuilder;
  resourceExhaustionTracker?: ResourceExhaustionTracker;
}

/**
 * Central visibility system that handles all visibility updates.
 */
export class VisibilitySystem {
  private readonly spatialIndex: SpatialIndexManager;
  private readonly eventBus: EventBus;
  private readonly packetSender: PacketSender;
  private readonly packetBuilder: PacketBuilder;
  private readonly viewerState = new ViewerState();
  private readonly unsubscribers: (() => void)[] = [];
  private readonly resourceExhaustionTracker: ResourceExhaustionTracker;

  constructor(config: VisibilitySystemConfig) {
    this.spatialIndex = config.spatialIndex;
    this.eventBus = config.eventBus;
    this.packetSender = config.packetSender;
    this.packetBuilder = config.packetBuilder;
    this.resourceExhaustionTracker = config.resourceExhaustionTracker ?? new ResourceExhaustionTracker(config.packetSender);

    this.subscribeToEvents();
  }

  /**
   * Subscribes to all relevant game events.
   */
  private subscribeToEvents(): void {
    // Player events
    this.unsubscribers.push(
      this.eventBus.on("PlayerAdded", (e) => this.handlePlayerAdded(e)),
      this.eventBus.on("PlayerRemoved", (e) => this.handlePlayerRemoved(e)),
      this.eventBus.on("PlayerMoved", (e) => this.handlePlayerMoved(e)),
      this.eventBus.on("PlayerTeleported", (e) => this.handlePlayerTeleported(e)),
      this.eventBus.on("PlayerWentThroughDoor", (e) => this.handlePlayerWentThroughDoor(e)),
      this.eventBus.on("PlayerStartedTargeting", (e) => this.handlePlayerStartedTargeting(e)),
      this.eventBus.on("PlayerStoppedTargeting", (e) => this.handlePlayerStoppedTargeting(e)),
      this.eventBus.on("PlayerStartedSkilling", (e) => this.handlePlayerStartedSkilling(e)),
      this.eventBus.on("PlayerCastedInventorySpell", (e) => this.handlePlayerCastedInventorySpell(e)),
      this.eventBus.on("PlayerDied", (e) => this.handlePlayerDied(e)),
      
      // NPC events
      this.eventBus.on("NPCAdded", (e) => this.handleNPCAdded(e)),
      this.eventBus.on("NPCRemoved", (e) => this.handleNPCRemoved(e)),
      this.eventBus.on("NPCMoved", (e) => this.handleNPCMoved(e)),
      this.eventBus.on("NPCStartedAggro", (e) => this.handleNPCStartedAggro(e)),
      this.eventBus.on("NPCStoppedAggro", (e) => this.handleNPCStoppedAggro(e)),
      
      // Item events
      this.eventBus.on("ItemSpawned", (e) => this.handleItemSpawned(e)),
      this.eventBus.on("ItemDespawned", (e) => this.handleItemDespawned(e)),
      this.eventBus.on("ItemRespawned", (e) => this.handleItemRespawned(e)),
      this.eventBus.on("ItemBecameVisibleToAll", (e) => this.handleItemBecameVisibleToAll(e)),
      
      // Combat events
      this.eventBus.on("EntityDamaged", (e) => this.handleEntityDamaged(e)),
      this.eventBus.on("EntityHitpointsChanged", (e) => this.handleEntityHitpointsChanged(e)),
      this.eventBus.on("EntityForcedPublicMessage", (e) => this.handleEntityForcedPublicMessage(e)),
      this.eventBus.on("FiredProjectile", (e) => this.handleFiredProjectile(e)),
      
      // Skill events
      this.eventBus.on("PlayerSkillLevelIncreased", (e) => this.handlePlayerSkillLevelIncreased(e)),
      this.eventBus.on("PlayerCombatLevelIncreased", (e) => this.handlePlayerCombatLevelIncreased(e)),
      
      // Equipment events
      this.eventBus.on("PlayerEquipmentChanged", (e) => this.handlePlayerEquipmentChanged(e)),
      
      // State change events
      this.eventBus.on("EntityStateChanged", (e) => this.handleEntityStateChanged(e))
    );
  }

  /**
   * Unsubscribes from all events and cleans up.
   */
  destroy(): void {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers.length = 0;
  }

  // ============================================================================
  // Player Event Handlers
  // ============================================================================

  private handlePlayerAdded(event: PlayerAddedEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);

    // Add player to spatial index
    this.spatialIndex.addOrUpdatePlayer(event.playerState);

    // Compute what entities this player can see
    const visibleEntities = this.spatialIndex.gatherVisibleEntities(
      event.userId,
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Notify the player about all visible entities
    for (const visibleKey of visibleEntities) {
      this.notifyViewerEntityEntered(event.userId, visibleKey);
    }

    // Compute who can see this player
    const viewers = this.spatialIndex.gatherViewersForEntity(entityRef, event.position);
    
    // Notify all viewers that this player appeared
    const packet = this.packetBuilder.buildPlayerEnteredChunk(event.playerState);
    for (const viewerId of viewers) {
      this.viewerState.addVisibility(viewerId, entityKey);
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handlePlayerRemoved(event: PlayerRemovedEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);

    // Notify all watchers that this player left
    const watchers = this.viewerState.getWatchers(entityKey);
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }

    // Clear visibility state for this entity
    this.viewerState.clearEntity(entityKey);
    
    // Clear what this player was watching
    this.viewerState.clearViewer(event.userId);

    // Remove from spatial index
    this.spatialIndex.removePlayer(event.userId);
  }

  private handlePlayerMoved(event: PlayerMovedEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);
    
    const playerEntry = this.spatialIndex.getPlayer(event.userId);
    if (!playerEntry) return;

    // Update spatial index
    this.spatialIndex.addOrUpdatePlayer(playerEntry.playerState);

    // Update what this player can see
    this.refreshPlayerVisibility(event.userId, event.newPosition);

    // Compute new watchers for this player
    const newWatchers = this.spatialIndex.gatherViewersForEntity(entityRef, event.newPosition);
    const { entered, exited, persisting } = this.viewerState.updateWatchers(entityKey, newWatchers);

    // Build movement packet
    const movePacket = this.packetBuilder.buildEntityMoveTo(
      entityRef,
      event.newPosition.x,
      event.newPosition.y
    );

    // Send to self
    this.packetSender.sendToUser(event.userId, movePacket);

    // Notify watchers who still see this player
    for (const viewerId of persisting) {
      this.packetSender.sendToUser(viewerId, movePacket);
    }

    // Notify new watchers (player entered their view)
    const enterPacket = this.packetBuilder.buildPlayerEnteredChunk(playerEntry.playerState);
    for (const viewerId of entered) {
      this.packetSender.sendToUser(viewerId, enterPacket);
    }

    // Notify old watchers (player left their view)
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    for (const viewerId of exited) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }
  }

  private handlePlayerTeleported(event: PlayerTeleportedEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);
    
    const playerEntry = this.spatialIndex.getPlayer(event.userId);
    if (!playerEntry) return;

    // Capture old watchers before updating spatial index
    const oldWatchers = new Set(this.viewerState.getWatchers(entityKey));

    // Update spatial index
    this.spatialIndex.addOrUpdatePlayer(playerEntry.playerState);

    // Update what this player can see
    this.refreshPlayerVisibility(event.userId, event.newPosition);

    // Compute new watchers
    const newWatchers = this.spatialIndex.gatherViewersForEntity(entityRef, event.newPosition);
    const { entered, exited, persisting } = this.viewerState.updateWatchers(entityKey, newWatchers);

    // Build teleport packet
    const teleportPacket = this.packetBuilder.buildTeleportTo(
      entityRef,
      event.newPosition.x,
      event.newPosition.y,
      event.newPosition.mapLevel,
      event.teleportType,
      event.spellId
    );

    // Send to self
    this.packetSender.sendToUser(event.userId, teleportPacket)

    // New watchers (player entered their view) - send enter packet
    const enterPacket = this.packetBuilder.buildPlayerEnteredChunk(playerEntry.playerState);
    for (const viewerId of entered) {
      this.packetSender.sendToUser(viewerId, enterPacket);
    }

    // Old watchers (player left their view) - send exit packet
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    for (const viewerId of exited) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }
  }

  /**
   * Handles player going through a door.
   * Similar to movement but also sends WentThroughDoor packet for door animation.
   */
  private handlePlayerWentThroughDoor(event: PlayerWentThroughDoorEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);
    
    const playerEntry = this.spatialIndex.getPlayer(event.userId);
    if (!playerEntry) return;

    // Update spatial index with new position
    this.spatialIndex.addOrUpdatePlayer(playerEntry.playerState);

    // Update what this player can see
    this.refreshPlayerVisibility(event.userId, event.newPosition);

    // Compute new watchers for this player
    const newWatchers = this.spatialIndex.gatherViewersForEntity(entityRef, event.newPosition);
    const { entered, exited, persisting } = this.viewerState.updateWatchers(entityKey, newWatchers);

    // Build movement packet (player moves through the door)
    const movePacket = this.packetBuilder.buildEntityMoveTo(
      entityRef,
      event.newPosition.x,
      event.newPosition.y
    );

    // Build door animation packet
    const doorPacket = this.packetBuilder.buildWentThroughDoor(
      event.doorEntityId,
      event.userId
    );

    // Send movement + door animation to self
    this.packetSender.sendToUser(event.userId, movePacket);
    this.packetSender.sendToUser(event.userId, doorPacket);

    // Notify watchers who still see this player (send both packets)
    for (const viewerId of persisting) {
      this.packetSender.sendToUser(viewerId, movePacket);
      this.packetSender.sendToUser(viewerId, doorPacket);
    }

    // Notify new watchers (player entered their view)
    const enterPacket = this.packetBuilder.buildPlayerEnteredChunk(playerEntry.playerState);
    for (const viewerId of entered) {
      this.packetSender.sendToUser(viewerId, enterPacket);
      // Also send door animation to new viewers so they see the door close
      this.packetSender.sendToUser(viewerId, doorPacket);
    }

    // Notify old watchers (player left their view)
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    for (const viewerId of exited) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }
  }

  /**
   * Handles player death events.
   * Broadcasts PlayerDied packet to all players who can see the death location.
   */
  private handlePlayerDied(event: PlayerDiedEvent): void {
    // Build the PlayerDied packet
    const killerEntityId = event.killerEntityId ?? null;

    const payload = buildPlayerDiedPayload({
      VictimEntityID: event.victimUserId,
      PKerEntityID: killerEntityId
    });

    // Get all players who can see the death location
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.deathPosition.mapLevel,
      event.deathPosition.x,
      event.deathPosition.y
    );

    // Send to all viewers
    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, {
        action: GameAction.PlayerDied,
        payload
      });
    }

    // Also send to the victim themselves if not already in viewers
    const victimIsViewer = viewers.some(v => v.id === event.victimUserId);
    if (!victimIsViewer) {
      this.packetSender.sendToUser(event.victimUserId, {
        action: GameAction.PlayerDied,
        payload
      });
    }
  }

  // ============================================================================
  // NPC Event Handlers
  // ============================================================================

  private handleNPCAdded(event: NPCAddedEvent): void {
    const entityRef: EntityRef = { type: EntityType.NPC, id: event.npcId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.NPC, event.npcId);

    // Get NPC from spatial index (should already be added by caller)
    const npc = this.spatialIndex.getNPC(event.npcId);
    if (!npc) return;

    // Compute who can see this NPC
    const viewers = this.spatialIndex.gatherViewersForEntity(entityRef, event.position);

    // Notify all viewers
    const packet = this.packetBuilder.buildNPCEnteredChunk(npc);
    for (const viewerId of viewers) {
      this.viewerState.addVisibility(viewerId, entityKey);
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handleNPCRemoved(event: NPCRemovedEvent): void {
    const entityRef: EntityRef = { type: EntityType.NPC, id: event.npcId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.NPC, event.npcId);

    // Notify all watchers
    const watchers = this.viewerState.getWatchers(entityKey);
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }

    // Clear visibility state
    this.viewerState.clearEntity(entityKey);
  }

  private handleNPCMoved(event: NPCMovedEvent): void {
    const entityRef: EntityRef = { type: EntityType.NPC, id: event.npcId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.NPC, event.npcId);
    
    const npc = this.spatialIndex.getNPC(event.npcId);
    if (!npc) return;

    // Compute new watchers
    const newWatchers = this.spatialIndex.gatherViewersForEntity(entityRef, event.newPosition);
    const { entered, exited, persisting } = this.viewerState.updateWatchers(entityKey, newWatchers);

    // Build movement packet
    const movePacket = this.packetBuilder.buildEntityMoveTo(
      entityRef,
      event.newPosition.x,
      event.newPosition.y
    );

    // Notify persisting watchers (NPC moved within view)
    for (const viewerId of persisting) {
      this.packetSender.sendToUser(viewerId, movePacket);
    }

    // Notify new watchers (NPC entered their view)
    const enterPacket = this.packetBuilder.buildNPCEnteredChunk(npc);
    for (const viewerId of entered) {
      this.packetSender.sendToUser(viewerId, enterPacket);
    }

    // Notify old watchers (NPC left their view)
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    for (const viewerId of exited) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }
  }

  private handlePlayerStartedTargeting(event: PlayerStartedTargetingEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);

    const watchers = this.viewerState.getWatchers(entityKey);
    const packet = this.packetBuilder.buildStartedTargeting(entityRef, event.target);

    // Send to self
    this.packetSender.sendToUser(event.userId, packet);
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handlePlayerStoppedTargeting(event: PlayerStoppedTargetingEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);

    const watchers = this.viewerState.getWatchers(entityKey);
    const packet = this.packetBuilder.buildStoppedTargeting(entityRef);

    // Send to self
    this.packetSender.sendToUser(event.userId, packet);
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handlePlayerStartedSkilling(event: PlayerStartedSkillingEvent): void {
    const entityRef: EntityRef = { type: EntityType.Player, id: event.userId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);

    const watchers = this.viewerState.getWatchers(entityKey);
    const payload = buildStartedSkillingPayload({
      PlayerEntityID: event.userId,
      TargetID: event.targetId,
      Skill: event.skillClientRef,
      TargetType: event.targetType
    });
    const packet = { action: GameAction.StartedSkilling, payload };

    this.packetSender.sendToUser(event.userId, packet);
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handlePlayerCastedInventorySpell(event: PlayerCastedInventorySpellEvent): void {
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Player, event.userId);
    const watchers = this.viewerState.getWatchers(entityKey);
    const payload = buildCastedInventorySpellPayload({
      EntityID: event.userId,
      EntityType: EntityType.Player,
      SpellID: event.spellId,
      TargetItemID: event.targetItemId
    });
    const packet = { action: GameAction.CastedInventorySpell, payload };

    this.packetSender.sendToUser(event.userId, packet);
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handleNPCStartedAggro(event: NPCStartedAggroEvent): void {
    const entityRef: EntityRef = { type: EntityType.NPC, id: event.npcId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.NPC, event.npcId);
    
    const watchers = this.viewerState.getWatchers(entityKey);
    const packet = this.packetBuilder.buildStartedTargeting(entityRef, event.target);

    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  private handleNPCStoppedAggro(event: NPCStoppedAggroEvent): void {
    const entityRef: EntityRef = { type: EntityType.NPC, id: event.npcId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.NPC, event.npcId);
    
    const watchers = this.viewerState.getWatchers(entityKey);
    const packet = this.packetBuilder.buildStoppedTargeting(entityRef);

    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  // ============================================================================
  // Item Event Handlers
  // ============================================================================

  private handleItemSpawned(event: ItemSpawnedEvent): void {
    const entityRef: EntityRef = { type: EntityType.Item, id: event.entityId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Item, event.entityId);

    const item = this.spatialIndex.getItem(event.entityId);
    if (!item) return;

    // Compute who can see this item (items have larger view radius)
    let viewers = this.spatialIndex.getPlayersViewingItem(
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Filter viewers if item is only visible to specific player
    if (item.visibleToUserId !== null) {
      viewers = viewers.filter(viewer => viewer.id === item.visibleToUserId);
    }

    // Notify all eligible viewers
    const packet = this.packetBuilder.buildItemEnteredChunk(item);
    for (const viewer of viewers) {
      this.viewerState.addVisibility(viewer.id, entityKey);
      this.packetSender.sendToUser(viewer.id, packet);
    }
  }

  private handleItemDespawned(event: ItemDespawnedEvent): void {
    const entityRef: EntityRef = { type: EntityType.Item, id: event.entityId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Item, event.entityId);

    // Notify all watchers
    const watchers = this.viewerState.getWatchers(entityKey);
    const exitPacket = this.packetBuilder.buildEntityExitedChunk(entityRef);
    
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, exitPacket);
    }

    // Clear visibility state
    this.viewerState.clearEntity(entityKey);
    this.spatialIndex.removeItem(event.entityId);
  }

  private handleItemRespawned(event: ItemRespawnedEvent): void {
    // Same as spawned
    this.handleItemSpawned({
      ...event,
      type: "ItemSpawned"
    });
  }

  private handleItemBecameVisibleToAll(event: ItemBecameVisibleToAllEvent): void {
    const entityRef: EntityRef = { type: EntityType.Item, id: event.entityId };
    const entityKey = this.spatialIndex.makeEntityKey(EntityType.Item, event.entityId);

    const item = this.spatialIndex.getItem(event.entityId);
    if (!item) return;

    // Get all players who can see this location (excluding those who already see it)
    const allViewers = this.spatialIndex.getPlayersViewingItem(
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Get current watchers (player who could already see it)
    const currentWatchers = this.viewerState.getWatchers(entityKey);

    // Notify viewers who don't already see the item
    const packet = this.packetBuilder.buildItemEnteredChunk(item);
    for (const viewer of allViewers) {
      if (!currentWatchers.has(viewer.id)) {
        this.viewerState.addVisibility(viewer.id, entityKey);
        this.packetSender.sendToUser(viewer.id, packet);
      }
    }
  }

  // ============================================================================
  // Combat Event Handlers
  // ============================================================================

  /**
   * Handles entity damage events.
   * Broadcasts ShowDamage packets to all players who can see the combat.
   */
  private handleEntityDamaged(event: EntityDamagedEvent): void {
    // Build the ShowDamage packet
    const payload = buildShowDamagePayload({
      SenderEntityID: event.attackerRef.id,
      ReceiverEntityID: event.targetRef.id,
      DamageAmount: event.damage
    });

    // Get all players who can see the target's position
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.targetPosition.mapLevel,
      event.targetPosition.x,
      event.targetPosition.y
    );

    // Send damage packet to all viewers
    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, {
        action: GameAction.ShowDamage,
        payload
      });
    }

    // Also send to attacker if they're a player and not already in viewers
    if (event.attackerRef.type === EntityType.Player) {
      const attackerIsViewer = viewers.some(v => v.id === event.attackerRef.id);
      if (!attackerIsViewer) {
        this.packetSender.sendToUser(event.attackerRef.id, {
          action: GameAction.ShowDamage,
          payload
        });
      }
    }

    // Also send to target if they're a player and not already in viewers
    if (event.targetRef.type === EntityType.Player) {
      const targetIsViewer = viewers.some(v => v.id === event.targetRef.id);
      if (!targetIsViewer) {
        this.packetSender.sendToUser(event.targetRef.id, {
          action: GameAction.ShowDamage,
          payload
        });
      }
    }
  }

  private handleFiredProjectile(event: FiredProjectileEvent): void {
    const payload = buildFiredProjectilePayload({
      ProjectileID: event.projectileId,
      RangerID: event.rangerRef.id,
      RangerEntityType: event.rangerRef.type,
      TargetID: event.targetRef.id,
      TargetEntityType: event.targetRef.type,
      DamageAmount: event.damage,
      IsConfused: event.isConfused
    });

    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.targetPosition.mapLevel,
      event.targetPosition.x,
      event.targetPosition.y
    );

    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, {
        action: GameAction.FiredProjectile,
        payload
      });
    }

    if (event.rangerRef.type === EntityType.Player) {
      const rangerIsViewer = viewers.some(v => v.id === event.rangerRef.id);
      if (!rangerIsViewer) {
        this.packetSender.sendToUser(event.rangerRef.id, {
          action: GameAction.FiredProjectile,
          payload
        });
      }
    }

    if (event.targetRef.type === EntityType.Player) {
      const targetIsViewer = viewers.some(v => v.id === event.targetRef.id);
      if (!targetIsViewer) {
        this.packetSender.sendToUser(event.targetRef.id, {
          action: GameAction.FiredProjectile,
          payload
        });
      }
    }
  }

  // ============================================================================
  // State Change Event Handlers
  // ============================================================================

  /**
   * Handles entity state changes.
   * Currently only handles IdleState transitions to emit EnteredIdleState packets.
   */
  private handleEntityStateChanged(event: EntityStateChangedEvent): void {
    // Only emit EnteredIdleState packet when transitioning TO IdleState
    if (event.newState === States.IdleState) {
      this.emitEnteredIdleState(event.entityRef);
    }
    
    // TODO: Future: Handle other state transitions if needed (e.g., combat states, activity states)
  }

  /**
   * Handles entity hitpoints changes.
   * Broadcasts HitpointsCurrentLevelChanged packets to all players who can see the entity.
   */
  private handleEntityHitpointsChanged(event: EntityHitpointsChangedEvent): void {
    const { buildHitpointsCurrentLevelChangedPayload } = require("../../protocol/packets/actions/HitpointsCurrentLevelChanged");
    
    // Build the HitpointsCurrentLevelChanged packet
    const payload = buildHitpointsCurrentLevelChangedPayload({
      EntityID: event.entityRef.id,
      EntityType: event.entityRef.type,
      CurrentHealth: event.currentHitpoints
    });

    // Get all players who can see the entity's position
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Send hitpoints packet to all viewers
    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, { action: GameAction.HitpointsCurrentLevelChanged, payload });
    }
  }

  /**
   * Handles entity forced public messages.
   * Broadcasts ForcePublicMessage packets to all players who can see the entity.
   */
  private handleEntityForcedPublicMessage(event: EntityForcedPublicMessageEvent): void {
    const { buildForcePublicMessagePayload } = require("../../protocol/packets/actions/ForcePublicMessage");
    
    // Build the ForcePublicMessage packet
    const payload = buildForcePublicMessagePayload({
      EntityID: event.entityRef.id,
      EntityType: event.entityRef.type,
      Message: event.message
    });

    // Get all players who can see the entity's position
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Send message packet to all viewers
    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, { action: GameAction.ForcePublicMessage, payload });
    }
  }

  /**
   * Handles player skill level increases.
   * Broadcasts PlayerSkillLevelIncreased packets to all players who can see the player.
   */
  private handlePlayerSkillLevelIncreased(event: PlayerSkillLevelIncreasedEvent): void {
    const { buildPlayerSkillLevelIncreasedPayload } = require("../../protocol/packets/actions/PlayerSkillLevelIncreased");
    
    // Build the PlayerSkillLevelIncreased packet
    const payload = buildPlayerSkillLevelIncreasedPayload({
      PlayerEntityID: event.userId,
      Skill: event.skillClientRef,
      LevelsGained: event.levelsGained,
      NewLevel: event.newLevel
    });

    // Get all players who can see the leveling player's position
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Send skill level packet to all viewers (including the player themselves)
    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, { action: GameAction.PlayerSkillLevelIncreased, payload });
    }
  }

  /**
   * Handles player combat level increases.
   * Broadcasts PlayerCombatLevelIncreased packets to all players who can see the player.
   */
  private handlePlayerCombatLevelIncreased(event: PlayerCombatLevelIncreasedEvent): void {
    const { buildPlayerCombatLevelIncreasedPayload } = require("../../protocol/packets/actions/PlayerCombatLevelIncreased");
    
    // Build the PlayerCombatLevelIncreased packet
    const payload = buildPlayerCombatLevelIncreasedPayload({
      PlayerEntityID: event.userId,
      NewCombatLevel: event.newCombatLevel
    });

    // Get all players who can see the leveling player's position
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      event.position.mapLevel,
      event.position.x,
      event.position.y
    );

    // Send combat level packet to all viewers (including the player themselves)
    for (const viewer of viewers) {
      this.packetSender.sendToUser(viewer.id, { action: GameAction.PlayerCombatLevelIncreased, payload });
    }
  }

  /**
   * Handles player equipment changes.
   * Broadcasts EquippedItem or UnequippedItem packets to all players who can see the player.
   */
  private handlePlayerEquipmentChanged(event: PlayerEquipmentChangedEvent): void {
    const playerState = this.spatialIndex.getPlayer(event.userId)?.playerState;
    if (!playerState) return;

    // Get all players who can see the equipping player
    const viewers = this.spatialIndex.getPlayersViewingPosition(
      playerState.mapLevel,
      playerState.x,
      playerState.y
    );

    if (event.itemId === 0) {
      // Item was unequipped - send UnequippedItem packet with the item that was removed
      const { buildUnequippedItemPayload } = require("../../protocol/packets/actions/UnequippedItem");
      
      const payload = buildUnequippedItemPayload({
        PlayerEntityID: event.userId,
        ItemID: event.unequippedItemId ?? 0 // Use the actual unequipped item ID
      });

      // Send unequipped packet to all viewers (including the player themselves)
      for (const viewer of viewers) {
        this.packetSender.sendToUser(viewer.id, { action: GameAction.UnequippedItem, payload });
      }
    } else {
      // Item was equipped - send EquippedItem packet
      const { buildEquippedItemPayload } = require("../../protocol/packets/actions/EquippedItem");
      
      const payload = buildEquippedItemPayload({
        PlayerEntityID: event.userId,
        ItemID: event.itemId
      });

      // Send equipped packet to all viewers (including the player themselves)
      for (const viewer of viewers) {
        this.packetSender.sendToUser(viewer.id, { action: GameAction.EquippedItem, payload });
      }
    }
  }

  // ============================================================================
  // Player Visibility Helpers
  // ============================================================================

  /**
   * Refreshes what a player can see when they move.
   * Notifies them about entities entering/exiting their view.
   */
  private refreshPlayerVisibility(userId: number, position: Position): void {
    // Get what the player can currently see
    const newVisible = this.spatialIndex.gatherVisibleEntities(
      userId,
      position.mapLevel,
      position.x,
      position.y
    );

    // Get what they could see before
    const oldVisible = this.viewerState.getVisibleEntities(userId);

    // Compute entered/exited
    const entered = new Set<string>();
    const exited = new Set<string>();

    for (const key of newVisible) {
      if (!oldVisible.has(key)) {
        entered.add(key);
      }
    }

    for (const key of oldVisible) {
      if (!newVisible.has(key)) {
        exited.add(key);
      }
    }

    // Notify about entities entering view
    for (const entityKey of entered) {
      this.notifyViewerEntityEntered(userId, entityKey);
    }

    // Notify about entities exiting view
    for (const entityKey of exited) {
      this.notifyViewerEntityExited(userId, entityKey);
    }
  }

  /**
   * Notifies a viewer that an entity entered their view.
   */
  private notifyViewerEntityEntered(viewerId: number, entityKey: string): void {
    const entityRef = this.spatialIndex.parseEntityKey(entityKey);
    if (!entityRef) return;

    let packet: OutgoingPacket | null = null;

    switch (entityRef.type) {
      case EntityType.Player: {
        const player = this.spatialIndex.getPlayer(entityRef.id);
        if (player) {
          packet = this.packetBuilder.buildPlayerEnteredChunk(player.playerState);
        }
        break;
      }
      case EntityType.NPC: {
        const npc = this.spatialIndex.getNPC(entityRef.id);
        if (npc) {
          packet = this.packetBuilder.buildNPCEnteredChunk(npc);
        }
        break;
      }
      case EntityType.Item: {
        const item = this.spatialIndex.getItem(entityRef.id);
        if (item && item.isPresent) {
          // Check if item is visible to this viewer
          if (item.visibleToUserId === null || item.visibleToUserId === viewerId) {
            packet = this.packetBuilder.buildItemEnteredChunk(item);
          }
        }
        break;
      }
      case EntityType.Environment: {
        // Check if this environment entity is exhausted
        if (this.resourceExhaustionTracker.isExhausted(entityRef.id)) {
          this.resourceExhaustionTracker.notifyExhausted(entityRef.id, viewerId);
        }
        break;
      }
    }

    if (packet) {
      this.viewerState.addVisibility(viewerId, entityKey);
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  /**
   * Notifies a viewer that an entity exited their view.
   */
  private notifyViewerEntityExited(viewerId: number, entityKey: string): void {
    const entityRef = this.spatialIndex.parseEntityKey(entityKey);
    if (!entityRef) return;

    const packet = this.packetBuilder.buildEntityExitedChunk(entityRef);
    this.viewerState.removeVisibility(viewerId, entityKey);
    this.packetSender.sendToUser(viewerId, packet);
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Gets the current watchers for an entity.
   * 
   * Note: Only works for entities tracked in the viewer system (Players, NPCs, Items).
   * For static world entities (Environment), use getPlayersNearEntity() instead.
   */
  getWatchers(entityRef: EntityRef): Set<number> {
    const entityKey = this.spatialIndex.makeEntityKey(entityRef.type, entityRef.id);
    return new Set(this.viewerState.getWatchers(entityKey));
  }

  /**
   * Gets players near a world entity (tree, rock, etc.) based on position.
   * World entities are static and not tracked in the viewer system,
   * so we use a position-based radius query instead.
   * 
   * @param worldEntity - The world entity (must have x, y, mapLevel properties)
   * @returns Set of player user IDs within view range
   */
  getPlayersNearEntity(worldEntity: { x: number; y: number; mapLevel: MapLevel }): Set<number> {
    const nearbyPlayers = this.spatialIndex.getPlayersViewingPosition(
      worldEntity.mapLevel,
      worldEntity.x,
      worldEntity.y
    );
    return new Set(nearbyPlayers.map(p => p.id));
  }

  /**
   * Emits an idle state packet to an entity and its watchers.
   */
  emitEnteredIdleState(entityRef: EntityRef): void {
    const entityKey = this.spatialIndex.makeEntityKey(entityRef.type, entityRef.id);
    const packet = this.packetBuilder.buildEnteredIdleState(entityRef);

    // Send to self if player
    if (entityRef.type === EntityType.Player) {
      this.packetSender.sendToUser(entityRef.id, packet);
    }

    // Send to all watchers
    const watchers = this.viewerState.getWatchers(entityKey);
    for (const viewerId of watchers) {
      this.packetSender.sendToUser(viewerId, packet);
    }
  }

  /**
   * Gets the resource exhaustion tracker.
   */
  getResourceExhaustionTracker(): ResourceExhaustionTracker {
    return this.resourceExhaustionTracker;
  }

  /**
   * Encodes an entity reference to the format expected by ShowDamage packet.
   * Format: combines entity type and id into a single identifier.
   */
  private encodeEntityId(entityRef: EntityRef): number {
    // Protocol expects entity IDs that encode both type and id
    // EntityType is: 0=Environment, 1=Item, 2=NPC, 3=Player
    // Encode as: (type << 24) | id, allowing up to 16M entities per type
    return (entityRef.type << 24) | (entityRef.id & 0xFFFFFF);
  }
}
