-- Move all player user IDs out of the NPC ID range.
-- This migration shifts every existing users.id by +200000 and then
-- aligns the users.id sequence so the next generated ID is max(id) + 1.

BEGIN;

-- Prevent concurrent writes while IDs are being remapped.
LOCK TABLE "users" IN ACCESS EXCLUSIVE MODE;

-- Shift all user IDs by +200000. Foreign keys update via ON UPDATE CASCADE.
UPDATE "users"
SET "id" = "id" + 200000;

-- Realign the users.id sequence to the new ID range.
SELECT setval(
  pg_get_serial_sequence('"users"', 'id'),
  COALESCE((SELECT MAX("id") FROM "users"), 200000),
  true
);

COMMIT;
