import { PrismaClient } from "@openspell/db";
import type { Json } from "@openspell/db";

let prismaSingleton: InstanceType<typeof PrismaClient> | null = null;

export function getPrisma(): InstanceType<typeof PrismaClient> {
  if (!prismaSingleton) {
    prismaSingleton = new PrismaClient();
  }
  return prismaSingleton;
}

export async function connectDb(): Promise<void> {
  await getPrisma().$connect();
}

export async function disconnectDb(): Promise<void> {
  if (!prismaSingleton) return;
  await prismaSingleton.$disconnect();
  prismaSingleton = null;
}

function parseServerId(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return 1;
  return n;
}

/**
 * Mark a user as online in the shared database.
 *
 * Assumptions:
 * - The user must already exist in the `users` table (FK constraint).
 * - This is intended to replace calling the API over HTTP for online presence.
 */
export async function upsertOnlinePresence(params: {
  userId: number;
  username?: string;
  serverId?: number;
}): Promise<void> {
  const prisma = getPrisma();
  const serverId = parseServerId(params.serverId ?? process.env.SERVER_ID);

  await prisma.onlineUser.upsert({
    where: { userId: params.userId },
    update: {
      lastSeen: new Date(),
      serverId,
      username: params.username ?? null
    },
    create: {
      userId: params.userId,
      username: params.username ?? null,
      serverId,
      lastSeen: new Date()
    }
  });
}

export async function removeOnlinePresence(userId: number): Promise<void> {
  const prisma = getPrisma();
  await prisma.onlineUser.deleteMany({ where: { userId } });
}

/**
 * Removes all online presence rows for a specific game server shard.
 * Useful during server startup/shutdown to clear stale presence after crashes.
 */
export async function removeOnlinePresenceByServerId(serverId: number): Promise<number> {
  const prisma = getPrisma();
  const parsedServerId = parseServerId(serverId);
  const result = await prisma.onlineUser.deleteMany({
    where: { serverId: parsedServerId }
  });
  return result.count;
}

export async function savePlayerStateSnapshot(params: {
  userId: number;
  persistenceId: number;
  state: Json;
  version: number;
}): Promise<void> {
  const prisma = getPrisma();
  await prisma.playerStateSnapshot.upsert({
    where: {
      userId_persistenceId: {
        userId: params.userId,
        persistenceId: params.persistenceId
      }
    },
    update: {
      state: params.state,
      version: params.version
    },
    create: {
      userId: params.userId,
      persistenceId: params.persistenceId,
      state: params.state,
      version: params.version
    }
  });
}

/**
 * Update the world's lastHeartbeat timestamp in the database.
 * Called periodically by the game server to indicate it's still alive.
 * 
 * @param serverId - The server ID to update heartbeat for
 * @returns Promise that resolves when heartbeat is updated
 */
export async function sendWorldHeartbeat(serverId: number): Promise<void> {
  const prisma = getPrisma();
  
  try {
    await prisma.world.update({
      where: { serverId },
      data: { lastHeartbeat: new Date() }
    });
  } catch (err) {
    // Silently fail if world doesn't exist or DB is unavailable
    // This is non-fatal - the server can still run without heartbeat tracking
    if ((err as any)?.code === 'P2025') {
      // World record doesn't exist - this is expected on first run
      // The world should be created via the API server's /api/worlds/register endpoint
      return;
    }
    console.warn(`[heartbeat] Failed to update heartbeat for serverId ${serverId}:`, (err as Error)?.message ?? err);
  }
}

/**
 * Result of a ban check operation.
 */
export type BanCheckResult = {
  isBanned: boolean;
  isPermanent: boolean;
  banReason: string | null;
  bannedUntil: Date | null;
  timeRemainingMs: number | null; // Milliseconds until unban (null if permanent)
};

/**
 * Checks if a user is currently banned.
 * Returns ban information if banned, null if not banned.
 * 
 * @param userId - The user ID to check
 * @returns Ban check result or null if not banned
 */
export async function checkUserBan(userId: number): Promise<BanCheckResult | null> {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { bannedUntil: true, banReason: true }
  });

  if (!user || !user.banReason) {
    return null; // Not banned
  }

  const now = new Date();
  const isPermanent = user.bannedUntil === null;
  
  // If temporary ban, check if it has expired
  if (!isPermanent && user.bannedUntil && user.bannedUntil <= now) {
    // Ban has expired, but we should clear it from the database
    await prisma.user.update({
      where: { id: userId },
      data: { bannedUntil: null, banReason: null }
    });
    return null; // No longer banned
  }

  const timeRemainingMs = isPermanent 
    ? null 
    : user.bannedUntil 
      ? Math.max(0, user.bannedUntil.getTime() - now.getTime())
      : null;

  return {
    isBanned: true,
    isPermanent,
    banReason: user.banReason,
    bannedUntil: user.bannedUntil,
    timeRemainingMs
  };
}

