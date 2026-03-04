import { ClientActionTypes } from "../../protocol/enums/ClientActionType";
import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { decodeCastTeleportSpellPayload } from "../../protocol/packets/actions/CastTeleportSpell";
import { buildCastedTeleportSpellPayload } from "../../protocol/packets/actions/CastedTeleportSpell";
import { buildSkillCurrentLevelChangedPayload } from "../../protocol/packets/actions/SkillCurrentLevelChanged";
import { TeleportType } from "../../protocol/enums/TeleportType";
import type { MapLevel } from "../../world/Location";
import { SKILLS, skillToClientRef } from "../../world/PlayerState";
import { States } from "../../protocol/enums/States";
import { createEntityDamagedEvent, createEntityHitpointsChangedEvent } from "../events/GameEvents";
import { RequirementsChecker } from "../services/RequirementsChecker";
import { WildernessService } from "../services/WildernessService";
import { DelayType } from "../systems/DelaySystem";
import type { ActionHandler } from "./types";

/**
 * Spell ID to destination mapping.
 * TODO: Move this to a spell catalog/database.
 */
const TELEPORT_DESTINATIONS: Record<
  number,
  { xMin: number; xMax: number; yMin: number; yMax: number; mapLevel: MapLevel; name: string }
> = {
  // TODO: Fill with real coordinates per teleport spell ID.
  4: { xMin: -324, xMax: -320, yMin: 12, yMax: 16, mapLevel: 1 as MapLevel, name: "Hedgecastle Teleport" },
  7: { xMin: 46, xMax: 50, yMin: 189, yMax: 193, mapLevel: 1 as MapLevel, name: "Icitrine Teleport" },
  8: { xMin: -262, xMax: -260, yMin: -396, yMax: -394, mapLevel: 1 as MapLevel, name: "Highcove Teleport" },
  15: { xMin: 315, xMax: 321, yMin: -13, yMax: -7, mapLevel: 1 as MapLevel, name: "Celadon Teleport" },
  16: { xMin: 91, xMax: 94, yMin: -186, yMax: -183, mapLevel: 1 as MapLevel, name: "Anglham Castle Teleport" },
  17: { xMin: 169, xMax: 173, yMin: 284, yMax: 288, mapLevel: 1 as MapLevel, name: "Water Obelisk Teleport" },
  18: { xMin: -215, xMax: -211, yMin: -184, yMax: -181, mapLevel: 1 as MapLevel, name: "Nature Obelisk Teleport" },
  19: { xMin: -61, xMax: -59, yMin: 361, yMax: 363, mapLevel: 0 as MapLevel, name: "Fire Obelisk Teleport" },
  20: { xMin: -239, xMax: -235, yMin: -166, yMax: -163, mapLevel: 0 as MapLevel, name: "Fury Obelisk Teleport" },
  21: { xMin: -3, xMax: 1, yMin: 461, yMax: 465, mapLevel: 1 as MapLevel, name: "Energy Obelisk Teleport" },
  22: { xMin: 215, xMax: 219, yMin: -173, yMax: -169, mapLevel: 1 as MapLevel, name: "Rage Obelisk Teleport" },
  23: { xMin: -99, xMax: -95, yMin: -264, yMax: -260, mapLevel: 1 as MapLevel, name: "Wizard's Obelisk Teleport" },
  24: { xMin: 426, xMax: 426, yMin: -458, yMax: -458, mapLevel: 1 as MapLevel, name: "Blood Teleport" },
  25: { xMin: -404, xMax: -400, yMin: -467, yMax: -463, mapLevel: 1 as MapLevel, name: "Dragonsmoke Teleport" },
  26: { xMin: -399, xMax: -395, yMin: -88, yMax: -85, mapLevel: 1 as MapLevel, name: "Portal Obelisk Teleport" },
  27: { xMin: -194, xMax: -190, yMin: 45, yMax: 49, mapLevel: 0 as MapLevel, name: "Golden Obelisk Teleport" },
  28: { xMin: 365, xMax: 365, yMin: -482, yMax: -482, mapLevel: 1 as MapLevel, name: "Blood Obelisk Teleport" },
  34: { xMin: 141, xMax: 145, yMin: 445, yMax: 449, mapLevel: 1 as MapLevel, name: "Cairn Teleport" },
};

