import { GameAction } from "../../protocol/enums/GameAction";
import { EntityType } from "../../protocol/enums/EntityType";
import { MenuType } from "../../protocol/enums/MenuType";
import { States } from "../../protocol/enums/States";
import { buildAddedItemAtInventorySlotPayload } from "../../protocol/packets/actions/AddedItemAtInventorySlot";
import { buildInvokedInventoryItemActionPayload } from "../../protocol/packets/actions/InvokedInventoryItemAction";
import { buildTradeCancelledPayload } from "../../protocol/packets/actions/TradeCancelled";
import { buildTradeCompletedPayload } from "../../protocol/packets/actions/TradeCompleted";
import { buildTradeGoToFinalStepPayload } from "../../protocol/packets/actions/TradeGoToFinalStep";
import { buildTradePlayerAcceptedPayload } from "../../protocol/packets/actions/TradePlayerAccepted";
import type { InvokeInventoryItemActionPayload } from "../../protocol/packets/actions/InvokeInventoryItemAction";
import { buildRemovedItemFromInventoryAtSlotPayload } from "../../protocol/packets/actions/RemovedItemFromInventoryAtSlot";
import { buildTradeRequestedPayload } from "../../protocol/packets/actions/TradeRequested";
import { buildTradeStartedPayload } from "../../protocol/packets/actions/TradeStarted";
import { buildTradeStatusResetPayload } from "../../protocol/packets/actions/TradeStatusReset";
import type { ItemCatalog } from "../../world/items/ItemCatalog";
import type { LineOfSightSystem } from "../../world/LineOfSight";
import { INVENTORY_SLOT_COUNT, type FullInventory, type InventoryItem, type PlayerState } from "../../world/PlayerState";
import { InventoryManager } from "../../world/systems/InventoryManager";
import { applyWeightChange, recalculatePlayerWeight } from "../../world/systems/WeightCalculator";
import type { InventoryService } from "./InventoryService";
import type { MessageService } from "./MessageService";
import type { TargetingService } from "./TargetingService";
import type { DelaySystem } from "../systems/DelaySystem";
import { DelayType } from "../systems/DelaySystem";
import type { StateMachine } from "../StateMachine";
import type { PacketAuditService } from "./PacketAuditService";
import type { ItemAuditService } from "./ItemAuditService";

const TRADE_REQUEST_DELAY_TICKS = 2;
const TRADE_REQUEST_TIMEOUT_MS = 10_000;

const enum TradeCancelledReason {
  NoSpace = 0,
  Cancelled = 1,
  OtherPlayerNoSpace = 2,
  OtherPlayerCancelled = 3
}

const enum TradeStatusAction {
  Decline = 0,
  Accept = 1
}

export interface TradingServiceConfig {
  playerStatesByUserId: Map<number, PlayerState>;
  targetingService: TargetingService;
  delaySystem: DelaySystem;
  inventoryService: InventoryService;
  itemCatalog: ItemCatalog;
  stateMachine: StateMachine;
  messageService: MessageService;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
  getLineOfSightSystem: () => LineOfSightSystem | null;
  packetAudit?: PacketAuditService | null;
  itemAudit?: ItemAuditService | null;
}

type TradeInventorySnapshot = {
  inventory: FullInventory;
  inventoryWeight: number;
};

type TradePhase = "offer" | "confirm";

type ActiveTradeSession = {
  playerAUserId: number;
  playerBUserId: number;
  phase: TradePhase;
  offerAcceptedBy: Set<number>;
  confirmAcceptedBy: Set<number>;
};

export class TradingService {
  private readonly pendingRequests = new Map<string, number>();
  private readonly activeTradePartnerByUserId = new Map<number, number>();
  private readonly offeredInventoryByUserId = new Map<number, FullInventory>();
  private readonly inventorySnapshotsByUserId = new Map<number, TradeInventorySnapshot>();
  private readonly activeTradeSessionByPairKey = new Map<string, ActiveTradeSession>();
  private completedTradeSequence = 0;

  constructor(private readonly config: TradingServiceConfig) {}

  private logInvalid(
    userId: number,
    packetName: string,
    reason: string,
    payload?: unknown,
    details?: Record<string, unknown>
  ): void {
    const actionType =
      payload && typeof payload === "object" && payload !== null && "Action" in payload
        ? Number((payload as { Action?: unknown }).Action)
        : undefined;
    this.config.packetAudit?.logInvalidPacket({
      userId,
      packetName,
      actionType: Number.isInteger(actionType) ? actionType : undefined,
      reason,
      payload,
      details
    });
  }

