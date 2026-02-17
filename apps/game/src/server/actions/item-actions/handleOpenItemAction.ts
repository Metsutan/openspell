import { GameAction } from "../../../protocol/enums/GameAction";
import { MenuType } from "../../../protocol/enums/MenuType";
import { States } from "../../../protocol/enums/States";
import { buildInvokedInventoryItemActionPayload, type InvokedInventoryItemActionPayload } from "../../../protocol/packets/actions/InvokedInventoryItemAction";
import type { InvokeInventoryItemActionPayload } from "../../../protocol/packets/actions/InvokeInventoryItemAction";
import type { PlayerState } from "../../../world/PlayerState";
import type { ActionContext } from "../types";
import { DelayType } from "../../systems/DelaySystem";

const INVENTORY_SLOT_COUNT = 28;
const UNOBTAINABLE_MONEY_BAG_ITEM_ID = 69;
const OPEN_ITEM_DELAY_TICKS = 2;

type LootEntry = {
  itemId: number;
  minAmount: number;
  maxAmount: number;
  weight: number;
  isIOU: boolean;
};

type OpenableDefinition = {
  name: string;
  rewardTables: LootEntry[][];
};

const COINS_ITEM_ID = 6;
const LOGS_ITEM_ID = 64;
const PINE_LOGS_ITEM_ID = 65;
const OAK_LOGS_ITEM_ID = 66;
const GOLD_BAR_ITEM_ID = 72;
const IRON_ORE_ITEM_ID = 79;
const STRAWBERRY_ITEM_ID = 103;
const WATERMELON_ITEM_ID = 104;
const COAL_ITEM_ID = 142;
const FIRE_SCROLL_ITEM_ID = 175;
const WATER_SCROLL_ITEM_ID = 176;
const NATURE_SCROLL_ITEM_ID = 177;
const RED_SANTA_HAT_ITEM_ID = 414;
const GREEN_SANTA_HAT_ITEM_ID = 415;
const BLUE_SANTA_HAT_ITEM_ID = 416;
const GOLDEN_SANTA_HAT_ITEM_ID = 619;
const SILVER_SANTA_HAT_ITEM_ID = 620;
const PURPLE_SANTA_HAT_ITEM_ID = 621;
const YELLOW_SANTA_HAT_ITEM_ID = 622;
const PINK_SANTA_HAT_ITEM_ID = 623;
const WARP_SCROLL_ITEM_ID = 181;
const ALCHEMY_SCROLL_ITEM_ID = 184;
const NAURU_ROOT_ITEM_ID = 279;
const MAUI_ROOT_ITEM_ID = 280;
const STRING_ITEM_ID = 352;
const DEADWOOD_LOGS_ITEM_ID = 356;

const SANTA_HAT_REWARD_TABLE: LootEntry[] = [
  { itemId: RED_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 1, isIOU: false },
  { itemId: GREEN_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 1, isIOU: false },
  { itemId: BLUE_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 1, isIOU: false },
];

const PRESENT_2023_BONUS_REWARD_TABLE: LootEntry[] = [
  { itemId: COINS_ITEM_ID, minAmount: 12, maxAmount: 12, weight: 1, isIOU: false },
  { itemId: COINS_ITEM_ID, minAmount: 25, maxAmount: 25, weight: 1, isIOU: false },
  { itemId: WARP_SCROLL_ITEM_ID, minAmount: 5, maxAmount: 5, weight: 1, isIOU: false },
  { itemId: ALCHEMY_SCROLL_ITEM_ID, minAmount: 10, maxAmount: 10, weight: 1, isIOU: false }
];

const NEW_PRESENT_SANTA_HAT_REWARD_TABLE: LootEntry[] = [
  { itemId: GOLDEN_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 1, isIOU: false },
  { itemId: SILVER_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 1, isIOU: false },
  { itemId: PURPLE_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 5, isIOU: false },
  { itemId: YELLOW_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 5, isIOU: false },
  { itemId: PINK_SANTA_HAT_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 5, isIOU: false }
];

