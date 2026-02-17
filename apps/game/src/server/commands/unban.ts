import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { unbanUserByUsername } from "../../db";
import type { CommandContext, CommandHandler } from "./types";

/**
 * /unban <username>
 *
 * Removes an account ban from a player.
 * Note: This does not remove IP bans.
 */
export const unbanCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  if (args.length < 1) {
    ctx.reply("Usage: /unban <username>", MessageStyle.Warning);
    return;
  }

  const targetUsername = args.join(" ").trim();
  if (!targetUsername) {
    ctx.reply("Usage: /unban <username>", MessageStyle.Warning);
    return;
  }

  void (async () => {
    const result = await unbanUserByUsername(targetUsername);
    if (!result) {
      ctx.reply(`Player "${targetUsername}" was not found`, MessageStyle.Warning);
      return;
    }

    if (!result.wasBanned) {
      ctx.reply(`${result.username} is not account-banned.`, MessageStyle.Yellow);
      return;
    }

    ctx.reply(`Unbanned ${result.username}.`, MessageStyle.Green);
  })().catch((err) => {
    ctx.reply("Failed to unban player due to an internal error.", MessageStyle.Red);
    console.warn("[commands/unban] Failed to unban player:", (err as Error)?.message ?? err);
  });
};