/**
 * Checks if an IP address is currently banned.
 * Returns ban information if banned, null if not banned.
 * 
 * @param ip - The IP address to check
 * @returns Ban check result or null if not banned
 */
export async function checkIPBan(ip: string): Promise<BanCheckResult | null> {
  const prisma = getPrisma();
  const ipBan = await prisma.iPBan.findUnique({
    where: { ip }
  });

  if (!ipBan) {
    return null; // Not banned
  }

  const now = new Date();
  const isPermanent = ipBan.bannedUntil === null;
  
  // If temporary ban, check if it has expired
  if (!isPermanent && ipBan.bannedUntil && ipBan.bannedUntil <= now) {
    // Ban has expired, remove it from the database
    await prisma.iPBan.delete({
      where: { ip }
    });
    return null; // No longer banned
  }

  const timeRemainingMs = isPermanent 
    ? null 
    : ipBan.bannedUntil 
      ? Math.max(0, ipBan.bannedUntil.getTime() - now.getTime())
      : null;

  return {
    isBanned: true,
    isPermanent,
    banReason: ipBan.banReason,
    bannedUntil: ipBan.bannedUntil,
    timeRemainingMs
  };
}

/**
 * Records an IP address associated with a user login.
 * Creates a new record if the IP hasn't been seen for this user, or updates lastSeen if it exists.
 * 
 * @param userId - The user ID
 * @param ip - The IP address
 */
export async function trackUserIP(userId: number, ip: string): Promise<void> {
  const prisma = getPrisma();
  const now = new Date();
  
  await prisma.userIP.upsert({
    where: {
      userId_ip: {
        userId,
        ip
      }
    },
    update: {
      lastSeen: now
    },
    create: {
      userId,
      ip,
      firstSeen: now,
      lastSeen: now
    }
  });
}

/**
 * Formats a ban message for display to the user.
 * 
 * @param banResult - The ban check result
 * @param username - Optional username to include in the message
 * @returns Formatted ban message
 */
export function formatBanMessage(banResult: BanCheckResult, username?: string): string {
  if (banResult.isPermanent) {
    const reason = banResult.banReason || "No reason provided";
    return username 
      ? `Your account is permanently banned. Reason: ${reason}`
      : `Your account is permanently banned. Reason: ${reason}`;
  } else {
    const reason = banResult.banReason || "No reason provided";
    const timeRemaining = banResult.timeRemainingMs;
    if (timeRemaining === null) {
      return `Your account is banned. Reason: ${reason}`;
    }
    
    // Format time remaining
    const seconds = Math.floor(timeRemaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    let timeStr: string;
    if (days > 0) {
      timeStr = `${days} day${days !== 1 ? 's' : ''}, ${hours % 24} hour${(hours % 24) !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      timeStr = `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes % 60} minute${(minutes % 60) !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      timeStr = `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds % 60} second${(seconds % 60) !== 1 ? 's' : ''}`;
    } else {
      timeStr = `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    
    return `Your account is banned. Reason: ${reason}. You will be unbanned in ${timeStr}`;
  }
}

/**
 * Recomputes "overall" skill and recalculates ranks for players who changed skills.
 * The game server already saves skills directly to the database, so this only needs to:
 * 1. Recompute "overall" skill for specified users
 * 2. Recalculate ranks for all skills
 * 
 * This is an EXPENSIVE operation (runs window functions on entire database).
 * Should only be called once per autosave cycle with all changed users.
 * 
 * @param userIds - Array of user IDs who had skill changes
 * @returns Promise that resolves when recomputation is complete
 */
export async function recomputeHiscores(userIds: number[], serverIdOverride?: number): Promise<void> {
  const apiUrl = process.env.API_URL || 'http://localhost:3002';
  const secret = process.env.HISCORES_UPDATE_SECRET;
  const serverId = parseServerId(serverIdOverride ?? process.env.SERVER_ID);
  
  if (!secret) {
    console.warn('[hiscores] HISCORES_UPDATE_SECRET not configured, skipping recompute');
    return;
  }
  
  if (userIds.length === 0) {
    return; // Nothing to do
  }
  
  try {
    const https = await import('https');
    const http = await import('http');
    const url = new URL('/api/hiscores/recompute', apiUrl);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const payload = JSON.stringify({
      secret,
      userIds,
      ...(serverId ? { serverId } : {})
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      // In dev, ignore self-signed certs
      ...(isHttps && process.env.NODE_ENV !== 'production' && { rejectUnauthorized: false })
    };
    
    await new Promise<void>((resolve, reject) => {
      const req = httpModule.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Hiscores recompute failed: ${res.statusCode} - ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
    
    console.log(`[hiscores] Recomputed overall and ranks for ${userIds.length} player(s)`);
  } catch (error) {
    // Non-fatal: hiscores can be out of sync temporarily
    console.warn(`[hiscores] Failed to recompute hiscores:`, (error as Error)?.message ?? error);
  }
}