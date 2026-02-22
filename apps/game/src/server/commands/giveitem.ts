import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler, GiveItemResult } from "./types";

/**
 * Maximum items that can be given in a single command.
 * This prevents abuse and ensures reasonable server load.
 */
const MAX_GIVE_AMOUNT = Number.MAX_SAFE_INTEGER;

/**
 * Parses the item ID argument.
 * Supports both numeric IDs and potential future item name lookups.
 */
function parseItemId(arg: string): number | null {
  const parsed = parseInt(arg, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

/**
 * Parses the amount argument with sensible defaults and limits.
 */
function parseAmount(arg: string | undefined): number {
  if (!arg) return 1;
  
  const parsed = parseInt(arg, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(parsed, MAX_GIVE_AMOUNT);
}

/**
 * Parses boolean flags from command args.
 */
function parseBooleanArg(arg: string | undefined): boolean | null {
  if (!arg) return null;
  const normalized = arg.toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

/**
 * Formats a large number with commas for readability.
 */
function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * /giveitem <itemId> [amount] [noted] [username]
 * 
 * Gives items to yourself or another player.
 * 
 * Examples:
 *   /giveitem 1          - Give 1 of item #1 to yourself
 *   /giveitem 1 100      - Give 100 of item #1 to yourself
 *   /giveitem 1 50       - Give 50 of item #1 to yourself
 *   /giveitem 1 50 true  - Give 50 of item #1 to yourself as a noted item
 *   /giveitem 1 50 true Bob - Give 50 of item #1 to player "Bob" as a noted item
 * 
 * Notes:
 *   - Stackable items will stack in existing slots when possible
 *   - Non-stackable items take one slot each
 *   - If inventory is full, overflow items are dropped on the ground
 */
export const giveitemCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  // Validate arguments
  if (args.length < 1) {
    ctx.reply("Usage: /giveitem <itemId> [amount] [noted] [username]", MessageStyle.Warning);
    return;
  }

  // Parse item ID
  const itemId = parseItemId(args[0]);
  if (itemId === null) {
    ctx.reply(`Invalid item ID: ${args[0]}`, MessageStyle.Warning);
    return;
  }

  // Validate item exists
  const definition = ctx.getItemDefinition(itemId);
  if (!definition) {
    ctx.reply(`Item #${itemId} does not exist`, MessageStyle.Warning);
    return;
  }

  // Parse amount
  let amount = parseAmount(args[1]);

  // Parse noted + optional target player.
  // New format: /giveitem <itemId> [amount] [noted] [username]
  let targetUserId = ctx.userId;
  let targetUsername = ctx.username;
  let noted = false;

  const notedArg = parseBooleanArg(args[2]);

  if (notedArg !== null) {
    noted = notedArg;
    if (args.length >= 4) {
      const targetName = args.slice(3).join(" "); // Handle spaces in usernames
      const foundId = ctx.getPlayerIdByUsername(targetName);
      
      if (foundId === null) {
        ctx.reply(`Player "${targetName}" is not online`, MessageStyle.Warning);
        return;
      }
      
      targetUserId = foundId;
      targetUsername = targetName;
    }
  } else if (args.length >= 3) {
    // Backward compatibility: if arg[2] is not a boolean, treat it as a username.
    const targetName = args.slice(2).join(" "); // Handle spaces in usernames
    const foundId = ctx.getPlayerIdByUsername(targetName);
    
    if (foundId === null) {
      ctx.reply(`Player "${targetName}" is not online`, MessageStyle.Warning);
      return;
    }
    
    targetUserId = foundId;
    targetUsername = targetName;
  }

  const TIERED_TREASURE_MAP_IDS = new Set<number>([442, 443, 456]);
  const isTreasureMap = TIERED_TREASURE_MAP_IDS.has(itemId);

  if (isTreasureMap) {
    if (!ctx.canReceiveTreasureMapItem(targetUserId, itemId)) {
      if (targetUserId === ctx.userId) {
        ctx.reply("You already have this tier of Treasure Map in your inventory, bank, or on the floor.", MessageStyle.Warning);
      } else {
        ctx.reply(`${targetUsername} already has this tier of Treasure Map in inventory, bank, or on the floor.`, MessageStyle.Warning);
      }
      return;
    }

    if (noted) {
      ctx.reply("Treasure Maps cannot be given as noted items.", MessageStyle.Warning);
      return;
    }

    if (amount > 1) {
      amount = 1;
    }

    const targetState = ctx.getPlayerState(targetUserId);
    if (!targetState || !targetState.hasInventorySpace()) {
      if (targetUserId === ctx.userId) {
        ctx.reply("You need at least 1 free inventory slot to receive a Treasure Map.", MessageStyle.Warning);
      } else {
        ctx.reply(`${targetUsername} needs at least 1 free inventory slot to receive a Treasure Map.`, MessageStyle.Warning);
      }
      return;
    }
  }
  let result: GiveItemResult;
  if(noted) {
    result = ctx.giveItem(targetUserId, itemId, amount, true);
  } else {
    result = ctx.giveItem(targetUserId, itemId, amount, false);
  }

  // Report results
  const isStackable = definition.isStackable;
  const amountStr = formatNumber(result.added);
  const itemNameFormatted = result.added === 1 && !definition.isNamePlural
    ? result.itemName
    : result.itemName; // Could add plural logic here if needed

  if (result.added === 0) {
    if (targetUserId === ctx.userId) {
      ctx.reply(`Your inventory is full!`, MessageStyle.Red);
    } else {
      ctx.reply(`${targetUsername}'s inventory is full!`, MessageStyle.Red);
    }
    return;
  }

  // Success message
  if (targetUserId === ctx.userId) {
    ctx.reply(
      `Added ${amountStr}x ${result.itemName} to your inventory`,
      MessageStyle.Green
    );
  } else {
    ctx.reply(
      `Added ${amountStr}x ${result.itemName} to ${targetUsername}'s inventory`,
      MessageStyle.Green
    );
  }

  // Overflow warning
  if (result.overflow > 0) {
    const overflowStr = formatNumber(result.overflow);
    if (targetUserId === ctx.userId) {
      ctx.reply(
        `Inventory full! ${overflowStr}x ${result.itemName} was dropped.`,
        MessageStyle.Orange
      );
    } else {
      ctx.reply(
        `${targetUsername}'s inventory full! ${overflowStr}x ${result.itemName} was dropped.`,
        MessageStyle.Orange
      );
    }
  }

  // Additional info for non-stackable items
  if (!isStackable && amount > 1) {
    ctx.reply(
      `Note: ${result.itemName} is not stackable (1 per slot)`,
      MessageStyle.Yellow
    );
  }
};
