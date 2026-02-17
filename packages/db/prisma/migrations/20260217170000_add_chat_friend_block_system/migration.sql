-- Chat friends and block list persistence
CREATE TABLE IF NOT EXISTS "chat_friends" (
    "id" SERIAL NOT NULL,
    "ownerUserId" INTEGER NOT NULL,
    "targetUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_friends_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "chat_blocks" (
    "id" SERIAL NOT NULL,
    "ownerUserId" INTEGER NOT NULL,
    "blockedUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_blocks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "chat_friends_ownerUserId_targetUserId_key"
ON "chat_friends"("ownerUserId", "targetUserId");

CREATE INDEX IF NOT EXISTS "chat_friends_ownerUserId_idx"
ON "chat_friends"("ownerUserId");

CREATE INDEX IF NOT EXISTS "chat_friends_targetUserId_idx"
ON "chat_friends"("targetUserId");

CREATE UNIQUE INDEX IF NOT EXISTS "chat_blocks_ownerUserId_blockedUserId_key"
ON "chat_blocks"("ownerUserId", "blockedUserId");

CREATE INDEX IF NOT EXISTS "chat_blocks_ownerUserId_idx"
ON "chat_blocks"("ownerUserId");

CREATE INDEX IF NOT EXISTS "chat_blocks_blockedUserId_idx"
ON "chat_blocks"("blockedUserId");

ALTER TABLE "chat_friends"
ADD CONSTRAINT "chat_friends_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_friends"
ADD CONSTRAINT "chat_friends_targetUserId_fkey"
FOREIGN KEY ("targetUserId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_blocks"
ADD CONSTRAINT "chat_blocks_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_blocks"
ADD CONSTRAINT "chat_blocks_blockedUserId_fkey"
FOREIGN KEY ("blockedUserId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
