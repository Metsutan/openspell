import type { Socket } from "socket.io";
import { GameAction } from "../../protocol/enums/GameAction";
import { buildPlayerCountChangedPayload } from "../../protocol/packets/actions/PlayerCountChanged";
import { buildPlayerWeightChangedPayload } from "../../protocol/packets/actions/PlayerWeightChanged";
import { checkIPBan, checkUserBan, formatBanMessage, upsertOnlinePresence, removeOnlinePresence, trackUserIP } from "../../db";
import { decodeLoginPayload } from "../../protocol/packets/actions/Login";
import { createPlayerAddedEvent, createPlayerRemovedEvent, type Position } from "../events/GameEvents";
import type { EventBus } from "../events/EventBus";
import type { World } from "../../world/World";
import type { PlayerState } from "../../world/PlayerState";
import type { PlayerPersistenceManager } from "./PlayerPersistenceManager";
import { LoginFailedError, type LoginService } from "./LoginService";
import type { MapLevel } from "../../world/Location";
import { InventoryService } from "./InventoryService";
import type { BankingService } from "./BankingService";
import type { DelaySystem } from "../systems/DelaySystem";
import type { SkillingMenuService } from "./SkillingMenuService";
import type { ChangeAppearanceService } from "./ChangeAppearanceService";
import type { TreasureMapService } from "./TreasureMapService";

export interface ConnectionServiceDependencies {
  dbEnabled: boolean;
  world: World;
  eventBus: EventBus;
  loginService: LoginService;
  playerPersistence: PlayerPersistenceManager;
  socketsByUserId: Map<number, Socket>;
  playerStatesByUserId: Map<number, PlayerState>;
  usernamesByUserId: Map<number, string>;
  inventoryService: InventoryService;
  bankingService: BankingService;
  skillingMenuService: SkillingMenuService;
  changeAppearanceService: ChangeAppearanceService;
  treasureMapService: TreasureMapService | null;
  delaySystem: DelaySystem;
  equipmentService: any; // Using 'any' to avoid circular dependency with EquipmentService
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  enqueueBroadcast: (action: GameAction, payload: unknown[]) => void;
}

export interface ConnectionInfo {
  userId: number;
  username: string;
  emailVerified: boolean;
  socket: Socket;
}

/**
 * Service for managing player connections and sessions.
 * Handles login flow, session setup, and disconnect cleanup.
 */
export class ConnectionService {
  private static readonly MAX_ACTIVE_ACCOUNTS_PER_IP = 2;
  private static readonly MAX_ACTIVE_ACCOUNTS_PER_IP_MESSAGE = "Only 2 accounts are allowed per person.";

  constructor(private readonly deps: ConnectionServiceDependencies) {}

  private rejectLoginAndCloseSocket(socket: Socket, payload: unknown): null {
    socket.emit(GameAction.LoginFailed.toString(), payload);

    // Force-close both Socket.IO namespace + underlying Engine.IO transport.
    // This avoids clients getting stuck on an upgraded websocket after rejection.
    setTimeout(() => {
      try {
        if (socket.connected) {
          socket.disconnect(true);
        }
      } catch {
        // best effort
      }
      try {
        socket.conn.close();
      } catch {
        // best effort
      }
    }, 25);

    return null;
  }

