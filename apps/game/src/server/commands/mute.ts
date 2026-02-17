import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { muteUserByUsername } from "../../db";
import type { CommandContext, CommandHandler } from "./types";

const DURATION_PATTERN = /^(\d+)([wdhm])$/i;

function parseDurationMs(raw: string | undefined): number | null | "invalid" {
  if (!raw) return null; // null means permanent

  const match = DURATION_PATTERN.exec(raw.trim());
  if (!match) return "invalid";

  const amount = Number.parseInt(match[1], 10);
  if (!Number.isFinite(amount) || amount <= 0) return "invalid";

  const unit = match[2].toLowerCase();
  switch (unit) {
    case "w":
      return amount * 7 * 24 * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "m":
      return amount * 60 * 1000;
    default:
      return "invalid";
  }
}

function formatDurationShort(raw: string): string {
  const match = DURATION_PATTERN.exec(raw.trim());
  if (!match) return raw;
  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "w":
      return `${amount} week${amount === 1 ? "" : "s"}`;
    case "d":
      return `${amount} day${amount === 1 ? "" : "s"}`;
    case "h":
      return `${amount} hour${amount === 1 ? "" : "s"}`;
    case "m":
      return `${amount} minute${amount === 1 ? "" : "s"}`;
    default:
      return raw;
  }
}

/**
 * /mute <username> [duration]
 *
 * Duration format:
 * - 10w (weeks)
 * - 2d (days)
 * - 50h (hours)
 * - 10m (minutes)
 *
 * Omit duration for permanent mute.
 */
export const muteCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  if (args.length < 1) {
    ctx.reply("Usage: /mute <username> [duration]", MessageStyle.Warning);
    ctx.reply("Duration format: <number><w|d|h|m> (examples: 10w, 2d, 50h, 10m)", MessageStyle.Warning);
    return;
  }

  const maybeDuration = args[args.length - 1];
  const parsedDuration = parseDurationMs(maybeDuration);

  if (parsedDuration === "invalid") {
    ctx.reply("Invalid duration format. Use <number><w|d|h|m> (example: 10m)", MessageStyle.Warning);
    return;
  }

  const hasDuration = args.length > 1 && parsedDuration !== null;
  const usernameParts = hasDuration ? args.slice(0, -1) : args;
  const targetUsername = usernameParts.join(" ").trim();
  if (!targetUsername) {
    ctx.reply("Usage: /mute <username> [duration]", MessageStyle.Warning);
    return;
  }

  const reason = `Muted by ${ctx.username}`;
  void (async () => {
    const result = await muteUserByUsername(targetUsername, parsedDuration, reason);
    if (!result) {
      ctx.reply(`Player "${targetUsername}" was not found`, MessageStyle.Warning);
      return;
    }

    const targetState = ctx.getPlayerState(result.userId);
    if (targetState) {
      targetState.setMuteState(result.mutedUntil, reason);
    }

    if (parsedDuration === null) {
      ctx.reply(`Muted ${result.username} permanently.`, MessageStyle.Orange);
      return;
    }

    ctx.reply(`Muted ${result.username} for ${formatDurationShort(maybeDuration)}.`, MessageStyle.Orange);
  })().catch((err) => {
    ctx.reply("Failed to mute player due to an internal error.", MessageStyle.Red);
    console.warn("[commands/mute] Failed to mute player:", (err as Error)?.message ?? err);
  });
};
