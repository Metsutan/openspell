import http from "http";
import https from "https";
import express from "express";
import { Server as SocketIOServer, type Socket } from "socket.io";
import fs from "fs";
import path from "path";

import {
  connectDb,
  disconnectDb,
  sendWorldHeartbeat,
  recomputeHiscores,
  removeOnlinePresenceByServerId,
  getActiveAccountBansForUserIds
} from "../db";
import { GameAction } from "../protocol/enums/GameAction";
import { ClientActionTypes, isClientActionType, type ClientActionType } from "../protocol/enums/ClientActionType";
import { EntityType } from "../protocol/enums/EntityType";
import { ClientActionPayload, decodeClientActionPayload } from "../protocol/packets/actions/ClientAction";
import { buildLoggedOutPayload } from "../protocol/packets/actions/LoggedOut";
import { buildServerShutdownCountdownPayload } from "../protocol/packets/actions/ServerShutdownCountdown";
import { World } from "../world/World";
import { MAP_LEVELS, type MapLevel } from "../world/Location";
import { PlayerState } from "../world/PlayerState";
import { PlayerPersistenceManager } from "./services/PlayerPersistenceManager";
import { InventoryService } from "./services/InventoryService";
import { EquipmentService } from "./services/EquipmentService";
import { LoginService } from "./services/LoginService";
import { MessageService } from "./services/MessageService";
import { TargetingService } from "./services/TargetingService";
import { TradingService } from "./services/TradingService";
import { ChangeAppearanceService } from "./services/ChangeAppearanceService";
import { TeleportService } from "./services/TeleportService";
import { ConnectionService } from "./services/ConnectionService";
import { StateLoaderService } from "./services/StateLoaderService";
import { ConversationService } from "./services/ConversationService";
import { WorldEntityActionService } from "./services/WorldEntityActionService";
import { InGameClock } from "../world/InGameClock";
import { ConversationCatalog } from "../world/conversations/ConversationCatalog";
import { ShopCatalog } from "../world/shops/ShopCatalog";

// Event-driven systems
import { EventBus } from "./events/EventBus";
import {
  type EntityRef,
} from "./events/GameEvents";
import {
  SpatialIndexManager,
} from "./systems/SpatialIndexManager";
import { VisibilitySystem, type PacketSender, type OutgoingPacket } from "./systems/VisibilitySystem";
import { DefaultPacketBuilder } from "./systems/PacketBuilder";
import { EnvironmentSystem } from "./systems/EnvironmentSystem";
import { ResourceExhaustionTracker } from "./systems/ResourceExhaustionTracker";
import { AggroSystem } from "./systems/AggroSystem";
import { PathfindingSystem, type MovementPlan } from "./systems/PathfindingSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { FollowSystem } from "./systems/FollowSystem";
import { AbilitySystem } from "./systems/AbilitySystem";
import { RegenerationSystem } from "./systems/RegenerationSystem";
import { ShopSystem } from "./systems/ShopSystem";
import { CombatSystem } from "./systems/CombatSystem";
import { DeathSystem } from "./systems/DeathSystem";
import { DelaySystem } from "./systems/DelaySystem";
import { WoodcuttingSystem } from "./systems/WoodcuttingSystem";
import { FishingSystem } from "./systems/FishingSystem";
import { HarvestingSystem } from "./systems/HarvestingSystem";
import { MiningSystem } from "./systems/MiningSystem";
import { BankingService } from "./services/BankingService";
import { DamageService } from "./services/DamageService";
import { ExperienceService } from "./services/ExperienceService";
import { MonsterDropService } from "./services/MonsterDropService";
import { TreasureMapService } from "./services/TreasureMapService";
import { PlayerDeathDropService } from "./services/PlayerDeathDropService";
import { PickpocketService } from "./services/PickpocketService";
import { WoodcuttingService } from "./services/WoodcuttingService";
import { FishingService } from "./services/FishingService";
import { HarvestingService } from "./services/HarvestingService";
import { MiningService } from "./services/MiningService";
import { CookingService } from "./services/CookingService";
import { EnchantingService } from "./services/EnchantingService";
import { ItemInteractionService } from "./services/ItemInteractionService";
import { SkillingMenuService } from "./services/SkillingMenuService";
import { WorldEntityLootService } from "./services/WorldEntityLootService";
import { InstancedNpcService } from "./services/InstancedNpcService";
import { ShakingService } from "./services/ShakingService";
import { PacketAuditService } from "./services/PacketAuditService";
import { ItemAuditService } from "./services/ItemAuditService";
import { ChatAuditService } from "./services/ChatAuditService";
import { AntiCheatRealtimeService } from "./services/AntiCheatRealtimeService";
import { AntiCheatAnalyzerService } from "./services/AntiCheatAnalyzerService";
import {
  EntityCatalog
} from "../world/entities/EntityCatalog";
import { ItemCatalog, type GroundItemInstance, type ItemDefinition } from "../world/items/ItemCatalog";
import { SpellCatalog } from "../world/spells/SpellCatalog";
import { ItemManager } from "../world/systems/ItemManager";
import {
  WorldEntityCatalog,
} from "../world/entities/WorldEntityCatalog";
import { WorldModel, type PathingGrid } from "../world/WorldModel";
import { LineOfSightSystem } from "../world/LineOfSight";
import { dispatchClientAction } from "./actions";
import type { ActionContext } from "./actions";
import { StateMachine, type StateMachineContext } from "./StateMachine";
import type { NPCState, GroundItemState, WorldEntityState, TrackedEntityState } from "./state/EntityState";
import { MessageStyle } from "../protocol/enums/MessageStyle";

const PATHING_LAYER_BY_MAP_LEVEL: Record<MapLevel, string> = {
  [MAP_LEVELS.Underground]: "earthunderground",
  [MAP_LEVELS.Overworld]: "earthoverworld",
  [MAP_LEVELS.Sky]: "earthsky"
};

type GameServerConfig = {
  port: number;
  useHttps: boolean;
  sslCertPath?: string;
  sslKeyPath?: string;
  tickMs: number;
  serverId?: number;
};

type PendingDisconnect = {
  userId: number;
  username: string;
  disconnectedAtMs: number;
  forceLogoutAtMs: number;
};

export class GameServer {
  private readonly app = express();
  private readonly server: http.Server | https.Server;
  private readonly io: SocketIOServer;
  private readonly world: World;
  private readonly dbEnabled: boolean;
  private readonly clock: InGameClock;
  private tickTimer: NodeJS.Timeout | null = null;
  private tick = 0;

  private readonly socketsByUserId = new Map<number, Socket>();
  private readonly playerStatesByUserId = new Map<number, PlayerState>();
  private entityCatalog: EntityCatalog | null = null;
  private itemCatalog: ItemCatalog | null = null;
  private spellCatalog: SpellCatalog | null = null;
  private worldEntityCatalog: WorldEntityCatalog | null = null;
  private conversationCatalog: ConversationCatalog | null = null;
  private shopCatalog: ShopCatalog | null = null;
  private itemManager: ItemManager | null = null;
  private readonly usernamesByUserId = new Map<number, string>();
  private readonly npcStates = new Map<number, NPCState>();
  private readonly groundItemStates = new Map<number, GroundItemState>();
  private readonly worldEntityStates = new Map<number, WorldEntityState>();
  private readonly movementPlans = new Map<string, MovementPlan>();
  private readonly pathingGridCache = new Map<MapLevel, PathingGrid>();
  private worldModel: WorldModel | null = null;
  private losSystem: LineOfSightSystem | null = null;
  private readonly playerPersistence: PlayerPersistenceManager;
  private readonly stateMachine: StateMachine;
  private static readonly NPC_MAX_MOVE_ATTEMPTS_PER_TICK = 6;
  private static readonly DISCONNECT_SAVE_TIMEOUT_MS = 2_000;
  private static readonly DISCONNECT_BASE_LOGOUT_DELAY_MS = 10_000;
  private static readonly DISCONNECT_COMBAT_RESET_DELAY_MS = 10_000;
  private static readonly DISCONNECT_COMBAT_LOGOUT_MAX_MS = 60_000;
  private readonly serverId: number;
  private readonly pendingDisconnectsByUserId = new Map<number, PendingDisconnect>();

  // Idle/AFK detection
  private readonly lastActivityTickByUserId = new Map<number, number>();
  private readonly idleWarningsSentToUserId = new Set<number>();
  private static readonly IDLE_WARNING_TICKS = 1400; // 14 minutes
  private static readonly IDLE_DISCONNECT_TICKS = 1500; // 15 minutes
  private static readonly BAN_ENFORCEMENT_INTERVAL_MS = 30_000;
  private readonly banEnforcementIntervalTicks: number;
  private banEnforcementInFlight = false;

  // Throttle repeated protocol action failures to avoid log spam
  private protocolErrorThrottleLastMs = 0;
  private protocolErrorThrottleCount = 0;
  private static readonly PROTOCOL_ERROR_THROTTLE_MS = 10_000;

