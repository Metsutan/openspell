import http from "http";
import https from "https";
import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer, type Socket } from "socket.io";
import { config } from "dotenv";
import { getPrisma } from "@openspell/db";
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers, asteriskCensorStrategy } from "obscenity";

const sharedEnvPath = path.join(__dirname, "..", "..", "shared-assets", "base", "shared.env");
config({ path: sharedEnvPath });

const USE_HTTPS = process.env.USE_HTTPS === "true";
const CHAT_PORT = Number(process.env.CHAT_PORT ?? process.env.PORT ?? 8765);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const DEFAULT_CERT_PATH = path.join(__dirname, "..", "..", "..", "certs", "localhost.pem");
const DEFAULT_KEY_PATH = path.join(__dirname, "..", "..", "..", "certs", "localhost-key.pem");
const SSL_CERT_PATH = process.env.SSL_CERT_PATH
  ? process.env.SSL_CERT_PATH
  : DEFAULT_CERT_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH
  ? process.env.SSL_KEY_PATH
  : DEFAULT_KEY_PATH;

type ChatTokenPayload = {
  id?: number;
  name?: string;
  type?: number;
  isMuted?: boolean;
  iat?: number;
  exp?: number;
};

type ChatSession = {
  userId: number;
  username: string;
  playerType: number;
  serverId: number;
  socket: Socket;
};

type LoginPayload = {
  token: string;
  server: number;
};

type UsernameRow = {
  id: number;
  username: string;
};

type ModerationRow = {
  id: number;
  username: string;
  playerType: number;
  banReason: string | null;
  bannedUntil: Date | null;
  muteReason: string | null;
  mutedUntil: Date | null;
};

const prisma = getPrisma();
const app = express();
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "chat" });
});

const server = USE_HTTPS
  ? https.createServer(
      {
        cert: fs.readFileSync(SSL_CERT_PATH),
        key: fs.readFileSync(SSL_KEY_PATH)
      },
      app
    )
  : http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*" }
});

const sessionsByUserId = new Map<number, ChatSession>();
const userIdBySocketId = new Map<string, number>();

/**
 * Match game server public chat censor behavior exactly.
 */
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers
});
const censor = new TextCensor().setStrategy(asteriskCensorStrategy());

function censorMessage(text: string): string {
  const matches = matcher.getAllMatches(text);

  if (matches.length === 0) {
    return text; // No obscenities found
  }

  return censor.applyTo(text, matches);
}

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

function parseLoginPayload(payload: unknown): LoginPayload | null {
  if (!payload || typeof payload !== "object") return null;
  const token = (payload as { token?: unknown }).token;
  const serverIdRaw = (payload as { server?: unknown }).server;
  if (typeof token !== "string" || token.trim().length === 0) return null;
  const serverId = Number(serverIdRaw);
  return {
    token: token.trim(),
    server: Number.isFinite(serverId) && Number.isInteger(serverId) && serverId > 0 ? serverId : 1
  };
}

function parseNamePayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const name = (payload as { name?: unknown }).name;
  if (typeof name !== "string") return null;
  const normalized = normalizeUsername(name);
  return normalized.length > 0 ? normalized : null;
}

function parsePrivateMessagePayload(payload: unknown): { to: string; msg: string } | null {
  if (!payload || typeof payload !== "object") return null;
  const toRaw = (payload as { to?: unknown }).to;
  const msgRaw = (payload as { msg?: unknown }).msg;
  if (typeof toRaw !== "string" || typeof msgRaw !== "string") return null;
  const to = normalizeUsername(toRaw);
  const msg = msgRaw.trim().slice(0, 500);
  if (!to || !msg) return null;
  return { to, msg };
}

