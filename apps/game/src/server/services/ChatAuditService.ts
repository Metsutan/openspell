import { getPrisma } from "../../db";

type ChatChannel = "local" | "global";

type ChatMessageInput = {
  userId: number | null;
  usernameSnapshot?: string | null;
  displayNameSnapshot?: string | null;
  message: string;
  channel: ChatChannel;
  mapLevel?: number | null;
  x?: number | null;
  y?: number | null;
  serverId?: number | null;
  playerType?: number | null;
  style?: number | null;
};

type ChatAuditConfig = {
  enabled: boolean;
  batchSize: number;
  flushMs: number;
  retentionDays: number;
};

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

export class ChatAuditService {
  private readonly config: ChatAuditConfig;
  private readonly queue: ChatMessageInput[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly serverId: number | null,
    private readonly dbEnabled: boolean
  ) {
    this.config = {
      enabled: parseBoolean(process.env.CHAT_LOG_ENABLED, true),
      batchSize: parseNumber(process.env.CHAT_LOG_BATCH_SIZE, 200),
      flushMs: parseNumber(process.env.CHAT_LOG_FLUSH_MS, 2000),
      retentionDays: parseNumber(process.env.CHAT_LOG_RETENTION_DAYS, 90),
    };

    if (this.dbEnabled && this.config.enabled) {
      this.flushTimer = setInterval(() => void this.flush(), this.config.flushMs);
      this.cleanupTimer = setInterval(() => void this.cleanup(), 12 * 60 * 60 * 1000);
    }
  }

  logChatMessage(input: ChatMessageInput): void {
    if (!this.config.enabled || !this.dbEnabled) return;
    this.queue.push({
      ...input,
      serverId: input.serverId ?? this.serverId,
    });
    this.flushIfNeeded();
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    await this.flush();
  }

  private flushIfNeeded(): void {
    if (this.queue.length >= this.config.batchSize) {
      void this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (!this.dbEnabled || !this.config.enabled) return;
    if (this.queue.length === 0) return;

    const prisma = getPrisma();
    const batch = this.queue.splice(0, this.queue.length);
    const inserts = batch.map((entry) =>
      prisma.$executeRaw`
        INSERT INTO "chat_message_events" (
          "userId",
          "usernameSnapshot",
          "displayNameSnapshot",
          "channel",
          "message",
          "mapLevel",
          "x",
          "y",
          "serverId",
          "playerType",
          "style"
        ) VALUES (
          ${entry.userId ?? null},
          ${entry.usernameSnapshot ?? null},
          ${entry.displayNameSnapshot ?? null},
          ${entry.channel},
          ${entry.message},
          ${entry.mapLevel ?? null},
          ${entry.x ?? null},
          ${entry.y ?? null},
          ${entry.serverId ?? null},
          ${entry.playerType ?? null},
          ${entry.style ?? null}
        )
      `
    );
    await prisma.$transaction(inserts);
  }

  private async cleanup(): Promise<void> {
    if (!this.dbEnabled || !this.config.enabled) return;
    if (this.config.retentionDays <= 0) return;

    const cutoff = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
    const prisma = getPrisma();
    await prisma.$executeRaw`
      DELETE FROM "chat_message_events"
      WHERE "sentAt" < ${cutoff}
    `;
  }
}
