/**
 * DelaySystem.ts - Handles timed delays for player actions
 * 
 * Architecture:
 * - Manages both blocking and non-blocking delays for players
 * - Blocking delays: Prevent all player actions until complete (stun, death)
 * - Non-blocking delays: Can be interrupted by new actions (pickpocket windup)
 * 
 * Use Cases:
 * - Pickpocket: 2-tick non-blocking delay before attempt
 * - Stun: Blocking delay after failed pickpocket/combat
 * - Death: Blocking delay before respawn (can replace DeathSystem player death timer)
 * - Skilling: Non-blocking delays between resource gathering
 */

import { States } from "../../protocol/enums/States";
import { EntityType } from "../../protocol/enums/EntityType";
import type { PlayerState } from "../../world/PlayerState";
import type { StateMachine } from "../StateMachine";
import type { MessageService } from "../services/MessageService";

/**
 * Callback executed when a delay completes.
 */
export type DelayCallback = (userId: number) => void;

/**
 * Types of delays supported by the system.
 */
export enum DelayType {
  /** Can be interrupted by new actions */
  NonBlocking = "non-blocking",
  /** Blocks all player actions until complete */
  Blocking = "blocking"
}

/**
 * Configuration for a player delay.
 */
export interface DelayConfig {
  /** User ID of the player */
  userId: number;
  /** Type of delay */
  type: DelayType;
  /** Number of ticks to wait */
  ticks: number;
  /** Optional state to set while delayed */
  state?: States;
  /** Optional state to restore when delay ends */
  restoreState?: States;
  /** If true, don't restore state after delay (stay in current state) */
  skipStateRestore?: boolean;
  /** Optional message to send when delay starts */
  startMessage?: string;
  /** Optional message to send when delay is interrupted */
  interruptMessage?: string;
  /** Callback when delay completes naturally */
  onComplete?: DelayCallback;
  /** Callback when delay is interrupted (non-blocking only) */
  onInterrupt?: DelayCallback;
}

/**
 * Active delay tracking.
 */
interface ActiveDelay {
  config: DelayConfig;
  remainingTicks: number;
  originalState: States;
}

export interface DelaySystemConfig {
  playerStatesByUserId: Map<number, PlayerState>;
  stateMachine: StateMachine;
  messageService: MessageService;
}

/**
 * System for managing timed delays on player actions.
 */
export class DelaySystem {
  /** Map of active delays by userId */
  private readonly activeDelays = new Map<number, ActiveDelay>();

  constructor(private readonly config: DelaySystemConfig) {}

  /**
   * Main update called once per server tick.
   * Decrements delay timers and triggers callbacks when complete.
   */
  update(): void {
    const completedDelays: number[] = [];

    // Decrement timers
    for (const [userId, delay] of this.activeDelays.entries()) {
      delay.remainingTicks--;

      if (delay.remainingTicks <= 0) {
        completedDelays.push(userId);
      }
    }

    // Process completed delays
    for (const userId of completedDelays) {
      this.completeDelay(userId);
    }
  }

  /**
   * Starts a delay for a player.
   * 
   * @param config - Configuration for the delay
   * @returns true if delay was started, false if player not found or already delayed
   */
  startDelay(config: DelayConfig): boolean {
    const player = this.config.playerStatesByUserId.get(config.userId);
    if (!player) {
      console.warn(`[DelaySystem] Cannot start delay: Player ${config.userId} not found`);
      return false;
    }

    // For non-blocking delays, allow overwriting existing delays
    // For blocking delays, prevent starting if already delayed
    if (config.type === DelayType.Blocking && this.activeDelays.has(config.userId)) {
      console.warn(`[DelaySystem] Cannot start blocking delay: Player ${config.userId} already has active delay`);
      return false;
    }

    // Store original state
    const originalState = player.currentState;

    // Set delay state if provided (StateMachine will update player.currentState internally)
    if (config.state !== undefined) {
      this.config.stateMachine.setState(
        { type: EntityType.Player, id: config.userId },
        config.state
      );
    }

    // Send start message if provided
    if (config.startMessage) {
      this.config.messageService.sendServerInfo(config.userId, config.startMessage);
    }

    // Store active delay
    this.activeDelays.set(config.userId, {
      config,
      remainingTicks: config.ticks,
      originalState
    });

    return true;
  }

