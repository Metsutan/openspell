import { PlayerType } from "../../protocol/enums/PlayerType";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandDefinition, CommandHandler } from "./types";
import { teleportCommand } from "./teleport";
import { giveitemCommand } from "./giveitem";
import { setskillCommand } from "./setskill";
import { shutdownCommand } from "./shutdown";
import { muteCommand } from "./mute";
import { unmuteCommand } from "./unmute";
import { banCommand } from "./ban";
import { unbanCommand } from "./unban";
import { moveCommand } from "./move";

// Re-export types for convenience
export type { CommandContext, CommandDefinition, CommandHandler } from "./types";

// ============================================================================
// Command Registry
// ============================================================================
// Register all chat commands here. Each command can specify:
// - handler: The function to execute
// - requiredPrivilege: Array of PlayerTypes allowed to use (empty = all)
// - usage: Help text for the command
// - description: Short description

const COMMANDS: Record<string, CommandDefinition> = {
  // ---------------------------------------------------------------------------
  // Admin Commands
  // ---------------------------------------------------------------------------
  teleport: {
    handler: teleportCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/teleport <location> [player name]",
    description: "Teleport to a location or teleport another player"
  },

  move: {
    handler: moveCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/move <north|south|east|west> [distance]",
    description: "Move by cardinal tiles using teleport"
  },

  // Placeholder for future commands - implement handlers as needed
  bank: {
    handler: (ctx) => {
      ctx.reply("Bank command not yet implemented", MessageStyle.Warning);
    },
    requiredPrivilege: [PlayerType.Admin],
    usage: "/bank [username]",
    description: "Open bank interface"
  },

  giveitem: {
    handler: giveitemCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/giveitem <itemId> [amount] [username] [noted (true/false)]",
    description: "Give an item to yourself or another player"
  },

  setskill: {
    handler: setskillCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/setskill <skill> <level> [username]",
    description: "Set a skill to a specific level"
  },

  shutdown: {
    handler: shutdownCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/shutdown [minutes]",
    description: "Schedule a graceful server shutdown countdown"
  },

  // ---------------------------------------------------------------------------
  // Moderator Commands
  // ---------------------------------------------------------------------------
  mute: {
    handler: muteCommand,
    requiredPrivilege: [PlayerType.Admin, PlayerType.Mod, PlayerType.PlayerMod],
    usage: "/mute <username> [duration]",
    description: "Mute a player"
  },

  unmute: {
    handler: unmuteCommand,
    requiredPrivilege: [PlayerType.Admin, PlayerType.Mod, PlayerType.PlayerMod],
    usage: "/unmute <username>",
    description: "Unmute a player"
  },

  ban: {
    handler: banCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/ban <username> [duration]",
    description: "Account-ban a player"
  },

  unban: {
    handler: unbanCommand,
    requiredPrivilege: [PlayerType.Admin],
    usage: "/unban <username>",
    description: "Remove an account ban from a player"
  },

  kick: {
    handler: (ctx, args) => {
      ctx.reply("Kick command not yet implemented", MessageStyle.Warning);
    },
    requiredPrivilege: [PlayerType.Admin],
    usage: "/kick <username> [reason]",
    description: "Kick a player from the server"
  },

  // ---------------------------------------------------------------------------
  // Global Commands (no privilege required)
  // ---------------------------------------------------------------------------
  help: {
    handler: (ctx, args) => {
      // Show commands available to this player
      const available = Object.entries(COMMANDS)
        .filter(([_, def]) => {
          if (!def.requiredPrivilege || def.requiredPrivilege.length === 0) return true;
          return def.requiredPrivilege.includes(ctx.playerType);
        })
        .map(([name, def]) => `/${name}${def.usage ? ` - ${def.description || ""}` : ""}`);

      ctx.reply("Available commands:", MessageStyle.Green);
      for (const cmd of available) {
        ctx.reply(cmd, MessageStyle.Green);
      }
    },
    usage: "/help",
    description: "Show available commands"
  },
};

// ============================================================================
// Command Dispatcher
// ============================================================================

/**
 * Attempts to execute a chat command.
 * 
 * @param command - The command name (without the leading /)
 * @param args - Array of arguments passed to the command
 * @param ctx - Command context with utilities and player info
 * @returns true if command was handled, false if command not found
 */
export function executeCommand(
  command: string,
  args: string[],
  ctx: CommandContext
): boolean {
  const cmdDef = COMMANDS[command.toLowerCase()];

  if (!cmdDef) {
    return false; // Command not found, let caller decide what to do
  }

  // Check privilege requirements
  if (cmdDef.requiredPrivilege && cmdDef.requiredPrivilege.length > 0) {
    if (!cmdDef.requiredPrivilege.includes(ctx.playerType)) {
      // Silently ignore - don't reveal command exists to unprivileged users
      return false;
    }
  }

  // Execute the command
  cmdDef.handler(ctx, args);
  return true;
}

/**
 * Get all registered command names (for autocomplete, etc.)
 */
export function getCommandNames(): string[] {
  return Object.keys(COMMANDS);
}

/**
 * Get commands available to a specific player type
 */
export function getAvailableCommands(playerType: PlayerType): string[] {
  return Object.entries(COMMANDS)
    .filter(([_, def]) => {
      if (!def.requiredPrivilege || def.requiredPrivilege.length === 0) return true;
      return def.requiredPrivilege.includes(playerType);
    })
    .map(([name]) => name);
}
