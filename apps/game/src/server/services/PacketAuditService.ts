import fs from "fs";
import path from "path";
import crypto from "crypto";
import { chmod, chown } from "fs/promises";
import Database from "better-sqlite3";
import type { Json } from "@openspell/db";
import { getPrisma } from "../../db";

type InvalidPacketInput = {
  userId: number | null;
  serverId?: number;
  actionType?: number;
  packetName: string;
  reason: string;
  payload?: unknown;
  details?: Record<string, unknown>;
};

type PacketTraceInput = {
  userId: number | null;
  serverId?: number;
  packetNumber: number;
  packetName: string;
  actionType?: number;
  payload: unknown;
  timestamp?: Date;
};

type InvalidPacketBucket = {
  userId: number | null;
  serverId: number | null;
  actionType: number | null;
  packetName: string;
  reason: string;
  payloadHash: string;
  payloadSample: Json | null;
  details: Json | null;
  occurredAt: Date;
  count: number;
};

type TraceFileMeta = {
  userId: number | null;
  serverId: number | null;
  bucketStart: Date;
  bucketEnd: Date;
  packetCount: number;
  filePath: string;
  byteCount: number;
};

type PacketAuditConfig = {
  invalidEnabled: boolean;
  invalidBatchSize: number;
  invalidFlushMs: number;
  invalidDedupWindowMs: number;
  invalidSampleRate: number;
  traceEnabled: boolean;
  tracePath: string;
  traceRotateMb: number;
  traceRotateMinutes: number;
  traceFlushMs: number;
  traceRetentionDays: number;
  traceSampleRate: number;
};

const DEFAULT_TRACE_DIR = path.resolve(process.cwd(), "logs", "packets");
const TRACE_PATH_SERVER_TOKEN = "{serverId}";
const TRACE_PATH_WORLD_TOKEN = "{worldId}";
const UNKNOWN_ACTION_TYPE = -1;

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

