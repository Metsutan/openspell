-- Chat message audit events (local/global).

CREATE TABLE "chat_message_events" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "usernameSnapshot" TEXT,
    "displayNameSnapshot" TEXT,
    "channel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "mapLevel" INTEGER,
    "x" INTEGER,
    "y" INTEGER,
    "serverId" INTEGER,
    "playerType" INTEGER,
    "style" INTEGER,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_message_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "chat_message_events_userId_idx" ON "chat_message_events"("userId");
CREATE INDEX "chat_message_events_channel_idx" ON "chat_message_events"("channel");
CREATE INDEX "chat_message_events_serverId_idx" ON "chat_message_events"("serverId");
CREATE INDEX "chat_message_events_sentAt_idx" ON "chat_message_events"("sentAt");
CREATE INDEX "chat_message_events_mapLevel_x_y_sentAt_idx" ON "chat_message_events"("mapLevel", "x", "y", "sentAt");

ALTER TABLE "chat_message_events"
ADD CONSTRAINT "chat_message_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
