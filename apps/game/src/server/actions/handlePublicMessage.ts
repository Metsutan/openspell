import { PlayerType } from "../../protocol/enums/PlayerType";
import { decodePublicMessagePayload } from "../../protocol/packets/actions/PublicMessage";
import { executeCommand } from "../commands";
import type { CommandContext } from "../commands/types";
import type { ActionHandler } from "./types";
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers, asteriskCensorStrategy } from 'obscenity';

/**
 * Initialize obscenity filter to detect and censor obscenities (excluding mild curses).
 * Whitelisted terms are allowed and won't be censored.
 */
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// Use asterisk strategy to censor with repeated * characters
const censor = new TextCensor().setStrategy(asteriskCensorStrategy());
const LOCAL_CHAT_MIN_INTERVAL_TICKS = 2;
/**
 * Censors obscenities in a message, excluding mild curse words.
 * @param text The message text to censor
 * @returns The censored message
 */
function censorMessage(text: string): string {
  const matches = matcher.getAllMatches(text);

  if (matches.length === 0) {
    return text; // No obscenities found
  }


  if (matches.length === 0) {
    return text; // Only mild curses found, don't censor
  }

  return censor.applyTo(text, matches);
}

/**
 * Handles public chat messages from players.
 * Routes commands to command system, handles global chat, and local messages.
 */
export const handlePublicMessage: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;
  
  const publicMessage = decodePublicMessagePayload(actionData);
  if (!publicMessage) return; // Invalid packet, already logged in decode
  
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const messageText = publicMessage.Message;
  const trimmedMessageText = (messageText as string).trim().slice(0, 80);
  const playerType = playerState.playerType as PlayerType;

  // Command handling: messages starting with "/" are treated as commands.
  if (trimmedMessageText.startsWith("/")) {
    const commandBody = trimmedMessageText.slice(1);
    const [rawCommand, ...rawArgs] = commandBody.split(" ");
    const command = rawCommand.toLowerCase();

    // Handle /g (global chat) inline since it's a chat feature, not a command
    if (command === "g") {
      const globalMessage = rawArgs.join(" ").trim();
      if (!globalMessage) return; // Nothing to broadcast
      const censoredGlobalMessage = censorMessage(globalMessage);
      ctx.messageService.sendGlobalMessage(ctx.userId, playerState.displayName ?? playerState.username, censoredGlobalMessage, playerType);
      return;
    }

    // Build command context and dispatch to command system
    const commandCtx = buildCommandContext(ctx, playerState);
    const handled = executeCommand(command, rawArgs, commandCtx);

    if (handled) {
      return; // Command was processed
    }
    // Unrecognized command falls through to normal chat
  }
  
  if (ctx.currentTick - playerState.lastLocalMessageTick < LOCAL_CHAT_MIN_INTERVAL_TICKS) {
    return;
  }
  playerState.lastLocalMessageTick = ctx.currentTick;

  // Send the public message to nearby players (with censoring applied)
  const censoredMessage = censorMessage(publicMessage.Message as string);
  ctx.messageService.sendPublicMessage(ctx.userId, censoredMessage, publicMessage.Style as MessageStyle);
};

/**
 * Builds a command context from the action context.
 */