  requestTrade(requestingUserId: number, otherUserId: number): boolean {
    if (requestingUserId === otherUserId) {
      return false;
    }

    if (this.isInActiveTrade(requestingUserId) || this.isInActiveTrade(otherUserId)) {
      this.config.messageService.sendServerInfo(requestingUserId, "You're already busy.");
      return false;
    }

    const requestingPlayer = this.config.playerStatesByUserId.get(requestingUserId);
    if (!requestingPlayer) {
      return false;
    }

    const otherPlayer = this.config.playerStatesByUserId.get(otherUserId);
    if (!otherPlayer) {
      this.config.messageService.sendServerInfo(requestingUserId, "They're no longer there");
      return false;
    }

    if (otherPlayer.mapLevel !== requestingPlayer.mapLevel) {
      //LogInvalid
      this.config.messageService.sendServerInfo(requestingUserId, "They're no longer there");
      return false;
    }

    const otherState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: otherUserId });
    if (otherState === States.PlayerDeadState) {
      this.config.messageService.sendServerInfo(requestingUserId, "They're no longer there");
      return false;
    }

    if (!this.arePlayersAdjacent(requestingPlayer, otherPlayer)) {
      //LogInvalid
      this.config.messageService.sendServerInfo(requestingUserId, "Can't reach them");
      return false;
    }

    const targetRef = { type: EntityType.Player, id: otherUserId } as const;
    this.config.targetingService.setPlayerTarget(requestingUserId, targetRef);

    const delayStarted = this.config.delaySystem.startDelay({
      userId: requestingUserId,
      type: DelayType.NonBlocking,
      ticks: TRADE_REQUEST_DELAY_TICKS,
      state: States.TradingState,
      // We decide whether to stay in TradingState or return to idle inside onComplete.
      // If reciprocal request starts a trade, auto-restore to idle would incorrectly cancel it.
      skipStateRestore: true,
      onComplete: (delayedUserId) => this.completeTradeRequest(delayedUserId, otherUserId)
    });

    if (!delayStarted) {
      this.config.messageService.sendServerInfo(requestingUserId, "You're already busy.");
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      this.config.stateMachine.setState({ type: EntityType.Player, id: requestingUserId }, States.IdleState);
      return false;
    }

    return true;
  }

  onPlayerExitedTradingState(userId: number): void {
    const partnerId = this.activeTradePartnerByUserId.get(userId);
    if (partnerId === undefined) {
      return;
    }

    this.endActiveTradeDirectional(
      userId,
      partnerId,
      TradeCancelledReason.Cancelled,
      TradeCancelledReason.OtherPlayerCancelled
    );
  }

  onPlayerDisconnected(userId: number): void {
    const partnerId = this.activeTradePartnerByUserId.get(userId);
    if (partnerId !== undefined) {
      this.endActiveTradeDirectional(
        userId,
        partnerId,
        TradeCancelledReason.Cancelled,
        TradeCancelledReason.OtherPlayerCancelled
      );
    }

    this.clearPendingRequestsForUser(userId);
  }

  updateTradeStatus(userId: number, status: number): void {
    if (status !== TradeStatusAction.Decline && status !== TradeStatusAction.Accept) {
      this.logInvalid(userId, "UpdateTradeStatus", "trade_status_invalid_value", { Status: status }, { status });
      return;
    }

    const partnerId = this.activeTradePartnerByUserId.get(userId);
    if (partnerId === undefined) {
      this.logInvalid(userId, "UpdateTradeStatus", "trade_status_no_active_trade", { Status: status }, { status });
      return;
    }

    if (status === TradeStatusAction.Decline) {
      this.endActiveTradeDirectional(
        userId,
        partnerId,
        TradeCancelledReason.Cancelled,
        TradeCancelledReason.OtherPlayerCancelled,
        { setPlayerAIdle: true, setPlayerBIdle: true, restoreSnapshot: true }
      );
      return;
    }

    const session = this.getActiveTradeSession(userId);
    if (!session) {
      return;
    }

    this.sendTradePlayerAccepted(userId, session.playerAUserId, session.playerBUserId);

    if (session.phase === "offer") {
      session.offerAcceptedBy.add(userId);
      if (session.offerAcceptedBy.has(session.playerAUserId) && session.offerAcceptedBy.has(session.playerBUserId)) {
        session.phase = "confirm";
        session.offerAcceptedBy.clear();
        session.confirmAcceptedBy.clear();
        this.sendTradeGoToFinalStep(session.playerAUserId, session.playerBUserId);
      }
      return;
    }

    session.confirmAcceptedBy.add(userId);
    if (session.confirmAcceptedBy.has(session.playerAUserId) && session.confirmAcceptedBy.has(session.playerBUserId)) {
      this.completeActiveTrade(session);
    }
  }

  offerTradeItem(userId: number, payload: InvokeInventoryItemActionPayload): boolean {
    const sendOfferResponse = (success: boolean) => {
      this.config.enqueueUserMessage(
        userId,
        GameAction.InvokedInventoryItemAction,
        buildInvokedInventoryItemActionPayload({
          Action: payload.Action,
          MenuType: payload.MenuType,
          Slot: payload.Slot,
          ItemID: payload.ItemID,
          Amount: payload.Amount,
          IsIOU: payload.IsIOU,
          Success: success,
          Data: null
        })
      );
    };

    if (Number(payload.MenuType) !== MenuType.TradeInventory) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_invalid_menu", payload, {
        menuType: payload.MenuType
      });
      sendOfferResponse(false);
      return false;
    }

    const partnerId = this.activeTradePartnerByUserId.get(userId);
    if (partnerId === undefined) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_no_active_trade", payload);
      sendOfferResponse(false);
      return false;
    }

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_missing_player_state", payload);
      sendOfferResponse(false);
      return false;
    }

    const partnerState = this.config.playerStatesByUserId.get(partnerId);
    if (!partnerState) {
      this.endActiveTradeDirectional(
        userId,
        partnerId,
        TradeCancelledReason.Cancelled,
        TradeCancelledReason.OtherPlayerCancelled,
        { restoreSnapshot: true }
      );
      sendOfferResponse(false);
      return false;
    }

    const slot = Number(payload.Slot);
    if (!Number.isInteger(slot) || slot < 0 || slot >= INVENTORY_SLOT_COUNT) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_invalid_slot", payload, { slot });
      sendOfferResponse(false);
      return false;
    }

    const sourceItem = playerState.inventory[slot];
    if (!sourceItem) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_empty_slot", payload, { slot });
      sendOfferResponse(false);
      return false;
    }

    const expectedItemId = Number(payload.ItemID);
    const expectedIsIOU = payload.IsIOU ? 1 : 0;
    if (!Number.isInteger(expectedItemId) || sourceItem[0] !== expectedItemId || sourceItem[2] !== expectedIsIOU) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_mismatch", payload, {
        slot,
        expectedItemId,
        actualItemId: sourceItem[0],
        expectedIsIOU,
        actualIsIOU: sourceItem[2]
      });
      sendOfferResponse(false);
      return false;
    }

    const itemDef = this.config.itemCatalog.getDefinitionById(expectedItemId);
    if (!itemDef) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_missing_definition", payload, {
        expectedItemId
      });
      sendOfferResponse(false);
      return false;
    }

    if (!itemDef.isTradeable) {
      this.config.messageService.sendServerInfo(userId, "You can't trade that item");
      sendOfferResponse(false);
      return false;
    }

    const requestedAmount = Number(payload.Amount);
    if (!Number.isInteger(requestedAmount) || requestedAmount <= 0) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_invalid_amount", payload, {
        requestedAmount
      });
      sendOfferResponse(false);
      return false;
    }

    const offeredInventory = this.offeredInventoryByUserId.get(userId);
    if (!offeredInventory) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_missing_offer_inventory", payload);
      sendOfferResponse(false);
      return false;
    }

    const offeredManager = new InventoryManager(offeredInventory, this.config.itemCatalog);
    const offerCapacity = offeredManager.calculateAddCapacity(expectedItemId, expectedIsIOU);
    const amountAvailableInInventory = playerState.inventory.reduce((total, item) => {
      if (!item) return total;
      if (item[0] !== expectedItemId || item[2] !== expectedIsIOU) return total;
      return total + item[1];
    }, 0);

    const amountToOffer = Math.min(requestedAmount, amountAvailableInInventory, offerCapacity);
    if (amountToOffer <= 0) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_no_offerable_amount", payload, {
        requestedAmount,
        amountAvailableInInventory,
        offerCapacity
      });
      sendOfferResponse(false);
      return false;
    }

    sendOfferResponse(true);
    let remainingToOffer = amountToOffer;
    const inventoryChanges: Array<{
      slot: number;
      previousItem: InventoryItem;
      newItem: InventoryItem | null;
      amountChanged: number;
    }> = [];

    for (let sourceSlot = 0; sourceSlot < playerState.inventory.length; sourceSlot += 1) {
      if (remainingToOffer <= 0) break;

      const itemAtSlot = playerState.inventory[sourceSlot];
      if (!itemAtSlot) continue;
      if (itemAtSlot[0] !== expectedItemId || itemAtSlot[2] !== expectedIsIOU) continue;

      const removeAmount = Math.min(itemAtSlot[1], remainingToOffer);
      const previousItem: InventoryItem = [...itemAtSlot];
      const remainingAmountAtSlot = itemAtSlot[1] - removeAmount;
      const newItem: InventoryItem | null =
        remainingAmountAtSlot > 0 ? [expectedItemId, remainingAmountAtSlot, expectedIsIOU] : null;

      playerState.inventory[sourceSlot] = newItem;
      remainingToOffer -= removeAmount;

      inventoryChanges.push({
        slot: sourceSlot,
        previousItem,
        newItem,
        amountChanged: -removeAmount
      });

      this.config.enqueueUserMessage(
        userId,
        GameAction.RemovedItemFromInventoryAtSlot,
        buildRemovedItemFromInventoryAtSlotPayload({
          MenuType: MenuType.TradeInventory,
          Slot: sourceSlot,
          ItemID: expectedItemId,
          Amount: removeAmount,
          IsIOU: expectedIsIOU === 1,
          RemainingAmountAtSlot: remainingAmountAtSlot
        })
      );
    }

    if (remainingToOffer > 0) {
      // Defensive rollback if inventory changed between validation and removal.
      this.rollbackOfferRemovals(playerState, inventoryChanges);
      this.logInvalid(userId, "InvokeInventoryItemAction", "offer_trade_item_partial_remove_rolled_back", payload, {
        remainingToOffer,
        amountToOffer
      });
      sendOfferResponse(false);
      return false;
    }

    applyWeightChange(
      playerState,
      inventoryChanges,
      this.config.itemCatalog
    );
    playerState.markInventoryDirty();
    this.config.inventoryService.sendWeightUpdate(userId, playerState);

    const addResult = offeredManager.addItems(expectedItemId, amountToOffer, expectedIsIOU);
    for (const change of addResult.slotsModified) {
      if (change.amountChanged <= 0 || !change.newItem) {
        continue;
      }

      const previousAmountAtSlot = change.previousItem?.[1] ?? 0;
      const payloadForRequester = buildAddedItemAtInventorySlotPayload({
        MenuType: MenuType.TradeMyOfferedItems,
        Slot: change.slot,
        ItemID: expectedItemId,
        Amount: change.amountChanged,
        IsIOU: change.newItem[2] === 1,
        PreviousAmountAtSlot: previousAmountAtSlot
      });
      this.config.enqueueUserMessage(userId, GameAction.AddedItemAtInventorySlot, payloadForRequester);

      const payloadForOtherPlayer = buildAddedItemAtInventorySlotPayload({
        MenuType: MenuType.TradeOtherPlayerOfferedItems,
        Slot: change.slot,
        ItemID: expectedItemId,
        Amount: change.amountChanged,
        IsIOU: change.newItem[2] === 1,
        PreviousAmountAtSlot: previousAmountAtSlot
      });
      this.config.enqueueUserMessage(partnerId, GameAction.AddedItemAtInventorySlot, payloadForOtherPlayer);
    }

    this.resetOfferAcceptanceOnOfferChange(userId, partnerId);

    return true;
  }

  revokeTradeItem(userId: number, payload: InvokeInventoryItemActionPayload): boolean {
    const sendRevokeResponse = (success: boolean) => {
      this.config.enqueueUserMessage(
        userId,
        GameAction.InvokedInventoryItemAction,
        buildInvokedInventoryItemActionPayload({
          Action: payload.Action,
          MenuType: payload.MenuType,
          Slot: payload.Slot,
          ItemID: payload.ItemID,
          Amount: payload.Amount,
          IsIOU: payload.IsIOU,
          Success: success,
          Data: null
        })
      );
    };

    if (Number(payload.MenuType) !== MenuType.TradeMyOfferedItems) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_invalid_menu", payload, {
        menuType: payload.MenuType
      });
      sendRevokeResponse(false);
      return false;
    }

    const partnerId = this.activeTradePartnerByUserId.get(userId);
    if (partnerId === undefined) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_no_active_trade", payload);
      sendRevokeResponse(false);
      return false;
    }

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_missing_player_state", payload);
      sendRevokeResponse(false);
      return false;
    }

    const offeredInventory = this.offeredInventoryByUserId.get(userId);
    if (!offeredInventory) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_missing_offer_inventory", payload);
      sendRevokeResponse(false);
      return false;
    }

    const expectedItemId = Number(payload.ItemID);
    const expectedIsIOU = payload.IsIOU ? 1 : 0;
    const requestedAmount = Number(payload.Amount);
    if (!Number.isInteger(expectedItemId) || !Number.isInteger(requestedAmount) || requestedAmount <= 0) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_invalid_payload", payload, {
        expectedItemId,
        requestedAmount
      });
      sendRevokeResponse(false);
      return false;
    }

    let amountOffered = 0;
    for (const item of offeredInventory) {
      if (!item) continue;
      if (item[0] !== expectedItemId || item[2] !== expectedIsIOU) continue;
      amountOffered += item[1];
    }

    if (amountOffered <= 0) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_not_offered", payload, {
        expectedItemId,
        expectedIsIOU
      });
      sendRevokeResponse(false);
      return false;
    }

    const inventoryManager = new InventoryManager(
      playerState.inventory,
      this.config.itemCatalog,
      (changes) => applyWeightChange(playerState, changes, this.config.itemCatalog)
    );
    const inventoryCapacity = inventoryManager.calculateAddCapacity(expectedItemId, expectedIsIOU);
    const amountToRevoke = Math.min(requestedAmount, amountOffered, inventoryCapacity);
    if (amountToRevoke <= 0) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_no_revokeable_amount", payload, {
        requestedAmount,
        amountOffered,
        inventoryCapacity
      });
      sendRevokeResponse(false);
      return false;
    }

    const offeredManager = new InventoryManager(offeredInventory, this.config.itemCatalog);
    const removeResult = offeredManager.removeItems(expectedItemId, amountToRevoke, expectedIsIOU);
    if (removeResult.removed <= 0) {
      this.logInvalid(userId, "InvokeInventoryItemAction", "revoke_trade_item_remove_failed", payload, {
        expectedItemId,
        expectedIsIOU,
        amountToRevoke
      });
      sendRevokeResponse(false);
      return false;
    }

    sendRevokeResponse(true);

    for (const change of removeResult.slotsModified) {
      if (change.amountChanged >= 0 || !change.previousItem) continue;

      const remainingAmountAtSlot = change.newItem?.[1] ?? 0;
      this.config.enqueueUserMessage(
        userId,
        GameAction.RemovedItemFromInventoryAtSlot,
        buildRemovedItemFromInventoryAtSlotPayload({
          MenuType: MenuType.TradeMyOfferedItems,
          Slot: change.slot,
          ItemID: expectedItemId,
          Amount: Math.abs(change.amountChanged),
          IsIOU: change.previousItem[2] === 1,
          RemainingAmountAtSlot: remainingAmountAtSlot
        })
      );

      this.config.enqueueUserMessage(
        partnerId,
        GameAction.RemovedItemFromInventoryAtSlot,
        buildRemovedItemFromInventoryAtSlotPayload({
          MenuType: MenuType.TradeOtherPlayerOfferedItems,
          Slot: change.slot,
          ItemID: expectedItemId,
          Amount: Math.abs(change.amountChanged),
          IsIOU: change.previousItem[2] === 1,
          RemainingAmountAtSlot: remainingAmountAtSlot
        })
      );
    }

    const addResult = inventoryManager.addItems(expectedItemId, removeResult.removed, expectedIsIOU);
    this.resetOfferAcceptanceOnOfferChange(userId, partnerId);
    if (addResult.added <= 0) {
      return true;
    }

    for (const change of addResult.slotsModified) {
      if (change.amountChanged <= 0 || !change.newItem) continue;

      this.config.enqueueUserMessage(
        userId,
        GameAction.AddedItemAtInventorySlot,
        buildAddedItemAtInventorySlotPayload({
          MenuType: MenuType.TradeInventory,
          Slot: change.slot,
          ItemID: expectedItemId,
          Amount: change.amountChanged,
          IsIOU: change.newItem[2] === 1,
          PreviousAmountAtSlot: change.previousItem?.[1] ?? 0
        })
      );
    }

    playerState.markInventoryDirty();
    this.config.inventoryService.sendWeightUpdate(userId, playerState);
    return true;
  }

  private resetOfferAcceptanceOnOfferChange(userId: number, partnerId: number): void {
    const session = this.getActiveTradeSession(userId);
    if (!session || session.phase !== "offer" || session.offerAcceptedBy.size === 0) {
      return;
    }

    session.offerAcceptedBy.clear();
    const resetPayload = buildTradeStatusResetPayload();
    this.config.enqueueUserMessage(userId, GameAction.TradeStatusReset, resetPayload as unknown as unknown[]);
    this.config.enqueueUserMessage(partnerId, GameAction.TradeStatusReset, resetPayload as unknown as unknown[]);
  }

  private completeTradeRequest(requestingUserId: number, otherUserId: number): void {
    if (this.isInActiveTrade(requestingUserId) || this.isInActiveTrade(otherUserId)) {
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      this.setPlayerIdleIfTrading(requestingUserId);
      return;
    }

    const requestingPlayer = this.config.playerStatesByUserId.get(requestingUserId);
    if (!requestingPlayer) {
      return;
    }

    const otherPlayer = this.config.playerStatesByUserId.get(otherUserId);
    if (!otherPlayer) {
      this.config.messageService.sendServerInfo(requestingUserId, "They're no longer there");
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      this.setPlayerIdleIfTrading(requestingUserId);
      return;
    }

    if (otherPlayer.mapLevel !== requestingPlayer.mapLevel) {
      this.config.messageService.sendServerInfo(requestingUserId, "They're no longer there");
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      this.setPlayerIdleIfTrading(requestingUserId);
      return;
    }

    const otherState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: otherUserId });
    if (otherState === States.PlayerDeadState) {
      this.config.messageService.sendServerInfo(requestingUserId, "They're no longer there");
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      this.setPlayerIdleIfTrading(requestingUserId);
      return;
    }

    const targetRef = { type: EntityType.Player, id: otherUserId } as const;
    if (!this.config.targetingService.isPlayerTargeting(requestingUserId, targetRef)) {
      this.setPlayerIdleIfTrading(requestingUserId);
      return;
    }

    if (!this.arePlayersAdjacent(requestingPlayer, otherPlayer)) {
      this.config.messageService.sendServerInfo(requestingUserId, "Can't reach them");
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      this.setPlayerIdleIfTrading(requestingUserId);
      return;
    }

    const now = Date.now();
    this.cleanupExpiredPendingRequests(now);

    const reciprocalKey = this.makePendingKey(otherUserId, requestingUserId);
    const reciprocalExpiresAt = this.pendingRequests.get(reciprocalKey);

    if (reciprocalExpiresAt !== undefined && reciprocalExpiresAt > now) {
      this.pendingRequests.delete(reciprocalKey);
      this.pendingRequests.delete(this.makePendingKey(requestingUserId, otherUserId));
      this.startActiveTrade(requestingUserId, otherUserId);
      this.config.targetingService.clearPlayerTarget(requestingUserId);
      return;
    }

    this.pendingRequests.set(this.makePendingKey(requestingUserId, otherUserId), now + TRADE_REQUEST_TIMEOUT_MS);
    this.sendTradeRequestedToPair(requestingUserId, otherUserId);

    this.config.targetingService.clearPlayerTarget(requestingUserId);
    this.setPlayerIdleIfTrading(requestingUserId);
  }

  private startActiveTrade(playerAUserId: number, playerBUserId: number): void {
    this.activeTradePartnerByUserId.set(playerAUserId, playerBUserId);
    this.activeTradePartnerByUserId.set(playerBUserId, playerAUserId);
    this.offeredInventoryByUserId.set(playerAUserId, this.createEmptyTradeInventory());
    this.offeredInventoryByUserId.set(playerBUserId, this.createEmptyTradeInventory());
    this.captureInventorySnapshot(playerAUserId);
    this.captureInventorySnapshot(playerBUserId);
    const pairKey = this.makePairKey(playerAUserId, playerBUserId);
    this.activeTradeSessionByPairKey.set(pairKey, {
      playerAUserId,
      playerBUserId,
      phase: "offer",
      offerAcceptedBy: new Set<number>(),
      confirmAcceptedBy: new Set<number>()
    });

    this.sendTradeStartedBothDirections(playerAUserId, playerBUserId);

    this.config.stateMachine.setState({ type: EntityType.Player, id: playerAUserId }, States.TradingState);
    this.config.stateMachine.setState({ type: EntityType.Player, id: playerBUserId }, States.TradingState);
  }

  private endActiveTradeDirectional(
    playerAUserId: number,
    playerBUserId: number,
    playerAReason: TradeCancelledReason,
    playerBReason: TradeCancelledReason,
    options?: { setPlayerAIdle?: boolean; setPlayerBIdle?: boolean; restoreSnapshot?: boolean }
  ): void {
    const shouldRestoreSnapshot = options?.restoreSnapshot !== false;
    if (shouldRestoreSnapshot) {
      this.restoreInventorySnapshot(playerAUserId);
      this.restoreInventorySnapshot(playerBUserId);
    }

    this.clearTradeState(playerAUserId, playerBUserId);

    const payloadForPlayerA = buildTradeCancelledPayload({
      Player1ID: playerAUserId,
      Player2ID: playerBUserId,
      Reason: playerAReason
    });
    const payloadForPlayerB = buildTradeCancelledPayload({
      Player1ID: playerAUserId,
      Player2ID: playerBUserId,
      Reason: playerBReason
    });
    this.config.enqueueUserMessage(playerAUserId, GameAction.TradeCancelled, payloadForPlayerA);
    this.config.enqueueUserMessage(playerBUserId, GameAction.TradeCancelled, payloadForPlayerB);

    const shouldSetPlayerAIdle = options?.setPlayerAIdle === true;
    const shouldSetPlayerBIdle = options?.setPlayerBIdle !== false;

    if (shouldSetPlayerAIdle) {
      const playerAState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: playerAUserId });
      if (playerAState === States.TradingState) {
        this.config.stateMachine.setState({ type: EntityType.Player, id: playerAUserId }, States.IdleState);
      }
    }

    if (!shouldSetPlayerBIdle) {
      return;
    }

    const partnerState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: playerBUserId });
    if (partnerState === States.TradingState) {
      this.config.stateMachine.setState({ type: EntityType.Player, id: playerBUserId }, States.IdleState);
    }
  }

  private sendTradeRequestedToPair(requestingUserId: number, otherUserId: number): void {
    const payload = buildTradeRequestedPayload({
      RequestingPlayerID: requestingUserId,
      OtherPlayerID: otherUserId
    });
    this.config.enqueueUserMessage(requestingUserId, GameAction.TradeRequested, payload);
    this.config.enqueueUserMessage(otherUserId, GameAction.TradeRequested, payload);
  }

  private sendTradeStartedBothDirections(playerAUserId: number, playerBUserId: number): void {
    const firstDirectionPayload = buildTradeStartedPayload({
      Player1ID: playerAUserId,
      Player2ID: playerBUserId
    });
    const secondDirectionPayload = buildTradeStartedPayload({
      Player1ID: playerBUserId,
      Player2ID: playerAUserId
    });

    this.config.enqueueUserMessage(playerAUserId, GameAction.TradeStarted, firstDirectionPayload);
    this.config.enqueueUserMessage(playerAUserId, GameAction.TradeStarted, secondDirectionPayload);
    this.config.enqueueUserMessage(playerBUserId, GameAction.TradeStarted, firstDirectionPayload);
    this.config.enqueueUserMessage(playerBUserId, GameAction.TradeStarted, secondDirectionPayload);
  }

  private cleanupExpiredPendingRequests(now: number): void {
    for (const [key, expiresAt] of this.pendingRequests.entries()) {
      if (expiresAt <= now) {
        this.pendingRequests.delete(key);
      }
    }
  }

  private makePendingKey(requestingUserId: number, otherUserId: number): string {
    return `${requestingUserId}:${otherUserId}`;
  }

  private clearPendingRequestsForUser(userId: number): void {
    const userIdText = String(userId);
    for (const key of this.pendingRequests.keys()) {
      const [requestingText, otherText] = key.split(":");
      if (requestingText === userIdText || otherText === userIdText) {
        this.pendingRequests.delete(key);
      }
    }
  }

  private isInActiveTrade(userId: number): boolean {
    return this.activeTradePartnerByUserId.has(userId);
  }

  private getActiveTradeSession(userId: number): ActiveTradeSession | null {
    const partnerId = this.activeTradePartnerByUserId.get(userId);
    if (partnerId === undefined) {
      return null;
    }

    const pairKey = this.makePairKey(userId, partnerId);
    return this.activeTradeSessionByPairKey.get(pairKey) ?? null;
  }

  private setPlayerIdleIfTrading(userId: number): void {
    const currentState = this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: userId });
    if (currentState === States.TradingState) {
      this.config.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
    }
  }

  private captureInventorySnapshot(userId: number): void {
    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      return;
    }

    this.inventorySnapshotsByUserId.set(userId, {
      inventory: playerState.inventory.map((item) => (item ? ([...item] as InventoryItem) : null)),
      inventoryWeight: playerState.inventoryWeight
    });
  }

  private createEmptyTradeInventory(): FullInventory {
    return Array.from({ length: INVENTORY_SLOT_COUNT }, () => null);
  }

  private restoreInventorySnapshot(userId: number): void {
    const snapshot = this.inventorySnapshotsByUserId.get(userId);
    if (!snapshot) {
      return;
    }

    const playerState = this.config.playerStatesByUserId.get(userId);
    if (!playerState) {
      return;
    }

    for (let i = 0; i < INVENTORY_SLOT_COUNT; i += 1) {
      const snapshotItem = snapshot.inventory[i];
      playerState.inventory[i] = snapshotItem ? ([...snapshotItem] as InventoryItem) : null;
    }
    playerState.inventoryWeight = snapshot.inventoryWeight;
    playerState.markInventoryDirty();
  }

  private completeActiveTrade(session: ActiveTradeSession): void {
    const playerAState = this.config.playerStatesByUserId.get(session.playerAUserId);
    const playerBState = this.config.playerStatesByUserId.get(session.playerBUserId);
    const playerAOffered = this.offeredInventoryByUserId.get(session.playerAUserId);
    const playerBOffered = this.offeredInventoryByUserId.get(session.playerBUserId);
    if (!playerAState || !playerBState || !playerAOffered || !playerBOffered) {
      this.endActiveTradeDirectional(
        session.playerAUserId,
        session.playerBUserId,
        TradeCancelledReason.Cancelled,
        TradeCancelledReason.OtherPlayerCancelled,
        { restoreSnapshot: true }
      );
      this.logInvalid(session.playerAUserId, "complete_trade_request", "complete_trade_request_missing_player_states", { playerAUserId: session.playerAUserId, playerBUserId: session.playerBUserId });
      return; 
    }

    const playerAFinalInventory = this.cloneInventory(playerAState.inventory);
    const playerBFinalInventory = this.cloneInventory(playerBState.inventory);
    const playerAFinalManager = new InventoryManager(playerAFinalInventory, this.config.itemCatalog);
    const playerBFinalManager = new InventoryManager(playerBFinalInventory, this.config.itemCatalog);

    for (const item of playerBOffered) {
      if (!item) continue;
      const addResult = playerAFinalManager.addItems(item[0], item[1], item[2]);
      if (addResult.overflow > 0) {
        this.endActiveTradeDirectional(
          session.playerAUserId,
          session.playerBUserId,
          TradeCancelledReason.NoSpace,
          TradeCancelledReason.OtherPlayerNoSpace,
          { restoreSnapshot: true }
        );
        return;
      }
    }

    for (const item of playerAOffered) {
      if (!item) continue;
      const addResult = playerBFinalManager.addItems(item[0], item[1], item[2]);
      if (addResult.overflow > 0) {
        this.endActiveTradeDirectional(
          session.playerAUserId,
          session.playerBUserId,
          TradeCancelledReason.OtherPlayerNoSpace,
          TradeCancelledReason.NoSpace,
          { restoreSnapshot: true }
        );
        return;
      }
    }

    this.overwriteInventory(playerAState.inventory, playerAFinalInventory);
    this.overwriteInventory(playerBState.inventory, playerBFinalInventory);
    recalculatePlayerWeight(playerAState, this.config.itemCatalog);
    recalculatePlayerWeight(playerBState, this.config.itemCatalog);
    playerAState.markInventoryDirty();
    playerBState.markInventoryDirty();

    const playerACompletedPayload = buildTradeCompletedPayload({
      Player1ID: session.playerAUserId,
      Player2ID: session.playerBUserId,
      CurrentInventory: this.cloneInventory(playerAState.inventory)
    });
    const playerBCompletedPayload = buildTradeCompletedPayload({
      Player1ID: session.playerAUserId,
      Player2ID: session.playerBUserId,
      CurrentInventory: this.cloneInventory(playerBState.inventory)
    });
    this.config.enqueueUserMessage(session.playerAUserId, GameAction.TradeCompleted, playerACompletedPayload);
    this.config.enqueueUserMessage(session.playerBUserId, GameAction.TradeCompleted, playerBCompletedPayload);
    this.config.inventoryService.sendWeightUpdate(session.playerAUserId, playerAState);
    this.config.inventoryService.sendWeightUpdate(session.playerBUserId, playerBState);
    this.logCompletedTradeTransfers(session, playerAOffered, playerBOffered);

    this.clearTradeState(session.playerAUserId, session.playerBUserId);

    if (this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: session.playerAUserId }) === States.TradingState) {
      this.config.stateMachine.setState({ type: EntityType.Player, id: session.playerAUserId }, States.IdleState);
    }
    if (this.config.stateMachine.getCurrentState({ type: EntityType.Player, id: session.playerBUserId }) === States.TradingState) {
      this.config.stateMachine.setState({ type: EntityType.Player, id: session.playerBUserId }, States.IdleState);
    }
  }

  private rollbackOfferRemovals(
    playerState: PlayerState,
    inventoryChanges: Array<{
      slot: number;
      previousItem: InventoryItem;
      newItem: InventoryItem | null;
      amountChanged: number;
    }>
  ): void {
    const rollbackChanges: Array<{
      slot: number;
      previousItem: InventoryItem | null;
      newItem: InventoryItem;
      amountChanged: number;
    }> = [];

    for (const change of inventoryChanges) {
      const current = playerState.inventory[change.slot];
      const restored: InventoryItem = [...change.previousItem];
      playerState.inventory[change.slot] = restored;
      rollbackChanges.push({
        slot: change.slot,
        previousItem: current ? [...current] : null,
        newItem: restored,
        amountChanged: Math.abs(change.amountChanged)
      });
    }

    if (rollbackChanges.length > 0) {
      applyWeightChange(playerState, rollbackChanges, this.config.itemCatalog);
      playerState.markInventoryDirty();
    }
  }

  private clearTradeState(playerAUserId: number, playerBUserId: number): void {
    this.activeTradePartnerByUserId.delete(playerAUserId);
    this.activeTradePartnerByUserId.delete(playerBUserId);
    this.offeredInventoryByUserId.delete(playerAUserId);
    this.offeredInventoryByUserId.delete(playerBUserId);
    this.inventorySnapshotsByUserId.delete(playerAUserId);
    this.inventorySnapshotsByUserId.delete(playerBUserId);
    this.pendingRequests.delete(this.makePendingKey(playerAUserId, playerBUserId));
    this.pendingRequests.delete(this.makePendingKey(playerBUserId, playerAUserId));
    this.activeTradeSessionByPairKey.delete(this.makePairKey(playerAUserId, playerBUserId));
  }

  private sendTradePlayerAccepted(acceptedUserId: number, playerAUserId: number, playerBUserId: number): void {
    const payload = buildTradePlayerAcceptedPayload({
      PlayerID: acceptedUserId
    });
    this.config.enqueueUserMessage(playerAUserId, GameAction.TradePlayerAccepted, payload);
    this.config.enqueueUserMessage(playerBUserId, GameAction.TradePlayerAccepted, payload);
  }

  private sendTradeGoToFinalStep(playerAUserId: number, playerBUserId: number): void {
    const resetPayload = buildTradeStatusResetPayload();
    const finalStepPayload = buildTradeGoToFinalStepPayload();
    this.config.enqueueUserMessage(playerAUserId, GameAction.TradeStatusReset, resetPayload as unknown as unknown[]);
    this.config.enqueueUserMessage(playerAUserId, GameAction.TradeGoToFinalStep, finalStepPayload as unknown as unknown[]);
    this.config.enqueueUserMessage(playerBUserId, GameAction.TradeStatusReset, resetPayload as unknown as unknown[]);
    this.config.enqueueUserMessage(playerBUserId, GameAction.TradeGoToFinalStep, finalStepPayload as unknown as unknown[]);
  }

  private makePairKey(userAId: number, userBId: number): string {
    const low = Math.min(userAId, userBId);
    const high = Math.max(userAId, userBId);
    return `${low}:${high}`;
  }

  private cloneInventory(inventory: FullInventory): FullInventory {
    return inventory.map((item) => (item ? ([...item] as InventoryItem) : null));
  }

  private overwriteInventory(targetInventory: FullInventory, sourceInventory: FullInventory): void {
    for (let i = 0; i < targetInventory.length; i++) {
      const item = sourceInventory[i];
      targetInventory[i] = item ? ([...item] as InventoryItem) : null;
    }
  }

  private logCompletedTradeTransfers(
    session: ActiveTradeSession,
    playerAOffered: FullInventory,
    playerBOffered: FullInventory
  ): void {
    if (!this.config.itemAudit) {
      return;
    }

    const tradeSessionId = this.makeTradeSessionId(session.playerAUserId, session.playerBUserId);

    for (const item of playerAOffered) {
      if (!item) continue;
      const [itemId, amount, isIOU] = item;
      if (amount <= 0) continue;
      this.config.itemAudit.logTradeItemTransfer({
        tradeSessionId,
        fromUserId: session.playerAUserId,
        toUserId: session.playerBUserId,
        itemId,
        amount,
        isIOU
      });
    }

    for (const item of playerBOffered) {
      if (!item) continue;
      const [itemId, amount, isIOU] = item;
      if (amount <= 0) continue;
      this.config.itemAudit.logTradeItemTransfer({
        tradeSessionId,
        fromUserId: session.playerBUserId,
        toUserId: session.playerAUserId,
        itemId,
        amount,
        isIOU
      });
    }
  }

  private makeTradeSessionId(playerAUserId: number, playerBUserId: number): string {
    this.completedTradeSequence += 1;
    return `${Date.now()}:${this.completedTradeSequence}:${playerAUserId}:${playerBUserId}`;
  }

  private arePlayersAdjacent(requestingPlayer: PlayerState, otherPlayer: PlayerState): boolean {
    const losSystem = this.config.getLineOfSightSystem();
    if (!losSystem) {
      const dx = Math.abs(requestingPlayer.x - otherPlayer.x);
      const dy = Math.abs(requestingPlayer.y - otherPlayer.y);
      return dx <= 1 && dy <= 1 && (dx + dy > 0);
    }

    const isAdjacent = losSystem.isAdjacentTo(
      requestingPlayer.x,
      requestingPlayer.y,
      otherPlayer.x,
      otherPlayer.y
    );
    if (!isAdjacent) {
      return false;
    }

    if (
      losSystem.isMeleeBlocked(
        requestingPlayer.x,
        requestingPlayer.y,
        otherPlayer.x,
        otherPlayer.y,
        requestingPlayer.mapLevel
      )
    ) {
      return false;
    }

    return losSystem.checkLOS(
      requestingPlayer.x,
      requestingPlayer.y,
      otherPlayer.x,
      otherPlayer.y,
      requestingPlayer.mapLevel
    ).hasLOS;
  }
}
