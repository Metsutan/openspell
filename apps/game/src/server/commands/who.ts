import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandHandler } from "./types";

/**
 * Command to list currently online players.
 * Usage: /who
 */
export const whoCommand: CommandHandler = (ctx, args) => {
  const onlineNames = ctx.getOnlinePlayerNames();
  const count = onlineNames.length;
  
  if (count === 0) {
    ctx.reply("There are no players online.", MessageStyle.Green);
    return { handled: true };
  }

  // Sort names alphabetically for better readability
  const sortedNames = [...onlineNames].sort((a, b) => a.localeCompare(b));
  
  ctx.reply(`There ${count === 1 ? 'is' : 'are'} ${count} player${count === 1 ? '' : 's'} online:`, MessageStyle.Green);
  
  // Send names as a comma-separated list
  const namesList = sortedNames.join(", ");
  ctx.reply(namesList, MessageStyle.Green);

  return { handled: true };
};
