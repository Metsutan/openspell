import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import type { MapLevel } from "../../world/Location";
import type { PlayerState } from "../../world/PlayerState";
import type { EntityRef } from "../events/GameEvents";
import type { NPCState } from "../state/EntityState";
import type { StateMachine } from "../StateMachine";
import type { SpatialIndexManager } from "../systems/SpatialIndexManager";

// ---------------------------------------------------------------------------
// NPC Combat Script infrastructure
// ---------------------------------------------------------------------------

/**
 * Context passed to custom NPC combat scripts so they can query the world
 * and execute attacks without coupling to CombatSystem internals.
 */
export interface NpcCombatContext {
  spatialIndex: SpatialIndexManager;
  playerStates: Map<number, PlayerState>;
  stateMachine: StateMachine;
  hasLineOfSight: (fromX: number, fromY: number, toX: number, toY: number, mapLevel: MapLevel) => boolean;
  executeAttack: (
    npc: NPCState,
    target: PlayerState | NPCState,
    attackerRef: EntityRef,
    targetRef: EntityRef,
    spellId: number | null
  ) => void;
}

/**
 * A custom NPC combat script function.
 * Called each tick the NPC's combat delay reaches 0, before normal combat.
 * Return `true` if the script handled the attack (skip normal logic),
 * `false` to fall through to default melee/ranged behaviour.
 */
export type NpcCombatScriptFn = (npc: NPCState, ctx: NpcCombatContext) => boolean;

// ---------------------------------------------------------------------------
// Damogui constants
// ---------------------------------------------------------------------------

export const DAMOGUI_DEFINITION_ID = 163;
export const OUTBURST_SPELL_ID = 32;
const DAMOGUI_MAGIC_CHANCE = 0.10;

// ---------------------------------------------------------------------------
// Damogui combat script
// ---------------------------------------------------------------------------

/**
 * Custom combat logic for the Damogui boss.
 *
 * Each attack tick there is a 10 % chance Damogui casts Outburst on a
 * random player within his full aggro range (16 tiles) that he has line of
 * sight to.  The remaining 90 % of the time (or if no valid magic target
 * exists) he falls through to normal melee.
 */
function processDamoguiCombat(npc: NPCState, ctx: NpcCombatContext): boolean {
  if (Math.random() >= DAMOGUI_MAGIC_CHANCE) return false;

  const aggroRadius = npc.definition.combat?.aggroRadius ?? 0;
  if (aggroRadius <= 0) return false;

  const nearbyPlayers = ctx.spatialIndex.getPlayersInAggroRange(
    npc.mapLevel, npc.x, npc.y, aggroRadius
  );

  const validTargets = nearbyPlayers.filter(p => {
    const state = ctx.stateMachine.getCurrentState({ type: EntityType.Player, id: p.id });
    if (state === States.PlayerDeadState) return false;
    return ctx.hasLineOfSight(npc.x, npc.y, p.x, p.y, npc.mapLevel);
  });

  if (validTargets.length === 0) return false;

  const chosen = validTargets[Math.floor(Math.random() * validTargets.length)];
  const playerState = ctx.playerStates.get(chosen.id);
  if (!playerState) return false;

  const attackerRef: EntityRef = { type: EntityType.NPC, id: npc.id };
  const targetRef: EntityRef = { type: EntityType.Player, id: chosen.id };

  ctx.executeAttack(npc, playerState, attackerRef, targetRef, OUTBURST_SPELL_ID);

  npc.lastPlayerAttackAtMs = Date.now();
  return true;
}

// ---------------------------------------------------------------------------
// Script registry – add new entries here when more bosses get custom AI
// ---------------------------------------------------------------------------

export const NPC_COMBAT_SCRIPTS: ReadonlyMap<number, NpcCombatScriptFn> = new Map([
  [DAMOGUI_DEFINITION_ID, processDamoguiCombat],
]);
