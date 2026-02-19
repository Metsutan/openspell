import { PlayerType } from "../../protocol/enums/PlayerType";
import { decodePublicMessagePayload } from "../../protocol/packets/actions/PublicMessage";
import { ClientActionTypes } from "../../protocol/enums/ClientActionType";
import { executeCommand } from "../commands";
import type { CommandContext } from "../commands/types";
import type { ActionHandler } from "./types";
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers, asteriskCensorStrategy } from 'obscenity';
import { clearUserMuteByUserId } from "../../db";

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
const CHAT_MAX_LENGTH = 80;

type ChatValidationResult =
  | { ok: true; trimmed: string }
  | { ok: false; reason: string; details?: Record<string, unknown> };

function validateChatMessageText(message: string): ChatValidationResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return { ok: false, reason: "empty_message_after_trim" };
  }

  if (trimmed.length > CHAT_MAX_LENGTH) {
    return {
      ok: false,
      reason: "message_too_long",
      details: { length: trimmed.length, maxLength: CHAT_MAX_LENGTH }
    };
  }

  // Client should only send basic printable ASCII for chat text.
  // Any non-printable/non-ASCII characters are considered tampered payloads.
  if (/[^ -~]/.test(trimmed)) {
    return { ok: false, reason: "message_contains_non_ascii_or_control_chars" };
  }

  // Reject content that would require HTML encoding on output.
  if (/[<>]/.test(trimmed)) {
    return { ok: false, reason: "message_contains_html_sensitive_chars" };
  }

  return { ok: true, trimmed };
}
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
export const handlePublicMessage: ActionHandler = async (ctx, actionData) => {
  if (ctx.userId === null) return;
  
  const publicMessage = decodePublicMessagePayload(actionData);
  if (!publicMessage) return; // Invalid packet, already logged in decode
  
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "PublicMessage",
      actionType: ClientActionTypes.PublicMessage,
      reason,
      payload: publicMessage,
      details
    });
  };

  if (typeof publicMessage.Message !== "string") {
    logInvalid("invalid_message_type", { messageType: typeof publicMessage.Message });
    return;
  }

  const messageText = publicMessage.Message;
  const validation = validateChatMessageText(messageText);
  if (!validation.ok) {
    logInvalid(validation.reason, validation.details);
    return;
  }
  const trimmedMessageText = validation.trimmed;
  const playerType = playerState.playerType as PlayerType;

  // Command handling: messages starting with "/" are treated as commands.
  if (trimmedMessageText.startsWith("/")) {
    const commandBody = trimmedMessageText.slice(1);
    const [rawCommand, ...rawArgs] = commandBody.split(" ");
    const command = rawCommand.toLowerCase();

    // Handle /g (global chat) inline since it's a chat feature, not a command
    if (command === "g") {
      const globalMessage = rawArgs.join(" ");
      const globalValidation = validateChatMessageText(globalMessage);
      if (!globalValidation.ok) {
        logInvalid(`global_${globalValidation.reason}`, globalValidation.details);
        return;
      }

      const muteMessage = getMuteBlockMessage(playerState);
      if (muteMessage) {
        ctx.messageService.sendServerInfo(ctx.userId, muteMessage, MessageStyle.Warning);
        return;
      }

      const censoredGlobalMessage = censorMessage(globalValidation.trimmed);
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

  const muteMessage = getMuteBlockMessage(playerState);
  if (muteMessage) {
    ctx.messageService.sendServerInfo(ctx.userId, muteMessage, MessageStyle.Warning);
    return;
  }

  // Send the public message to nearby players (with censoring applied)
  const censoredMessage = censorMessage(trimmedMessageText);
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
    disconnectPlayer: (userId: number, reason?: string) => {
      return ctx.disconnectUser(userId, reason);
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

function formatRemainingDuration(timeRemainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(timeRemainingMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}, ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}, ${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

function getMuteBlockMessage(playerState: PlayerState): string | null {
  const muteStatus = playerState.getMuteStatus(Date.now());
  if (muteStatus.isExpired) {
    // Expired temporary mute; clear in-memory immediately and persist cleanup asynchronously.
    playerState.clearMuteState();
    void clearUserMuteByUserId(playerState.userId).catch((err) => {
      console.warn("[handlePublicMessage] Failed to clear expired mute:", (err as Error)?.message ?? err);
    });
    return null;
  }

  if (!muteStatus.isMuted) {
    return null;
  }

  if (muteStatus.isPermanent) {
    return "You are permanently muted.";
  }

  if (muteStatus.timeRemainingMs === null) {
    return "You're muted.";
  }

  return `You're muted for ${formatRemainingDuration(muteStatus.timeRemainingMs)}.`;
}
