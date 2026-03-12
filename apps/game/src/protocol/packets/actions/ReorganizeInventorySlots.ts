import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { ReorganizeInventorySlotsFields } from "../../fields/actions/ReorganizeInventorySlotsFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (ReorganizeInventorySlots) */
export type ReorganizeInventorySlotsPayload = {
  Menu: unknown;
  Slot1: unknown;
  ItemID1: unknown;
  IsIOU1: boolean;
  Slot2: unknown;
  ItemID2: unknown;
  IsIOU2: boolean;
  Type: unknown;
};

export function decodeReorganizeInventorySlotsPayload(payload: unknown): ReorganizeInventorySlotsPayload {
  assertIsArray(payload, "ReorganizeInventorySlots payload");
  const arr = payload as PacketArray;
  return {
    Menu: arr[ReorganizeInventorySlotsFields.Menu] as any,
    Slot1: arr[ReorganizeInventorySlotsFields.Slot1] as any,
    ItemID1: arr[ReorganizeInventorySlotsFields.ItemID1] as any,
    IsIOU1: arr[ReorganizeInventorySlotsFields.IsIOU1] as any,
    Slot2: arr[ReorganizeInventorySlotsFields.Slot2] as any,
    ItemID2: arr[ReorganizeInventorySlotsFields.ItemID2] as any,
    IsIOU2: arr[ReorganizeInventorySlotsFields.IsIOU2] as any,
    Type: arr[ReorganizeInventorySlotsFields.Type] as any,
  };
}

export function buildReorganizeInventorySlotsPayload(data: ReorganizeInventorySlotsPayload): unknown[] {
  const arr: unknown[] = new Array(8);
  arr[ReorganizeInventorySlotsFields.Menu] = data.Menu;
  arr[ReorganizeInventorySlotsFields.Slot1] = data.Slot1;
  arr[ReorganizeInventorySlotsFields.ItemID1] = data.ItemID1;
  arr[ReorganizeInventorySlotsFields.IsIOU1] = data.IsIOU1 ? 1 : 0;
  arr[ReorganizeInventorySlotsFields.Slot2] = data.Slot2;
  arr[ReorganizeInventorySlotsFields.ItemID2] = data.ItemID2;
  arr[ReorganizeInventorySlotsFields.IsIOU2] = data.IsIOU2 ? 1 : 0;
  arr[ReorganizeInventorySlotsFields.Type] = data.Type;
  return arr;
}
