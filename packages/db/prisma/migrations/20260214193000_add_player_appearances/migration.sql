-- CreateTable
CREATE TABLE "player_appearances" (
    "userId" INTEGER NOT NULL,
    "persistenceId" INTEGER NOT NULL,
    "hairStyleId" INTEGER NOT NULL DEFAULT 1,
    "beardStyleId" INTEGER NOT NULL DEFAULT 1,
    "shirtId" INTEGER NOT NULL DEFAULT 1,
    "bodyTypeId" INTEGER NOT NULL DEFAULT 0,
    "legsId" INTEGER NOT NULL DEFAULT 5,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_appearances_pkey" PRIMARY KEY ("userId","persistenceId")
);

-- CreateIndex
CREATE INDEX "player_appearances_userId_persistenceId_idx" ON "player_appearances"("userId", "persistenceId");

-- CreateIndex
CREATE INDEX "player_appearances_persistenceId_idx" ON "player_appearances"("persistenceId");

-- AddForeignKey
ALTER TABLE "player_appearances" ADD CONSTRAINT "player_appearances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill from player_state_snapshots (previous appearance source)
INSERT INTO "player_appearances" (
    "userId",
    "persistenceId",
    "hairStyleId",
    "beardStyleId",
    "shirtId",
    "bodyTypeId",
    "legsId",
    "updatedAt"
)
SELECT
    pss."userId",
    pss."persistenceId",
    CASE WHEN jsonb_typeof(pss."state"->'appearance'->'hairStyleId') = 'number'
      THEN (pss."state"->'appearance'->>'hairStyleId')::INTEGER
      ELSE 1
    END AS "hairStyleId",
    CASE WHEN jsonb_typeof(pss."state"->'appearance'->'beardStyleId') = 'number'
      THEN (pss."state"->'appearance'->>'beardStyleId')::INTEGER
      ELSE 1
    END AS "beardStyleId",
    CASE WHEN jsonb_typeof(pss."state"->'appearance'->'shirtId') = 'number'
      THEN (pss."state"->'appearance'->>'shirtId')::INTEGER
      ELSE 1
    END AS "shirtId",
    CASE WHEN jsonb_typeof(pss."state"->'appearance'->'bodyTypeId') = 'number'
      THEN (pss."state"->'appearance'->>'bodyTypeId')::INTEGER
      ELSE 0
    END AS "bodyTypeId",
    CASE WHEN jsonb_typeof(pss."state"->'appearance'->'legsId') = 'number'
      THEN (pss."state"->'appearance'->>'legsId')::INTEGER
      ELSE 5
    END AS "legsId",
    NOW() AS "updatedAt"
FROM "player_state_snapshots" pss
ON CONFLICT ("userId", "persistenceId") DO NOTHING;

-- Ensure defaults exist for any player persistence profile that lacks snapshot data
INSERT INTO "player_appearances" (
    "userId",
    "persistenceId",
    "hairStyleId",
    "beardStyleId",
    "shirtId",
    "bodyTypeId",
    "legsId",
    "updatedAt"
)
SELECT
    pl."userId",
    pl."persistenceId",
    1,
    1,
    1,
    0,
    5,
    NOW()
FROM "player_locations" pl
ON CONFLICT ("userId", "persistenceId") DO NOTHING;
