-- Trade item transfer events for completed player-to-player trades

CREATE TABLE "trade_item_transfer_events" (
    "id" SERIAL NOT NULL,
    "tradeSessionId" TEXT NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "isIOU" INTEGER NOT NULL DEFAULT 0,
    "serverId" INTEGER,
    "tradedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trade_item_transfer_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "trade_item_transfer_events_tradeSessionId_idx" ON "trade_item_transfer_events"("tradeSessionId");
CREATE INDEX "trade_item_transfer_events_fromUserId_idx" ON "trade_item_transfer_events"("fromUserId");
CREATE INDEX "trade_item_transfer_events_toUserId_idx" ON "trade_item_transfer_events"("toUserId");
CREATE INDEX "trade_item_transfer_events_itemId_idx" ON "trade_item_transfer_events"("itemId");
CREATE INDEX "trade_item_transfer_events_tradedAt_idx" ON "trade_item_transfer_events"("tradedAt");

ALTER TABLE "trade_item_transfer_events"
ADD CONSTRAINT "trade_item_transfer_events_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trade_item_transfer_events"
ADD CONSTRAINT "trade_item_transfer_events_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