// Total weight = 16.
// Note: "strawberry" and "roots" were omitted because quantity/chance were unspecified.
const MESSAGE_IN_A_BOTTLE_REWARD_TABLE: LootEntry[] = [
  { itemId: COAL_ITEM_ID, minAmount: 22, maxAmount: 93, weight: 3, isIOU: true },
  { itemId: STRAWBERRY_ITEM_ID, minAmount: 15, maxAmount: 45, weight: 1, isIOU: true },
  { itemId: IRON_ORE_ITEM_ID, minAmount: 30, maxAmount: 75, weight: 1, isIOU: true },
  { itemId: GOLD_BAR_ITEM_ID, minAmount: 1, maxAmount: 10, weight: 1, isIOU: true },
  { itemId: WATERMELON_ITEM_ID, minAmount: 10, maxAmount: 50, weight: 1, isIOU: true },
  { itemId: STRING_ITEM_ID, minAmount: 75, maxAmount: 300, weight: 1, isIOU: true },
  { itemId: MAUI_ROOT_ITEM_ID, minAmount: 10, maxAmount: 25, weight: 1, isIOU: true },
  { itemId: NAURU_ROOT_ITEM_ID, minAmount: 10, maxAmount: 25, weight: 1, isIOU: true },
  { itemId: LOGS_ITEM_ID, minAmount: 30, maxAmount: 120, weight: 1, isIOU: true },
  { itemId: PINE_LOGS_ITEM_ID, minAmount: 75, maxAmount: 200, weight: 1, isIOU: true },
  { itemId: OAK_LOGS_ITEM_ID, minAmount: 50, maxAmount: 500, weight: 1, isIOU: true },
  { itemId: DEADWOOD_LOGS_ITEM_ID, minAmount: 10, maxAmount: 100, weight: 1, isIOU: true },
  { itemId: WATER_SCROLL_ITEM_ID, minAmount: 150, maxAmount: 2000, weight: 1, isIOU: false },
  { itemId: NATURE_SCROLL_ITEM_ID, minAmount: 150, maxAmount: 2000, weight: 1, isIOU: false },
  { itemId: FIRE_SCROLL_ITEM_ID, minAmount: 150, maxAmount: 2000, weight: 1, isIOU: false }
];

const OPENABLE_DEFINITIONS: Record<number, OpenableDefinition> = {
  // Unobtainable; opening is always invalid.
  [UNOBTAINABLE_MONEY_BAG_ITEM_ID]: {
    name: "money bag",
    rewardTables: [
      [{ itemId: UNOBTAINABLE_MONEY_BAG_ITEM_ID, minAmount: 1, maxAmount: 1, weight: 1, isIOU: false }]
    ]
  },
  417: {
    name: "cyan christmas present (2023)",
    rewardTables: [
      SANTA_HAT_REWARD_TABLE,
      PRESENT_2023_BONUS_REWARD_TABLE
    ]
  },
  418: {
    name: "green christmas present (2023)",
    rewardTables: [
      SANTA_HAT_REWARD_TABLE,
      PRESENT_2023_BONUS_REWARD_TABLE
    ]
  },
  419: {
    name: "white christmas present (2023)",
    rewardTables: [
      SANTA_HAT_REWARD_TABLE,
      PRESENT_2023_BONUS_REWARD_TABLE
    ]
  },
  420: {
    name: "red christmas present (2023)",
    rewardTables: [
      SANTA_HAT_REWARD_TABLE,
      PRESENT_2023_BONUS_REWARD_TABLE
    ]
  },
  425: {
    name: "message in a bottle",
    rewardTables: [
      MESSAGE_IN_A_BOTTLE_REWARD_TABLE
    ]
  },
  618: {
    name: "christmas present",
    rewardTables: [
      NEW_PRESENT_SANTA_HAT_REWARD_TABLE
    ]
  }
};

type OpenItemActionDependencies = {
  ctx: ActionContext;
  playerState: PlayerState;
  payload: InvokeInventoryItemActionPayload;
  logInvalid: (reason: string, details?: Record<string, unknown>) => void;
};