const TELEPORT_DELAY_TICKS = 5;
const BLOOD_TELEPORT_DELAY_TICKS = 12;
const BLOOD_TELEPORT_COMBAT_LOCK_MS = 10_000;
const BLOOD_TELEPORT_SPELL_ID = 24;
const BLOOD_TELEPORT_LOCATIONS: Array<{ x: number; y: number; mapLevel: MapLevel; name: string }> = [
  { x: 405, y: -329, mapLevel: 1 as MapLevel, name: "Blood Teleport" },
  { x: 57, y: -354, mapLevel: 1 as MapLevel, name: "Blood Teleport" },
  { x: 426, y: -458, mapLevel: 1 as MapLevel, name: "Blood Teleport" },
  { x: 215, y: -325, mapLevel: 1 as MapLevel, name: "Blood Teleport" },
  { x: 505, y: -461, mapLevel: 1 as MapLevel, name: "Blood Teleport" }
];

/**
 * Handles teleport spell casting.
 * Validates the spell, checks requirements, and triggers the teleport.
 */
export const handleCastTeleportSpell: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;
  
  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const decoded = decodeCastTeleportSpellPayload(actionData);
  const spellId = Number(decoded.SpellID);
  const isBloodTeleport = spellId === BLOOD_TELEPORT_SPELL_ID;
  const teleportDelayTicks = isBloodTeleport ? BLOOD_TELEPORT_DELAY_TICKS : TELEPORT_DELAY_TICKS;
  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "CastTeleportSpell",
      actionType: ClientActionTypes.CastTeleportSpell,
      reason,
      payload: decoded,
      details
    });
  };

  if (!Number.isInteger(spellId) || spellId <= 0) {
    logInvalid("invalid_spell_id", { spellId });
    return;
  }

  const spellDefinition = ctx.spellCatalog?.getDefinitionById(spellId);
  if (!spellDefinition) {
    logInvalid("unknown_spell", { spellId });
    return;
  }

  if (spellDefinition.type !== "teleport") {
    logInvalid("spell_not_teleport", { spellId, type: spellDefinition.type });
    return;
  }

  // Look up teleport destination
  const destination = TELEPORT_DESTINATIONS[spellId];
  if (!destination) {
    logInvalid("unknown_teleport_destination", { spellId });
    return;
  }
  if (isBloodTeleport && BLOOD_TELEPORT_LOCATIONS.length === 0) {
    logInvalid("missing_blood_teleport_pool", { spellId });
    return;
  }
  if (isBloodTeleport && playerState.wasHitWithin(BLOOD_TELEPORT_COMBAT_LOCK_MS)) {
    //logInvalid("blood_teleport_recent_combat_block", { spellId });
    ctx.messageService.sendServerInfo(
      ctx.userId,
      "You cannot cast this spell within 10 seconds of being in combat"
    );
    return;
  }
  if (!isBloodTeleport && !WildernessService.canTeleport(playerState.x, playerState.y, playerState.mapLevel)) {
    ctx.messageService.sendServerInfo(ctx.userId, WildernessService.TELEPORT_BLOCK_MESSAGE);
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

  if (!hasSpellResources(playerState, spellDefinition.recipe ?? null)) {
    logInvalid("missing_runes", { spellId });
    return;
  }

  const castedPayload = buildCastedTeleportSpellPayload({
    EntityID: ctx.userId,
    EntityType: EntityType.Player,
    SpellID: spellId
  });

  const viewers = ctx.spatialIndex.getPlayersViewingPosition(
    playerState.mapLevel,
    playerState.x,
    playerState.y
  );

  ctx.enqueueUserMessage(ctx.userId, GameAction.CastedTeleportSpell, castedPayload);
  for (const viewer of viewers) {
    if (viewer.id !== ctx.userId) {
      ctx.enqueueUserMessage(viewer.id, GameAction.CastedTeleportSpell, castedPayload);
    }
  }

  const delayStarted = ctx.delaySystem.startDelay({
    userId: ctx.userId,
    type: DelayType.NonBlocking,
    ticks: teleportDelayTicks,
    state: States.TeleportingState,
    restoreState: States.IdleState,
    onComplete: (userId) => {
      const state = ctx.playerStatesByUserId.get(userId);
      if (!state) return;
      if (!consumeSpellResources(userId, ctx.inventoryService, state, spellDefinition.recipe ?? null)) {
        ctx.messageService.sendServerInfo(userId, "You don't have the required scrolls.");
        return;
      }

      let x: number;
      let y: number;
      let mapLevel: MapLevel;
      if (isBloodTeleport) {
        const chosenIndex = Math.floor(Math.random() * BLOOD_TELEPORT_LOCATIONS.length);
        const chosenLocation = BLOOD_TELEPORT_LOCATIONS[chosenIndex];
        x = chosenLocation.x;
        y = chosenLocation.y;
        mapLevel = chosenLocation.mapLevel;
      } else {
        x = Math.floor(Math.random() * (destination.xMax - destination.xMin + 1)) + destination.xMin;
        y = Math.floor(Math.random() * (destination.yMax - destination.yMin + 1)) + destination.yMin;
        mapLevel = destination.mapLevel;
      }

      const teleportResult = ctx.teleportService.teleportPlayer(userId, x, y, mapLevel, {
        type: TeleportType.Teleport,
        spellId,
        broadcastSpellCast: false,
        validate: true,
        skipWildernessRestriction: isBloodTeleport
      });

      if (!teleportResult.success && teleportResult.reason) {
        ctx.messageService.sendServerInfo(userId, teleportResult.reason);
        return;
      }

      ctx.experienceService.addSkillXp(
        state,
        SKILLS.magic,
        spellDefinition.exp ?? 0,
        { sendGainedExp: false }
      );

      if (isBloodTeleport) {
        const currentHitpoints = state.getSkillBoostedLevel(SKILLS.hitpoints);
        const recoilDamage = Math.floor(currentHitpoints / 2);
        const newHitpoints = Math.max(0, currentHitpoints - recoilDamage);
        if (newHitpoints !== currentHitpoints) {
          state.setBoostedLevel(SKILLS.hitpoints, newHitpoints);

          const hitpointsClientRef = skillToClientRef(SKILLS.hitpoints);
          if (hitpointsClientRef !== null) {
            const skillPayload = buildSkillCurrentLevelChangedPayload({
              Skill: hitpointsClientRef,
              CurrentLevel: newHitpoints
            });
            ctx.enqueueUserMessage(userId, GameAction.SkillCurrentLevelChanged, skillPayload);
          }

          const position = { mapLevel: state.mapLevel, x: state.x, y: state.y };
          ctx.eventBus.emit(createEntityHitpointsChangedEvent(
            { type: EntityType.Player, id: userId },
            newHitpoints,
            position
          ));
          ctx.eventBus.emit(createEntityDamagedEvent(
            { type: EntityType.Environment, id: -1 },
            { type: EntityType.Player, id: userId },
            recoilDamage,
            position
          ));
        }
      }
    }
  });

  if (!delayStarted) {
    logInvalid("teleport_delay_failed", { spellId });
    return;
  }
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

function consumeSpellResources(
  userId: number,
  inventoryService: { removeItem: (userId: number, itemId: number, amount: number, isIOU: number) => { removed: number } },
  playerState: { countItem: (itemId: number, isIOU?: number) => number; equipment: { weapon?: [number, number] | null } },
  recipe: { itemId: number; amount: number }[] | null
): boolean {
  if (!hasSpellResources(playerState, recipe)) {
    return false;
  }

  const normalizedRecipe = recipe ?? [];
  const staffOverrideItemId = getStaffScrollOverride(playerState);
  for (const entry of normalizedRecipe) {
    if (!entry || !Number.isInteger(entry.itemId) || !Number.isInteger(entry.amount)) {
      continue;
    }
    if (staffOverrideItemId !== null && entry.itemId === staffOverrideItemId) {
      continue;
    }
    const removal = inventoryService.removeItem(userId, entry.itemId, entry.amount, 0);
    if (removal.removed < entry.amount) {
      return false;
    }
  }

  return true;
}

function getStaffScrollOverride(
  playerState: { equipment: { weapon?: [number, number] | null } }
): number | null {
  const weaponId = playerState.equipment.weapon?.[0] ?? null;
  if (weaponId === null) {
    return null;
  }
  if (weaponId === 435) return 175;
  if (weaponId === 436) return 176;
  if (weaponId === 437) return 177;
  return null;
}
