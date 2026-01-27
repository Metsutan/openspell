-- AlterTable
ALTER TABLE "anti_cheat_threshold_overrides" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "invalid_packet_event_rollups_unique" RENAME TO "invalid_packet_event_rollups_userId_serverId_actionType_pac_key";