export function handleOpenItemAction({
  ctx,
  playerState,
  payload,
  logInvalid
}: OpenItemActionDependencies): void {
  const sendActionResponse = (success: boolean): void => {
    const responsePayload = buildInvokedInventoryItemActionPayload({
      Action: payload.Action,
      MenuType: payload.MenuType,
      Slot: payload.Slot,
      ItemID: payload.ItemID,
      Amount: payload.Amount,
      IsIOU: payload.IsIOU,
      Success: success,
      Data: null
    } satisfies InvokedInventoryItemActionPayload);
    ctx.enqueueUserMessage(ctx.userId!, GameAction.InvokedInventoryItemAction, responsePayload);
  };

  if (payload.MenuType !== MenuType.Inventory) {
    logInvalid("open_invalid_menu", { menuType: payload.MenuType });
    sendActionResponse(false);
    return;
  }

  const slot = Number(payload.Slot);
  if (!Number.isInteger(slot) || slot < 0 || slot >= INVENTORY_SLOT_COUNT) {
    logInvalid("open_invalid_slot", { slot });
    sendActionResponse(false);
    return;
  }

  const inventoryItem = playerState.inventory[slot];
  if (!inventoryItem) {
    logInvalid("open_empty_slot", { slot });
    sendActionResponse(false);
    return;
  }

  const [itemId, itemAmount, isIOU] = inventoryItem;
  const expectedItemId = Number(payload.ItemID);
  if (itemId !== expectedItemId) {
    logInvalid("open_item_mismatch", { slot, expectedItemId, itemId });
    sendActionResponse(false);
    return;
  }
  if (itemAmount <= 0) {
    logInvalid("open_invalid_amount", { slot, itemId, itemAmount });
    sendActionResponse(false);
    return;
  }
  if (isIOU === 1) {
    logInvalid("open_iou", { slot, itemId });
    sendActionResponse(false);
    return;
  }

  const openableDefinition = OPENABLE_DEFINITIONS[itemId];
  if (!openableDefinition) {
    logInvalid("open_invalid_item", { itemId });
    sendActionResponse(false);
    return;
  }

  if (itemId === UNOBTAINABLE_MONEY_BAG_ITEM_ID) {
    logInvalid("open_unobtainable_money_bag", { itemId, slot });
    sendActionResponse(false);
    return;
  }

  const rolledRewards: Array<{ itemId: number; amount: number; isIOU: boolean }> = [];
  for (const table of openableDefinition.rewardTables) {
    const rolled = rollLoot(table);
    if (!rolled) {
      logInvalid("open_roll_failed", { itemId });
      sendActionResponse(false);
      return;
    }
    if (rolled.itemId === UNOBTAINABLE_MONEY_BAG_ITEM_ID) {
      logInvalid("open_rolled_unobtainable_money_bag", { sourceItemId: itemId, slot, rolledItemId: rolled.itemId });
      sendActionResponse(false);
      return;
    }
    rolledRewards.push(rolled);
  }

  if (rolledRewards.length === 0) {
    logInvalid("open_empty_reward_rolls", { itemId });
    sendActionResponse(false);
    return;
  }

  const openableName = capitalizeFirstLetter(openableDefinition.name);
  // Restart this windup if the user opens again quickly.
  ctx.delaySystem.interruptDelay(ctx.userId!, false);

  const delayStarted = ctx.delaySystem.startDelay({
    userId: ctx.userId!,
    type: DelayType.NonBlocking,
    ticks: OPEN_ITEM_DELAY_TICKS,
    state: States.OpeningItemState,
    restoreState: States.IdleState,
    startMessage: `You open the ${openableName}...`,
    onComplete: (resolvedUserId) => {
      const delayedPlayerState = ctx.playerStatesByUserId.get(resolvedUserId);
      if (!delayedPlayerState) {
        return;
      }

      const delayedItem = delayedPlayerState.inventory[slot];
      if (!delayedItem) {
        logInvalid("open_delay_empty_slot", { slot, expectedItemId: itemId });
        sendActionResponse(false);
        return;
      }

      const [delayedItemId, delayedAmount, delayedIsIOU] = delayedItem;
      if (delayedItemId !== itemId || delayedIsIOU !== isIOU || delayedAmount <= 0) {
        logInvalid("open_delay_item_mismatch", {
          slot,
          expectedItemId: itemId,
          delayedItemId,
          expectedIsIOU: isIOU,
          delayedIsIOU
        });
        sendActionResponse(false);
        return;
      }

      const decremented = ctx.inventoryService.decrementItemAtSlot(resolvedUserId, slot, delayedItemId, 1, delayedIsIOU);
      if (!decremented || decremented.removed <= 0) {
        logInvalid("open_remove_failed", { slot, itemId: delayedItemId });
        sendActionResponse(false);
        return;
      }

      for (const reward of rolledRewards) {
        const rewardResult = ctx.inventoryService.giveItem(
          resolvedUserId,
          reward.itemId,
          reward.amount,
          reward.isIOU ? 1 : 0
        );
        const totalRewarded = rewardResult.added + rewardResult.overflow;
        if (totalRewarded <= 0) {
          logInvalid("open_reward_failed", {
            sourceItemId: itemId,
            rolledItemId: reward.itemId,
            rolledAmount: reward.amount
          });
          sendActionResponse(false);
          return;
        }

        const announcedName = rewardResult.itemName;
        if (totalRewarded === 1) {
          ctx.messageService.sendServerInfo(resolvedUserId, `There was ${withIndefiniteArticle(announcedName)} inside.`);
        } else {
          ctx.messageService.sendServerInfo(
            resolvedUserId,
            `There were ${formatNumber(totalRewarded)} ${announcedName} inside.`
          );
        }
      }

      sendActionResponse(true);
    }
  });

  if (!delayStarted) {
    logInvalid("open_delay_failed", { slot, itemId });
    sendActionResponse(false);
  }
}

function rollLoot(table: LootEntry[]): { itemId: number; amount: number; isIOU: boolean } | null {
  if (!table || table.length === 0) {
    return null;
  }

  const validEntries = table.filter((entry) =>
    Number.isInteger(entry.itemId) &&
    Number.isInteger(entry.minAmount) &&
    Number.isInteger(entry.maxAmount) &&
    entry.minAmount > 0 &&
    entry.maxAmount >= entry.minAmount &&
    entry.weight > 0 &&
    typeof entry.isIOU === "boolean"
  );
  if (validEntries.length === 0) {
    return null;
  }

  const totalWeight = validEntries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of validEntries) {
    roll -= entry.weight;
    if (roll <= 0) {
      return {
        itemId: entry.itemId,
        amount: randomIntInclusive(entry.minAmount, entry.maxAmount),
        isIOU: entry.isIOU
      };
    }
  }

  const fallback = validEntries[validEntries.length - 1];
  return {
    itemId: fallback.itemId,
    amount: randomIntInclusive(fallback.minAmount, fallback.maxAmount),
    isIOU: fallback.isIOU
  };
}

function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function withIndefiniteArticle(value: string): string {
  if (!value) return value;
  const first = value.trim().charAt(0).toLowerCase();
  const article = ["a", "e", "i", "o", "u"].includes(first) ? "an" : "a";
  return `${article} ${value}`;
}
