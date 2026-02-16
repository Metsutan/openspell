import { ClientActionTypes } from "../../protocol/enums/ClientActionType";
import { EntityType } from "../../protocol/enums/EntityType";
import { GameAction } from "../../protocol/enums/GameAction";
import { States } from "../../protocol/enums/States";
import { decodeCastSingleCombatOrStatusSpellPayload } from "../../protocol/packets/actions/CastSingleCombatOrStatusSpell";
import { buildSkillCurrentLevelChangedPayload } from "../../protocol/packets/actions/SkillCurrentLevelChanged";
import { skillToClientRef, SKILLS, type PlayerState } from "../../world/PlayerState";
import { RequirementsChecker } from "../services/RequirementsChecker";
import { WildernessService } from "../services/WildernessService";
import { getPlayerCombatMode, isWithinRange, MAGIC_RANGE_DEFAULT } from "./utils/combatMode";
import { getStatusSpellEffect } from "../../world/spells/statusSpellEffects";
import type { NPCState } from "../state/EntityState";
import type { ActionContext, ActionHandler } from "./types";
import { canPlayerInteractWithNpc } from "../services/instancedNpcUtils";

export const handleCastSingleCombatOrStatusSpell: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) return;

  const decoded = decodeCastSingleCombatOrStatusSpellPayload(actionData);
  const spellId = Number(decoded.SpellID);
  const targetId = Number(decoded.TargetID);
  const targetEntityType = Number(decoded.TargetEntityType);
  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "CastSingleCombatOrStatusSpell",
      actionType: ClientActionTypes.CastSingleCombatOrStatusSpell,
      reason,
      payload: decoded,
      details
    });
  };

  if (!Number.isInteger(spellId) || spellId <= 0) {
    logInvalid("invalid_spell_id", { spellId });
    return;
  }

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  const spellDefinition = ctx.spellCatalog?.getDefinitionById(spellId);
  if (!spellDefinition) {
    logInvalid("unknown_spell", { spellId });
    return;
  }

  if (spellDefinition.type !== "combat" && spellDefinition.type !== "status") {
    logInvalid("invalid_spell_type", { spellId, type: spellDefinition.type });
    return;
  }

  const target = resolveTarget(ctx, targetEntityType, targetId);
  if (!target) {
    logInvalid("invalid_target", { targetEntityType, targetId });
    return;
  }

  if (target.type === EntityType.Player && target.state.userId === ctx.userId) {
    logInvalid("self_target", { targetId });
    return;
  }

  if (target.state.mapLevel !== playerState.mapLevel) {
    logInvalid("target_wrong_map", { targetId, mapLevel: target.state.mapLevel });
    return;
  }

  if (target.type === EntityType.Player) {
    if (
      !WildernessService.isInWilderness(playerState.x, playerState.y, playerState.mapLevel) ||
      !WildernessService.isInWilderness(target.state.x, target.state.y, target.state.mapLevel)
    ) {
      ctx.messageService.sendServerInfo(ctx.userId, "You can only attack players in the wilderness.");
      return;
    }
  } else if (!target.state.definition.combat) {
    logInvalid("npc_no_combat", { targetId });
    return;
  } else if (!canPlayerInteractWithNpc(ctx.userId, target.state)) {
    ctx.messageService.sendServerInfo(ctx.userId, "You cannot attack that.");
    return;
  }

  const spellRange = resolveSpellRange(spellDefinition.range);
  const hasLOS = ctx.losSystem
    ? ctx.losSystem.checkLOS(playerState.x, playerState.y, target.state.x, target.state.y, playerState.mapLevel).hasLOS
    : true;
  const inRange = isWithinRange(
    playerState.x,
    playerState.y,
    target.state.x,
    target.state.y,
    spellRange
  ) && hasLOS;

  if (!inRange) {
    ctx.messageService.sendServerInfo(ctx.userId, "Can't reach them");
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
    ctx.messageService.sendServerInfo(ctx.userId, "You don't have the required runes.");
    return;
  }

  if (spellDefinition.type === "status") {
    applyStatusSpellEffect(ctx, spellId, target);
  }

  playerState.singleCastSpellId = spellId;
  ctx.targetingService.setPlayerTarget(ctx.userId, { type: target.type, id: targetId });
  const combatMode = getPlayerCombatMode(playerState);
  const nextState = combatMode === "magic"
    ? States.MagicCombatState
    : combatMode === "range"
      ? States.RangeCombatState
      : States.MeleeCombatState;
  ctx.stateMachine.setState({ type: EntityType.Player, id: ctx.userId }, nextState);
  playerState.pendingAction = null;
};

type SpellTarget =
  | { type: EntityType.Player; state: PlayerState }
  | { type: EntityType.NPC; state: NPCState };

function resolveTarget(ctx: ActionContext, entityType: number, targetId: number): SpellTarget | null {
  if (entityType === EntityType.Player) {
    const state = ctx.playerStatesByUserId.get(targetId);
    return state ? { type: EntityType.Player, state } : null;
  }
  if (entityType === EntityType.NPC) {
    const state = ctx.npcStates.get(targetId);
    return state ? { type: EntityType.NPC, state } : null;
  }
  return null;
}

function resolveSpellRange(range: number | null | undefined): number {
  if (typeof range === "number" && Number.isFinite(range) && range > 0) {
    return range;
  }
  return MAGIC_RANGE_DEFAULT;
}

function hasSpellResources(playerState: PlayerState, recipe: { itemId: number; amount: number }[] | null): boolean {
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

function getStaffScrollOverride(playerState: PlayerState): number | null {
  const weaponId = playerState.equipment.weapon?.[0] ?? null;
  if (weaponId === null) {
    return null;
  }
  if (weaponId === 435) return 175;
  if (weaponId === 436) return 176;
  if (weaponId === 437) return 177;
  return null;
}

function applyStatusSpellEffect(ctx: ActionContext, spellId: number, target: SpellTarget): void {
  const effect = getStatusSpellEffect(spellId);
  if (!effect) {
    return;
  }
  if (effect.kind === "confuse") {
    return;
  }
  if (target.type !== EntityType.Player) {
    return;
  }
  const currentLevel = target.state.getSkillLevel(effect.skill);
  const reduction = Math.max(1, Math.floor(currentLevel * (effect.reductionPercent / 100)));
  const newBoosted = Math.max(0, currentLevel - reduction);
  target.state.setBoostedLevel(effect.skill, newBoosted);

  const clientRef = skillToClientRef(effect.skill);
  if (clientRef !== null) {
    const payload = buildSkillCurrentLevelChangedPayload({
      Skill: clientRef,
      CurrentLevel: newBoosted
    });
    ctx.enqueueUserMessage(target.state.userId, GameAction.SkillCurrentLevelChanged, payload);
  }
}
