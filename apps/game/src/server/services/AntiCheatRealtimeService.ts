import { getPrisma } from "../../db";
import type { ItemCatalog } from "../../world/items/ItemCatalog";

type AntiCheatSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type ActionRecord = {
  lastActionAt: number;
  lastTick: number;
  actionsThisTick: number;
};

type InvalidPacketRecord = {
  timestamps: number[];
};

type TradeRecord = {
  entries: Array<{ at: number; amount: number }>;
};

type WealthTransferEntry = {
  at: number;
  value: number;
  itemId: number;
  amount: number;
  unitValue: number;
  source: string;
};

type WealthTransferRecord = {
  entries: WealthTransferEntry[];
};

type SessionTier = 0 | 1 | 2 | 3 | 4;

type SessionRecord = {
  startedAt: number;
  lastTier: SessionTier;
};

type AntiCheatConfig = {
  enabled: boolean;
  actionMinIntervalMs: number;
  maxActionsPerTick: number;
  invalidWindowMs: number;
  invalidMax: number;
  tradeWindowMs: number;
  tradeMax: number;
  mulingAmountThreshold: number;
  wealthTransferWindowMs: number;
  wealthTransferValueThreshold: number;
  sharedIpWindowMs: number;
  sessionAlertStartHours: number;
  sessionAlertStepHours: number;
  alertCooldownMs: number;
  cleanupMs: number;
  overrideRefreshMs: number;
};