  // Event-driven systems
  private readonly eventBus: EventBus;
  private readonly spatialIndex: SpatialIndexManager;
  private readonly resourceExhaustionTracker: ResourceExhaustionTracker;
  private readonly visibilitySystem: VisibilitySystem;
  private readonly packetBuilder: DefaultPacketBuilder;
  private readonly environmentSystem: EnvironmentSystem;
  private readonly aggroSystem: AggroSystem;
  private readonly pathfindingSystem: PathfindingSystem;
  private readonly movementSystem: MovementSystem;
  private readonly followSystem: FollowSystem;
  private readonly abilitySystem: AbilitySystem;
  private readonly regenerationSystem: RegenerationSystem;
  private readonly packetAudit: PacketAuditService | null;
  private readonly itemAudit: ItemAuditService | null;
  private readonly chatAudit: ChatAuditService | null;
  private readonly antiCheatRealtime: AntiCheatRealtimeService | null;
  private readonly antiCheatAnalyzer: AntiCheatAnalyzerService | null;
  private delaySystem!: DelaySystem;
  private shopSystem!: ShopSystem;
  private combatSystem!: CombatSystem;
  private deathSystem!: DeathSystem;
  private woodcuttingSystem!: WoodcuttingSystem;
  private fishingSystem!: FishingSystem;
  private harvestingSystem!: HarvestingSystem;
  private miningSystem!: MiningSystem;
  private monsterDropService!: MonsterDropService;
  private treasureMapService!: TreasureMapService;
  private playerDeathDropService!: PlayerDeathDropService;
  private pickpocketService!: PickpocketService | null;
  private woodcuttingService!: WoodcuttingService | null;
  private fishingService!: FishingService | null;
  private harvestingService!: HarvestingService | null;
  private miningService!: MiningService | null;
  private shakingService!: ShakingService | null;
  private cookingService!: CookingService;
  private enchantingService!: EnchantingService;
  private itemInteractionService!: ItemInteractionService;
  private damageService!: DamageService;
  private experienceService!: ExperienceService;
  private skillingMenuService!: SkillingMenuService;
  private worldEntityLootService!: WorldEntityLootService | null;
  private instancedNpcService!: InstancedNpcService | null;

  // Graceful shutdown
  private shutdownInProgress = false;
  private shutdownTimer: NodeJS.Timeout | null = null;
  private readonly shutdownHandlers: Array<() => void> = [];

  // Service layer
  private inventoryService!: InventoryService;
  private equipmentService!: EquipmentService;
  private loginService!: LoginService;
  private messageService!: MessageService;
  private targetingService!: TargetingService;
  private tradingService!: TradingService;
  private changeAppearanceService!: ChangeAppearanceService;
  private teleportService!: TeleportService;
  private connectionService!: ConnectionService;
  private stateLoaderService!: StateLoaderService;
  private conversationService!: ConversationService;
  private worldEntityActionService!: WorldEntityActionService;
  private bankingService!: BankingService;

  // Aggro system constants
  private static readonly AGGRO_CHECK_INTERVAL_TICKS = 2; // Check aggro every N ticks
  private static readonly PURSUIT_STEP_INTERVAL_TICKS = 1; // How often to step toward target

  // /**
  //  * Tracks settings that changed this tick and need confirmation packets sent.
  //  * Keyed by userId, value is a Set of PlayerSetting enums that changed.
  //  * Flushed once per tick in runServerTick before swapping outgoing buffers.
  //  */
  // private readonly pendingSettingConfirmations = new Map<number, Set<PlayerSetting>>();

  private outgoingNow: Array<
    | { target: "broadcast"; action: GameAction; payload: unknown[] }
    | { target: "user"; userId: number; action: GameAction; payload: unknown[] }
  > = [];
  private outgoingNext: Array<
    | { target: "broadcast"; action: GameAction; payload: unknown[] }
    | { target: "user"; userId: number; action: GameAction; payload: unknown[] }
  > = [];

  constructor(private readonly config: GameServerConfig) {
    this.dbEnabled = !!process.env.DATABASE_URL;
    this.world = new World(config.tickMs);
    this.clock = new InGameClock({ initialHour: 1, msPerHour: 150_000 });
    this.serverId = this.parseServerId(config.serverId ?? process.env.SERVER_ID);
    this.banEnforcementIntervalTicks = Math.max(
      1,
      Math.floor(GameServer.BAN_ENFORCEMENT_INTERVAL_MS / Math.max(1, config.tickMs))
    );
    this.playerPersistence = new PlayerPersistenceManager(this.dbEnabled, this.playerStatesByUserId, this.serverId);
    this.antiCheatRealtime = new AntiCheatRealtimeService(this.serverId, this.dbEnabled);
    this.antiCheatAnalyzer = new AntiCheatAnalyzerService(this.serverId, this.dbEnabled);
    this.packetAudit = new PacketAuditService(this.serverId, this.dbEnabled, {
      onInvalidPacket: (input) => {
        this.antiCheatRealtime?.recordInvalidPacket(input.userId ?? null, input.packetName, input.reason);
      }
    });
    this.itemAudit = new ItemAuditService(this.serverId, this.dbEnabled, {
      onItemDrop: (input) => {
        if (input.dropperUserId) {
          this.antiCheatRealtime?.recordItemDrop({
            userId: input.dropperUserId,
            itemId: input.itemId,
            amount: input.amount,
            groundItemId: input.groundItemId ?? null
          });
        }
      },
      onItemPickup: (input) => {
        this.antiCheatRealtime?.recordItemPickup({
          pickerUserId: input.pickerUserId,
          dropperUserId: input.dropperUserId ?? null,
          itemId: input.itemId,
          amount: input.amount
        });
      },
      onTradeItemTransfer: (input) => {
        this.antiCheatRealtime?.recordTradeTransfer({
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
          itemId: input.itemId,
          amount: input.amount
        });
      }
    });
    this.chatAudit = new ChatAuditService(this.serverId, this.dbEnabled);
    // Initialize event-driven systems
    this.eventBus = new EventBus();
    this.spatialIndex = new SpatialIndexManager();
    this.packetBuilder = new DefaultPacketBuilder();
    this.stateMachine = new StateMachine(this.createStateMachineContext());

    // Create packet sender adapter (will be connected after io is created)
    const packetSender: PacketSender = {
      sendToUser: (userId: number, packet: OutgoingPacket) => {
        this.enqueueUserMessage(userId, packet.action, packet.payload);
      },
      broadcast: (packet: OutgoingPacket) => {
        this.enqueueBroadcast(packet.action, packet.payload);
      }
    };

    // Initialize resource exhaustion tracker before visibility system
    this.resourceExhaustionTracker = new ResourceExhaustionTracker(packetSender);

    this.visibilitySystem = new VisibilitySystem({
      spatialIndex: this.spatialIndex,
      eventBus: this.eventBus,
      packetSender,
      packetBuilder: this.packetBuilder,
      resourceExhaustionTracker: this.resourceExhaustionTracker
    });

    this.environmentSystem = new EnvironmentSystem({
      clock: this.clock,
      tickMs: config.tickMs,
      onBroadcast: (action, payload) => this.enqueueBroadcast(action, payload)
    });

    // Initialize TargetingService before AggroSystem (AggroSystem depends on it)
    this.targetingService = new TargetingService({
      eventBus: this.eventBus,
      playerStatesByUserId: this.playerStatesByUserId,
      npcStates: this.npcStates,
      spatialIndexManager: this.spatialIndex
    });

    this.aggroSystem = new AggroSystem({
      npcStates: this.npcStates,
      spatialIndex: this.spatialIndex,
      targetingService: this.targetingService
    });

    this.pathfindingSystem = new PathfindingSystem({
      npcStates: this.npcStates,
      playerStates: this.playerStatesByUserId,
      movementPlans: this.movementPlans,
      aggroSystem: this.aggroSystem,
      targetingService: this.targetingService,
      stateMachine: this.stateMachine,
      worldModel: null, // Will be set in start()
      pathingGridCache: this.pathingGridCache,
      pathingLayerByMapLevel: PATHING_LAYER_BY_MAP_LEVEL,
      makeEntityKey: (entityRef: EntityRef) => this.makeEntityKey(entityRef),
      losSystem: null, // Will be set in start()
      spellCatalog: null // Will be set in start()
    });

    this.movementSystem = new MovementSystem({
      movementPlans: this.movementPlans,
      playerStates: this.playerStatesByUserId,
      npcStates: this.npcStates,
      spatialIndex: this.spatialIndex,
      stateMachine: this.stateMachine,
      eventBus: this.eventBus,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      makeEntityKey: (entityRef: EntityRef) => this.makeEntityKey(entityRef),
      worldModel: null, // Will be set in start()
      pathingLayerByMapLevel: PATHING_LAYER_BY_MAP_LEVEL,
      losSystem: null // Will be set in start()
    });

    this.followSystem = new FollowSystem({
      playerStates: this.playerStatesByUserId,
      targetingService: this.targetingService,
      getTradingService: () => this.tradingService,
      pathfindingSystem: this.pathfindingSystem,
      movementSystem: this.movementSystem,
      stateMachine: this.stateMachine,
      getMessageService: () => this.messageService,
      getSpellCatalog: () => this.spellCatalog,
      hasLineOfSight: (fromX, fromY, toX, toY, mapLevel) => {
        if (!this.losSystem) return true;
        return this.losSystem.checkLOS(fromX, fromY, toX, toY, mapLevel as MapLevel).hasLOS;
      }
    });

    this.abilitySystem = new AbilitySystem({
      playerStates: this.playerStatesByUserId,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload)
    });

