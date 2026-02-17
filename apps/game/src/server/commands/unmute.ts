import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { unmuteUserByUsername } from "../../db";
import type { CommandContext, CommandHandler } from "./types";

/**
 * /unmute <username>
 *
 * Removes an active mute from a player.
 */
export const unmuteCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  if (args.length < 1) {
    ctx.reply("Usage: /unmute <username>", MessageStyle.Warning);
    return;
  }

  const targetUsername = args.join(" ").trim();
  if (!targetUsername) {
    ctx.reply("Usage: /unmute <username>", MessageStyle.Warning);
    return;
  }

  void (async () => {
    const result = await unmuteUserByUsername(targetUsername);
    if (!result) {
      ctx.reply(`Player "${targetUsername}" was not found`, MessageStyle.Warning);
      return;
    }

    const targetState = ctx.getPlayerState(result.userId);
    if (targetState) {
      targetState.clearMuteState();
    }

    if (!result.wasMuted) {
      ctx.reply(`${result.username} is not muted.`, MessageStyle.Yellow);
      return;
    }

    ctx.reply(`Unmuted ${result.username}.`, MessageStyle.Green);
  })().catch((err) => {
    ctx.reply("Failed to unmute player due to an internal error.", MessageStyle.Red);
    console.warn("[commands/unmute] Failed to unmute player:", (err as Error)?.message ?? err);
  });
};