function parseFloatSafe(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveTracePath(basePath: string, serverId: number | null, explicitPath: boolean): string {
  const serverIdValue = serverId ?? "unknown";
  if (basePath.includes(TRACE_PATH_SERVER_TOKEN) || basePath.includes(TRACE_PATH_WORLD_TOKEN)) {
    return basePath
      .replace(new RegExp(TRACE_PATH_SERVER_TOKEN, "g"), String(serverIdValue))
      .replace(new RegExp(TRACE_PATH_WORLD_TOKEN, "g"), String(serverIdValue));
  }

  if (!explicitPath) {
    return path.join(basePath, `world-${serverIdValue}`);
  }

  return basePath;
}

function safeStringify(payload: unknown): string {
  try {
    return JSON.stringify(payload);
  } catch (err) {
    return JSON.stringify({ error: "payload_stringify_failed" });
  }
}

function normalizeJsonValue(value: unknown): Json | null {
  if (value === undefined) return null;
  try {
    return JSON.parse(safeStringify(value)) as Json;
  } catch (err) {
    return null;
  }
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function getBucketStart(date: Date): Date {
  const bucket = new Date(date);
  bucket.setMinutes(0, 0, 0);
  return bucket;
}

function normalizeActionType(actionType: number | null | undefined): number {
  if (typeof actionType !== "number" || !Number.isFinite(actionType)) {
    return UNKNOWN_ACTION_TYPE;
  }
  return Math.trunc(actionType);
}

export class PacketAuditService {
  private readonly config: PacketAuditConfig;
  private readonly onInvalidPacket?: (input: InvalidPacketInput) => void;
  private readonly invalidBuckets = new Map<string, InvalidPacketBucket>();
  private readonly pendingTraceFiles: TraceFileMeta[] = [];
  private invalidFlushTimer: NodeJS.Timeout | null = null;
  private traceFlushTimer: NodeJS.Timeout | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;

  private traceDb: Database.Database | null = null;
  private traceStmt: Database.Statement | null = null;
  private traceFilePath: string | null = null;
  private traceFileStart: Date | null = null;
  private traceDateKey: string | null = null;
  private tracePacketCount = 0;
  private traceByteCount = 0;

  constructor(
    private readonly serverId: number | null,
    private readonly dbEnabled: boolean,
    options?: { onInvalidPacket?: (input: InvalidPacketInput) => void }
  ) {
    this.config = {
      invalidEnabled: parseBoolean(process.env.PACKET_LOG_INVALID_ENABLED, true),
      invalidBatchSize: parseNumber(process.env.PACKET_LOG_INVALID_BATCH_SIZE, 200),
      invalidFlushMs: parseNumber(process.env.PACKET_LOG_INVALID_FLUSH_MS, 2000),
      invalidDedupWindowMs: parseNumber(process.env.PACKET_LOG_INVALID_DEDUP_WINDOW_MS, 60000),
      invalidSampleRate: parseFloatSafe(process.env.PACKET_LOG_INVALID_SAMPLE_RATE, 1.0),
      traceEnabled: parseBoolean(process.env.PACKET_TRACE_ENABLED, true),
      tracePath: resolveTracePath(
        process.env.PACKET_TRACE_PATH ? path.resolve(process.env.PACKET_TRACE_PATH) : DEFAULT_TRACE_DIR,
        this.serverId,
        Boolean(process.env.PACKET_TRACE_PATH)
      ),
      traceRotateMb: parseNumber(process.env.PACKET_TRACE_ROTATE_MB, 50),
      traceRotateMinutes: parseNumber(process.env.PACKET_TRACE_ROTATE_MINUTES, 10),
      traceFlushMs: parseNumber(process.env.PACKET_TRACE_FLUSH_MS, 1000),
      traceRetentionDays: parseNumber(process.env.PACKET_TRACE_RETENTION_DAYS, 30),
      traceSampleRate: parseFloatSafe(process.env.PACKET_TRACE_SAMPLE_RATE, 1.0),
    };
    this.onInvalidPacket = options?.onInvalidPacket;

    if (this.config.traceEnabled) {
      fs.mkdirSync(this.config.tracePath, { recursive: true });
    }

    if (this.dbEnabled && this.config.invalidEnabled) {
      this.invalidFlushTimer = setInterval(() => void this.flushInvalidBuckets(), this.config.invalidFlushMs);
    }

    if (this.dbEnabled && this.config.traceEnabled) {
      this.traceFlushTimer = setInterval(() => void this.flushTraceMetadata(), this.config.traceFlushMs);
      this.cleanupTimer = setInterval(() => void this.cleanupTraceFiles(), 60 * 60 * 1000);
    }
  }

  logInvalidPacket(input: InvalidPacketInput): void {
    this.onInvalidPacket?.(input);
    if (!this.config.invalidEnabled || !this.dbEnabled) return;
    if (this.config.invalidSampleRate < 1 && Math.random() > this.config.invalidSampleRate) {
      return;
    }

    const payloadJson = input.payload ? safeStringify(input.payload) : "";
    const payloadHash = sha256(payloadJson);
    const bucketKey = [
      input.userId ?? "null",
      input.serverId ?? this.serverId ?? "null",
      input.actionType ?? "null",
      input.packetName,
      input.reason,
      payloadHash,
    ].join("|");

    const now = new Date();
    const existing = this.invalidBuckets.get(bucketKey);
    if (existing && now.getTime() - existing.occurredAt.getTime() <= this.config.invalidDedupWindowMs) {
      existing.count += 1;
      existing.occurredAt = now;
      return;
    }

    this.invalidBuckets.set(bucketKey, {
      userId: input.userId ?? null,
      serverId: input.serverId ?? this.serverId ?? null,
      actionType: input.actionType ?? null,
      packetName: input.packetName,
      reason: input.reason,
      payloadHash,
      payloadSample: normalizeJsonValue(input.payload),
      details: normalizeJsonValue(input.details),
      occurredAt: now,
      count: 1,
    });

    if (this.invalidBuckets.size >= this.config.invalidBatchSize) {
      void this.flushInvalidBuckets();
    }
  }

  logPacketTrace(input: PacketTraceInput): void {
    if (!this.config.traceEnabled) return;
    if (this.config.traceSampleRate < 1 && Math.random() > this.config.traceSampleRate) {
      return;
    }

    const timestamp = input.timestamp ?? new Date();
    this.ensureTraceFile(timestamp);
    if (!this.traceStmt) return;

    const payloadActionType =
      Array.isArray(input.payload) && typeof input.payload[0] === "number" ? input.payload[0] : null;
    const entry = {
      userId: input.userId,
      serverId: input.serverId ?? this.serverId,
      timestamp: timestamp.toISOString(),
      packetNumber: input.packetNumber,
      packetName: input.packetName,
      actionType: input.actionType ?? input.packetNumber ?? payloadActionType,
      payload: input.payload,
    };

    const payloadJson = safeStringify(entry.payload);
    this.traceStmt?.run(
      entry.timestamp,
      entry.userId ?? null,
      entry.serverId ?? null,
      entry.actionType ?? null,
      entry.packetName,
      payloadJson
    );
    this.tracePacketCount += 1;
    this.traceByteCount += Buffer.byteLength(payloadJson);
    this.rotateIfNeeded(timestamp);
  }

  async shutdown(): Promise<void> {
    if (this.invalidFlushTimer) clearInterval(this.invalidFlushTimer);
    if (this.traceFlushTimer) clearInterval(this.traceFlushTimer);
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);

    await this.flushInvalidBuckets();
    this.closeTraceFile();
    await this.flushTraceMetadata();
  }

  private ensureTraceFile(now: Date): void {
    const nextDateKey = this.getTraceDateKey(now);
    if (!this.traceDb || this.traceDateKey !== nextDateKey) {
      this.rotateTraceFile(now);
      return;
    }
  }

  private rotateIfNeeded(now: Date): void {
    if (!this.traceFileStart) return;
    const rotateByDate = this.getTraceDateKey(now) !== this.traceDateKey;
    const rotateBySize = this.traceByteCount >= this.config.traceRotateMb * 1024 * 1024;

    if (rotateByDate || rotateBySize) {
      this.rotateTraceFile(now);
    }
  }

  private rotateTraceFile(now: Date): void {
    this.closeTraceFile();

    const dateKey = this.getTraceDateKey(now);
    const fileName = `packets-${dateKey}.db`;
    const filePath = path.join(this.config.tracePath, fileName);

    fs.mkdirSync(this.config.tracePath, { recursive: true, mode: 0o755 });

    this.traceFilePath = filePath;
    this.traceFileStart = now;
    this.traceDateKey = dateKey;
    this.tracePacketCount = 0;
    this.traceByteCount = 0;

    this.traceDb = new Database(filePath);
    this.traceDb.pragma("journal_mode = WAL");
    this.traceDb.pragma("synchronous = NORMAL");
    this.traceDb.exec(`
      CREATE TABLE IF NOT EXISTS packets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        user_id INTEGER,
        server_id INTEGER,
        action_type INTEGER,
        packet_name TEXT,
        payload TEXT,
        created_at REAL DEFAULT (julianday('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_packets_timestamp ON packets(timestamp);
      CREATE INDEX IF NOT EXISTS idx_packets_user_id ON packets(user_id);
    `);
    this.traceStmt = this.traceDb.prepare(`
      INSERT INTO packets (timestamp, user_id, server_id, action_type, packet_name, payload)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    void (async () => {
      try {
        await chmod(filePath, 0o644);
        if (process.platform !== "win32") {
          const uid = process.getuid?.();
          const gid = process.getgid?.();
          if (typeof uid === "number" && typeof gid === "number") {
            await chown(filePath, uid, gid);
          }
        }
      } catch (err) {
        console.warn("[PacketAuditService] Failed to set trace file permissions:", err);
      }
    })();
  }

  private closeTraceFile(): void {
    if (!this.traceDb || !this.traceFilePath || !this.traceFileStart) {
      return;
    }

    const filePath = this.traceFilePath;
    const bucketStart = this.traceFileStart;
    const bucketEnd = new Date();
    const packetCount = this.tracePacketCount;
    let byteCount = this.traceByteCount;

    try {
      if (fs.existsSync(filePath)) {
        byteCount = fs.statSync(filePath).size;
      }
    } catch (err) {
      console.warn(`[PacketAuditService] Failed to stat trace file ${filePath}:`, err);
    }

    this.traceDb.close();

    this.pendingTraceFiles.push({
      userId: null,
      serverId: this.serverId,
      bucketStart,
      bucketEnd,
      packetCount,
      filePath,
      byteCount,
    });

    this.traceDb = null;
    this.traceStmt = null;
    this.traceFilePath = null;
    this.traceFileStart = null;
    this.traceDateKey = null;
  }

  private getTraceDateKey(now: Date): string {
    return now.toISOString().slice(0, 10);
  }

  private async flushInvalidBuckets(): Promise<void> {
    if (!this.dbEnabled || !this.config.invalidEnabled) return;
    if (this.invalidBuckets.size === 0) return;

    const prisma = getPrisma();
    const buckets = Array.from(this.invalidBuckets.values());
    this.invalidBuckets.clear();

    const rollups = new Map<string, { data: any; count: number }>();
    for (const bucket of buckets) {
      const normalizedActionType = normalizeActionType(bucket.actionType);
      const bucketStart = getBucketStart(bucket.occurredAt);
      const key = [
        bucket.userId ?? "null",
        bucket.serverId ?? "null",
        normalizedActionType,
        bucket.packetName,
        bucket.reason,
        bucketStart.toISOString(),
      ].join("|");

      const existing = rollups.get(key);
      if (existing) {
        existing.count += bucket.count;
      } else {
        rollups.set(key, {
          data: {
            userId: bucket.userId,
            serverId: bucket.serverId,
            actionType: normalizedActionType,
            packetName: bucket.packetName,
            reason: bucket.reason,
            bucketStart,
          },
          count: bucket.count,
        });
      }
    }

    const createEvents = prisma.invalidPacketEvent.createMany({
      data: buckets.map((bucket) => ({
        userId: bucket.userId,
        serverId: bucket.serverId,
        actionType: normalizeActionType(bucket.actionType),
        packetName: bucket.packetName,
        reason: bucket.reason,
        payloadHash: bucket.payloadHash,
        payloadSample: bucket.payloadSample ?? undefined,
        details: bucket.details ?? undefined,
        occurredAt: bucket.occurredAt,
        count: bucket.count,
      })),
    });

    const rollupQueries = Array.from(rollups.values()).map((rollup) =>
      prisma.invalidPacketEventRollup.upsert({
        where: {
          userId_serverId_actionType_packetName_reason_bucketStart: {
            userId: rollup.data.userId,
            serverId: rollup.data.serverId,
            actionType: rollup.data.actionType,
            packetName: rollup.data.packetName,
            reason: rollup.data.reason,
            bucketStart: rollup.data.bucketStart,
          },
        },
        update: { count: { increment: rollup.count } },
        create: { ...rollup.data, count: rollup.count },
      })
    );

    try {
      await prisma.$transaction([createEvents, ...rollupQueries]);
    } catch (err) {
      console.warn("[PacketAuditService] Failed to persist invalid packet events:", err);
    }
  }

  private async flushTraceMetadata(): Promise<void> {
    if (!this.dbEnabled || !this.config.traceEnabled) return;
    if (this.pendingTraceFiles.length === 0) return;

    const prisma = getPrisma();
    const pending = this.pendingTraceFiles.splice(0, this.pendingTraceFiles.length);

    await prisma.packetTraceFile.createMany({
      data: pending.map((file) => ({
        userId: file.userId,
        serverId: file.serverId,
        bucketStart: file.bucketStart,
        bucketEnd: file.bucketEnd,
        packetCount: file.packetCount,
        filePath: file.filePath,
        byteCount: file.byteCount,
      })),
    });
  }

  private async cleanupTraceFiles(): Promise<void> {
    if (!this.config.traceEnabled || !this.dbEnabled) return;
    if (this.config.traceRetentionDays <= 0) return;

    const cutoff = new Date(Date.now() - this.config.traceRetentionDays * 24 * 60 * 60 * 1000);
    const prisma = getPrisma();

    const oldFiles = await prisma.packetTraceFile.findMany({
      where: { bucketEnd: { lt: cutoff } },
      select: { id: true, filePath: true },
    });

    if (oldFiles.length === 0) return;

    for (const file of oldFiles) {
      try {
        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath);
        }
      } catch (err) {
        console.warn(`[PacketAuditService] Failed to remove trace file ${file.filePath}:`, err);
      }
    }

    await prisma.packetTraceFile.deleteMany({
      where: { id: { in: oldFiles.map((file: { id: any }) => file.id) } },
    });
  }
}