  /**
   * Interrupts an active delay (non-blocking only).
   * 
   * @param userId - User ID of player
   * @param sendMessage - Whether to send interrupt message
   * @returns true if delay was interrupted, false if no active delay or delay is blocking
   */
  interruptDelay(userId: number, sendMessage: boolean = true): boolean {
    const delay = this.activeDelays.get(userId);
    if (!delay) {
      return false;
    }

    // Can't interrupt blocking delays
    if (delay.config.type === DelayType.Blocking) {
      if (sendMessage && delay.config.startMessage) {
        // Re-send the blocking message as feedback
        this.config.messageService.sendServerInfo(userId, delay.config.startMessage);
      }
      return false;
    }

    // Send interrupt message if configured
    if (sendMessage && delay.config.interruptMessage) {
      this.config.messageService.sendServerInfo(userId, delay.config.interruptMessage);
    }

    // Call interrupt callback
    if (delay.config.onInterrupt) {
      delay.config.onInterrupt(userId);
    }

    // Restore original state if needed (unless skipStateRestore is true)
    if (!delay.config.skipStateRestore) {
      this.restorePlayerState(userId, delay);
    }

    // Remove delay
    this.activeDelays.delete(userId);

    return true;
  }

  /**
   * Completes a delay naturally (timer expired).
   */
  private completeDelay(userId: number): void {
    const delay = this.activeDelays.get(userId);
    if (!delay) return;


    // Remove delay BEFORE calling callback
    // This allows the callback to start new delays (e.g., pickpocket fail → stun delay)
    this.activeDelays.delete(userId);

    // Call completion callback (delay is already removed, so callback can start new delays)
    if (delay.config.onComplete) {
      delay.config.onComplete(userId);
    }

    // Skip state restoration if configured (useful for continuous activities like woodcutting)
    if (delay.config.skipStateRestore) {
      return;
    }

    // Restore state if configured (StateMachine will update player.currentState internally)
    if (delay.config.restoreState !== undefined) {
      const player = this.config.playerStatesByUserId.get(userId);
      if (player) {
        this.config.stateMachine.setState(
          { type: EntityType.Player, id: userId },
          delay.config.restoreState
        );
      }
    } else {
      // Restore original state
      this.restorePlayerState(userId, delay);
    }
  }

  /**
   * Restores player to their original state before the delay.
   */
  private restorePlayerState(userId: number, delay: ActiveDelay): void {
    const player = this.config.playerStatesByUserId.get(userId);
    if (!player) return;

    // Only restore if state was actually changed by the delay (StateMachine will update player.currentState internally)
    if (delay.config.state !== undefined) {
      this.config.stateMachine.setState(
        { type: EntityType.Player, id: userId },
        delay.originalState
      );
    }
  }

  /**
   * Checks if a player has an active delay.
   */
  hasActiveDelay(userId: number): boolean {
    return this.activeDelays.has(userId);
  }

  /**
   * Checks if a player has a blocking delay.
   */
  hasBlockingDelay(userId: number): boolean {
    const delay = this.activeDelays.get(userId);
    if (!delay) return false;
    return delay.config.type === DelayType.Blocking;
  }

  /**
   * Gets remaining ticks for a player's delay.
   * Returns null if no active delay.
   */
  getRemainingTicks(userId: number): number | null {
    const delay = this.activeDelays.get(userId);
    return delay?.remainingTicks ?? null;
  }

  /**
   * Clears a player's delay (for disconnect, death, etc.).
   * Unlike interrupt, this doesn't trigger callbacks or restore state.
   */
  clearDelay(userId: number): void {
    this.activeDelays.delete(userId);
  }

  /**
   * Gets the number of active delays (for debugging).
   */
  getActiveDelayCount(): number {
    return this.activeDelays.size;
  }
}
