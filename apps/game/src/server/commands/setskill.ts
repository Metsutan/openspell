import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler } from "./types";
import { SKILLS, isSkillSlug, getExpAtLevel, type SkillSlug, skillToClientRef } from "../../world/PlayerState";
import { DefaultPacketBuilder } from "../systems/PacketBuilder";

/**
 * Combat skills that should trigger PlayerCombatLevelIncreased packet
 */
const COMBAT_SKILLS: Set<SkillSlug> = new Set([
  SKILLS.hitpoints,
  SKILLS.accuracy,
  SKILLS.defense,
  SKILLS.strength,
  SKILLS.range,
  SKILLS.magic
]);

/**
 * Maximum level cap for skills
 */
const MAX_LEVEL = 100;

/**
 * /setskill <skill> <level> [username]
 * 
 * Sets a player's skill to a specific level (and corresponding XP).
 * 
 * Examples:
 *   /setskill mining 50          - Set your mining to level 50
 *   /setskill hitpoints 99 Bob   - Set Bob's hitpoints to level 99
 * 
 * Notes:
 *   - Combat skills (hitpoints, accuracy, defense, strength, range, magic) will broadcast combat level changes
 *   - Non-combat skills will broadcast skill level changes
 *   - Level must be between 1 and 99
 *   - Skill names are case-insensitive
 */
export const setskillCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  // Validate arguments
  if (args.length < 2) {
    ctx.reply("Usage: /setskill <skill> <level> [username]", MessageStyle.Warning);
    ctx.reply("Example: /setskill mining 50", MessageStyle.Warning);
    return;
  }

  // Parse skill name
  const skillArg = args[0].toLowerCase();
  if (!isSkillSlug(skillArg)) {
    ctx.reply(`Invalid skill: "${skillArg}"`, MessageStyle.Warning);
    ctx.reply("Valid skills: " + Object.values(SKILLS).filter(s => s !== "overall").join(", "), MessageStyle.Green);
    return;
  }

  // Don't allow setting overall skill
  if (skillArg === SKILLS.overall) {
    ctx.reply("Cannot directly set overall level", MessageStyle.Warning);
    return;
  }

  const skillSlug = skillArg as SkillSlug;

  // Parse level
  const levelArg = parseInt(args[1], 10);
  if (!Number.isFinite(levelArg) || levelArg < 1 || levelArg > MAX_LEVEL) {
    ctx.reply(`Invalid level: ${args[1]}. Level must be between 1 and ${MAX_LEVEL}`, MessageStyle.Warning);
    return;
  }

  // Determine target player
  let targetUserId = ctx.userId;
  let targetUsername = ctx.username;

  if (args.length >= 3) {
    const targetName = args.slice(2).join(" "); // Handle spaces in usernames
    const foundId = ctx.getPlayerIdByUsername(targetName);

    if (foundId === null) {
      ctx.reply(`Player "${targetName}" is not online`, MessageStyle.Warning);
      return;
    }

    targetUserId = foundId;
    targetUsername = targetName;
  }

  // Get player state
  const playerState = ctx.getPlayerState(targetUserId);
  if (!playerState) {
    ctx.reply(`Could not find player state for ${targetUsername}`, MessageStyle.Red);
    return;
  }

  // Get the previous level and XP
  const previousLevel = playerState.getSkillLevel(skillSlug);
  const previousXp = playerState.getSkillXp(skillSlug);

  // Calculate XP for the target level
  const xpForLevel = getExpAtLevel(levelArg);

  // Set the skill level and XP (returns old combat level if this is a combat skill)
  const oldCombatLevel = playerState.setSkillState(skillSlug, levelArg, xpForLevel, levelArg);

  // Calculate levels gained and XP gained (can be negative if level decreased)
  const levelsGained = levelArg - previousLevel;
  const xpGained = xpForLevel - previousXp;

  // Send success message to command executor
  if (targetUserId === ctx.userId) {
    ctx.reply(
      `Set ${skillSlug} to level ${levelArg} (${xpForLevel.toLocaleString()} XP, +${xpGained.toLocaleString()} XP)`,
      MessageStyle.Green
    );
  } else {
    ctx.reply(
      `Set ${targetUsername}'s ${skillSlug} to level ${levelArg} (${xpForLevel.toLocaleString()} XP, +${xpGained.toLocaleString()} XP)`,
      MessageStyle.Green
    );
  }

  // Always send PlayerSkillLevelIncreased for any skill change
  // Also sends GainedExp packet to the target player for client-side XP tracking
  ctx.sendSkillLevelIncreasedBroadcast(targetUserId, skillSlug, levelsGained, levelArg, xpGained);

  // If this is a combat skill, check if combat level changed
  if (oldCombatLevel !== null) {
    const newCombatLevel = calculateCombatLevel(playerState);
    playerState.updateCombatLevel(newCombatLevel);

    // Only send PlayerCombatLevelIncreased if the combat level actually changed
    if (newCombatLevel !== oldCombatLevel) {
      ctx.sendCombatLevelIncreasedBroadcast(targetUserId, newCombatLevel);
    }
  }
};

/**
 * Calculates a player's combat level based on their combat skills.
 * 
 * Formula (simplified OSRS-style):
 * Base = 0.25 * (Defense + Hitpoints + floor(Prayer/2))
 * Melee = 0.325 * (Attack + Strength)
 * Range = 0.325 * (floor(Range * 1.5))
 * Magic = 0.325 * (floor(Magic * 1.5))
 * Combat Level = floor(Base + max(Melee, Range, Magic))
 * 
 * Since we don't have Attack or Prayer, we'll use:
 * Base = 0.25 * (Defense + Hitpoints)
 * Melee = 0.325 * (Accuracy + Strength)
 * Range = 0.325 * (floor(Range * 1.5))
 * Magic = 0.325 * (floor(Magic * 1.5))
 * Combat Level = floor(Base + max(Melee, Range, Magic))
 */
export function calculateCombatLevel(playerState: import("../../world/PlayerState").PlayerState): number {
  return DefaultPacketBuilder.calculateCombatLevel(playerState);
}
