import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler } from "./types";

const DEFAULT_SHUTDOWN_MINUTES = 15;

function parseShutdownMinutes(arg: string | undefined): number | null {
  if (!arg) {
    return DEFAULT_SHUTDOWN_MINUTES;
  }

  const parsed = Number.parseInt(arg, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

/**
 * /shutdown [minutes]
 *
 * Schedules a graceful server shutdown after the specified number of minutes.
 * Default is 15 minutes when no argument is provided.
 */
export const shutdownCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const minutes = parseShutdownMinutes(args[0]);

  if (minutes === null) {
    ctx.reply("Usage: /shutdown [minutes]", MessageStyle.Warning);
    ctx.reply("Minutes must be a non-negative integer (example: /shutdown 15)", MessageStyle.Warning);
    return;
  }

  const result = ctx.scheduleServerShutdown(minutes);
  if (!result.scheduled) {
    ctx.reply(result.reason ?? "Shutdown could not be scheduled", MessageStyle.Warning);
    return;
  }

  if (minutes === 0) {
    ctx.reply("Server shutdown has been initiated immediately.", MessageStyle.Orange);
    return;
  }

  ctx.reply(`Server shutdown scheduled in ${minutes} minute(s).`, MessageStyle.Orange);
};