function buildCommandContext(ctx: ActionContext, playerState: PlayerState): CommandContext {
  return {
    userId: ctx.userId!,
    playerType: playerState.playerType as PlayerType,
    username: playerState.username,
    hasPrivilege: (...allowed: PlayerType[]) => allowed.includes(playerState.playerType as PlayerType),
    reply: (message: string, style?: MessageStyle) => {
      ctx.messageService.sendServerInfo(ctx.userId!, message, style);
    },
    scheduleServerShutdown: (minutes: number) => {
      return ctx.scheduleServerShutdown(minutes, ctx.userId!);
    },
    getPlayerIdByUsername: (username: string) => {
      // Search through all player states for matching username
      for (const state of ctx.playerStatesByUserId.values()) {
        if (state.username === username) {
          return state.userId;
        }
      }
      return null;
    },
    teleportPlayer: (targetUserId: number, x: number, y: number, mapLevel: number) => {
      ctx.teleportService.teleportPlayer(targetUserId, x, y, mapLevel as MapLevel, { validate: false });
    },
    stopPlayerMovement: (targetUserId: number) => {
      const targetState = ctx.playerStatesByUserId.get(targetUserId);
      if (!targetState) return;

      targetState.pendingAction = null;
      ctx.targetingService.clearPlayerTarget(targetUserId);
      ctx.pathfindingSystem.deleteMovementPlan({ type: EntityType.Player, id: targetUserId });
      ctx.stateMachine.setState({ type: EntityType.Player, id: targetUserId }, States.IdleState);
    },
    giveItem: (targetUserId: number, itemId: number, amount: number, noted: boolean = false) => {
      const definition = ctx.itemCatalog?.getDefinitionById(itemId);
      const itemName = definition?.name ?? `Item #${itemId}`;
      
      if (amount <= 0 || !definition) {
        return { added: 0, overflow: amount > 0 ? amount : 0, itemName };
      }
      
      // Stackable items always use isIOU=0 (they stack naturally)
      // Non-stackable items use isIOU=1 when noted (certificate form)
      const isIOU = !definition.isStackable && noted ? 1 : 0;
      return ctx.inventoryService.giveItem(targetUserId, itemId, amount, isIOU);
    },
    getItemDefinition: (itemId: number) => {
      return ctx.itemCatalog?.getDefinitionById(itemId);
    },
    canReceiveTreasureMapItem: (targetUserId: number, itemId: number) => {
      const tier = ctx.treasureMapService?.getTreasureMapTierByItemId(itemId);
      if (!tier) {
        return true;
      }
      return ctx.treasureMapService?.canRollTreasureMapDrop(targetUserId, tier) ?? true;
    },
    getPlayerState: (userId: number) => {
      return ctx.playerStatesByUserId.get(userId);
    },
    sendSkillLevelIncreasedBroadcast: (
      targetUserId: number,
      skillSlug: import("../../world/PlayerState").SkillSlug,
      levelsGained: number,
      newLevel: number,
      xpGained: number
    ) => {
      // Import necessary packet builders and enums
      const { GameAction } = require("../../protocol/enums/GameAction");
      const { buildPlayerSkillLevelIncreasedPayload } = require("../../protocol/packets/actions/PlayerSkillLevelIncreased");
      const { buildGainedExpPayload } = require("../../protocol/packets/actions/GainedExp");
      const { skillToClientRef } = require("../../world/PlayerState");
      
      // Get the target player's entity ID (same as userId for players)
      const playerEntityID = targetUserId;
      
      // Convert skill slug to client reference
      const skillClientRef = skillToClientRef(skillSlug);
      if (skillClientRef === null) {
        return; // Can't send packet for 'overall' skill
      }
      
      // Send GainedExp packet to the target player (for client-side XP tracking)
      const gainedExpPayload = buildGainedExpPayload({
        Skill: skillClientRef,
        Amount: xpGained
      });
      ctx.enqueueUserMessage(targetUserId, GameAction.GainedExp, gainedExpPayload);
      
      // Build the PlayerSkillLevelIncreased payload
      const skillLevelPayload = buildPlayerSkillLevelIncreasedPayload({
        PlayerEntityID: playerEntityID,
        Skill: skillClientRef,
        LevelsGained: levelsGained,
        NewLevel: newLevel
      });
      
      // Broadcast to all players (visibility system would handle filtering to nearby players)
      // For now we'll broadcast globally - in a proper implementation this would use
      // the event bus to notify nearby players only
      ctx.enqueueBroadcast(GameAction.PlayerSkillLevelIncreased, skillLevelPayload);
    },
    sendCombatLevelIncreasedBroadcast: (
      targetUserId: number,
      newCombatLevel: number
    ) => {
      // Import necessary packet builders and enums
      const { GameAction } = require("../../protocol/enums/GameAction");
      const { buildPlayerCombatLevelIncreasedPayload } = require("../../protocol/packets/actions/PlayerCombatLevelIncreased");
      
      // Get the target player's entity ID (same as userId for players)
      const playerEntityID = targetUserId;
      
      // Build the PlayerCombatLevelIncreased payload
      const payload = buildPlayerCombatLevelIncreasedPayload({
        PlayerEntityID: playerEntityID,
        NewCombatLevel: newCombatLevel
      });
      
      // Broadcast to all players (visibility system would handle filtering to nearby players)
      ctx.enqueueBroadcast(GameAction.PlayerCombatLevelIncreased, payload);
    }
  };
}

// Import types needed for command context
import type { PlayerState } from "../../world/PlayerState";
import type { MapLevel } from "../../world/Location";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { ActionContext } from "./types";
import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