    this.regenerationSystem = new RegenerationSystem({
      playerStatesByUserId: this.playerStatesByUserId,
      npcStates: this.npcStates,
      eventBus: this.eventBus,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload)
    });

    this.app.get("/health", (_req, res) => {
      res.json({ ok: true });
    });

    this.server = this.buildNodeServer();
    this.io = new SocketIOServer(this.server, {
      cors: { origin: "*" },
      allowUpgrades: true,
      transports: ["polling", "websocket"],
      pingInterval: 25_000,
      pingTimeout: 20_000,
      maxHttpBufferSize: 1_000_000
    });

    this.io.on("connection", (socket) => this.manageConnection(socket));
    if (this.config.serverId) {
      sendWorldHeartbeat(this.config.serverId);
    }
  }

  private parseServerId(value: unknown): number {
    const n = Number(value);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return 1;
    return n;
  }

  async start() {
    // Register crash handlers early so they're active during initialization
    this.registerCrashHandlers();

    try {
      this.worldModel = await WorldModel.initialize();
      // Initialize LOS system
      this.losSystem = new LineOfSightSystem(this.worldModel);
      // Update pathfinding system with world model and LOS system
      (this.pathfindingSystem as any).config.worldModel = this.worldModel;
      (this.pathfindingSystem as any).config.losSystem = this.losSystem;
      // Update movement system with world model and LOS system
      (this.movementSystem as any).config.worldModel = this.worldModel;
      (this.movementSystem as any).config.losSystem = this.losSystem;
    } catch (err) {
      console.error("[world] failed to initialize pathfinding data (movement will fallback):", err);
    }
    this.entityCatalog = await EntityCatalog.load();
    this.itemCatalog = await ItemCatalog.load();
    this.antiCheatRealtime?.setItemCatalog(this.itemCatalog);
    this.spellCatalog = await SpellCatalog.load();
    (this.pathfindingSystem as any).config.spellCatalog = this.spellCatalog;
    this.worldEntityCatalog = await WorldEntityCatalog.load();
    this.conversationCatalog = await ConversationCatalog.load();
    this.shopCatalog = await ShopCatalog.load();

    // Initialize world entity action service
    this.worldEntityActionService = new WorldEntityActionService();
    await this.worldEntityActionService.initialize();

    // Initialize world entity loot service (search/picklock loot definitions)
    try {
      this.worldEntityLootService = await WorldEntityLootService.load();
    } catch (error) {
      console.error("[GameServer] Failed to load WorldEntityLootService:", error);
      this.worldEntityLootService = null;
    }

    // Set item catalog for weight calculations in persistence manager
    this.playerPersistence.setItemCatalog(this.itemCatalog);



    // Initialize ItemManager after catalogs are loaded
    this.itemManager = new ItemManager(
      this.itemCatalog,
      this.spatialIndex,
      this.eventBus,
      this.groundItemStates
    );

    // Initialize services after catalogs are loaded
    this.inventoryService = new InventoryService({
      itemCatalog: this.itemCatalog,
      itemManager: this.itemManager,
      playerStatesByUserId: this.playerStatesByUserId,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      enqueueBroadcast: (action, payload) => this.enqueueBroadcast(action, payload),
      itemAudit: this.itemAudit
    });

    this.equipmentService = new EquipmentService({
      itemCatalog: this.itemCatalog,
      playerStatesByUserId: this.playerStatesByUserId,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      eventBus: this.eventBus,
      stateMachine: this.stateMachine,
      packetAudit: this.packetAudit
    });

    this.loginService = new LoginService({
      dbEnabled: this.dbEnabled,
      clock: this.clock,
      playerStatesByUserId: this.playerStatesByUserId
    });

    this.messageService = new MessageService({
      playerStatesByUserId: this.playerStatesByUserId,
      visibilitySystem: this.visibilitySystem,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      enqueueBroadcast: (action, payload) => this.enqueueBroadcast(action, payload),
      chatAudit: this.chatAudit
    });

    // Initialize delay system for timed player actions (pickpocket, stun, etc.)
    this.delaySystem = new DelaySystem({
      playerStatesByUserId: this.playerStatesByUserId,
      stateMachine: this.stateMachine,
      messageService: this.messageService
    });

    // Note: targetingService is now initialized in constructor before AggroSystem
    this.tradingService = new TradingService({
      playerStatesByUserId: this.playerStatesByUserId,
      targetingService: this.targetingService,
      delaySystem: this.delaySystem,
      inventoryService: this.inventoryService,
      itemCatalog: this.itemCatalog!,
      stateMachine: this.stateMachine,
      messageService: this.messageService,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      getLineOfSightSystem: () => this.losSystem,
      packetAudit: this.packetAudit,
      itemAudit: this.itemAudit
    });

    this.changeAppearanceService = new ChangeAppearanceService({
      playerStatesByUserId: this.playerStatesByUserId,
      inventoryService: this.inventoryService,
      messageService: this.messageService,
      stateMachine: this.stateMachine,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      enqueueBroadcast: (action, payload) => this.enqueueBroadcast(action, payload)
    });

    this.teleportService = new TeleportService({
      playerStatesByUserId: this.playerStatesByUserId,
      spatialIndex: this.spatialIndex,
      eventBus: this.eventBus,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      enqueueBroadcast: (action, payload) => this.enqueueBroadcast(action, payload),
      cancelMovementPlanForPlayer: (userId) => this.pathfindingSystem.deleteMovementPlan({ type: EntityType.Player, id: userId })
    });

    this.bankingService = new BankingService({
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      playerStatesByUserId: this.playerStatesByUserId
    });

    // Set banking service for bank autosave in persistence manager
    this.playerPersistence.setBankingService(this.bankingService);

    this.experienceService = new ExperienceService({
      enqueueUserMessage: (userId, action, payload) => {
        this.outgoingNext.push({ target: "user", userId, action, payload });
      },
      eventBus: this.eventBus,
      getPlayerPosition: (userId) => {
        const player = this.playerStatesByUserId.get(userId);
        if (!player) return null;
        return {
          mapLevel: player.mapLevel,
          x: player.x,
          y: player.y
        };
      }
    });

    this.skillingMenuService = new SkillingMenuService({
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      messageService: this.messageService,
      playerStatesByUserId: this.playerStatesByUserId,
      itemCatalog: this.itemCatalog!,
      inventoryService: this.inventoryService,
      experienceService: this.experienceService,
      delaySystem: this.delaySystem,
      stateMachine: this.stateMachine,
      eventBus: this.eventBus,
      packetAudit: this.packetAudit
    });

    this.treasureMapService = await TreasureMapService.load({
      playerStatesByUserId: this.playerStatesByUserId,
      eventBus: this.eventBus
    });
    this.playerPersistence.setTreasureMapService(this.treasureMapService);

    this.connectionService = new ConnectionService({
      dbEnabled: this.dbEnabled,
      world: this.world,
      eventBus: this.eventBus,
      loginService: this.loginService,
      playerPersistence: this.playerPersistence,
      socketsByUserId: this.socketsByUserId,
      playerStatesByUserId: this.playerStatesByUserId,
      usernamesByUserId: this.usernamesByUserId,
      inventoryService: this.inventoryService,
      bankingService: this.bankingService,
      skillingMenuService: this.skillingMenuService,
      changeAppearanceService: this.changeAppearanceService,
      treasureMapService: this.treasureMapService,
      equipmentService: this.equipmentService,
      delaySystem: this.delaySystem,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      enqueueBroadcast: (action, payload) => this.enqueueBroadcast(action, payload)
    });

    this.stateLoaderService = new StateLoaderService({
      entityCatalog: this.entityCatalog,
      itemCatalog: this.itemCatalog,
      worldEntityCatalog: this.worldEntityCatalog,
      spatialIndex: this.spatialIndex
    });

    this.shopSystem = new ShopSystem({
      shopCatalog: this.shopCatalog,
      playerStatesByUserId: this.playerStatesByUserId,
      messageService: this.messageService,
      inventoryService: this.inventoryService,
      enqueueUserMessage: this.enqueueUserMessage.bind(this),
      itemCatalog: this.itemCatalog,
      itemAudit: this.itemAudit,
      packetAudit: this.packetAudit
    });

    this.conversationService = new ConversationService({
      conversationCatalog: this.conversationCatalog,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      enqueueBroadcast: (action, payload) => this.enqueueBroadcast(action, payload),
      npcStates: this.npcStates,
      playerStatesByUserId: this.playerStatesByUserId,
      inventoryService: this.inventoryService,
      messageService: this.messageService,
      experienceService: this.experienceService,
      itemCatalog: this.itemCatalog,
      shopSystem: this.shopSystem,
      deleteMovementPlan: (entityRef) => this.pathfindingSystem.deleteMovementPlan(entityRef),
      targetingService: this.targetingService,
      stateMachine: this.stateMachine,
      changeAppearanceService: this.changeAppearanceService,
      getInstancedNpcService: () => this.instancedNpcService ?? null,
      teleportService: this.teleportService
    });

    this.damageService = new DamageService({
      itemCatalog: this.itemCatalog,
      spellCatalog: this.spellCatalog,
      eventBus: this.eventBus
    });

    this.cookingService = new CookingService({
      inventoryService: this.inventoryService,
      messageService: this.messageService,
      itemCatalog: this.itemCatalog,
      experienceService: this.experienceService,
      delaySystem: this.delaySystem,
      stateMachine: this.stateMachine,
      eventBus: this.eventBus,
      playerStatesByUserId: this.playerStatesByUserId,
      worldEntityStates: this.worldEntityStates,
      enqueueUserMessage: (userId: number, action: number, payload: unknown[]) =>
        this.enqueueUserMessage(userId, action, payload),
      packetAudit: this.packetAudit
    });

    this.enchantingService = new EnchantingService({
      inventoryService: this.inventoryService,
      messageService: this.messageService,
      experienceService: this.experienceService,
      itemCatalog: this.itemCatalog,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action as GameAction, payload)
    });

    this.itemInteractionService = new ItemInteractionService({
      inventoryService: this.inventoryService,
      messageService: this.messageService,
      itemCatalog: this.itemCatalog,
      cookingService: this.cookingService,
      enchantingService: this.enchantingService,
      experienceService: this.experienceService,
      worldEntityCatalog: this.worldEntityCatalog,
      playerStatesByUserId: this.playerStatesByUserId,
      eventBus: this.eventBus,
      delaySystem: this.delaySystem,
      stateMachine: this.stateMachine,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
      packetAudit: this.packetAudit
    });

    this.combatSystem = new CombatSystem({
      playerStates: this.playerStatesByUserId,
      npcStates: this.npcStates,
      spatialIndex: this.spatialIndex,
      losSystem: this.losSystem,
      damageService: this.damageService,
      inventoryService: this.inventoryService,
      equipmentService: this.equipmentService,
      itemManager: this.itemManager,
      spellCatalog: this.spellCatalog,
      targetingService: this.targetingService,
      experienceService: this.experienceService,
      stateMachine: this.stateMachine,
      messageService: this.messageService,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload)
    });

    // Initialize monster drop service for NPC loot
    this.monsterDropService = await MonsterDropService.load({
      itemManager: this.itemManager,
      entityCatalog: this.entityCatalog,
      treasureMapService: this.treasureMapService
    });

    // Initialize pickpocket service for pickpocketing NPCs
    try {
      this.pickpocketService = await PickpocketService.load({
        inventoryService: this.inventoryService,
        entityCatalog: this.entityCatalog,
        messageService: this.messageService,
        damageService: this.damageService,
        targetingService: this.targetingService,
        delaySystem: this.delaySystem,
        combatSystem: this.combatSystem,
        stateMachine: this.stateMachine,
        eventBus: this.eventBus,
        playerStatesByUserId: this.playerStatesByUserId,
        npcStates: this.npcStates,
        enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
        packetAudit: this.packetAudit
      });
    } catch (error) {
      console.error("[GameServer] Failed to load PickpocketService:", error);
      this.pickpocketService = null;
    }

    // Initialize shake service for tree shaking actions
    this.shakingService = new ShakingService({
      playerStatesByUserId: this.playerStatesByUserId,
      worldEntityStates: this.worldEntityStates,
      targetingService: this.targetingService,
      stateMachine: this.stateMachine,
      delaySystem: this.delaySystem,
      messageService: this.messageService,
      itemManager: this.itemManager,
      itemAudit: this.itemAudit,
      enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload)
    });

    // Initialize woodcutting service for chopping trees
    try {
      this.woodcuttingService = await WoodcuttingService.load({
        inventoryService: this.inventoryService,
        messageService: this.messageService,
        equipmentService: this.equipmentService,
        itemCatalog: this.itemCatalog,
        delaySystem: this.delaySystem,
        eventBus: this.eventBus,
        visibilitySystem: this.visibilitySystem,
        experienceService: this.experienceService,
        stateMachine: this.stateMachine,
        playerStatesByUserId: this.playerStatesByUserId,
        worldEntityStates: this.worldEntityStates,
        enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
        shakingService: this.shakingService
      });

      // Initialize woodcutting system for tick-based processing
      this.woodcuttingSystem = new WoodcuttingSystem({
        woodcuttingService: this.woodcuttingService,
        getCurrentTick: () => this.tick
      });
    } catch (error) {
      console.error("[GameServer] Failed to load WoodcuttingService:", error);
      throw error;
    }

    // Initialize fishing service for fishing spots
    try {
      this.fishingService = await FishingService.load({
        inventoryService: this.inventoryService,
        messageService: this.messageService,
        equipmentService: this.equipmentService,
        itemCatalog: this.itemCatalog,
        delaySystem: this.delaySystem,
        eventBus: this.eventBus,
        visibilitySystem: this.visibilitySystem,
        experienceService: this.experienceService,
        stateMachine: this.stateMachine,
        playerStatesByUserId: this.playerStatesByUserId,
        worldEntityStates: this.worldEntityStates,
        enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload)
      });

      this.fishingSystem = new FishingSystem({
        fishingService: this.fishingService,
        getCurrentTick: () => this.tick
      });
    } catch (error) {
      console.error("[GameServer] Failed to load FishingService:", error);
      throw error;
    }

    // Initialize harvesting service for plants/crops
    try {
      this.harvestingService = await HarvestingService.load({
        inventoryService: this.inventoryService,
        messageService: this.messageService,
        equipmentService: this.equipmentService,
        itemCatalog: this.itemCatalog,
        delaySystem: this.delaySystem,
        eventBus: this.eventBus,
        visibilitySystem: this.visibilitySystem,
        experienceService: this.experienceService,
        stateMachine: this.stateMachine,
        playerStatesByUserId: this.playerStatesByUserId,
        worldEntityStates: this.worldEntityStates,
        enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
        packetAudit: this.packetAudit
      });

      this.harvestingSystem = new HarvestingSystem({
        harvestingService: this.harvestingService,
        getCurrentTick: () => this.tick
      });
    } catch (error) {
      console.error("[GameServer] Failed to load HarvestingService:", error);
      throw error;
    }

    // Initialize mining service for rock nodes
    try {
      this.miningService = await MiningService.load({
        inventoryService: this.inventoryService,
        messageService: this.messageService,
        equipmentService: this.equipmentService,
        itemCatalog: this.itemCatalog,
        delaySystem: this.delaySystem,
        eventBus: this.eventBus,
        visibilitySystem: this.visibilitySystem,
        experienceService: this.experienceService,
        stateMachine: this.stateMachine,
        playerStatesByUserId: this.playerStatesByUserId,
        worldEntityStates: this.worldEntityStates,
        enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action, payload),
        packetAudit: this.packetAudit
      });

      this.miningSystem = new MiningSystem({
        miningService: this.miningService,
        getCurrentTick: () => this.tick
      });
    } catch (error) {
      console.error("[GameServer] Failed to load MiningService:", error);
      throw error;
    }

    // Initialize player death drop service for player death items
    this.playerDeathDropService = new PlayerDeathDropService({
      itemCatalog: this.itemCatalog,
      itemManager: this.itemManager,
      inventoryService: this.inventoryService,
      equipmentService: this.equipmentService,
      playerStatesByUserId: this.playerStatesByUserId,
      itemAudit: this.itemAudit
    });

    this.deathSystem = new DeathSystem({
      combatSystem: this.combatSystem,
      npcStates: this.npcStates,
      playerStates: this.playerStatesByUserId,
      eventBus: this.eventBus,
      targetingService: this.targetingService,
      spatialIndex: this.spatialIndex,
      stateMachine: this.stateMachine,
      teleportService: this.teleportService,
      monsterDropService: this.monsterDropService,
      playerDeathDropService: this.playerDeathDropService,
      delaySystem: this.delaySystem
    });

    // Load entity states using the service
    this.stateLoaderService.loadNpcStates(this.npcStates);
    this.stateLoaderService.loadGroundItemStates(this.groundItemStates);
    this.stateLoaderService.loadWorldEntityStates(this.worldEntityStates);

    try {
      this.instancedNpcService = await InstancedNpcService.load({
        entityCatalog: this.entityCatalog,
        npcStates: this.npcStates,
        spatialIndex: this.spatialIndex,
        eventBus: this.eventBus,
        targetingService: this.targetingService,
        getPlayerState: (userId) => this.playerStatesByUserId.get(userId) ?? null,
        cancelMovementPlan: (entityRef) => this.pathfindingSystem.deleteMovementPlan(entityRef),
        enqueueUserMessage: (userId, action, payload) => this.enqueueUserMessage(userId, action as GameAction, payload)
      });
      this.deathSystem.setInstancedNpcService(this.instancedNpcService);
    } catch (error) {
      console.error("[GameServer] Failed to load InstancedNpcService:", error);
      this.instancedNpcService = null;
      this.deathSystem.setInstancedNpcService(null);
    }

    if (this.dbEnabled) {
      await connectDb();

      // Clear stale presence for this shard from previous unclean exits.
      await this.cleanupServerOnlinePresence("startup");

      // CRITICAL: Preload skill ID cache at startup so shutdown doesn't have to wait for it
      console.log('[server] Preloading skill ID cache for fast shutdown saves...');
      await this.playerPersistence.preloadSkillCache();
      console.log('[server] Skill ID cache preloaded');

      this.playerPersistence.startAutosaveLoop();

      // Initialize banking service with database access
      const { getPrisma } = await import("../db");
      const prisma = getPrisma();
      await this.bankingService.initialize(prisma);

      this.antiCheatAnalyzer?.start();
    }

    this.beginTickLoop();

    await new Promise<void>((resolve, reject) => {
      this.server.listen(this.config.port, () => resolve());
      this.server.on("error", (err) => reject(err));
    });
  }

  async stop() {
    // Clean up all registered handlers
    for (const cleanup of this.shutdownHandlers) {
      cleanup();
    }
    this.shutdownHandlers.length = 0;

    this.endTickLoop();
    this.visibilitySystem.destroy();
    this.environmentSystem.reset();
    this.eventBus.clear();
    this.playerPersistence.stopAutosaveLoop();
    await this.cleanupServerOnlinePresence("stop");
    await disconnectDb();
    await new Promise<void>((resolve) => this.server.close(() => resolve()));
  }

  // Lifecycle & Server Control
  private beginTickLoop() {
    if (this.tickTimer) return;
    this.tick = 0;
    this.tickTimer = setInterval(() => this.runServerTick(), this.config.tickMs);
  }

  private endTickLoop() {
    if (!this.tickTimer) return;
    clearInterval(this.tickTimer);
    this.tickTimer = null;
    this.outgoingNow.length = 0;
    this.outgoingNext.length = 0;
  }

  private runServerTick() {
    // Input System - Handled immediately as it happens

    // Process Dying NPCs
    this.deathSystem.processDeath()

    // Delay System - Process timed delays (pickpocket, stun, etc.)
    this.delaySystem.update();

    // Aggro System
    this.aggroSystem.update();

    // Pathfinding System - Players (event-driven, so this is a placeholder)
    this.pathfindingSystem.updatePlayers();

    // Follow System (phase 0) - prevent stale follower plans from moving early
    this.followSystem.prepareForTick();

    // Movement System - Players
    this.movementSystem.updatePlayers();

    // Follow System (phase 1) - followers move after leaders in same tick
    this.followSystem.update();

    // Combat System - Player Combat (happens immediately after player movement)
    // This ensures players can attack immediately upon arrival before NPCs react
    this.combatSystem.processPlayerCombat();

    // Pathfinding System - NPCs (reacts to updated player positions and combat)
    this.pathfindingSystem.updateNPCs();

    // Movement System - NPCs
    this.movementSystem.updateNPCs();

    // Combat System - NPC Combat (happens after NPC movement)
    // NPCs attack after they've moved into position
    this.combatSystem.processNpcCombat();

    // Death System - Process respawns (right after combat)
    this.deathSystem.processRespawns();

    this.instancedNpcService?.update();

    // Pending Action System - Process environment actions (doors, etc.)
    this.processEnvironmentActions(); //todo: implement health and state regen.

    // Activity System - Skilling (woodcutting, mining, etc.)
    this.woodcuttingSystem.update();
    this.fishingSystem.update();
    this.harvestingSystem.update();
    this.miningSystem.update();


    // Respawn System/Despawn System
    if (this.itemManager) {
      this.itemManager.setCurrentTick(this.tick);
      this.itemManager.updateRespawns(this.tick);
    }

    // Status System

    // Environment System
    this.environmentSystem.update();

    // Shop System

    // Clean-up System

    // Visibility System

    // Regenerate Abilities
    this.abilitySystem.update();

    // Regenerate Skills/Stats
    this.regenerationSystem.update();

    // Restock Shops
    this.shopSystem.update();

    // Idle/AFK System - Check for inactive players
    this.checkIdlePlayers();
    this.processPendingDisconnects();

    // Account ban enforcement safety net for bans issued outside the game server.
    if (this.dbEnabled && this.tick % this.banEnforcementIntervalTicks === 0) {
      void this.enforceActiveAccountBans();
    }

    // Update Clients System
    const tmp = this.outgoingNow;
    this.outgoingNow = this.outgoingNext;
    this.outgoingNext = tmp;
    this.outgoingNext.length = 0;
    // Now flush everything that was queued (both during last tick AND between ticks)
    if (this.outgoingNow.length > 0) {
      this.flushQueuedPackets(this.outgoingNow);
    }
    this.world.update(++this.tick);

    // Update NPC aggro state (check for nearby players to aggro)
  }

  // Networking & Packet Queueing
  private enqueueBroadcast(action: GameAction, payload: unknown[]) {
    this.outgoingNext.push({ target: "broadcast", action, payload });
  }

  private enqueueUserMessage(userId: number, action: GameAction, payload: unknown[]) {
    this.outgoingNext.push({ target: "user", userId, action, payload });
  }


  private flushQueuedPackets(
    packets: Array<
      | { target: "broadcast"; action: GameAction; payload: unknown[] }
      | { target: "user"; userId: number; action: GameAction; payload: unknown[] }
    >
  ) {
    const broadcastActions: Array<{ action: GameAction; payload: unknown[] }> = [];
    const userActions = new Map<number, Array<{ action: GameAction; payload: unknown[] }>>();

    for (const packet of packets) {
      if (packet.target === "broadcast") {
        broadcastActions.push({ action: packet.action, payload: packet.payload });
      } else {
        const queue = userActions.get(packet.userId);
        if (queue) {
          queue.push({ action: packet.action, payload: packet.payload });
        } else {
          userActions.set(packet.userId, [{ action: packet.action, payload: packet.payload }]);
        }
      }
    }

    if (broadcastActions.length > 0) {
      const payload = this.composeGameStateUpdatePayload(broadcastActions);
      this.io.emit(GameAction.GameStateUpdate.toString(), payload);
    }

    for (const [userId, actions] of userActions.entries()) {
      const socket = this.socketsByUserId.get(userId);
      if (!socket) continue;
      const payload = this.composeGameStateUpdatePayload(actions);
      socket.emit(GameAction.GameStateUpdate.toString(), payload);
    }
  }

  private composeGameStateUpdatePayload(actions: Array<{ action: GameAction; payload: unknown[] }>): unknown[] {
    return actions.map((entry) => [entry.action, entry.payload]);
  }

  // Lifecycle & Server Control (continued)
  private buildNodeServer() {
    if (!this.config.useHttps) return http.createServer(this.app);

    const defaultCert = path.join(__dirname, "..", "..", "..", "certs", "localhost.pem");
    const defaultKey = path.join(__dirname, "..", "..", "..", "certs", "localhost-key.pem");
    const certPath = this.config.sslCertPath ?? process.env.SSL_CERT_PATH ?? defaultCert;
    const keyPath = this.config.sslKeyPath ?? process.env.SSL_KEY_PATH ?? defaultKey;

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      throw new Error(
        `USE_HTTPS=true but TLS files were not found.\n  SSL_CERT_PATH: ${certPath}\n  SSL_KEY_PATH:  ${keyPath}`
      );
    }

    const cert = fs.readFileSync(certPath);
    const key = fs.readFileSync(keyPath);
    return https.createServer({ cert, key }, this.app);
  }

  // Networking & Client Connection Handling
  private manageConnection(socket: Socket) {
    let connectedUserId: number | null = null;
    let connectedUsername: string | null = null;

    const cleanupConnectedUser = async () => {
      if (connectedUserId === null) return;
      const userId = connectedUserId;
      const username = connectedUsername ?? "";
      const logoutRequested = (socket.data as { logoutRequested?: boolean }).logoutRequested === true;
      (socket.data as { logoutRequested?: boolean }).logoutRequested = false;

      // Always detach socket and idle tracking immediately.
      this.socketsByUserId.delete(userId);
      this.lastActivityTickByUserId.delete(userId);
      this.idleWarningsSentToUserId.delete(userId);

      if (logoutRequested) {
        await this.performFullDisconnectCleanup(userId, username);
      } else {
        this.schedulePendingDisconnect(userId, username);
      }

      // Reset local state
      connectedUserId = null;
      connectedUsername = null;
    };

    // Server -> client: CanLogin, with ONE argument: empty array.
    socket.emit(GameAction.CanLogin.toString(), []);

    socket.on(GameAction.Login.toString(), async (payload: unknown) => {
      this.packetAudit?.logPacketTrace({
        userId: connectedUserId,
        serverId: this.serverId,
        packetNumber: GameAction.Login,
        packetName: "Login",
        payload
      });
      const result = await this.connectionService.handleLogin(socket, payload);
      if (result) {
        connectedUserId = result.userId;
        connectedUsername = result.username;
        this.pendingDisconnectsByUserId.delete(result.userId);
        // Track initial activity
        this.lastActivityTickByUserId.set(result.userId, this.tick);
        this.antiCheatRealtime?.recordSessionStart(result.userId);
      } else {
        // Login was rejected (e.g. banned/invalid token). Close socket so the client
        // doesn't remain connected in an unauthenticated limbo state.
        setTimeout(() => {
          if (socket.connected) {
            socket.disconnect(true);
          }
        }, 25);
      }
    });

    socket.on(GameAction.ClientAction.toString(), async (payload: unknown) => {
      this.packetAudit?.logPacketTrace({
        userId: connectedUserId,
        serverId: this.serverId,
        packetNumber: GameAction.ClientAction,
        packetName: "ClientAction",
        payload
      });
      try {
        if (connectedUserId === null) {
          // Unauthenticated socket should not send gameplay packets.
          socket.disconnect(true);
          return;
        }

        const clientAction: ClientActionPayload = decodeClientActionPayload(payload);
        if (!isClientActionType(clientAction.ActionType as number)) {
          // Ignore unknown/unsupported client commands for now.
          return;
        }

        // Update activity tracking - player sent a packet
        if (connectedUserId !== null) {
          this.lastActivityTickByUserId.set(connectedUserId, this.tick);
          // Clear warning flag if they were previously warned
          this.idleWarningsSentToUserId.delete(connectedUserId);
        }

        // Build action context and dispatch to handler registry
        const ctx = this.buildActionContext(socket, connectedUserId);
        await dispatchClientAction(clientAction.ActionType as number, ctx, clientAction.ActionData as unknown);
      } catch (err) {
        // keep server alive; protocol decoding will evolve over time; throttle repeated failures
        const now = Date.now();
        const msg = String((err as Error)?.message ?? err);
        if (now - this.protocolErrorThrottleLastMs > GameServer.PROTOCOL_ERROR_THROTTLE_MS) {
          if (this.protocolErrorThrottleCount > 1) {
            console.warn(`[protocol] failed to handle client action (${this.protocolErrorThrottleCount} similar in last 10s):`, msg);
          } else {
            console.warn("[protocol] failed to handle client action:", msg);
          }
          this.protocolErrorThrottleLastMs = now;
          this.protocolErrorThrottleCount = 1;
        } else {
          this.protocolErrorThrottleCount++;
        }
      }
    });

    socket.on("disconnect", async () => {
      await cleanupConnectedUser();
    });
  }

  private async performFullDisconnectCleanup(userId: number, username: string): Promise<void> {
    this.pendingDisconnectsByUserId.delete(userId);

    // Cancel any active movement
    this.pathfindingSystem.cancelMovementPlan({ type: EntityType.Player, id: userId });

    // Clear targeting
    this.targetingService.clearPlayerTargetOnDisconnect(userId);
    this.targetingService.clearAllNPCsTargetingPlayer(userId);
    this.tradingService?.onPlayerDisconnected(userId);

    // Clear any NPCs that were targeting this player
    for (const npc of this.npcStates.values()) {
      if (npc.aggroTarget?.type === EntityType.Player && npc.aggroTarget.id === userId) {
        this.aggroSystem.dropNpcAggro(npc.id);
      }
    }

    // Despawn any instanced NPCs owned by this player and clear per-session kill tracking.
    this.instancedNpcService?.handlePlayerLogout(userId);

    // Remove from spatial index
    this.spatialIndex.removePlayer(userId);

    // Save bank if loaded (before removing player state)
    const playerState = this.playerStatesByUserId.get(userId);
    if (playerState) {
      try {
        await this.bankingService.saveBankToDatabase(playerState);
      } catch (err) {
        console.error(`[banking] Failed to save bank on disconnect for user ${userId}:`, err);
      }
    }

    // Delegate to ConnectionService for full disconnect handling
    await this.connectionService.handleDisconnect(userId, username, GameServer.DISCONNECT_SAVE_TIMEOUT_MS);
    this.antiCheatRealtime?.recordSessionEnd(userId);
  }

  private schedulePendingDisconnect(userId: number, username: string): void {
    const nowMs = Date.now();
    this.pendingDisconnectsByUserId.set(userId, {
      userId,
      username,
      disconnectedAtMs: nowMs,
      forceLogoutAtMs: nowMs + GameServer.DISCONNECT_COMBAT_LOGOUT_MAX_MS
    });
  }

  private processPendingDisconnects(): void {
    if (this.pendingDisconnectsByUserId.size === 0) {
      return;
    }

    const nowMs = Date.now();
    for (const pending of this.pendingDisconnectsByUserId.values()) {
      const playerState = this.playerStatesByUserId.get(pending.userId);
      if (!playerState) {
        this.pendingDisconnectsByUserId.delete(pending.userId);
        continue;
      }

      // Always enforce a hard cap for safety.
      if (nowMs >= pending.forceLogoutAtMs) {
        this.pendingDisconnectsByUserId.delete(pending.userId);
        void this.performFullDisconnectCleanup(pending.userId, pending.username);
        continue;
      }

      const baseReadyAt = pending.disconnectedAtMs + GameServer.DISCONNECT_BASE_LOGOUT_DELAY_MS;
      const combatReadyAt = playerState.lastIncomingCombatHitAtMs > 0
        ? playerState.lastIncomingCombatHitAtMs + GameServer.DISCONNECT_COMBAT_RESET_DELAY_MS
        : 0;
      const readyAt = Math.max(baseReadyAt, combatReadyAt);

      if (nowMs >= readyAt) {
        this.pendingDisconnectsByUserId.delete(pending.userId);
        void this.performFullDisconnectCleanup(pending.userId, pending.username);
      }
    }
  }

  // Action Context Builder
  private buildActionContext(socket: Socket, userId: number | null): ActionContext {
    return {
      socket,
      userId,
      currentTick: this.tick,
      playerStatesByUserId: this.playerStatesByUserId,
      npcStates: this.npcStates,
      groundItemStates: this.groundItemStates,
      worldEntityStates: this.worldEntityStates,
      spatialIndex: this.spatialIndex,
      world: this.world,
      pathfindingSystem: this.pathfindingSystem,
      stateMachine: this.stateMachine,
      delaySystem: this.delaySystem,
      messageService: this.messageService,
      inventoryService: this.inventoryService,
      equipmentService: this.equipmentService,
      targetingService: this.targetingService,
      tradingService: this.tradingService,
      changeAppearanceService: this.changeAppearanceService,
      treasureMapService: this.treasureMapService,
      teleportService: this.teleportService,
      conversationService: this.conversationService,
      shopSystem: this.shopSystem,
      worldEntityActionService: this.worldEntityActionService,
      worldEntityLootService: this.worldEntityLootService,
      instancedNpcService: this.instancedNpcService,
      bankingService: this.bankingService,
      pickpocketService: this.pickpocketService,
      woodcuttingService: this.woodcuttingService,
      fishingService: this.fishingService,
      harvestingService: this.harvestingService,
      miningService: this.miningService,
      shakingService: this.shakingService,
      itemInteractionService: this.itemInteractionService,
      skillingMenuService: this.skillingMenuService,
      eventBus: this.eventBus,
      resourceExhaustionTracker: this.resourceExhaustionTracker,
      itemCatalog: this.itemCatalog,
      itemManager: this.itemManager,
      spellCatalog: this.spellCatalog,
      packetAudit: this.packetAudit,
      itemAudit: this.itemAudit,
      antiCheatRealtime: this.antiCheatRealtime,
      experienceService: this.experienceService,
      losSystem: this.losSystem,
      worldEntityCatalog: this.worldEntityCatalog,
      enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => {
        this.enqueueUserMessage(userId, action, payload);
      },
      enqueueBroadcast: (action: number, payload: unknown[]) => {
        this.enqueueBroadcast(action, payload);
      },
      scheduleServerShutdown: (minutes: number, requestedByUserId?: number) => {
        return this.scheduleServerShutdown(minutes, requestedByUserId);
      },
      disconnectUser: (targetUserId: number, reason?: string) => {
        return this.disconnectUserSocket(targetUserId, reason);
      }
    };
  }

  private scheduleServerShutdown(
    minutesUntilShutdown: number,
    requestedByUserId?: number
  ): { scheduled: boolean; reason?: string } {
    if (this.shutdownInProgress) {
      return { scheduled: false, reason: "Shutdown is already in progress." };
    }
    if (this.shutdownTimer !== null) {
      return { scheduled: false, reason: "A shutdown countdown is already active." };
    }
    if (!Number.isFinite(minutesUntilShutdown) || minutesUntilShutdown < 0) {
      return { scheduled: false, reason: "Minutes must be a non-negative integer." };
    }

    const minutes = Math.floor(minutesUntilShutdown);
    const requesterLabel = requestedByUserId !== undefined
      ? `user ${requestedByUserId}`
      : "system";

    const countdownPayload = buildServerShutdownCountdownPayload({
      MinutesUntilShutdown: minutes
    });
    this.enqueueBroadcast(GameAction.ServerShutdownCountdown, countdownPayload);

    const infoMessage =
      minutes === 0
        ? "Server shutdown has been initiated."
        : `Server shutdown in ${minutes} minute(s).`;
    for (const userId of this.playerStatesByUserId.keys()) {
      this.messageService.sendServerInfo(userId, infoMessage, MessageStyle.Warning);
    }

    console.log(`[shutdown] Scheduled by ${requesterLabel}: ${minutes} minute(s)`);

    this.shutdownTimer = setTimeout(async () => {
      this.shutdownTimer = null;
      try {
        await this.gracefulShutdown(
          `Chat command shutdown by ${requesterLabel}${minutes > 0 ? ` (${minutes}m countdown)` : ""}`,
          0
        );
        process.exit(0);
      } catch (err) {
        console.error("[shutdown] Scheduled shutdown failed:", err);
        process.exit(1);
      }
    }, minutes * 60 * 1000);

    return { scheduled: true };
  }

  private createStateMachineContext(): StateMachineContext {
    return {
      eventBus: this.eventBus,
      cancelMovementPlan: (entityRef: EntityRef) => {
        // Just delete the movement plan - don't trigger state transition
        // (state transitions are handled by the StateMachine itself)
        this.pathfindingSystem.deleteMovementPlan(entityRef);
      },
      dropNpcAggro: (npcId: number) => {
        this.aggroSystem.dropNpcAggro(npcId);
      },
      getPlayerState: (userId: number) => {
        return this.playerStatesByUserId.get(userId);
      },
      getNpcState: (npcId: number) => {
        return this.npcStates.get(npcId);
      },
      makeEntityKey: (entityRef: EntityRef) => {
        return this.makeEntityKey(entityRef);
      },
      hasMovementPlan: (entityKey: string) => {
        return this.movementPlans.has(entityKey);
      },
      endConversation: (userId: number, handleStateTransitions: boolean) => {
        // Delegate to ConversationService
        // Safe to access here since state transitions happen after initialization
        this.conversationService.endConversation(userId, handleStateTransitions);
      },
      clearPlayerTarget: (userId: number) => {
        // Delegate to TargetingService
        // Safe to access here since state transitions happen after initialization
        this.targetingService.clearPlayerTarget(userId);
      },
      sendServerInfo: (userId: number, message: string) => {
        // Delegate to MessageService
        // Safe to access here since state transitions happen after initialization
        this.messageService.sendServerInfo(userId, message);
      },
      onPlayerExitedTradingState: (userId: number) => {
        this.tradingService?.onPlayerExitedTradingState(userId);
      },
      getWoodcuttingService: () => {
        // Return woodcutting service (may be null if not loaded)
        return this.woodcuttingService;
      },
      getFishingService: () => {
        // Return fishing service (may be null if not loaded)
        return this.fishingService;
      },
      getHarvestingService: () => {
        return this.harvestingService;
      },
      getMiningService: () => {
        return this.miningService;
      },
      getCookingService: () => {
        return this.cookingService;
      },
      getItemInteractionService: () => {
        return this.itemInteractionService;
      },
      enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => {
        // Delegate to GameServer's enqueue method
        this.enqueueUserMessage(userId, action, payload);
      }
    };
  }


  // ============================================================================
  // Graceful Shutdown & Crash Handling
  // ============================================================================

  /**
   * Handles graceful shutdown - saves all player states before exiting.
   * Called on SIGINT, SIGTERM, uncaught exceptions, and unhandled rejections.
   */
  private async gracefulShutdown(reason: string, exitCode: number = 0): Promise<void> {
    if (this.shutdownInProgress) {
      console.log('[shutdown] Already shutting down, ignoring duplicate signal');
      return;
    }

    this.shutdownInProgress = true;

    // CRITICAL: Prevent default signal behavior
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGTERM');

    console.log(`\n[shutdown] Graceful shutdown initiated: ${reason}`);

    try {
      // Stop accepting new connections and pause tick loop
      this.endTickLoop();
      console.log('[shutdown] Tick loop stopped');

      // Stop autosave loop BEFORE force-saving to prevent race conditions
      this.playerPersistence.stopAutosaveLoop();
      console.log('[shutdown] Autosave loop stopped');

      // Don't wait - force save handles waiting for in-flight saves internally
      console.log('[shutdown] Proceeding immediately to force save');

      // Force-save all connected players immediately
      const playerIds = Array.from(this.playerStatesByUserId.keys());
      console.log(`[shutdown] Database enabled: ${this.dbEnabled}`);
      console.log(`[shutdown] Saving ${playerIds.length} player(s)...`);

      if (playerIds.length === 0) {
        console.log('[shutdown] No players to save');
      }

      if (!this.dbEnabled) {
        console.warn('[shutdown] WARNING: Database is disabled! No saves will occur!');
      }

      const savePromises = playerIds.map(async (userId) => {
        const startTime = Date.now();
        console.log(`[shutdown] >> Starting save for player ${userId} at ${startTime}`);

        try {
          // Save player state to database
          await this.playerPersistence.trySavePlayerState(userId, { force: true });
          const elapsed = Date.now() - startTime;
          console.log(`[shutdown] ✓ Saved player ${userId} in ${elapsed}ms`);
          
          // Send LoggedOut packet to notify the player they're being disconnected
          console.log(`[shutdown] >> Sending LoggedOut packet to player ${userId}`);
          const loggedOutPayload = buildLoggedOutPayload({ EntityID: userId });
          this.enqueueUserMessage(userId, GameAction.LoggedOut, loggedOutPayload);
          
          return { userId, success: true, elapsed };
        } catch (err) {
          const elapsed = Date.now() - startTime;
          console.error(`[shutdown] ✗ Failed to save player ${userId} after ${elapsed}ms:`, err);
          return { userId, success: false, elapsed, error: err };
        }
      });

      console.log('[shutdown] Waiting for all save promises to complete...');
      const results = await Promise.allSettled(savePromises);

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { userId, success, elapsed } = await result.value;
          console.log(`[shutdown] Player ${userId}: ${success ? '✓' : '✗'} (${elapsed}ms)`);
        } else {
          console.error(`[shutdown] Promise rejected:`, result.reason);
        }
      }
      // Wait for all saves to complete (with longer timeout for database operations)
      console.log('[shutdown] Waiting for all save promises to complete...');
      try {
        await Promise.race([
          Promise.all(savePromises),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Save timeout after 30s')), 30000)
          )
        ]);
        console.log('[shutdown] Save promises completed');
      } catch (saveError) {
        console.error('[shutdown] Critical error during save:', saveError);
      }

      console.log('[shutdown] All players saved');

      if (this.packetAudit) {
        await this.packetAudit.shutdown();
      }

      if (this.itemAudit) {
        await this.itemAudit.shutdown();
      }

      if (this.chatAudit) {
        await this.chatAudit.shutdown();
      }

      if (this.antiCheatRealtime) {
        await this.antiCheatRealtime.shutdown();
      }

      if (this.antiCheatAnalyzer) {
        await this.antiCheatAnalyzer.shutdown();
      }
      
      // Flush any queued packets (including LoggedOut packets) before closing connections
      console.log('[shutdown] Flushing queued packets...');
      if (this.outgoingNext.length > 0) {
        const packetCount = this.outgoingNext.length;
        this.flushQueuedPackets(this.outgoingNext);
        this.outgoingNext.length = 0;
        console.log(`[shutdown] ✓ Flushed ${packetCount} queued packets`);
      } else {
        console.log('[shutdown] No packets to flush');
      }
      
      // Give sockets a moment to send the packets
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('[shutdown] Packets sent, disconnecting clients...');
      
      // Disconnect all client sockets
      for (const [userId, socket] of this.socketsByUserId.entries()) {
        try {
          socket.disconnect(true);
          console.log(`[shutdown] ✓ Disconnected player ${userId}`);
        } catch (err) {
          console.error(`[shutdown] ✗ Error disconnecting player ${userId}:`, err);
        }
      }

      // Recompute hiscores for all players with skill changes (before DB disconnect)
      // Skills are already saved to DB, this just recomputes "overall" and recalculates ranks
      if (this.dbEnabled) {
        const playersWithSkillChanges = playerIds.filter(userId => {
          const playerState = this.playerStatesByUserId.get(userId);
          return playerState && playerState.skillsDirty;
        });

        if (playersWithSkillChanges.length > 0) {
          console.log(`[shutdown] Recomputing hiscores for ${playersWithSkillChanges.length} player(s)...`);

          try {
            await recomputeHiscores(playersWithSkillChanges, this.serverId);

            // Mark skills clean
            for (const userId of playersWithSkillChanges) {
              const playerState = this.playerStatesByUserId.get(userId);
              if (playerState) {
                playerState.markSkillsClean();
              }
            }

            console.log('[shutdown] ✓ Hiscores recomputed');
          } catch (err) {
            console.error('[shutdown] ✗ Failed to recompute hiscores:', err);
          }
        }
      }

      // Best-effort final cleanup for stale rows on this shard.
      await this.cleanupServerOnlinePresence("shutdown");

      // Disconnect database
      await disconnectDb();
      console.log('[shutdown] Database disconnected');

      // Close server
      await new Promise<void>((resolve) => {
        this.server.close(() => {
          console.log('[shutdown] Server closed');
          resolve();
        });
      });

      console.log('[shutdown] Graceful shutdown complete');
    } catch (err) {
      console.error('[shutdown] Error during graceful shutdown:', err);
      process.exit(1);
    }
  }

  /**
   * Registers process event handlers for graceful shutdown.
   * Handles SIGINT, SIGTERM, uncaughtException, and unhandledRejection.
   */
  private registerCrashHandlers(): void {
    // SIGINT (Ctrl+C) - Use async handler that blocks until complete
    process.once('SIGINT', async () => {
      await this.handleShutdownSignal('SIGINT', 0);
    });
    
    // SIGTERM (kill/docker stop)
    process.once('SIGTERM', async () => {
      await this.handleShutdownSignal('SIGTERM', 0);
    });
    
    // Crashes - can't safely do async work
    process.once('uncaughtException', (err: Error) => {
      console.error('[crash] Uncaught exception:', err);
      this.handleCrash(err);
    });
    
    process.once('unhandledRejection', (reason: unknown) => {
      console.error('[crash] Unhandled rejection:', reason);
      this.handleCrash(new Error(String(reason)));
    });
    
    console.log('[server] Crash handlers registered');
  }
  
  private async handleShutdownSignal(signal: string, exitCode: number): Promise<never> {
    if (this.shutdownInProgress) {
      console.log('[shutdown] Already shutting down, forcing immediate exit');
      process.exit(1);
    }
    
    console.log(`[shutdown] ${signal} received, starting graceful shutdown...`);
    
    // Timeout to force exit
    const killer = setTimeout(() => {
      console.error('[shutdown] FORCE EXIT after 60s timeout');
      process.exit(1);
    }, 60000);
    
    try {
      await this.gracefulShutdown(signal, exitCode);
      clearTimeout(killer);
      console.log('[shutdown] Clean exit');
      process.exit(exitCode);
    } catch (err) {
      clearTimeout(killer);
      console.error('[shutdown] Shutdown failed:', err);
      process.exit(1);
    }
  }
  
  private handleCrash(error: Error): void {
    console.error('[crash] Attempting emergency save (5s timeout)...');
    
    const killer = setTimeout(() => {
      console.error('[crash] Emergency save timeout, forcing exit');
      process.exit(1);
    }, 5000);
    
    this.gracefulShutdown(`Crash: ${error.message}`, 1)
      .finally(() => {
        clearTimeout(killer);
        process.exit(1);
      });
  }

  private async cleanupServerOnlinePresence(phase: "startup" | "shutdown" | "stop"): Promise<void> {
    if (!this.dbEnabled) return;
    try {
      const deleted = await removeOnlinePresenceByServerId(this.serverId);
      if (deleted > 0) {
        console.log(`[presence] Cleared ${deleted} stale online row(s) for server ${this.serverId} during ${phase}`);
      }
    } catch (err) {
      // Non-fatal: login protection still has heartbeat-aware fallbacks.
      console.warn(
        `[presence] Failed to clear online rows for server ${this.serverId} during ${phase}:`,
        (err as Error)?.message ?? err
      );
    }
  }

  private disconnectUserSocket(userId: number, reason?: string): boolean {
    const socket = this.socketsByUserId.get(userId);
    if (!socket || !socket.connected) {
      return false;
    }

    if (reason) {
      this.messageService.sendServerInfo(userId, reason);
    }

    try {
      const loggedOutPayload = buildLoggedOutPayload({ EntityID: userId });
      socket.emit(GameAction.LoggedOut.toString(), loggedOutPayload);
    } catch {
      // best effort
    }

    setTimeout(() => {
      try {
        socket.disconnect(true);
      } catch {
        // best effort
      }
    }, 50);

    return true;
  }

  private async enforceActiveAccountBans(): Promise<void> {
    if (this.banEnforcementInFlight) {
      return;
    }
    if (this.socketsByUserId.size === 0) {
      return;
    }

    this.banEnforcementInFlight = true;
    try {
      const connectedUserIds = Array.from(this.socketsByUserId.keys());
      const bannedUsers = await getActiveAccountBansForUserIds(connectedUserIds);
      if (bannedUsers.length === 0) {
        return;
      }

      for (const banned of bannedUsers) {
        const disconnected = this.disconnectUserSocket(
          banned.userId,
          "Your account has been banned."
        );
        if (disconnected) {
          console.log(
            `[moderation] Disconnected banned user ${banned.userId} (reason: ${banned.banReason ?? "No reason provided"})`
          );
        }
      }
    } catch (err) {
      console.warn("[moderation] Failed account-ban enforcement sweep:", (err as Error)?.message ?? err);
    } finally {
      this.banEnforcementInFlight = false;
    }
  }



  // ============================================================================
  // Idle/AFK Detection
  // ============================================================================

  /**
   * Checks all connected players for idle/AFK status.
   * Warns players at 14 minutes of inactivity, disconnects at 15 minutes.
   * Called once per server tick.
   */
  /**
   * Processes pending environment actions for all players.
   * Uses the unified tick processor from environmentActions.
   */
  private processEnvironmentActions(): void {
  // Import dynamically to avoid circular dependency
  const { processPendingEnvironmentActions } = require("./actions/entity-actions/environmentActions");

  // Build a minimal context for the processor
  // Note: socket/userId not needed since processor handles all players
  const ctx = {
    playerStatesByUserId: this.playerStatesByUserId,
    currentTick: this.tick,
    groundItemStates: this.groundItemStates,
    worldEntityStates: this.worldEntityStates,
    spatialIndex: this.spatialIndex,
    delaySystem: this.delaySystem,
    pathfindingSystem: this.pathfindingSystem,
    worldEntityActionService: this.worldEntityActionService,
    instancedNpcService: this.instancedNpcService,
    messageService: this.messageService,
    teleportService: this.teleportService,
    eventBus: this.eventBus,
    resourceExhaustionTracker: this.resourceExhaustionTracker,
    targetingService: this.targetingService,
    bankingService: this.bankingService,
    worldEntityLootService: this.worldEntityLootService,
    inventoryService: this.inventoryService,
      treasureMapService: this.treasureMapService,
    equipmentService: this.equipmentService,
    itemCatalog: this.itemCatalog,
    experienceService: this.experienceService,
    woodcuttingService: this.woodcuttingService,
    fishingService: this.fishingService,
    harvestingService: this.harvestingService,
    miningService: this.miningService,
    shakingService: this.shakingService,
    skillingMenuService: this.skillingMenuService,
    enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => {
      this.enqueueUserMessage(userId, action, payload);
    },
    enqueueBroadcast: (action: number, payload: unknown[]) => {
      this.enqueueBroadcast(action, payload);
    }
  };

  processPendingEnvironmentActions(ctx);
}

  private checkIdlePlayers(): void {
  for(const [userId, lastActivityTick] of this.lastActivityTickByUserId.entries()) {
  const idleTicks = this.tick - lastActivityTick;

  // Disconnect after 15 minutes of inactivity
  if (idleTicks >= GameServer.IDLE_DISCONNECT_TICKS) {
    const socket = this.socketsByUserId.get(userId);
    if (socket) {
      (socket.data as { logoutRequested?: boolean }).logoutRequested = true;
      try {
        socket.emit(
          GameAction.LoggedOut.toString(),
          buildLoggedOutPayload({ EntityID: userId })
        );
      } catch {
        // best effort
      }
      // Give the packet a moment to flush before disconnecting.
      setTimeout(() => {
        socket.disconnect(true);
      }, 1000);
    }
    continue;
  }

  // Warn at 14 minutes (only once)
  if (idleTicks >= GameServer.IDLE_WARNING_TICKS && !this.idleWarningsSentToUserId.has(userId)) {
    this.messageService.sendServerInfo(userId, "WARNING - You will be logged out for inactivity in one minute.");
    this.idleWarningsSentToUserId.add(userId);
  }
}
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Creates an entity key string for use in maps/sets.
   * Used by movement plans and state machine.
   */
  private makeEntityKey(entityRef: EntityRef): string {
  return `${entityRef.type}:${entityRef.id}`;
}
}

