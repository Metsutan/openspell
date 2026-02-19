import { GameAction } from "../../protocol/enums/GameAction";
import { MessageStyle } from "../../protocol/enums/MessageStyle";
import { PlayerType } from "../../protocol/enums/PlayerType";
import { EntityType } from "../../protocol/enums/EntityType";
import http from "http";
import https from "https";
import { buildPublicMessagePayload } from "../../protocol/packets/actions/PublicMessage";
import { buildGlobalPublicMessagePayload } from "../../protocol/packets/actions/GlobalPublicMessage";
import { buildServerInfoMessagePayload } from "../../protocol/packets/actions/ServerInfoMessage";
import type { PlayerState } from "../../world/PlayerState";
import type { VisibilitySystem } from "../systems/VisibilitySystem";
import type { EntityRef } from "../events/GameEvents";
import type { ChatAuditService } from "./ChatAuditService";

export interface MessageServiceDependencies {
  playerStatesByUserId: Map<number, PlayerState>;
  visibilitySystem: VisibilitySystem;
  enqueueUserMessage: (userId: number, action: GameAction, payload: unknown[]) => void;
  enqueueBroadcast: (action: GameAction, payload: unknown[]) => void;
  chatAudit?: ChatAuditService | null;
}

/**
 * Service for handling chat messages and server notifications.
 * Manages public messages, global chat, and server info messages.
 */
export class MessageService {
  private readonly globalChatWebhookEnabled: boolean;
  private readonly globalChatWebhookUrl: string;

  constructor(private readonly deps: MessageServiceDependencies) {
    this.globalChatWebhookEnabled = this.parseBoolean(process.env.GLOBAL_CHAT_DISCORD_WEBHOOK_ENABLED, false);
    this.globalChatWebhookUrl = (process.env.GLOBAL_CHAT_DISCORD_WEBHOOK_URL ?? "").trim();
  }

  private parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined) return fallback;
    return value.toLowerCase() === "true" || value === "1";
  }

  private sanitizeMessageText(message: string): string {
    // Always escape chat text before sending to clients to prevent HTML/script injection.
    return message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }

  /**
   * Sends a server info message to a specific player.
   * Used for notifications, errors, and command responses.
   * 
   * @param userId The player to send the message to
   * @param message The message text
   * @param style The message style/color (defaults to Green)
   */
  sendServerInfo(userId: number, message: string, style: MessageStyle = MessageStyle.White) {
    const payload = buildServerInfoMessagePayload({
      Message: message,
      Style: style
    });
    this.deps.enqueueUserMessage(userId, GameAction.ServerInfoMessage, payload);
  }

  /**
   * Sends a public message from a player to nearby players.
   * Uses the visibility system to determine who can see the message.
   * 
   * @param userId The player sending the message
   * @param message The message text
   * @param style The message style
   */
  sendPublicMessage(userId: number, message: string, style: MessageStyle) {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) return;
    const safeMessage = this.sanitizeMessageText(message);

    const outgoingPayload = buildPublicMessagePayload({
      EntityID: userId,
      Style: style,
      Message: safeMessage,
      PlayerType: playerState.playerType as PlayerType
    });

    // Get watchers from VisibilitySystem for spatial broadcast
    const entityRef: EntityRef = { type: EntityType.Player, id: userId };
    const watchers = this.deps.visibilitySystem.getWatchers(entityRef);

    // Send to self
    this.deps.enqueueUserMessage(userId, GameAction.PublicMessage, outgoingPayload);

    // Send to all nearby watchers
    for (const viewer of watchers) {
      this.deps.enqueueUserMessage(viewer, GameAction.PublicMessage, outgoingPayload);
    }

    this.deps.chatAudit?.logChatMessage({
      userId,
      usernameSnapshot: playerState.username,
      displayNameSnapshot: playerState.displayName ?? playerState.username,
      message: safeMessage,
      channel: "local",
      mapLevel: playerState.mapLevel,
      x: playerState.x,
      y: playerState.y,
      playerType: playerState.playerType,
      style
    });
  }

  /**
   * Sends a global message to all connected players.
   * Typically used for global chat (/g command) or server-wide announcements.
   * 
   * @param userId The player sending the message (or 0 for system messages)
   * @param username The username to display
   * @param message The message text
   * @param playerType The player's privilege level
   */
  sendGlobalMessage(userId: number, username: string, message: string, playerType: PlayerType) {
    const safeName = this.sanitizeMessageText(username);
    const safeMessage = this.sanitizeMessageText(message);
    const outgoingPayload = buildGlobalPublicMessagePayload({
      EntityID: userId,
      Name: safeName,
      Message: safeMessage,
      PlayerType: playerType
    });

    const playerState = this.deps.playerStatesByUserId.get(userId);
    this.deps.chatAudit?.logChatMessage({
      userId,
      usernameSnapshot: playerState?.username ?? username,
      displayNameSnapshot: playerState?.displayName ?? username,
      message: safeMessage,
      channel: "global",
      mapLevel: playerState?.mapLevel ?? null,
      x: playerState?.x ?? null,
      y: playerState?.y ?? null,
      playerType: playerType
    });

    if (this.globalChatWebhookEnabled) {
      const webhookName = this.getWebhookSenderName(userId, username);
      const webhookMessage = this.formatGlobalWebhookMessage(webhookName, safeMessage, playerType);
      void this.sendGlobalChatWebhook(webhookMessage);
    }

    this.deps.enqueueBroadcast(GameAction.GlobalPublicMessage, outgoingPayload);
  }

  private getWebhookSenderName(userId: number, fallbackName: string): string {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return fallbackName;
    }
    return playerState.displayName ?? fallbackName;
  }

  private formatGlobalWebhookMessage(name: string, message: string, playerType: PlayerType): string {
    const prefix = playerType === PlayerType.Default ? "<:global:1474083951797600376>" : "<:mod:1474082851547910237>";
    return `${prefix} ${name}: ${message}`;
  }

  private async sendGlobalChatWebhook(content: string): Promise<void> {
    if (!this.globalChatWebhookUrl) return;

    let targetUrl: URL;
    try {
      targetUrl = new URL(this.globalChatWebhookUrl);
    } catch (error) {
      console.warn("[chat] GLOBAL_CHAT_DISCORD_WEBHOOK_URL is invalid:", (error as Error)?.message ?? error);
      return;
    }

    const body = JSON.stringify({
      username: "Global",
      content,
      allowed_mentions: { parse: [] as string[] }
    });

    const isHttps = targetUrl.protocol === "https:";
    const client = isHttps ? https : http;

    await new Promise<void>((resolve) => {
      const req = client.request(
        targetUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
          }
        },
        (res) => {
          // Drain response body so sockets can be reused.
          res.resume();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }
          console.warn(`[chat] Discord global webhook returned status ${res.statusCode ?? "unknown"}`);
          resolve();
        }
      );

      req.on("error", (error) => {
        console.warn("[chat] Failed to send Discord global webhook:", (error as Error)?.message ?? error);
        resolve();
      });

      req.write(body);
      req.end();
    });
  }
}
