-- Alter users.timePlayed from INTEGER to BIGINT to avoid 32-bit overflow.
ALTER TABLE "users"
ALTER COLUMN "timePlayed" TYPE BIGINT USING "timePlayed"::BIGINT;
