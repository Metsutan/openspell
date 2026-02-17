import { GameAction } from "../../protocol/enums/GameAction";
import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { buildStartedChangingAppearancePayload } from "../../protocol/packets/actions/StartedChangingAppearance";
import { buildStoppedChangingAppearancePayload } from "../../protocol/packets/actions/StoppedChangingAppearance";
import { buildChangedAppearancePayload } from "../../protocol/packets/actions/ChangedAppearance";
import type { ChangeAppearancePayload } from "../../protocol/packets/actions/ChangeAppearance";
import type { PlayerState } from "../../world/PlayerState";
import type { StateMachine } from "../StateMachine";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";

type EnqueueUserMessage = (userId: number, action: GameAction, payload: unknown[]) => void;
type EnqueueBroadcast = (action: GameAction, payload: unknown[]) => void;

export interface ChangeAppearanceServiceDependencies {
  playerStatesByUserId: Map<number, PlayerState>;
  inventoryService: InventoryService;
  messageService: MessageService;
  stateMachine: StateMachine;
  enqueueUserMessage: EnqueueUserMessage;
  enqueueBroadcast: EnqueueBroadcast;
}

export interface ChangeAppearanceResult {
  ok: boolean;
  reason?: string;
}

const COIN_ITEM_ID = 6;
const CHANGE_APPEARANCE_COST_COINS = 5000;

// Placeholder allow-lists copied from observed client constraints.
const ALLOWED_HAIR_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31
] as const;

const ALLOWED_BEARD_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33
] as const;

const ALLOWED_SHIRT_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29
] as const;

const ALLOWED_PANTS_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15] as const;

const ALLOWED_BODY_IDS = [0, 1, 2, 3, 4] as const;

const ALLOWED_HAIR_SET = new Set<number>(ALLOWED_HAIR_IDS);
const ALLOWED_BEARD_SET = new Set<number>(ALLOWED_BEARD_IDS);
const ALLOWED_SHIRT_SET = new Set<number>(ALLOWED_SHIRT_IDS);
const ALLOWED_PANTS_SET = new Set<number>(ALLOWED_PANTS_IDS);
const ALLOWED_BODY_SET = new Set<number>(ALLOWED_BODY_IDS);

export class ChangeAppearanceService {
  private readonly pendingFeeByUserId = new Map<number, number>();

  constructor(private readonly deps: ChangeAppearanceServiceDependencies) {}

  startFromConversation(userId: number): ChangeAppearanceResult {
    return this.startChangeAppearance(userId, {
      isFirstTime: false,
      chargeCoinsOnSubmit: true
    });
  }

  startChangeAppearance(
    userId: number,
    options: { isFirstTime: boolean; chargeCoinsOnSubmit: boolean }
  ): ChangeAppearanceResult {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return { ok: false, reason: "player_not_found" };
    }

    const payload = buildStartedChangingAppearancePayload({
      EntityID: userId,
      IsFirstTime: options.isFirstTime
    });
    this.deps.enqueueUserMessage(userId, GameAction.StartedChangingAppearance, payload);

    if (options.chargeCoinsOnSubmit) {
      this.pendingFeeByUserId.set(userId, CHANGE_APPEARANCE_COST_COINS);
    } else {
      this.pendingFeeByUserId.delete(userId);
    }

    this.deps.stateMachine.setState({ type: EntityType.Player, id: userId }, States.ChangingAppearanceState);
    return { ok: true };
  }

  applyChangeRequest(userId: number, payload: ChangeAppearancePayload): ChangeAppearanceResult {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return { ok: false, reason: "player_not_found" };
    }

    if (playerState.currentState !== States.ChangingAppearanceState) {
      return { ok: false, reason: "invalid_state" };
    }

    const hairId = this.parseAppearanceId(payload.HairID);
    const beardId = this.parseAppearanceId(payload.BeardID);
    const shirtId = this.parseAppearanceId(payload.ShirtID);
    const bodyId = this.parseAppearanceId(payload.BodyID);
    const pantsId = this.parseAppearanceId(payload.PantsID);

    if (
      hairId === null ||
      beardId === null ||
      shirtId === null ||
      bodyId === null ||
      pantsId === null
    ) {
      return { ok: false, reason: "non_integer_appearance_id" };
    }

    if (!this.validateAppearance(hairId, beardId, shirtId, bodyId, pantsId)) {
      return { ok: false, reason: "invalid_appearance_id" };
    }

    const fee = this.pendingFeeByUserId.get(userId) ?? 0;
    if (fee > 0) {
      const removeResult = this.deps.inventoryService.removeItem(userId, COIN_ITEM_ID, fee, 0);
      if (removeResult.removed < fee) {
        // InventoryService can partially remove; refund on failed payment check.
        if (removeResult.removed > 0) {
          this.deps.inventoryService.giveItem(userId, COIN_ITEM_ID, removeResult.removed, 0);
        }
        this.deps.messageService.sendServerInfo(
          userId,
          `You need ${fee} coins to change your appearance.`
        );
        return { ok: false, reason: "insufficient_coins" };
      }
    }

    playerState.updateAppearance({
      hairStyleId: hairId,
      beardStyleId: beardId,
      shirtId,
      bodyTypeId: bodyId,
      legsId: pantsId
    });

    const changedAppearancePayload = buildChangedAppearancePayload({
      EntityID: userId,
      HairID: playerState.appearance.hairStyleId,
      BeardID: playerState.appearance.beardStyleId,
      ShirtID: playerState.appearance.shirtId,
      BodyID: playerState.appearance.bodyTypeId,
      PantsID: playerState.appearance.legsId
    });

    this.deps.enqueueUserMessage(userId, GameAction.ChangedAppearance, changedAppearancePayload);
    this.deps.enqueueBroadcast(GameAction.ChangedAppearance, changedAppearancePayload);

    const stoppedPayload = buildStoppedChangingAppearancePayload({ EntityID: userId });
    this.deps.enqueueUserMessage(userId, GameAction.StoppedChangingAppearance, stoppedPayload);

    this.pendingFeeByUserId.delete(userId);
    this.deps.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);

    return { ok: true };
  }

  private parseAppearanceId(value: unknown): number | null {
    if (!Number.isInteger(value)) {
      return null;
    }
    return value as number;
  }

  private validateAppearance(
    hairId: number,
    beardId: number,
    shirtId: number,
    bodyId: number,
    pantsId: number
  ): boolean {
    return (
      ALLOWED_HAIR_SET.has(hairId) &&
      ALLOWED_BEARD_SET.has(beardId) &&
      ALLOWED_SHIRT_SET.has(shirtId) &&
      ALLOWED_BODY_SET.has(bodyId) &&
      ALLOWED_PANTS_SET.has(pantsId)
    );
  }
}
