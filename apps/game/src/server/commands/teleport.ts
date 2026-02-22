import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler } from "./types";

// ============================================================================
// Teleport Locations Registry
// ============================================================================
// Add new teleport locations here. Each entry maps a location name to coords.
// Usage: /teleport <location> [player name]

interface TeleportLocation {
  x: number;
  y: number;
  mapLevel: number;
  description?: string;
}

interface TeleportRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  mapLevel: number;
  description?: string;
}

function fixedTeleportFromRange(range: TeleportRange): TeleportLocation {
  // Admin command teleports should be deterministic (no random variation).
  return {
    x: Math.floor((range.xMin + range.xMax) / 2),
    y: Math.floor((range.yMin + range.yMax) / 2),
    mapLevel: range.mapLevel,
    description: range.description
  };
}

/**
 * Registry of named teleport locations.
 * 
 * To add a new location:
 * 1. Add an entry to this object with the location name as key
 * 2. That's it! The command will automatically support it.
 * 
 * Example: /teleport lumbridge
 *          /teleport varrock Player Display Name
 */
const SPELL_TELEPORT_LOCATIONS: Record<string, TeleportLocation> = {
  hedgecastle: fixedTeleportFromRange({
    xMin: -324, xMax: -320, yMin: 12, yMax: 16, mapLevel: 1, description: "Hedgecastle Teleport"
  }),
  icitrine: fixedTeleportFromRange({
    xMin: 46, xMax: 50, yMin: 189, yMax: 193, mapLevel: 1, description: "Icitrine Teleport"
  }),
  highcove: fixedTeleportFromRange({
    xMin: -262, xMax: -260, yMin: -396, yMax: -394, mapLevel: 1, description: "Highcove Teleport"
  }),
  celadon: fixedTeleportFromRange({
    xMin: 315, xMax: 321, yMin: -13, yMax: -7, mapLevel: 1, description: "Celadon Teleport"
  }),
  anglhamcastle: fixedTeleportFromRange({
    xMin: 91, xMax: 94, yMin: -186, yMax: -183, mapLevel: 1, description: "Anglham Castle Teleport"
  }),
  waterobelisk: fixedTeleportFromRange({
    xMin: 169, xMax: 173, yMin: 284, yMax: 288, mapLevel: 1, description: "Water Obelisk Teleport"
  }),
  natureobelisk: fixedTeleportFromRange({
    xMin: -215, xMax: -211, yMin: -184, yMax: -180, mapLevel: 1, description: "Nature Obelisk Teleport"
  }),
  fireobelisk: fixedTeleportFromRange({
    xMin: -64, xMax: -60, yMin: 360, yMax: 364, mapLevel: 0, description: "Fire Obelisk Teleport"
  }),
  furyobelisk: fixedTeleportFromRange({
    xMin: -238, xMax: -234, yMin: -167, yMax: -163, mapLevel: 0, description: "Fury Obelisk Teleport"
  }),
  energyobelisk: fixedTeleportFromRange({
    xMin: -3, xMax: 1, yMin: 461, yMax: 465, mapLevel: 1, description: "Energy Obelisk Teleport"
  }),
  rageobelisk: fixedTeleportFromRange({
    xMin: 215, xMax: 219, yMin: -173, yMax: -169, mapLevel: 1, description: "Rage Obelisk Teleport"
  }),
  wizardsobelisk: fixedTeleportFromRange({
    xMin: -99, xMax: -95, yMin: -264, yMax: -260, mapLevel: 1, description: "Wizard's Obelisk Teleport"
  }),
  blood: {
    x: 405,
    y: -329,
    mapLevel: 1,
    description: "Blood Teleport"
  },
  dragonsmoke: fixedTeleportFromRange({
    xMin: -404, xMax: -400, yMin: -467, yMax: -463, mapLevel: 1, description: "Dragonsmoke Teleport"
  }),
  portalobelisk: fixedTeleportFromRange({
    xMin: -399, xMax: -395, yMin: -89, yMax: -85, mapLevel: 1, description: "Portal Obelisk Teleport"
  }),
  goldenobelisk: fixedTeleportFromRange({
    xMin: -194, xMax: -190, yMin: 45, yMax: 49, mapLevel: 0, description: "Golden Obelisk Teleport"
  }),
  bloodobelisk: fixedTeleportFromRange({
    xMin: 363, xMax: 367, yMin: -484, yMax: -480, mapLevel: 1, description: "Blood Obelisk Teleport"
  }),
  cairn: fixedTeleportFromRange({
    xMin: 141, xMax: 145, yMin: 445, yMax: 449, mapLevel: 1, description: "Cairn Teleport"
  })
};

const TELEPORT_LOCATIONS: Record<string, TeleportLocation> = {
  ...SPELL_TELEPORT_LOCATIONS,
  // Existing convenience aliases
  home: {
    x: 78,
    y: -93,
    mapLevel: 1,
    description: "Spawn point"
  },
  summerton: {
    x: -160,
    y: -335,
    mapLevel: 1,
    description: "Summerton"
  }
};

// ============================================================================
// Teleport Subcommand Handlers
// ============================================================================
// For complex subcommands that need custom logic beyond simple location teleport

