import { ClientActionTypes } from "../../protocol/enums/ClientActionType";
import { MenuType } from "../../protocol/enums/MenuType";
import { decodeCastInventorySpellPayload } from "../../protocol/packets/actions/CastInventorySpell";
import { SKILLS } from "../../world/PlayerState";
import { RequirementsChecker } from "../services/RequirementsChecker";
import type { ActionHandler } from "./types";
import { isValidSlotIndex } from "../../world/systems/InventoryManager";
import { createPlayerCastedInventorySpellEvent } from "../events/GameEvents";

const COIN_ITEM_ID = 6;

type InventorySpellEffect = {
  kind: "alchemy";
  coinMultiplier: number;
};

const INVENTORY_SPELL_EFFECTS: Record<number, InventorySpellEffect> = {
  5: { kind: "alchemy", coinMultiplier: 0.75 },
  6: { kind: "alchemy", coinMultiplier: 1.0 }
};

export const handleCastInventorySpell: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const decoded = decodeCastInventorySpellPayload(actionData);
  const spellId = Number(decoded.SpellID);
  const menu = Number(decoded.Menu);
  const slot = Number(decoded.Slot);
  const itemId = Number(decoded.ItemID);
  const isIOU = decoded.IsIOU ? 1 : 0;

  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "CastInventorySpell",
      actionType: ClientActionTypes.CastInventorySpell,
      reason,
      payload: decoded,
      details
    });
  };

  if (!Number.isInteger(spellId) || spellId <= 0) {
    logInvalid("invalid_spell_id", { spellId });
    return;
  }

  if (menu !== MenuType.Inventory) {
    logInvalid("invalid_menu", { menu });
    return;
  }

  if (!isValidSlotIndex(slot)) {
    logInvalid("invalid_slot", { slot });
    return;
  }

  const slotItem = playerState.inventory[slot];
  if (!slotItem) {
    logInvalid("empty_slot", { slot });
    return;
  }

  if (slotItem[0] !== itemId || slotItem[2] !== isIOU) {
    logInvalid("slot_item_mismatch", { slot, itemId, isIOU, slotItem });
    return;
  }

  const spellDefinition = ctx.spellCatalog?.getDefinitionById(spellId);
  if (!spellDefinition) {
    logInvalid("unknown_spell", { spellId });
    return;
  }

  if (spellDefinition.type !== "inventory") {
    logInvalid("invalid_spell_type", { spellId, type: spellDefinition.type });
    return;
  }

  const spellEffect = INVENTORY_SPELL_EFFECTS[spellId];
  if (!spellEffect) {
    logInvalid("unsupported_inventory_spell", { spellId });
    return;
  }

  if (spellDefinition.requirements !== null && spellDefinition.requirements !== undefined) {
    if (!Array.isArray(spellDefinition.requirements)) {
      logInvalid("invalid_requirements_format", { spellId });
      return;
    }

    const requirementCheck = new RequirementsChecker().checkRequirements(
      spellDefinition.requirements,
      { playerState }
    );

    if (!requirementCheck.passed) {
      ctx.messageService.sendServerInfo(
        ctx.userId,
        "You don't meet the requirements to do that."
      );
      return;
    }
  }

  const itemDefinition = ctx.itemCatalog?.getDefinitionById(itemId);
  if (!itemDefinition) {
    logInvalid("unknown_item", { itemId });
    return;
  }

  if (itemDefinition.isStackable && isIOU === 0) {
    ctx.messageService.sendServerInfo(ctx.userId, "You can't alchemize stackable items.");
    return;
  }

  if (!hasSpellResources(playerState, spellDefinition.recipe ?? null)) {
    ctx.messageService.sendServerInfo(ctx.userId, "You don't have the required scrolls.");
    return;
  }

  const removalResult = ctx.inventoryService.decrementItemAtSlot(
    ctx.userId,
    slot,
    itemId,
    1,
    isIOU
  );
  if (!removalResult || removalResult.removed <= 0) {
    logInvalid("remove_failed", { slot, itemId, isIOU });
    return;
  }

  if (spellEffect.kind === "alchemy") {
    const coins = Math.floor(itemDefinition.cost * spellEffect.coinMultiplier);
    if (coins > 0) {
      ctx.inventoryService.giveItem(ctx.userId, COIN_ITEM_ID, coins, 0);
    }
  }

  ctx.eventBus.emit(
    createPlayerCastedInventorySpellEvent(
      ctx.userId,
      spellId,
      itemId,
      {
        mapLevel: playerState.mapLevel,
        x: playerState.x,
        y: playerState.y
      }
    )
  );

  ctx.experienceService.addSkillXp(
    playerState,
    SKILLS.magic,
    spellDefinition.exp ?? 0,
    { sendGainedExp: false }
  );
};

function hasSpellResources(
  playerState: { countItem: (itemId: number, isIOU?: number) => number; equipment: { weapon?: [number, number] | null } },
  recipe: { itemId: number; amount: number }[] | null
): boolean {
  if (!recipe || recipe.length === 0) {
    return true;
  }
  const staffOverrideItemId = getStaffScrollOverride(playerState);
  for (const entry of recipe) {
    if (!entry || !Number.isInteger(entry.itemId) || !Number.isInteger(entry.amount)) {
      continue;
    }
    if (staffOverrideItemId !== null && entry.itemId === staffOverrideItemId) {
      continue;
    }
    const available = playerState.countItem(entry.itemId, 0);
    if (available < entry.amount) {
      return false;
    }
  }
  return true;
}

function getStaffScrollOverride(playerState: { equipment: { weapon?: [number, number] | null } }): number | null {
  const weaponId = playerState.equipment.weapon?.[0] ?? null;
  if (weaponId === null) {
    return null;
  }
  if (weaponId === 435) return 175;
  if (weaponId === 436) return 176;
  if (weaponId === 437) return 177;
  return null;
}
