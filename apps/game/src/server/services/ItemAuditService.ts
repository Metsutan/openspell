import { getPrisma } from "../../db";

type ItemDropInput = {
  dropperUserId: number;
  itemId: number;
  amount: number;
  isIOU: number;
  mapLevel: number;
  x: number;
  y: number;
  serverId?: number | null;
  groundItemId?: number | null;
};

type ItemPickupInput = {
  pickerUserId: number;
  itemId: number;
  amount: number;
  isIOU: number;
  mapLevel: number;
  x: number;
  y: number;
  serverId?: number | null;
  groundItemId?: number | null;
};

type ShopSaleInput = {
  sellerUserId: number;
  buyerUserId: number;
  shopId: number;
  itemId: number;
  amount: number;
  priceEach: number;
  totalPrice: number;
  serverId?: number | null;
};

type TradeItemTransferInput = {
  tradeSessionId: string;
  fromUserId: number;
  toUserId: number;
  itemId: number;
  amount: number;
  isIOU: number;
  serverId?: number | null;
};

type ItemAuditConfig = {
  enabled: boolean;
  batchSize: number;
  flushMs: number;
  retentionDays: number;
  shopSaleEnabled: boolean;
  tradeEventEnabled: boolean;
};

type ItemAuditHooks = {
  onItemDrop?: (input: ItemDropInput & { serverId?: number | null }) => void;
  onItemPickup?: (
    input: ItemPickupInput & { dropperUserId?: number | null; serverId?: number | null }
  ) => void;
  onShopSale?: (input: ShopSaleInput & { serverId?: number | null }) => void;
  onTradeItemTransfer?: (input: TradeItemTransferInput & { serverId?: number | null }) => void;
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

export class ItemAuditService {
  private readonly config: ItemAuditConfig;
  private readonly hooks?: ItemAuditHooks;
  private readonly dropQueue: ItemDropInput[] = [];
  private readonly pickupQueue: Array<ItemPickupInput & { dropperUserId?: number | null }> = [];
  private readonly shopSaleQueue: ShopSaleInput[] = [];
  private readonly tradeTransferQueue: TradeItemTransferInput[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private readonly dropperByGroundItemId = new Map<number, number>();

  constructor(
    private readonly serverId: number | null,
    private readonly dbEnabled: boolean,
    hooks?: ItemAuditHooks
  ) {
    this.config = {
      enabled: parseBoolean(process.env.ITEM_EVENT_LOG_ENABLED, true),
      batchSize: parseNumber(process.env.ITEM_EVENT_BATCH_SIZE, 200),
      flushMs: parseNumber(process.env.ITEM_EVENT_FLUSH_MS, 2000),
      retentionDays: parseNumber(process.env.ITEM_EVENT_RETENTION_DAYS, 90),
      shopSaleEnabled: parseBoolean(process.env.SHOP_SALE_LOG_ENABLED, true),
      tradeEventEnabled: parseBoolean(process.env.TRADE_EVENT_LOG_ENABLED, true)
    };
    this.hooks = hooks;

    if (this.dbEnabled && (this.config.enabled || this.config.shopSaleEnabled || this.config.tradeEventEnabled)) {
      this.flushTimer = setInterval(() => void this.flush(), this.config.flushMs);
      this.cleanupTimer = setInterval(() => void this.cleanup(), 12 * 60 * 60 * 1000);
    }
  }

  logItemDrop(input: ItemDropInput): void {
    const entry = {
      ...input,
      serverId: input.serverId ?? this.serverId,
    };
    this.hooks?.onItemDrop?.(entry);
    if (!this.config.enabled || !this.dbEnabled) return;

    if (input.groundItemId !== undefined && input.groundItemId !== null) {
      this.dropperByGroundItemId.set(input.groundItemId, input.dropperUserId);
    }

    this.dropQueue.push(entry);
    this.flushIfNeeded();
  }

  logItemPickup(input: ItemPickupInput): void {
    const dropperUserId =
      input.groundItemId !== undefined && input.groundItemId !== null
        ? this.dropperByGroundItemId.get(input.groundItemId) ?? null
        : null;

    if (input.groundItemId !== undefined && input.groundItemId !== null) {
      this.dropperByGroundItemId.delete(input.groundItemId);
    }

    const entry = {
      ...input,
      dropperUserId,
      serverId: input.serverId ?? this.serverId,
    };
    this.hooks?.onItemPickup?.(entry);
    if (!this.config.enabled || !this.dbEnabled) return;
    this.pickupQueue.push(entry);
    this.flushIfNeeded();
  }

  logShopSale(input: ShopSaleInput): void {
    const entry = {
      ...input,
      serverId: input.serverId ?? this.serverId,
    };
    this.hooks?.onShopSale?.(entry);
    if (!this.config.shopSaleEnabled || !this.dbEnabled) return;
    this.shopSaleQueue.push(entry);
    this.flushIfNeeded();
  }

  logTradeItemTransfer(input: TradeItemTransferInput): void {
    const entry = {
      ...input,
      serverId: input.serverId ?? this.serverId
    };
    this.hooks?.onTradeItemTransfer?.(entry);
    if (!this.config.tradeEventEnabled || !this.dbEnabled) return;
    this.tradeTransferQueue.push(entry);
    this.flushIfNeeded();
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    await this.flush();
  }

  consumeTemporaryShopStock(groundItemId: number): void {
    this.dropperByGroundItemId.delete(groundItemId);
  }

  private flushIfNeeded(): void {
    if (
      this.dropQueue.length +
        this.pickupQueue.length +
        this.shopSaleQueue.length +
        this.tradeTransferQueue.length >=
      this.config.batchSize
    ) {
      void this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (!this.dbEnabled || (!this.config.enabled && !this.config.shopSaleEnabled && !this.config.tradeEventEnabled)) return;
    if (
      this.dropQueue.length === 0 &&
      this.pickupQueue.length === 0 &&
      this.shopSaleQueue.length === 0 &&
      this.tradeTransferQueue.length === 0
    ) {
      return;
    }

    const prisma = getPrisma();
    const dropBatch = this.dropQueue.splice(0, this.dropQueue.length);
    const pickupBatch = this.pickupQueue.splice(0, this.pickupQueue.length);
    const saleBatch = this.shopSaleQueue.splice(0, this.shopSaleQueue.length);
    const tradeTransferBatch = this.tradeTransferQueue.splice(0, this.tradeTransferQueue.length);

    const ops = [];

    if (dropBatch.length > 0) {
      ops.push(
        prisma.itemDropEvent.createMany({
          data: dropBatch.map((entry) => ({
            dropperUserId: entry.dropperUserId,
            itemId: entry.itemId,
            amount: BigInt(entry.amount),
            isIOU: entry.isIOU,
            mapLevel: entry.mapLevel,
            x: entry.x,
            y: entry.y,
            serverId: entry.serverId ?? null,
            groundItemId: entry.groundItemId ?? null,
          })),
        })
      );
    }

    if (pickupBatch.length > 0) {
      ops.push(
        prisma.itemPickupEvent.createMany({
          data: pickupBatch.map((entry) => ({
            pickerUserId: entry.pickerUserId,
            dropperUserId: entry.dropperUserId ?? null,
            itemId: entry.itemId,
            amount: BigInt(entry.amount),
            isIOU: entry.isIOU,
            mapLevel: entry.mapLevel,
            x: entry.x,
            y: entry.y,
            serverId: entry.serverId ?? null,
            groundItemId: entry.groundItemId ?? null,
          })),
        })
      );
    }

    if (saleBatch.length > 0 && this.config.shopSaleEnabled) {
      ops.push(
        prisma.shopItemSaleEvent.createMany({
          data: saleBatch.map((entry) => ({
            sellerUserId: entry.sellerUserId,
            buyerUserId: entry.buyerUserId,
            shopId: entry.shopId,
            itemId: entry.itemId,
            amount: entry.amount,
            priceEach: entry.priceEach,
            totalPrice: entry.totalPrice,
            serverId: entry.serverId ?? null,
          })),
        })
      );
    }

    if (tradeTransferBatch.length > 0 && this.config.tradeEventEnabled) {
      const prismaAny = prisma as any;
      ops.push(
        prismaAny.tradeItemTransferEvent.createMany({
          data: tradeTransferBatch.map((entry) => ({
            tradeSessionId: entry.tradeSessionId,
            fromUserId: entry.fromUserId,
            toUserId: entry.toUserId,
            itemId: entry.itemId,
            amount: BigInt(entry.amount),
            isIOU: entry.isIOU,
            serverId: entry.serverId ?? null
          }))
        })
      );
    }

    if (ops.length > 0) {
      await prisma.$transaction(ops);
    }
  }

  private async cleanup(): Promise<void> {
    if (!this.dbEnabled || (!this.config.enabled && !this.config.shopSaleEnabled && !this.config.tradeEventEnabled)) return;
    if (this.config.retentionDays <= 0) return;

    const cutoff = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
    const prisma = getPrisma();

    await prisma.$transaction([
      prisma.itemDropEvent.deleteMany({ where: { droppedAt: { lt: cutoff } } }),
      prisma.itemPickupEvent.deleteMany({ where: { pickedUpAt: { lt: cutoff } } }),
      prisma.shopItemSaleEvent.deleteMany({ where: { soldAt: { lt: cutoff } } }),
      prisma.tradeItemTransferEvent.deleteMany({ where: { tradedAt: { lt: cutoff } } })
    ]);
  }
}
