import { States } from "../../protocol/enums/States";
import { MAP_LEVELS, type MapLevel } from "../../world/Location";
import type { EntityCatalog } from "../../world/entities/EntityCatalog";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { WorldEntityCatalog } from "../../world/entities/WorldEntityCatalog";
import type { NPCState, GroundItemState, WorldEntityState, NPCCombatStat } from "../state/EntityState";
import type { SpatialIndexManager } from "../systems/SpatialIndexManager";

export interface StateLoaderServiceConfig {
  entityCatalog: EntityCatalog;
  itemCatalog: ItemCatalog;
  worldEntityCatalog: WorldEntityCatalog;
  spatialIndex: SpatialIndexManager;
}

/**
 * Service for loading and initializing game entity states.
 * Handles NPCs, ground items, and world entities (trees, rocks, etc.).
 */
export class StateLoaderService {
  constructor(private readonly config: StateLoaderServiceConfig) {}

  /**
   * Loads all NPC states from the entity catalog and adds them to the spatial index.
   * 
   * @param npcStates Map to populate with NPC states
   */
  loadNpcStates(npcStates: Map<number, NPCState>) {
    for (const instance of this.config.entityCatalog.getInstances()) {
      const definition = this.config.entityCatalog.getDefinitionById(instance.definitionId);
      if (!definition) continue;

      const position = instance.getPosition();
      
      // Initialize idle delay calculation
      const eagerness = definition.moveEagerness ?? 0;
      const normalizedEagerness = !Number.isFinite(eagerness) ? 0 : Math.max(0, Math.min(1, eagerness));
      const minMs = 600;
      const maxMs = 15_000;
      const baseMs = maxMs + (minMs - maxMs) * normalizedEagerness;
      const jitter = 0.7 + Math.random() * 0.6;
      const idleDelayMs = Math.max(1, Math.round(baseMs * jitter));
      const nextWanderAtMs = normalizedEagerness > 0 ? Date.now() + idleDelayMs : Number.POSITIVE_INFINITY;
      
      const aggroRadius = definition.combat?.aggroRadius ?? 0;
      
      const state: NPCState = {
        id: instance.id,
        definitionId: instance.definitionId,
        definition,
        mapLevel: position.mapLevel as MapLevel,
        x: position.x,
        y: position.y,
        respawnX: position.x,  // Store initial spawn position
        respawnY: position.y,  // Store initial spawn position
        movementArea: instance.movementArea,
        conversationId: instance.conversationId,
        shopId: Array.isArray(instance.shopId) ? instance.shopId[0] : instance.shopId,
        hitpointsLevel: definition.combat?.hitpoints ?? 1,
        accuracyLevel: definition.combat?.accuracy ?? 1,
        strengthLevel: definition.combat?.strength ?? 1,
        defenseLevel: definition.combat?.defense ?? 1,
        magicLevel: definition.combat?.magic ?? 1,
        rangeLevel: definition.combat?.range ?? 1,
        boostedStats: new Set<NPCCombatStat>(),
        currentState: States.IdleState,
        nextWanderAtMs,
        aggroRadius,
        aggroTarget: null,
        aggroDroppedTargetId: null,
        combatDelay: 0
      };
      
      npcStates.set(state.id, state);
      
      // Add to unified spatial index
      this.config.spatialIndex.addNPC({
        id: state.id,
        definitionId: state.definitionId,
        mapLevel: state.mapLevel,
        x: state.x,
        y: state.y,
        hitpointsLevel: state.hitpointsLevel,
        currentState: state.currentState,
        aggroRadius: state.aggroRadius
      });
    }
  }

  /**
   * Loads all ground item states from the item catalog and adds them to the spatial index.
   * All ground items start as present and visible to all players.
   * 
   * @param groundItemStates Map to populate with ground item states
   */
  loadGroundItemStates(groundItemStates: Map<number, GroundItemState>) {
    for (const instance of this.config.itemCatalog.getGroundItems()) {
      const state: GroundItemState = {
        id: instance.id,
        itemId: instance.itemId,
        isIOU: instance.isIOU,
        amount: instance.amount,
        respawnTicks: instance.respawnTicks,
        mapLevel: instance.mapLevel,
        x: instance.x,
        y: instance.y,
        isPresent: true,
        respawnAtTick: null,
        despawnTicks: 0, // World spawn items don't despawn
        despawnAtTick: null,
        visibleToUserId: null, // World spawn items are visible to all immediately
        visibleToAllAtTick: null
      };
      
      groundItemStates.set(state.id, state);
      
      // Add to unified spatial index
      this.config.spatialIndex.addItem({
        id: state.id,
        itemId: state.itemId,
        isIOU: state.isIOU,
        amount: state.amount,
        mapLevel: state.mapLevel,
        x: state.x,
        y: state.y,
        isPresent: true,
        visibleToUserId: null // World spawn items are visible to all immediately
      });
    }
  }

  /**
   * Loads all world entity states from the world entity catalog and adds them to the spatial index.
   * World entities are environment objects (trees, rocks, doors, etc.) that can be targeted.
   * 
   * @param worldEntityStates Map to populate with world entity states
   */
  loadWorldEntityStates(worldEntityStates: Map<number, WorldEntityState>) {
    for (const instance of this.config.worldEntityCatalog.getInstances()) {
      const definition = this.config.worldEntityCatalog.getDefinitionByType(instance.type);
      if (!definition) continue;

      // Calculate initial resources for harvestable entities
      let resourcesRemaining: number | null = null;
      if (definition.maxResourcesPerSpawn !== null && definition.minResourcesPerSpawn !== null) {
        // Random initial resource count between min and max
        const range = definition.maxResourcesPerSpawn - definition.minResourcesPerSpawn;
        resourcesRemaining = definition.minResourcesPerSpawn + Math.floor(Math.random() * (range + 1));
      }

      const state: WorldEntityState = {
        id: instance.id,
        definitionId: definition.id,
        definition,
        type: instance.type,
        mapLevel: instance.mapLevel,
        x: instance.x,
        y: instance.z,
        length: instance.length,
        width: instance.width,
        resourcesRemaining,
        respawnAtTick: null
      };
      
      worldEntityStates.set(state.id, state);
      
      // Add to unified spatial index
      this.config.spatialIndex.addWorldEntity({
        id: state.id,
        definitionId: state.definitionId,
        type: state.type,
        mapLevel: state.mapLevel,
        x: state.x,
        y: state.y,
        resourcesRemaining: state.resourcesRemaining
      });
    }
  }
}
