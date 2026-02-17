import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler } from "./types";

// ============================================================================
// Teleport Locations Registry
// ============================================================================
// Add new teleport locations here. Each entry maps a location name to coords.
// Usage: /teleport <location> [username]

interface TeleportLocation {
  x: number;
  y: number;
  mapLevel: number;
  description?: string;
}

/**
 * Registry of named teleport locations.
 * 
 * To add a new location:
 * 1. Add an entry to this object with the location name as key
 * 2. That's it! The command will automatically support it.
 * 
 * Example: /teleport lumbridge
 *          /teleport varrock PlayerName
 */
const TELEPORT_LOCATIONS: Record<string, TeleportLocation> = {
  home: {
    x: 78,
    y: -93,
    mapLevel: 1,
    description: "Spawn point"
  },
  celadon: {
    x: 325,
    y: -20,
    mapLevel: 1,
    description: "Celadon city"
  },
  summerton: {
    x: -160,
    y: -335,
    mapLevel: 1,
    description: "Summerton"
  },
  highcove:{
    x: -244,
    y: -353,
    mapLevel: 1,
    description: "Highcove"
  },
  icitrine:{
    x: 13,
    y: 207,
    mapLevel: 1,
    description: "Icitrine city"
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

function resolveOnlinePlayerId(ctx: CommandContext, usernameArg: string | undefined): number | null {
  const username = usernameArg?.trim();
  if (!username) return null;
  return ctx.getPlayerIdByUsername(username);
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
      ctx.reply("Usage: /teleport to <username>", MessageStyle.Warning);
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
      ctx.reply("Usage: /teleport bring <username>", MessageStyle.Warning);
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
 * Handles location-based teleport: /teleport <location> [username]
 */
function handleLocationTeleport(
  ctx: CommandContext,
  locationName: string,
  location: TeleportLocation,
  targetUsername?: string
): void {
  if (targetUsername) {
    // Teleport another player to the location
    const targetId = ctx.getPlayerIdByUsername(targetUsername);
    if (!targetId) {
      ctx.reply(`Player "${targetUsername}" not found`, MessageStyle.Warning);
      return;
    }
    ctx.stopPlayerMovement(targetId);
    ctx.teleportPlayer(targetId, location.x, location.y, location.mapLevel);
    ctx.reply(`Teleported ${targetUsername} to ${locationName}`, MessageStyle.Green);
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
 *   /teleport <location> <user>    - Teleport user to location
 *   /teleport to <username>        - Teleport yourself to another player
 *   /teleport bring <username>     - Bring another player to your location
 *   /teleport help                 - Show available locations
 */
export const teleportCommand: CommandHandler = (ctx, args) => {
  const subcommand = args[0]?.toLowerCase();

  // No subcommand or help requested
  if (!subcommand || subcommand === "help") {
    const locations = Object.keys(TELEPORT_LOCATIONS).join(", ");
    ctx.reply(`Available locations: ${locations}`, MessageStyle.Green);
    ctx.reply("Usage: /teleport <location> [username]", MessageStyle.Green);
    ctx.reply("Also: /teleport to <username>, /teleport bring <username>", MessageStyle.Green);
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
    handleLocationTeleport(ctx, subcommand, location, args[1]);
    return;
  }

  // Unknown subcommand/location
  const locations = Object.keys(TELEPORT_LOCATIONS).join(", ");
  ctx.reply(`Unknown location: "${subcommand}"`, MessageStyle.Warning);
  ctx.reply(`Available: ${locations}`, MessageStyle.Green);
};