async function findUserByUsernameInsensitive(username: string): Promise<UsernameRow | null> {
  const rows = await prisma.$queryRaw<UsernameRow[]>`
    SELECT "id", "username"
    FROM "users"
    WHERE LOWER("username") = LOWER(${username})
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function getUserModeration(userId: number): Promise<ModerationRow | null> {
  const rows = await prisma.$queryRaw<ModerationRow[]>`
    SELECT "id", "username", "playerType", "banReason", "bannedUntil", "muteReason", "mutedUntil"
    FROM "users"
    WHERE "id" = ${userId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

function normalizePlayerType(rawValue: unknown): number {
  const value = Number(rawValue);
  // Keep parity with apps/game/src/protocol/enums/PlayerType.ts values (0-3).
  if (Number.isInteger(value) && value >= 0 && value <= 3) {
    return value;
  }
  return 0;
}

async function clearExpiredBanIfNeeded(userId: number, row: ModerationRow): Promise<void> {
  if (row.banReason && row.bannedUntil && row.bannedUntil <= new Date()) {
    await prisma.$executeRaw`
      UPDATE "users"
      SET "banReason" = NULL, "bannedUntil" = NULL
      WHERE "id" = ${userId}
    `;
  }
}

async function clearExpiredMuteIfNeeded(userId: number, row: ModerationRow): Promise<void> {
  if (row.muteReason && row.mutedUntil && row.mutedUntil <= new Date()) {
    await prisma.$executeRaw`
      UPDATE "users"
      SET "muteReason" = NULL, "mutedUntil" = NULL
      WHERE "id" = ${userId}
    `;
  }
}

function isActiveBan(row: ModerationRow): boolean {
  if (!row.banReason) return false;
  if (row.bannedUntil === null) return true;
  return row.bannedUntil > new Date();
}

function isActiveMute(row: ModerationRow): boolean {
  if (!row.muteReason) return false;
  if (row.mutedUntil === null) return true;
  return row.mutedUntil > new Date();
}

async function loadFriendList(userId: number): Promise<string[]> {
  const rows = await prisma.$queryRaw<Array<{ username: string }>>`
    SELECT u."username"
    FROM "chat_friends" f
    INNER JOIN "users" u ON u."id" = f."targetUserId"
    WHERE f."ownerUserId" = ${userId}
    ORDER BY u."username" ASC
  `;
  return rows.map((row) => normalizeUsername(row.username));
}

async function loadBlockedList(userId: number): Promise<string[]> {
  const rows = await prisma.$queryRaw<Array<{ username: string }>>`
    SELECT u."username"
    FROM "chat_blocks" b
    INNER JOIN "users" u ON u."id" = b."blockedUserId"
    WHERE b."ownerUserId" = ${userId}
    ORDER BY u."username" ASC
  `;
  return rows.map((row) => normalizeUsername(row.username));
}

async function isBlocked(ownerUserId: number, blockedUserId: number): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT "id"
    FROM "chat_blocks"
    WHERE "ownerUserId" = ${ownerUserId} AND "blockedUserId" = ${blockedUserId}
    LIMIT 1
  `;
  return rows.length > 0;
}

async function isFriend(ownerUserId: number, targetUserId: number): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT "id"
    FROM "chat_friends"
    WHERE "ownerUserId" = ${ownerUserId} AND "targetUserId" = ${targetUserId}
    LIMIT 1
  `;
  return rows.length > 0;
}

async function notifyFriendStatus(targetUserId: number, payload: { name: string; server: number; online: boolean }): Promise<void> {
  const rows = await prisma.$queryRaw<Array<{ ownerUserId: number }>>`
    SELECT "ownerUserId"
    FROM "chat_friends"
    WHERE "targetUserId" = ${targetUserId}
  `;

  for (const row of rows) {
    const ownerSession = sessionsByUserId.get(row.ownerUserId);
    if (!ownerSession) continue;
    ownerSession.socket.emit("friendloggedinorout", payload);
  }
}

async function handleAuthenticatedDisconnect(socketId: string): Promise<void> {
  const userId = userIdBySocketId.get(socketId);
  if (!userId) return;
  userIdBySocketId.delete(socketId);

  const session = sessionsByUserId.get(userId);
  if (!session || session.socket.id !== socketId) {
    return;
  }

  sessionsByUserId.delete(userId);
  await notifyFriendStatus(userId, {
    name: session.username,
    server: session.serverId,
    online: false
  });
}

function verifyChatToken(token: string): ChatTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded !== "object") return null;
    return decoded as ChatTokenPayload;
  } catch {
    return null;
  }
}

