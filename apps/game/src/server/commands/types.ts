import { PlayerType } from "../../protocol/enums/PlayerType";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { ItemDefinition } from "../../world/items/ItemCatalog";

/**
 * Result of a give item operation.
 */
export interface GiveItemResult {
  /** Number of items successfully added to inventory */
  added: number;
  /** Number of items that couldn't fit (overflow) */
  overflow: number;
  /** Name of the item for display purposes */
  itemName: string;
}

/**
 * Context passed to command handlers, providing access to game server utilities
 * without exposing the entire GameServer instance.
 */
export interface CommandContext {
  /** The user ID of the player executing the command */
  userId: number;
  /** The player's privilege level */
  playerType: PlayerType;
  /** The player's username */
  username: string;

  // --- Privilege Checks ---
  /** Check if player has one of the allowed privilege levels */
  hasPrivilege: (...allowed: PlayerType[]) => boolean;

  // --- Messaging ---
  /** Send a server info message to the executing player */
  reply: (message: string, style?: MessageStyle) => void;

  // --- Server Control ---
  /** Schedule a graceful server shutdown countdown */
  scheduleServerShutdown: (minutes: number) => { scheduled: boolean; reason?: string };

  // --- Player Lookups ---
  /** Get a player's user ID by their username (online players only) */
  getPlayerIdByUsername: (username: string) => number | null;

  // --- Teleportation ---
  /** Teleport a player to a specific location */
  teleportPlayer: (targetUserId: number, x: number, y: number, mapLevel: number) => void;

  /** Force-stop a player's movement intent and active movement plan */
  stopPlayerMovement: (targetUserId: number) => void;

  // --- Inventory Operations ---
  /** 
   * Give items to a player's inventory.
   * Handles stackability, partial fills, and overflow.
   * @param targetUserId The player to give items to
   * @param itemId The item definition ID
   * @param amount Number of items to give
   * @param noted Whether this is a noted item (defaults to false)
   * @returns Result containing added count, overflow, and item name
   */
  giveItem: (targetUserId: number, itemId: number, amount: number, noted?: boolean) => GiveItemResult;

  // --- Item Lookups ---
  /** Get an item definition by ID */
  getItemDefinition: (itemId: number) => ItemDefinition | undefined;

  /** Returns true when giveitem can safely grant this treasure map item */
  canReceiveTreasureMapItem: (targetUserId: number, itemId: number) => boolean;

  // --- Player State Access ---
  /** Get a player's state by their user ID */
  getPlayerState: (userId: number) => import("../../world/PlayerState").PlayerState | undefined;

  // --- Skill Level Broadcast ---
  /**
   * Send a skill level increased broadcast to nearby players.
   * Also sends GainedExp packet to the target player for client-side XP tracking.
   */
  sendSkillLevelIncreasedBroadcast: (
    targetUserId: number,
    skillSlug: import("../../world/PlayerState").SkillSlug,
    levelsGained: number,
    newLevel: number,
    xpGained: number
  ) => void;

  /**
   * Send a combat level increased broadcast to nearby players.
   * This is used for combat skills (hitpoints, accuracy, defense, strength, range, magic).
   */
  sendCombatLevelIncreasedBroadcast: (
    targetUserId: number,
    newCombatLevel: number
  ) => void;
}

/**
 * Result of command execution
 */
export type CommandResult = void | { handled: boolean };

/**
 * A command handler function
 */
export type CommandHandler = (ctx: CommandContext, args: string[]) => CommandResult;

/**
 * Command definition with metadata
 */
export interface CommandDefinition {
  /** Handler function */
  handler: CommandHandler;
  /** Required privilege levels (empty = anyone can use) */
  requiredPrivilege?: PlayerType[];
  /** Usage description for help text */
  usage?: string;
  /** Short description of what the command does */
  description?: string;
}
