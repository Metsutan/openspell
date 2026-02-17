-- Add mute fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mutedUntil" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "muteReason" TEXT;

-- Index to support mute expiration checks
CREATE INDEX IF NOT EXISTS "users_mutedUntil_idx" ON "users"("mutedUntil");
