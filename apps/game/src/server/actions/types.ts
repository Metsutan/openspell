import type { Socket } from "socket.io";
import type { PlayerState } from "../../world/PlayerState";
import type { World } from "../../world/World";
import type { PathfindingSystem } from "../systems/PathfindingSystem";
import type { MessageService } from "../services/MessageService";
import type { InventoryService } from "../services/InventoryService";
import type { TeleportService } from "../services/TeleportService";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { ItemManager } from "../../world/systems/ItemManager";
import type { MapLevel } from "../../world/Location";
import type { LineOfSightSystem } from "../../world/LineOfSight";
import type { SpatialIndexManager } from "../systems/SpatialIndexManager";
import type { NPCState, WorldEntityState } from "../state/EntityState";
import type { GroundItemState } from "../state/EntityState";
import { WorldEntityCatalog } from "../../world/entities/WorldEntityCatalog";
import type { ConversationService } from "../services/ConversationService";
import type { ShopSystem } from "../systems/ShopSystem";
import type { StateMachine } from "../StateMachine";
import { TargetingService } from "../services/TargetingService";
import type { WorldEntityActionService } from "../services/WorldEntityActionService";
import type { EventBus } from "../events/EventBus";
import type { BankingService } from "../services/BankingService";
import type { EquipmentService } from "../services/EquipmentService";
import type { PickpocketService } from "../services/PickpocketService";
import type { WoodcuttingService } from "../services/WoodcuttingService";
import type { FishingService } from "../services/FishingService";
import type { HarvestingService } from "../services/HarvestingService";
import type { MiningService } from "../services/MiningService";
import type { DelaySystem } from "../systems/DelaySystem";
import type { ItemInteractionService } from "../services/ItemInteractionService";
import type { SkillingMenuService } from "../services/SkillingMenuService";
import type { PacketAuditService } from "../services/PacketAuditService";
import type { ItemAuditService } from "../services/ItemAuditService";
import type { AntiCheatRealtimeService } from "../services/AntiCheatRealtimeService";
import type { SpellCatalog } from "../../world/spells/SpellCatalog";
import type { ExperienceService } from "../services/ExperienceService";
import type { WorldEntityLootService } from "../services/WorldEntityLootService";
import type { ResourceExhaustionTracker } from "../systems/ResourceExhaustionTracker";
import type { InstancedNpcService } from "../services/InstancedNpcService";
import type { TradingService } from "../services/TradingService";
import type { ChangeAppearanceService } from "../services/ChangeAppearanceService";
import type { ShakingService } from "../services/ShakingService";
import type { TreasureMapService } from "../services/TreasureMapService";

/**
 * Context passed to client action handlers, providing access to necessary systems
 * without exposing the entire GameServer instance.
 */
export interface ActionContext {
  /** The socket connection for this player */
  socket: Socket;
  
  /** The user ID of the connected player (null if not authenticated) */
  userId: number | null;

  /** Current server tick (for respawn timers, cooldowns, etc.) */
  currentTick: number;

  // System references
  playerStatesByUserId: Map<number, PlayerState>;
  npcStates: Map<number, NPCState>;
  groundItemStates: Map<number, GroundItemState>;
  worldEntityStates: Map<number, WorldEntityState>;
  spatialIndex: SpatialIndexManager;
  world: World;
  pathfindingSystem: PathfindingSystem;
  stateMachine: StateMachine;
  delaySystem: DelaySystem;
  messageService: MessageService;
  inventoryService: InventoryService;
  equipmentService: EquipmentService;
  targetingService: TargetingService;
  teleportService: TeleportService;
  conversationService: ConversationService;
  shopSystem: ShopSystem;
  worldEntityActionService: WorldEntityActionService;
  worldEntityLootService: WorldEntityLootService | null;
  instancedNpcService: InstancedNpcService | null;
  bankingService: BankingService;
  pickpocketService: PickpocketService | null;
  woodcuttingService: WoodcuttingService | null;
  fishingService: FishingService | null;
  harvestingService: HarvestingService | null;
  miningService: MiningService | null;
  shakingService: ShakingService | null;
  itemInteractionService: ItemInteractionService;
  skillingMenuService: SkillingMenuService;
  eventBus: EventBus;
  resourceExhaustionTracker: ResourceExhaustionTracker;
  itemCatalog: ItemCatalog | null;
  itemManager: ItemManager | null;
  spellCatalog: SpellCatalog | null;
  packetAudit: PacketAuditService | null;
  itemAudit: ItemAuditService | null;
  antiCheatRealtime: AntiCheatRealtimeService | null;
  experienceService: ExperienceService;
  tradingService: TradingService;
  changeAppearanceService: ChangeAppearanceService;
  treasureMapService?: TreasureMapService | null;
  /** Line of sight system for checking projectile paths and visibility */
  losSystem: LineOfSightSystem | null;
  worldEntityCatalog: WorldEntityCatalog | null;
  /** Enqueue a message to a specific user */
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  
  /** Enqueue a broadcast message */
  enqueueBroadcast: (action: number, payload: unknown[]) => void;

  /** Schedule a graceful server shutdown countdown */
  scheduleServerShutdown: (minutes: number, requestedByUserId?: number) => { scheduled: boolean; reason?: string };
}

/**
 * A client action handler function.
 * Receives the action context and the raw action data payload.
 * 
 * @param ctx - Action context with utilities and system references
 * @param actionData - Raw action data from the client (needs decoding)
 * @returns Promise or void
 */
export type ActionHandler = (ctx: ActionContext, actionData: unknown) => Promise<void> | void;

/**
 * Client action definition with metadata.
 */
export interface ActionDefinition {
  /** Handler function */
  handler: ActionHandler;
  
  /** Whether this action requires authentication (userId must be set) */
  requiresAuth?: boolean;
  
  /** Description for documentation/debugging */
  description?: string;
}
