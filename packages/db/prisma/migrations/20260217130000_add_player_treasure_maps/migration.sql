-- Persist treasure map ownership + clue coordinates per player tier.

CREATE TABLE "player_treasure_maps" (
    "userId" INTEGER NOT NULL,
    "persistenceId" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "mapLevel" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "player_treasure_maps_pkey" PRIMARY KEY ("userId", "persistenceId", "tier")
);

CREATE INDEX "player_treasure_maps_userId_persistenceId_idx" ON "player_treasure_maps"("userId", "persistenceId");
CREATE INDEX "player_treasure_maps_persistenceId_idx" ON "player_treasure_maps"("persistenceId");
CREATE INDEX "player_treasure_maps_tier_idx" ON "player_treasure_maps"("tier");

ALTER TABLE "player_treasure_maps"
ADD CONSTRAINT "player_treasure_maps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "player_treasure_maps"
ADD CONSTRAINT "player_treasure_maps_tier_check" CHECK ("tier" IN (1, 2, 3));

ALTER TABLE "player_treasure_maps"
ADD CONSTRAINT "player_treasure_maps_itemId_check" CHECK ("itemId" IN (442, 443, 456));

ALTER TABLE "player_treasure_maps"
ADD CONSTRAINT "player_treasure_maps_mapLevel_check" CHECK ("mapLevel" >= 0 AND "mapLevel" <= 2);
