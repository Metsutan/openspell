import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { getLocationBoundsForMapLevel } from "../../world/Location";
import type { CommandContext, CommandHandler } from "./types";

type CardinalDirection = "north" | "south" | "east" | "west";

const DIRECTION_ALIASES: Record<string, CardinalDirection> = {
  n: "north",
  north: "north",
  s: "south",
  south: "south",
  e: "east",
  east: "east",
  w: "west",
  west: "west"
};

function parseDirection(input: string | undefined): CardinalDirection | null {
  if (!input) return null;
  return DIRECTION_ALIASES[input.toLowerCase()] ?? null;
}

function parseDistance(input: string | undefined): number | null {
  if (!input) return 1;
  const parsed = Number.parseInt(input, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

/**
 * /move <north|south|east|west> [distance]
 *
 * Moves the command executor by a fixed cardinal offset via teleport.
 * Coordinates are clamped to map-level bounds so movement cannot exceed world limits.
 */
export const moveCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const direction = parseDirection(args[0]);
  if (!direction) {
    ctx.reply("Usage: /move <north|south|east|west> [distance]", MessageStyle.Warning);
    ctx.reply("Example: /move north 2", MessageStyle.Warning);
    return;
  }

  const distance = parseDistance(args[1]);
  if (distance === null) {
    ctx.reply("Distance must be a whole number >= 1.", MessageStyle.Warning);
    return;
  }

  const playerState = ctx.getPlayerState(ctx.userId);
  if (!playerState) {
    ctx.reply("Could not resolve your current location.", MessageStyle.Warning);
    return;
  }

  const { x, y, mapLevel } = playerState;
  const bounds = getLocationBoundsForMapLevel(mapLevel);

  let targetX = x;
  let targetY = y;

  switch (direction) {
    case "north":
      targetY = y + distance;
      break;
    case "south":
      targetY = y - distance;
      break;
    case "east":
      targetX = x + distance;
      break;
    case "west":
      targetX = x - distance;
      break;
  }

  targetX = Math.max(bounds.x.min, Math.min(bounds.x.max, targetX));
  targetY = Math.max(bounds.y.min, Math.min(bounds.y.max, targetY));

  ctx.stopPlayerMovement(ctx.userId);
  ctx.teleportPlayer(ctx.userId, targetX, targetY, mapLevel);

  const movedX = targetX - x;
  const movedY = targetY - y;
  const movedTiles = Math.abs(movedX) + Math.abs(movedY);
  const requested = distance;

  if (movedTiles < requested) {
    ctx.reply(
      `Moved ${direction} ${movedTiles} tile${movedTiles === 1 ? "" : "s"} (clamped at map boundary).`,
      MessageStyle.Yellow
    );
    return;
  }

  ctx.reply(`Moved ${direction} ${requested} tile${requested === 1 ? "" : "s"}.`, MessageStyle.Green);
};