  /**
   * Handles the login flow for a player.
   * Validates credentials, sets up session state, and emits appropriate events.
   * 
   * @param socket The socket connection
   * @param payload The login payload
   * @returns Connection info if successful, null if failed (error sent to client)
   */
  async handleLogin(socket: Socket, payload: unknown): Promise<ConnectionInfo | null> {
    try {
      const login = decodeLoginPayload(payload);
      const clientIP = this.extractClientIP(socket);
      
      // Check IP ban first (before verifying login token)
      if (this.deps.dbEnabled && clientIP) {
        const ipBanResult = await checkIPBan(clientIP);
        if (ipBanResult) {
          const banMessage = formatBanMessage(ipBanResult);
          return this.rejectLoginAndCloseSocket(socket, [banMessage]);
        }
      }

      // Verify login token
      const { userId, username, emailVerified, isFirstGameLogin, lastLogin, serverId, persistenceId } =
        await this.deps.loginService.verifyLogin(login.Token as string);

      // Check user ban after verifying login token (so we have userId)
      if (this.deps.dbEnabled) {
        const userBanResult = await checkUserBan(userId);
        if (userBanResult) {
          const banMessage = formatBanMessage(userBanResult, username);
          return this.rejectLoginAndCloseSocket(socket, [banMessage]);
        }
      }

      // Limit concurrently connected accounts per IP.
      if (clientIP) {
        const activeUserIdsFromIP = this.getActiveUserIdsForIP(clientIP);
        const isAlreadyConnectedFromIP = activeUserIdsFromIP.has(userId);
        if (
          !isAlreadyConnectedFromIP &&
          activeUserIdsFromIP.size >= ConnectionService.MAX_ACTIVE_ACCOUNTS_PER_IP
        ) {
          return this.rejectLoginAndCloseSocket(socket, [
            ConnectionService.MAX_ACTIVE_ACCOUNTS_PER_IP_MESSAGE
          ]);
        }
      }

      // Set up session state
      this.deps.socketsByUserId.set(userId, socket);
      this.deps.world.upsertPlayer(userId, username);

      // Load player state from persistence
      const playerState = await this.deps.playerPersistence.loadPlayerState(userId, username, persistenceId);
      this.deps.playerStatesByUserId.set(userId, playerState);
      this.deps.usernamesByUserId.set(userId, username);

      // Pre-load bank data to avoid delays when player opens bank
      // This is done eagerly during login to ensure instant response when banking
      if (this.deps.dbEnabled) {
        const bankData = await this.deps.bankingService.loadBankForPlayer(userId, persistenceId);
        if (bankData) {
          playerState.bank = bankData;
        } else {
          console.warn(`[Connection] Failed to pre-load bank for user ${userId} (will retry on demand)`);
        }
      }

      if (this.deps.dbEnabled && this.deps.treasureMapService) {
        const mapRows = await this.deps.playerPersistence.loadPlayerTreasureMaps(userId, persistenceId);
        this.deps.treasureMapService.hydratePlayerTreasureMaps(userId, mapRows);
      }

      // Calculate and cache equipment bonuses from equipped items
      // This ensures combat formulas can use cached bonuses instead of recalculating every attack
      const equipmentBonuses = this.deps.equipmentService.calculateEquipmentBonuses(playerState);
      playerState.setEquipmentBonuses(equipmentBonuses);

      // Emit PlayerAdded event (VisibilitySystem will handle packets)
      this.deps.eventBus.emit(createPlayerAddedEvent(
        userId,
        playerState.username,
        { mapLevel: playerState.mapLevel, x: playerState.x, y: playerState.y },
        playerState
      ));

      // Update online presence and tracking
      if (this.deps.dbEnabled) {
        await upsertOnlinePresence({ userId, username, serverId });
        
        // Track IP address for this user
        if (clientIP) {
          await trackUserIP(userId, clientIP).catch((err) => {
            console.warn("[db] trackUserIP failed (non-fatal):", (err as Error)?.message ?? err);
          });
        }
        
        // Broadcast player count update
        this.deps.enqueueBroadcast(GameAction.PlayerCountChanged, buildPlayerCountChangedPayload({ CurrentPlayerCount: this.deps.world.playerCount }));
      }

      // Compose and send LoggedIn packet
      const packet = await this.deps.loginService.composeLoggedInPacket({
        accountId: userId,
        name: username,
        displayName: playerState.displayName,
        emailVerified,
        lastLogin
      });
      socket.emit(GameAction.LoggedIn.toString(), packet);

      // Send initial weight packet
      if (playerState) {
        this.deps.inventoryService.sendWeightUpdate(userId, playerState);
      }

      if (isFirstGameLogin) {
        this.deps.changeAppearanceService.startChangeAppearance(userId, {
          isFirstTime: true,
          chargeCoinsOnSubmit: false
        });
      }

      console.log(`[Connection] Player ${username} (${userId}) logged in`);

      return { userId, username, emailVerified, socket };
    } catch (err) {
      if (err instanceof LoginFailedError) {
        return this.rejectLoginAndCloseSocket(socket, [{ code: err.code, msg: err.msg }]);
      }
      return this.rejectLoginAndCloseSocket(socket, [String((err as Error)?.message ?? err)]);
    }
  }