type AlertInput = {
  userId: number;
  severity: AntiCheatSeverity;
  category: string;
  description: string;
  evidence: Record<string, unknown>;
  serverId?: number | null;
  relatedEntityId?: number | null;
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

export class AntiCheatRealtimeService {
  private readonly config: AntiCheatConfig;
  private readonly actionByUser = new Map<number, ActionRecord>();
  private readonly invalidByUser = new Map<number, InvalidPacketRecord>();
  private readonly tradesByPair = new Map<string, TradeRecord>();
  private readonly wealthTransfersByPair = new Map<string, WealthTransferRecord>();
  private readonly sharedIpTransfersByPair = new Map<string, WealthTransferRecord>();
  private readonly sharedIpCache = new Map<string, { checkedAt: number; shared: boolean; ip: string | null }>();
  private readonly recentAlerts = new Map<string, number>();
  private readonly overrides = new Map<string, number>();
  private readonly sessionsByUser = new Map<number, SessionRecord>();
  private itemCatalog: ItemCatalog | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private overrideTimer: NodeJS.Timeout | null = null;

  constructor(private readonly serverId: number | null, private readonly dbEnabled: boolean) {
    this.config = {
      enabled: parseBoolean(process.env.ANTI_CHEAT_REALTIME_ENABLED, true),
      actionMinIntervalMs: parseNumber(process.env.ANTI_CHEAT_ACTION_MIN_INTERVAL_MS, 550),
      maxActionsPerTick: parseNumber(process.env.ANTI_CHEAT_MAX_ACTIONS_PER_TICK, 2),
      invalidWindowMs: parseNumber(process.env.ANTI_CHEAT_INVALID_WINDOW_MS, 60_000),
      invalidMax: parseNumber(process.env.ANTI_CHEAT_INVALID_MAX, 10),
      tradeWindowMs: parseNumber(process.env.ANTI_CHEAT_TRADE_WINDOW_MS, 120_000),
      tradeMax: parseNumber(process.env.ANTI_CHEAT_TRADE_MAX, 6),
      mulingAmountThreshold: parseNumber(process.env.ANTI_CHEAT_MULING_AMOUNT_THRESHOLD, 2500),
      wealthTransferWindowMs: parseNumber(process.env.ANTI_CHEAT_WEALTH_TRANSFER_WINDOW_MS, 10_000),
      wealthTransferValueThreshold: parseNumber(process.env.ANTI_CHEAT_WEALTH_TRANSFER_VALUE_THRESHOLD, 500_000),
      sharedIpWindowMs: parseNumber(process.env.ANTI_CHEAT_SHARED_IP_WINDOW_MS, 30_000),
      sessionAlertStartHours: parseNumber(process.env.ANTI_CHEAT_SESSION_ALERT_START_HOURS, 9),
      sessionAlertStepHours: parseNumber(process.env.ANTI_CHEAT_SESSION_ALERT_STEP_HOURS, 3),
      alertCooldownMs: parseNumber(process.env.ANTI_CHEAT_ALERT_COOLDOWN_MS, 600_000),
      cleanupMs: parseNumber(process.env.ANTI_CHEAT_REALTIME_CLEANUP_MS, 120_000),
      overrideRefreshMs: parseNumber(process.env.ANTI_CHEAT_OVERRIDE_REFRESH_MS, 60_000)
    };

    if (this.config.enabled) {
      this.cleanupTimer = setInterval(() => this.cleanup(), this.config.cleanupMs);
    }
    if (this.dbEnabled && this.config.enabled) {
      void this.refreshOverrides();
      this.overrideTimer = setInterval(() => void this.refreshOverrides(), this.config.overrideRefreshMs);
    }
  }

  recordAction(userId: number, actionType: number, currentTick: number): void {
    if (!this.shouldRun()) return;
    const now = Date.now();
    const record = this.actionByUser.get(userId) ?? {
      lastActionAt: 0,
      lastTick: currentTick,
      actionsThisTick: 0
    };

    if (record.lastActionAt > 0) {
      const delta = now - record.lastActionAt;
      if (delta < this.config.actionMinIntervalMs) {
        void this.createAlert({
          userId,
          severity: "HIGH",
          category: "ACTION_RATE",
          description: `Action ${actionType} sent ${delta}ms after previous (min ${this.config.actionMinIntervalMs}ms)`,
          evidence: { actionType, deltaMs: delta, minIntervalMs: this.config.actionMinIntervalMs },
          serverId: this.serverId
        });
      }
    }

    if (record.lastTick === currentTick) {
      record.actionsThisTick += 1;
    } else {
      record.actionsThisTick = 1;
      record.lastTick = currentTick;
    }

    if (record.actionsThisTick > this.config.maxActionsPerTick) {
      void this.createAlert({
        userId,
        severity: "CRITICAL",
        category: "TICK_STUFFING",
        description: `Multiple actions (${record.actionsThisTick}) in a single tick`,
        evidence: {
          actionType,
          tick: currentTick,
          actionsThisTick: record.actionsThisTick,
          maxActionsPerTick: this.config.maxActionsPerTick
        },
        serverId: this.serverId
      });
    }

    record.lastActionAt = now;
    this.actionByUser.set(userId, record);
  }

  recordInvalidPacket(userId: number | null, packetName: string, reason: string): void {
    if (!this.shouldRun() || userId === null) return;
    const now = Date.now();
    const record = this.invalidByUser.get(userId) ?? { timestamps: [] };
    record.timestamps.push(now);

    const cutoff = now - this.config.invalidWindowMs;
    record.timestamps = record.timestamps.filter((t) => t >= cutoff);

    const invalidMax = this.getOverride("ANTI_CHEAT_INVALID_MAX", this.config.invalidMax);
    if (record.timestamps.length > invalidMax) {
      void this.createAlert({
        userId,
        severity: "HIGH",
        category: "PACKET_ABUSE",
        description: `${record.timestamps.length} invalid packets in ${Math.round(this.config.invalidWindowMs / 1000)}s`,
        evidence: {
          packetName,
          reason,
          windowMs: this.config.invalidWindowMs,
          count: record.timestamps.length,
          threshold: invalidMax
        },
        serverId: this.serverId
      });
    }

    this.invalidByUser.set(userId, record);
  }

  recordItemDrop(input: { userId: number; itemId: number; amount: number; groundItemId?: number | null }): void {
    if (!this.shouldRun()) return;
    void input;
  }

  recordItemPickup(input: {
    pickerUserId: number;
    dropperUserId?: number | null;
    itemId: number;
    amount: number;
  }): void {
    if (!this.shouldRun()) return;
    if (!input.dropperUserId || input.dropperUserId === input.pickerUserId) return;
    this.recordInterPlayerItemTransfer({
      fromUserId: input.dropperUserId,
      toUserId: input.pickerUserId,
      itemId: input.itemId,
      amount: input.amount,
      source: "GROUND_ITEM_PICKUP"
    });
  }

  recordTradeTransfer(input: { fromUserId: number; toUserId: number; itemId: number; amount: number }): void {
    if (!this.shouldRun()) return;
    if (input.fromUserId === input.toUserId) return;
    this.recordInterPlayerItemTransfer({
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      itemId: input.itemId,
      amount: input.amount,
      source: "TRADE"
    });
  }

  recordSessionStart(userId: number): void {
    if (!this.shouldRun()) return;
    this.sessionsByUser.set(userId, { startedAt: Date.now(), lastTier: 0 });
  }

  recordSessionEnd(userId: number): void {
    this.sessionsByUser.delete(userId);
  }

  async shutdown(): Promise<void> {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    if (this.overrideTimer) clearInterval(this.overrideTimer);
  }

  private buildTradePairKey(dropperUserId: number, pickerUserId: number, itemId: number): string {
    const [a, b] = dropperUserId < pickerUserId ? [dropperUserId, pickerUserId] : [pickerUserId, dropperUserId];
    return `${a}:${b}:${itemId}`;
  }

  private buildUserPairKey(userA: number, userB: number): string {
    const [a, b] = userA < userB ? [userA, userB] : [userB, userA];
    return `${a}:${b}`;
  }

  private shouldRun(): boolean {
    return this.config.enabled && this.dbEnabled;
  }

  private recordInterPlayerItemTransfer(input: {
    fromUserId: number;
    toUserId: number;
    itemId: number;
    amount: number;
    source: string;
  }): void {
    const now = Date.now();
    const unitValue = this.getItemUnitValue(input.itemId);
    const transferValue = unitValue * input.amount;
    const pairKey = this.buildTradePairKey(input.fromUserId, input.toUserId, input.itemId);
    const record = this.tradesByPair.get(pairKey) ?? { entries: [] };
    record.entries.push({ at: now, amount: input.amount });

    const cutoff = now - this.config.tradeWindowMs;
    record.entries = record.entries.filter((entry) => entry.at >= cutoff);

    const tradeMax = this.getOverride("ANTI_CHEAT_TRADE_MAX", this.config.tradeMax);
    if (record.entries.length >= tradeMax) {
      void this.createAlert({
        userId: input.toUserId,
        severity: "MEDIUM",
        category: "MULING_DETECTED",
        description: `Frequent item transfers between users ${input.fromUserId} and ${input.toUserId}`,
        evidence: {
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
          itemId: input.itemId,
          source: input.source,
          windowMs: this.config.tradeWindowMs,
          count: record.entries.length,
          threshold: tradeMax,
          possibleReasons: [
            "Transferring wealth to alt account",
            "Real-world trading (RWT)",
            "Helping friend move items",
            "Legitimate trading"
          ]
        },
        serverId: this.serverId
      });
    }

    const totalAmount = record.entries.reduce((sum, entry) => sum + entry.amount, 0);
    const mulingThreshold = this.getOverride(
      "ANTI_CHEAT_MULING_AMOUNT_THRESHOLD",
      this.config.mulingAmountThreshold
    );
    if (totalAmount >= mulingThreshold) {
      void this.createAlert({
        userId: input.toUserId,
        severity: "HIGH",
        category: "MULING_LARGE_TRANSFER",
        description: `Large item transfer (${totalAmount}) between users ${input.fromUserId} and ${input.toUserId}`,
        evidence: {
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
          itemId: input.itemId,
          source: input.source,
          windowMs: this.config.tradeWindowMs,
          totalAmount,
          threshold: mulingThreshold
        },
        serverId: this.serverId
      });
    }

    this.tradesByPair.set(pairKey, record);

    this.recordWealthTransfer({
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      itemId: input.itemId,
      amount: input.amount,
      unitValue,
      value: transferValue,
      source: input.source
    });
  }

  private getOverride(key: string, fallback: number): number {
    return this.overrides.get(key) ?? fallback;
  }

  private getItemUnitValue(itemId: number): number {
    const unitValue = this.itemCatalog?.getDefinitionById(itemId)?.cost;
    if (!Number.isFinite(unitValue)) return 0;
    return unitValue ?? 0;
  }

  setItemCatalog(itemCatalog: ItemCatalog | null): void {
    this.itemCatalog = itemCatalog;
  }

  private async refreshOverrides(): Promise<void> {
    if (!this.dbEnabled) return;
    try {
      const prisma = getPrisma() as any;
      const records = await prisma.antiCheatThresholdOverride.findMany();
      this.overrides.clear();
      for (const record of records) {
        if (typeof record.value === "number" && Number.isFinite(record.value)) {
          this.overrides.set(record.key, record.value);
        }
      }
    } catch (error) {
      console.warn("[AntiCheatRealtimeService] Failed to refresh overrides:", error);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const alertCutoff = now - this.config.alertCooldownMs;
    for (const [key, timestamp] of this.recentAlerts) {
      if (timestamp < alertCutoff) {
        this.recentAlerts.delete(key);
      }
    }

    const wealthCutoff = now - this.config.wealthTransferWindowMs;
    for (const [key, record] of this.wealthTransfersByPair) {
      record.entries = record.entries.filter((entry) => entry.at >= wealthCutoff);
      if (record.entries.length === 0) {
        this.wealthTransfersByPair.delete(key);
      }
    }

    const sharedIpCutoff = now - this.config.sharedIpWindowMs;
    for (const [key, record] of this.sharedIpTransfersByPair) {
      record.entries = record.entries.filter((entry) => entry.at >= sharedIpCutoff);
      if (record.entries.length === 0) {
        this.sharedIpTransfersByPair.delete(key);
      }
    }

    this.checkSessionDurations(now);
  }

  private checkSessionDurations(now: number): void {
    for (const [userId, record] of this.sessionsByUser) {
      const hours = (now - record.startedAt) / (60 * 60 * 1000);
      const tier = this.getSessionTier(hours);
      if (tier <= record.lastTier) continue;

      record.lastTier = tier;
      this.sessionsByUser.set(userId, record);
      void this.createSessionLengthAlert(userId, hours, record.startedAt, tier);
    }
  }

  private getSessionTier(hours: number): SessionTier {
    const start = this.config.sessionAlertStartHours;
    const step = Math.max(1, this.config.sessionAlertStepHours);
    if (hours < start) return 0;
    if (hours < start + step) return 1;
    if (hours < start + step * 2) return 2;
    if (hours < start + step * 3) return 3;
    return 4;
  }

  private async createSessionLengthAlert(
    userId: number,
    hours: number,
    startedAt: number,
    tier: SessionTier
  ): Promise<void> {
    if (tier === 0) return;
    const severityByTier: Record<SessionTier, AntiCheatSeverity> = {
      0: "LOW",
      1: "LOW",
      2: "MEDIUM",
      3: "HIGH",
      4: "CRITICAL"
    };
    const labelByTier: Record<SessionTier, string> = {
      0: "NONE",
      1: "LOW",
      2: "MEDIUM",
      3: "HIGH",
      4: "CRITICAL"
    };
    const thresholdHours =
      this.config.sessionAlertStartHours + this.config.sessionAlertStepHours * (tier - 1);
    await this.createAlert({
      userId,
      severity: severityByTier[tier],
      category: `SESSION_LENGTH_${labelByTier[tier]}`,
      description: `Long session (${hours.toFixed(1)}h) exceeds ${thresholdHours}h`,
      evidence: {
        sessionStartedAt: new Date(startedAt).toISOString(),
        durationHours: Number(hours.toFixed(2)),
        thresholdHours
      },
      serverId: this.serverId
    });
  }

  private recordWealthTransfer(input: {
    fromUserId: number;
    toUserId: number;
    itemId: number;
    amount: number;
    unitValue: number;
    value: number;
    source: string;
  }): void {
    if (input.value <= 0) return;
    const now = Date.now();
    const pairKey = this.buildUserPairKey(input.fromUserId, input.toUserId);
    const record = this.wealthTransfersByPair.get(pairKey) ?? { entries: [] };
    record.entries.push({
      at: now,
      value: input.value,
      itemId: input.itemId,
      amount: input.amount,
      unitValue: input.unitValue,
      source: input.source
    });

    const windowCutoff = now - this.config.wealthTransferWindowMs;
    record.entries = record.entries.filter((entry) => entry.at >= windowCutoff);
    const totalValue = record.entries.reduce((sum, entry) => sum + entry.value, 0);

    const transferThreshold = this.getOverride(
      "ANTI_CHEAT_WEALTH_TRANSFER_VALUE_THRESHOLD",
      this.config.wealthTransferValueThreshold
    );
    if (totalValue >= transferThreshold) {
      void this.createLargeUnevenWealthTransferAlert({
        fromUserId: input.fromUserId,
        toUserId: input.toUserId,
        totalValue,
        windowMs: this.config.wealthTransferWindowMs,
        entries: record.entries,
        threshold: transferThreshold,
        source: input.source
      });
    }

    if (record.entries.length === 0) {
      this.wealthTransfersByPair.delete(pairKey);
    } else {
      this.wealthTransfersByPair.set(pairKey, record);
    }

    void this.trackSharedIpTransfer({
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      pairKey,
      entry: {
        at: now,
        value: input.value,
        itemId: input.itemId,
        amount: input.amount,
        unitValue: input.unitValue,
        source: input.source
      }
    });
  }

  private async trackSharedIpTransfer(input: {
    fromUserId: number;
    toUserId: number;
    pairKey: string;
    entry: WealthTransferEntry;
  }): Promise<void> {
    const sharedIp = await this.getSharedIp(input.fromUserId, input.toUserId);
    if (!sharedIp) return;

    const record = this.sharedIpTransfersByPair.get(input.pairKey) ?? { entries: [] };
    record.entries.push(input.entry);
    const windowCutoff = Date.now() - this.config.sharedIpWindowMs;
    record.entries = record.entries.filter((entry) => entry.at >= windowCutoff);
    const totalValue = record.entries.reduce((sum, entry) => sum + entry.value, 0);

    if (record.entries.length > 0) {
      void this.createAlert({
        userId: input.toUserId,
        severity: "HIGH",
        category: "MULING_SHARED_IP_TRANSFER",
        description: `Wealth transfer between shared IP accounts (${sharedIp})`,
        evidence: {
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
          ip: sharedIp,
          totalValue,
          windowMs: this.config.sharedIpWindowMs,
          entryCount: record.entries.length
        },
        serverId: this.serverId
      });
    }

    if (record.entries.length === 0) {
      this.sharedIpTransfersByPair.delete(input.pairKey);
    } else {
      this.sharedIpTransfersByPair.set(input.pairKey, record);
    }
  }

  private async getSharedIp(userA: number, userB: number): Promise<string | null> {
    const cacheKey = this.buildUserPairKey(userA, userB);
    const now = Date.now();
    const cached = this.sharedIpCache.get(cacheKey);
    if (cached && now - cached.checkedAt < 5 * 60 * 1000) {
      return cached.shared ? cached.ip : null;
    }

    const prisma = getPrisma() as any;
    const userAIp = await prisma.userIP.findFirst({
      where: { userId: userA },
      orderBy: { lastSeen: "desc" },
      select: { ip: true }
    });
    if (!userAIp?.ip) {
      this.sharedIpCache.set(cacheKey, { checkedAt: now, shared: false, ip: null });
      return null;
    }

    const userBIp = await prisma.userIP.findFirst({
      where: { userId: userB },
      orderBy: { lastSeen: "desc" },
      select: { ip: true }
    });
    if (!userBIp?.ip) {
      this.sharedIpCache.set(cacheKey, { checkedAt: now, shared: false, ip: null });
      return null;
    }

    const sharedIp = userAIp.ip === userBIp.ip ? userAIp.ip : null;
    this.sharedIpCache.set(cacheKey, { checkedAt: now, shared: sharedIp !== null, ip: sharedIp });
    return sharedIp;
  }

  private async createLargeUnevenWealthTransferAlert(input: {
    fromUserId: number;
    toUserId: number;
    totalValue: number;
    windowMs: number;
    entries: WealthTransferEntry[];
    threshold: number;
    source: string;
  }): Promise<void> {
    const sampleEntries = input.entries.slice(-5).map((entry) => ({
      itemId: entry.itemId,
      amount: entry.amount,
      unitValue: entry.unitValue,
      value: entry.value
    }));
    await this.createAlert({
      userId: input.toUserId,
      severity: "CRITICAL",
      category: "LARGE_UNEVEN_WEALTH_TRANSFER",
      description: `Large uneven wealth transfer (${input.totalValue}) from user ${input.fromUserId}`,
      evidence: {
        fromUserId: input.fromUserId,
        toUserId: input.toUserId,
        totalValue: input.totalValue,
        windowMs: input.windowMs,
        threshold: input.threshold,
        source: input.source,
        sampleEntries
      },
      serverId: this.serverId
    });
  }

  private async createAlert(input: AlertInput): Promise<void> {
    if (!this.shouldRun()) return;
    const key = `${input.userId}:${input.category}`;
    const now = Date.now();
    const lastAlertAt = this.recentAlerts.get(key);
    if (lastAlertAt && now - lastAlertAt < this.config.alertCooldownMs) {
      return;
    }
    this.recentAlerts.set(key, now);

    const prisma = getPrisma() as any;
    await prisma.anomalyAlert.create({
      data: {
        userId: input.userId,
        severity: input.severity,
        category: input.category,
        description: input.description,
        evidence: input.evidence,
        detectedAt: new Date(),
        source: "REALTIME",
        serverId: input.serverId ?? null,
        relatedEntityId: input.relatedEntityId ?? null
      }
    });
  }
}