io.on("connection", (socket) => {
  socket.emit("canlogin", true);

  socket.on("login", async (payload: unknown) => {
    const login = parseLoginPayload(payload);
    if (!login) {
      socket.disconnect(true);
      return;
    }

    const decoded = verifyChatToken(login.token);
    const tokenUserId = Number(decoded?.id);
    if (!decoded || !Number.isInteger(tokenUserId) || tokenUserId <= 0) {
      socket.disconnect(true);
      return;
    }

    const user = await getUserModeration(tokenUserId);
    if (!user) {
      socket.disconnect(true);
      return;
    }

    await clearExpiredBanIfNeeded(tokenUserId, user);
    await clearExpiredMuteIfNeeded(tokenUserId, user);

    if (isActiveBan(user)) {
      socket.disconnect(true);
      return;
    }

    const username = normalizeUsername(user.username);
    const existingSession = sessionsByUserId.get(tokenUserId);
    if (existingSession && existingSession.socket.id !== socket.id) {
      existingSession.socket.disconnect(true);
    }

    const session: ChatSession = {
      userId: tokenUserId,
      username,
      playerType: normalizePlayerType(user.playerType),
      serverId: login.server,
      socket
    };
    sessionsByUserId.set(tokenUserId, session);
    userIdBySocketId.set(socket.id, tokenUserId);

    const [friends, blocked] = await Promise.all([
      loadFriendList(tokenUserId),
      loadBlockedList(tokenUserId)
    ]);

    socket.emit("friendlistloaded", {
      appearance: 1,
      friends,
      blocked
    });

    for (const friendName of friends) {
      const onlineFriend = [...sessionsByUserId.values()].find((value) => value.username === friendName);
      if (!onlineFriend) continue;
      socket.emit("friendisonlinewhenweloggedin", {
        name: friendName,
        server: onlineFriend.serverId,
        online: true
      });
    }

    await notifyFriendStatus(tokenUserId, {
      name: username,
      server: login.server,
      online: true
    });
  });

  socket.on("addfriend", async (payload: unknown) => {
    const userId = userIdBySocketId.get(socket.id);
    const current = userId ? sessionsByUserId.get(userId) : undefined;
    if (!current) return;

    const name = parseNamePayload(payload);
    if (!name) return;

    const target = await findUserByUsernameInsensitive(name);
    if (!target || target.id === current.userId) {
      socket.emit("addedfriend", { name, success: false });
      return;
    }

    const targetName = normalizeUsername(target.username);
    if (await isBlocked(current.userId, target.id)) {
      socket.emit("addedfriend", { name: targetName, success: false });
      return;
    }

    if (await isFriend(current.userId, target.id)) {
      socket.emit("addedfriend", { name: targetName, success: false });
      return;
    }

    await prisma.$executeRaw`
      INSERT INTO "chat_friends" ("ownerUserId", "targetUserId")
      VALUES (${current.userId}, ${target.id})
      ON CONFLICT ("ownerUserId", "targetUserId") DO NOTHING
    `;

    socket.emit("addedfriend", { name: targetName, success: true });

    const onlineFriend = sessionsByUserId.get(target.id);
    if (onlineFriend) {
      socket.emit("friendisonlinewhenweloggedin", {
        name: onlineFriend.username,
        server: onlineFriend.serverId,
        online: true
      });
    }
  });

  socket.on("removefriend", async (payload: unknown) => {
    const userId = userIdBySocketId.get(socket.id);
    const current = userId ? sessionsByUserId.get(userId) : undefined;
    if (!current) return;

    const name = parseNamePayload(payload);
    if (!name) return;

    const target = await findUserByUsernameInsensitive(name);
    const targetName = normalizeUsername(target?.username ?? name);

    if (target) {
      await prisma.$executeRaw`
        DELETE FROM "chat_friends"
        WHERE "ownerUserId" = ${current.userId} AND "targetUserId" = ${target.id}
      `;
    }

    socket.emit("removedfriend", targetName);
  });

  socket.on("blockuser", async (payload: unknown) => {
    const userId = userIdBySocketId.get(socket.id);
    const current = userId ? sessionsByUserId.get(userId) : undefined;
    if (!current) return;

    const name = parseNamePayload(payload);
    if (!name) return;

    const target = await findUserByUsernameInsensitive(name);
    if (!target || target.id === current.userId) {
      socket.emit("blockeduser", { name, success: false });
      return;
    }

    const targetName = normalizeUsername(target.username);
    if (await isBlocked(current.userId, target.id)) {
      socket.emit("blockeduser", { name: targetName, success: false });
      return;
    }

    await prisma.$executeRaw`
      INSERT INTO "chat_blocks" ("ownerUserId", "blockedUserId")
      VALUES (${current.userId}, ${target.id})
      ON CONFLICT ("ownerUserId", "blockedUserId") DO NOTHING
    `;
    await prisma.$executeRaw`
      DELETE FROM "chat_friends"
      WHERE "ownerUserId" = ${current.userId} AND "targetUserId" = ${target.id}
    `;

    socket.emit("blockeduser", { name: targetName, success: true });
  });

  socket.on("unblockuser", async (payload: unknown) => {
    const userId = userIdBySocketId.get(socket.id);
    const current = userId ? sessionsByUserId.get(userId) : undefined;
    if (!current) return;

    const name = parseNamePayload(payload);
    if (!name) return;

    const target = await findUserByUsernameInsensitive(name);
    const targetName = normalizeUsername(target?.username ?? name);

    if (target) {
      await prisma.$executeRaw`
        DELETE FROM "chat_blocks"
        WHERE "ownerUserId" = ${current.userId} AND "blockedUserId" = ${target.id}
      `;
    }

    socket.emit("unblockeduser", targetName);
  });

  socket.on("privatemessage", async (payload: unknown) => {
    const userId = userIdBySocketId.get(socket.id);
    const current = userId ? sessionsByUserId.get(userId) : undefined;
    if (!current) return;

    const message = parsePrivateMessagePayload(payload);
    if (!message) return;
    const censoredMessage = censorMessage(message.msg);

    const moderation = await getUserModeration(current.userId);
    if (!moderation) {
      socket.disconnect(true);
      return;
    }

    await clearExpiredBanIfNeeded(current.userId, moderation);
    await clearExpiredMuteIfNeeded(current.userId, moderation);
    if (isActiveBan(moderation)) {
      socket.disconnect(true);
      return;
    }
    if (isActiveMute(moderation)) {
      return;
    }

    const target = await findUserByUsernameInsensitive(message.to);
    if (!target || target.id === current.userId) return;

    const targetName = normalizeUsername(target.username);
    const senderIsFriendWithTarget = await isFriend(current.userId, target.id);
    if (!senderIsFriendWithTarget) return;

    const recipientBlockedSender = await isBlocked(target.id, current.userId);
    socket.emit("pmed", {
      type: current.playerType,
      to: targetName,
      msg: censoredMessage
    });

    if (recipientBlockedSender) return;
    const targetSession = sessionsByUserId.get(target.id);
    if (!targetSession) return;

    targetSession.socket.emit("pm", {
      type: current.playerType,
      from: current.username,
      msg: censoredMessage
    });
  });

  socket.on("disconnect", () => {
    void handleAuthenticatedDisconnect(socket.id);
  });
});

server.listen(CHAT_PORT, () => {
  const protocol = USE_HTTPS ? "https" : "http";
  console.log(`Chat server listening on ${protocol}://localhost:${CHAT_PORT}`);
});