  /**
   * Handles player disconnect and cleanup.
   * Saves player state, removes from world, and cleans up session data.
   * 
   * @param userId The user ID to disconnect
   * @param username The username (for logging)
   * @param saveTimeout Maximum time to wait for save (default: 2000ms)
   */
  async handleDisconnect(userId: number, username: string, saveTimeout: number = 2000): Promise<void> {
    //console.log(`[Connection] Player ${username} (${userId}) disconnecting`);

    // Get player's last position before cleanup
    const playerState = this.deps.playerStatesByUserId.get(userId);
    const lastPosition: Position = playerState 
      ? { mapLevel: playerState.mapLevel, x: playerState.x, y: playerState.y }
      : { mapLevel: 1 as MapLevel, x: 0, y: 0 };

    // Save player state (with timeout)
    // Note: Skills are saved directly to DB here, no need for separate hiscores API call
    // The "overall" skill and ranks will be recomputed on next autosave cycle (~30s delay is acceptable)
    const savePromise = this.deps.dbEnabled 
      ? this.deps.playerPersistence.trySavePlayerState(userId, { force: true }) 
      : null;

    // Clean up session state
    this.deps.socketsByUserId.delete(userId);
    this.deps.world.removePlayer(userId);
    this.deps.playerStatesByUserId.delete(userId);
    this.deps.usernamesByUserId.delete(userId);
    this.deps.bankingService.handlePlayerDisconnect(userId);
    this.deps.skillingMenuService.handlePlayerDisconnect(userId);
    this.deps.delaySystem.clearDelay(userId); // Clear any active delays to prevent memory leak

    // Emit PlayerRemoved event (VisibilitySystem + TargetingService will handle cleanup)
    this.deps.eventBus.emit(createPlayerRemovedEvent(userId, username, lastPosition));

    // Wait for save to complete (with timeout)
    if (savePromise) {
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, saveTimeout));
      await Promise.race([
        savePromise.catch((err) => {
          console.warn("[db] savePlayerState failed (non-fatal):", (err as Error)?.message ?? err);
        }),
        timeout
      ]);

      // Remove from online presence
      try {
        await removeOnlinePresence(userId);
        
        // Broadcast player count update
        this.deps.enqueueBroadcast(GameAction.PlayerCountChanged, buildPlayerCountChangedPayload({ CurrentPlayerCount: this.deps.world.playerCount }));
      } catch (err) {
        console.warn("[db] removeOnlinePresence failed (non-fatal):", (err as Error)?.message ?? err);
      }
    }

    console.log(`[Connection] Player ${username} (${userId}) disconnected`);
  }

  /**
   * Extracts the client IP address from a socket connection.
   * Handles proxy forwarding headers.
   * 
   * @private
   */
  private extractClientIP(socket: Socket): string | null {
    const req = socket.request;
    if (!req) return null;
    
    // Check for forwarded IP (if behind proxy)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return ips.split(',')[0].trim();
    }
    
    // Check socket connection
    const remoteAddress = socket.conn?.remoteAddress;
    if (remoteAddress) {
      // IPv6 addresses may be wrapped in ::ffff: for IPv4-mapped
      return remoteAddress.replace(/^::ffff:/, '');
    }
    
    // Fallback to request socket
    const reqSocket = (req as any).socket;
    if (reqSocket?.remoteAddress) {
      return reqSocket.remoteAddress.replace(/^::ffff:/, '');
    }
    
    return null;
  }

  private normalizeIPAddress(ip: string): string {
    return ip.replace(/^::ffff:/, "").trim().toLowerCase();
  }

  private getActiveUserIdsForIP(ip: string): Set<number> {
    const normalizedTargetIP = this.normalizeIPAddress(ip);
    const userIds = new Set<number>();

    for (const [activeUserId, activeSocket] of this.deps.socketsByUserId.entries()) {
      const activeSocketIP = this.extractClientIP(activeSocket);
      if (!activeSocketIP) {
        continue;
      }

      if (this.normalizeIPAddress(activeSocketIP) === normalizedTargetIP) {
        userIds.add(activeUserId);
      }
    }

    return userIds;
  }
}
