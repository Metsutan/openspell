import { GameAction } from "../../protocol/enums/GameAction";
import { EntityType } from "../../protocol/enums/EntityType";
import { buildSkillCurrentLevelChangedPayload } from "../../protocol/packets/actions/SkillCurrentLevelChanged";
import { SKILLS, skillToClientRef, type PlayerState } from "../../world/PlayerState";
import type { EventBus } from "../events/EventBus";
import { createEntityHitpointsChangedEvent } from "../events/GameEvents";
import type { NPCState, NPCCombatStat } from "../state/EntityState";
import {
  getNpcBaseCombatStat,
  getNpcCurrentCombatStat,
  setNpcCurrentCombatStat,
  updateNpcBoostedStats
} from "../state/EntityState";

type RegenerationSystemConfig = {
  playerStatesByUserId: Map<number, PlayerState>;
  npcStates: Map<number, NPCState>;
  eventBus: EventBus;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
};

export class RegenerationSystem {
  private static readonly REGEN_INTERVAL_TICKS = 100;
  private tickCounter = 0;

  constructor(private readonly config: RegenerationSystemConfig) {}

  update() {
    this.tickCounter += 1;
    if (this.tickCounter % RegenerationSystem.REGEN_INTERVAL_TICKS !== 0) {
      return;
    }

    this.regenPlayers();
    this.regenNpcs();
  }

  private regenPlayers() {
    for (const [userId, playerState] of this.config.playerStatesByUserId.entries()) {
      const boostedSkills = playerState.getBoostedSkillSlugs();
      if (boostedSkills.size === 0) continue;

      for (const slug of boostedSkills) {
        const state = playerState.getSkillState(slug);
        if (state.boostedLevel === state.level) {
          continue;
        }

        const nextBoosted = state.boostedLevel < state.level
          ? state.boostedLevel + 1
          : state.boostedLevel - 1;

        playerState.setBoostedLevel(slug, nextBoosted);

        const clientRef = skillToClientRef(slug);
        if (clientRef !== null) {
          const payload = buildSkillCurrentLevelChangedPayload({
            Skill: clientRef,
            CurrentLevel: nextBoosted
          });
          this.config.enqueueUserMessage(userId, GameAction.SkillCurrentLevelChanged, payload);
        }

        if (slug === SKILLS.hitpoints) {
          this.config.eventBus.emit(createEntityHitpointsChangedEvent(
            { type: EntityType.Player, id: userId },
            nextBoosted,
            { mapLevel: playerState.mapLevel, x: playerState.x, y: playerState.y }
          ));
        }
      }
    }
  }

  private regenNpcs() {
    for (const npc of this.config.npcStates.values()) {
      if (npc.boostedStats.size === 0) continue;

      for (const stat of Array.from(npc.boostedStats) as NPCCombatStat[]) {
        const base = getNpcBaseCombatStat(npc, stat);
        const current = getNpcCurrentCombatStat(npc, stat);
        if (current === base) {
          npc.boostedStats.delete(stat);
          continue;
        }

        const next = current < base ? current + 1 : current - 1;
        setNpcCurrentCombatStat(npc, stat, next);
        updateNpcBoostedStats(npc, stat);

        if (stat === "hitpoints") {
          this.config.eventBus.emit(createEntityHitpointsChangedEvent(
            { type: EntityType.NPC, id: npc.id },
            next,
            { mapLevel: npc.mapLevel, x: npc.x, y: npc.y }
          ));
        }
      }
    }
  }
}