type TeleportSubcommandHandler = (
  ctx: CommandContext,
  args: string[] // args after the subcommand
) => void;

function resolveOnlinePlayerId(ctx: CommandContext, playerNameArg: string | undefined): number | null {
  const playerName = playerNameArg?.trim();
  if (!playerName) return null;
  return ctx.getPlayerIdByUsername(playerName);
}

/**
 * Registry of special teleport subcommands with custom logic.
 * These take precedence over location lookups.
 * 
 * Use this for subcommands that need logic beyond simple coordinate teleport,
 * such as "to" (teleport to another player's position).
 */
const TELEPORT_SUBCOMMANDS: Record<string, TeleportSubcommandHandler> = {
  to: (ctx, args) => {
    const targetName = args.join(" ").trim();
    if (!targetName) {
      ctx.reply("Usage: /teleport to <player name>", MessageStyle.Warning);
      return;
    }

    const targetId = resolveOnlinePlayerId(ctx, targetName);
    if (targetId === null) {
      ctx.reply(`Player "${targetName}" not found`, MessageStyle.Warning);
      return;
    }

    const targetState = ctx.getPlayerState(targetId);
    if (!targetState) {
      ctx.reply(`Player "${targetName}" is not online`, MessageStyle.Warning);
      return;
    }

    ctx.stopPlayerMovement(ctx.userId);
    ctx.teleportPlayer(ctx.userId, targetState.x, targetState.y, targetState.mapLevel);
    ctx.reply(`Teleported to ${targetName}`, MessageStyle.Green);
  },

  bring: (ctx, args) => {
    const targetName = args.join(" ").trim();
    if (!targetName) {
      ctx.reply("Usage: /teleport bring <player name>", MessageStyle.Warning);
      return;
    }

    const targetId = resolveOnlinePlayerId(ctx, targetName);
    if (targetId === null) {
      ctx.reply(`Player "${targetName}" not found`, MessageStyle.Warning);
      return;
    }

    const sourceState = ctx.getPlayerState(ctx.userId);
    if (!sourceState) {
      ctx.reply("Could not resolve your current location", MessageStyle.Warning);
      return;
    }

    ctx.stopPlayerMovement(targetId);
    ctx.teleportPlayer(targetId, sourceState.x, sourceState.y, sourceState.mapLevel);
    ctx.reply(`Brought ${targetName} to your location`, MessageStyle.Green);
  },
};

// ============================================================================
// Main Teleport Command Handler
// ============================================================================

/**
 * Handles location-based teleport: /teleport <location> [player name]
 */
function handleLocationTeleport(
  ctx: CommandContext,
  locationName: string,
  location: TeleportLocation,
  targetPlayerName?: string
): void {
  if (targetPlayerName) {
    // Teleport another player to the location
    const targetId = ctx.getPlayerIdByUsername(targetPlayerName);
    if (targetId === null) {
      ctx.reply(`Player "${targetPlayerName}" not found`, MessageStyle.Warning);
      return;
    }
    ctx.stopPlayerMovement(targetId);
    ctx.teleportPlayer(targetId, location.x, location.y, location.mapLevel);
    ctx.reply(`Teleported ${targetPlayerName} to ${locationName}`, MessageStyle.Green);
  } else {
    // Teleport self to the location
    ctx.stopPlayerMovement(ctx.userId);
    ctx.teleportPlayer(ctx.userId, location.x, location.y, location.mapLevel);
    ctx.reply(`Teleported to ${locationName}`, MessageStyle.Green);
  }
}

/**
 * Main teleport command handler
 * 
 * Usage:
 *   /teleport <location>           - Teleport self to location
 *   /teleport <location> <player>  - Teleport player to location
 *   /teleport to <player name>     - Teleport yourself to another player
 *   /teleport bring <player name>  - Bring another player to your location
 *   /teleport help                 - Show available locations
 */
export const teleportCommand: CommandHandler = (ctx, args) => {
  const subcommand = args[0]?.toLowerCase();

  // No subcommand or help requested
  if (!subcommand || subcommand === "help") {
    const locations = Object.keys(TELEPORT_LOCATIONS).join(", ");
    ctx.reply(`Available locations: ${locations}`, MessageStyle.Green);
    ctx.reply("Usage: /teleport <location> [player name]", MessageStyle.Green);
    ctx.reply("Also: /teleport to <player name>, /teleport bring <player name>", MessageStyle.Green);
    return;
  }

  // Check for special subcommands first
  const specialHandler = TELEPORT_SUBCOMMANDS[subcommand];
  if (specialHandler) {
    specialHandler(ctx, args.slice(1));
    return;
  }

  // Check for location-based teleport
  const location = TELEPORT_LOCATIONS[subcommand];
  if (location) {
    const targetPlayerName = args.slice(1).join(" ").trim() || undefined;
    handleLocationTeleport(ctx, subcommand, location, targetPlayerName);
    return;
  }

  // Unknown subcommand/location
  const locations = Object.keys(TELEPORT_LOCATIONS).join(", ");
  ctx.reply(`Unknown location: "${subcommand}"`, MessageStyle.Warning);
  ctx.reply(`Available: ${locations}`, MessageStyle.Green);
};
