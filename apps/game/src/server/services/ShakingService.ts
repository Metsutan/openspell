import { GameAction } from "../../protocol/enums/GameAction";
import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import { buildShakeTreeResultPayload } from "../../protocol/packets/actions/ShakeTreeResult";
import { buildShookTreePayload } from "../../protocol/packets/actions/ShookTree";
import { buildStartedTargetingPayload } from "../../protocol/packets/actions/StartedTargeting";
import { buildStoppedTargetingPayload } from "../../protocol/packets/actions/StoppedTargeting";
import { SKILLS, type PlayerState } from "../../world/PlayerState";
import type { ItemManager } from "../../world/systems/ItemManager";
import type { StateMachine } from "../StateMachine";
import { DelayType, type DelaySystem } from "../systems/DelaySystem";
import type { WorldEntityState } from "../state/EntityState";
import type { ItemAuditService } from "./ItemAuditService";
import type { MessageService } from "./MessageService";
import type { TargetingService } from "./TargetingService";

const SHAKE_TREE_DELAY_TICKS = 3;
const DEFAULT_TREE_SHAKE_ITEM_CHANCE = 0.25;
const DEFAULT_TREE_SHAKE_RARE_CHANCE = 0.001;

type TreeShakeDropConfig = {
  normalItemId: number;
  rareItemId: number;
  normalAmount: number;
  rareAmount: number;
  itemChance: number;
  rareChance: number;
  rareOnly?: boolean;
  requiredHarvestingLevel: number;
  shakeTargetName: string;
};

const DEFAULT_TREE_SHAKE_DROP: TreeShakeDropConfig = {
  normalItemId: 0,
  rareItemId: 0,
  normalAmount: 1,
  rareAmount: 1,
  itemChance: DEFAULT_TREE_SHAKE_ITEM_CHANCE,
  rareChance: DEFAULT_TREE_SHAKE_RARE_CHANCE,
  requiredHarvestingLevel: 1,
  shakeTargetName: "Trees"
};

const TREE_SHAKE_DROPS_BY_DEFINITION_ID: Record<number, TreeShakeDropConfig> = {
  // Normal Tree (placeholder item/rates)
  3: {
    normalItemId: 112,
    rareItemId: 113,
    normalAmount: 1,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 3,
    shakeTargetName: "Trees"
  },
  // Palm Tree (placeholder item/rates)
  13: {
    normalItemId: 114,
    rareItemId: 115,
    normalAmount: 1,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 48,
    shakeTargetName: "Palm Trees"
  },
  // Pine Tree (requested behavior)
  17: {
    normalItemId: 108, // pinecone
    rareItemId: 109, // golden pinecone
    normalAmount: 1,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 15,
    shakeTargetName: "Pine Trees"
  },
  // Oak Tree
  21: {
    normalItemId: 110,
    rareItemId: 111,
    normalAmount: 1,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 30,
    shakeTargetName: "Oak Trees"
  },
  // Cherry Blossom (placeholder item/rates)
  22: {
    normalItemId: 116,
    rareItemId: 117,
    normalAmount: 1,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 60,
    shakeTargetName: "Cherry Blossoms"
  },
  // Money Tree
  23: {
    normalItemId: 6,
    rareItemId: 72,
    normalAmount: 500,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 70,
    shakeTargetName: "Money Trees"
  },
  // Wizard's Tree (placeholder item/rates)
  95: {
    normalItemId: 207,
    rareItemId: 213,
    normalAmount: 1,
    rareAmount: 1,
    itemChance: 0.25,
    rareChance: 0.001,
    requiredHarvestingLevel: 75,
    shakeTargetName: "Wizard's Trees"
  },
  // Deadwood Tree (rare-only shake)
  96: {
    normalItemId: 0,
    rareItemId: 219,
    normalAmount: 0,
    rareAmount: 1,
    itemChance: 0.01,
    rareChance: 0.01,
    rareOnly: true,
    requiredHarvestingLevel: 88,
    shakeTargetName: "Deadwood Trees"
  }
};

export interface ShakingServiceDependencies {
  playerStatesByUserId: Map<number, PlayerState>;
  worldEntityStates: Map<number, WorldEntityState>;
  targetingService: TargetingService;
  stateMachine: StateMachine;
  delaySystem: DelaySystem;
  messageService: MessageService;
  itemManager: ItemManager | null;
  itemAudit: ItemAuditService | null;
  enqueueUserMessage: (userId: number, action: number, payload: unknown[]) => void;
}

export class ShakingService {
  private readonly shakenTrees = new Set<number>();

  constructor(private readonly deps: ShakingServiceDependencies) {}

  initiateShake(playerState: PlayerState, entityState: WorldEntityState): void {
    const dropConfig = this.getTreeShakeDropConfig(entityState);
    const requiredHarvestingLevel = Math.max(1, Math.floor(dropConfig.requiredHarvestingLevel));
    const playerHarvestingLevel = playerState.getSkillLevel(SKILLS.harvesting);
    if (playerHarvestingLevel < requiredHarvestingLevel) {
      this.deps.messageService.sendServerInfo(
        playerState.userId,
        `You need a Harvesting level of at least ${requiredHarvestingLevel} to shake ${dropConfig.shakeTargetName}`
      );
      return;
    }

    const shouldRollLoot = !this.shakenTrees.has(entityState.id);
    if (shouldRollLoot) {
      // One shake roll per tree per resource cycle, regardless of result.
      this.shakenTrees.add(entityState.id);
    }

    // Keep server-side target state clear for normal action flow.
    this.deps.targetingService.clearPlayerTarget(playerState.userId);
    this.deps.stateMachine.setState({ type: EntityType.Player, id: playerState.userId }, States.TreeShakingState);

    // Client expects this sequence to play the shake interaction.
    const targetingPayload = buildStartedTargetingPayload({
      EntityID: playerState.userId,
      EntityType: EntityType.Player,
      TargetID: entityState.id,
      TargetType: EntityType.Environment
    });
    this.deps.enqueueUserMessage(playerState.userId, GameAction.StartedTargeting, targetingPayload);

    const untargetingPayload = buildStoppedTargetingPayload({
      EntityID: playerState.userId,
      EntityType: EntityType.Player
    });
    this.deps.enqueueUserMessage(playerState.userId, GameAction.StoppedTargeting, untargetingPayload);

    const shookTreePayload = buildShookTreePayload({
      TreeShakerEntityID: playerState.userId,
      TreeShakerEntityType: EntityType.Player,
      TreeID: entityState.id
    });
    this.deps.enqueueUserMessage(playerState.userId, GameAction.ShookTree, shookTreePayload);

    this.deps.delaySystem.interruptDelay(playerState.userId, false);
    const delayStarted = this.deps.delaySystem.startDelay({
      userId: playerState.userId,
      type: DelayType.NonBlocking,
      ticks: SHAKE_TREE_DELAY_TICKS,
      onComplete: (nextUserId) => this.resolveShake(nextUserId, entityState.id, shouldRollLoot)
    });

    if (!delayStarted) {
      this.resolveShake(playerState.userId, entityState.id, shouldRollLoot);
    }
  }

  private resolveShake(userId: number, worldEntityId: number, shouldRollLoot: boolean): void {
    const playerState = this.deps.playerStatesByUserId.get(userId);
    if (!playerState) {
      return;
    }

    try {
      const entityState = this.deps.worldEntityStates.get(worldEntityId);
      if (!entityState || entityState.mapLevel !== playerState.mapLevel) {
        return;
      }

      // Tree was already shaken during this resource cycle:
      // still perform full animation+delay flow, but always return nothing.
      if (!shouldRollLoot) {
        this.sendShakeTreeResult(userId, 0, false);
        return;
      }

      const dropConfig = this.getTreeShakeDropConfig(entityState);
      if (dropConfig.rareItemId <= 0 && dropConfig.normalItemId <= 0) {
        this.sendShakeTreeResult(userId, 0, false);
        return;
      }

      let isRare = false;
      let itemId = 0;
      let amount = 0;
      if (dropConfig.rareOnly) {
        const rareOnlyRoll = Math.random();
        const rareOnlySucceeded = rareOnlyRoll < this.clampProbability(dropConfig.rareChance);
        if (!rareOnlySucceeded || dropConfig.rareItemId <= 0) {
          this.sendShakeTreeResult(userId, 0, false);
          return;
        }
        isRare = true;
        itemId = dropConfig.rareItemId;
        amount = Math.max(1, Math.floor(dropConfig.rareAmount));
      } else {
        const itemRoll = Math.random();
        const itemSucceeded = itemRoll < this.clampProbability(dropConfig.itemChance);
        if (!itemSucceeded) {
          this.sendShakeTreeResult(userId, 0, false);
          return;
        }

        const rareRoll = Math.random();
        isRare = rareRoll < this.clampProbability(dropConfig.rareChance);
        itemId = isRare ? dropConfig.rareItemId : dropConfig.normalItemId;
        amount = isRare
          ? Math.max(1, Math.floor(dropConfig.rareAmount))
          : Math.max(1, Math.floor(dropConfig.normalAmount));
        if (itemId <= 0) {
          this.sendShakeTreeResult(userId, 0, false);
          return;
        }
      }

      if (!this.deps.itemManager) {
        this.deps.messageService.sendServerInfo(userId, "Item spawning is unavailable right now.");
        this.sendShakeTreeResult(userId, 0, false);
        return;
      }

      const spawned = this.deps.itemManager.spawnGroundItem(
        itemId,
        amount,
        false,
        playerState.mapLevel,
        playerState.x,
        playerState.y,
        undefined,
        userId
      );

      if (!spawned) {
        this.sendShakeTreeResult(userId, 0, false);
        return;
      }

      this.deps.itemAudit?.logItemDrop({
        dropperUserId: userId,
        itemId,
        amount,
        isIOU: 0,
        mapLevel: playerState.mapLevel,
        x: playerState.x,
        y: playerState.y,
        groundItemId: spawned.id
      });

      this.sendShakeTreeResult(userId, itemId, isRare);
    } finally {
      this.deps.stateMachine.setState({ type: EntityType.Player, id: userId }, States.IdleState);
    }
  }

  private getTreeShakeDropConfig(entityState: WorldEntityState): TreeShakeDropConfig {
    return TREE_SHAKE_DROPS_BY_DEFINITION_ID[entityState.definitionId] ?? DEFAULT_TREE_SHAKE_DROP;
  }

  private clampProbability(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }
    if (value <= 0) {
      return 0;
    }
    if (value >= 1) {
      return 1;
    }
    return value;
  }

  private sendShakeTreeResult(userId: number, itemId: number, isRare: boolean): void {
    const payload = buildShakeTreeResultPayload({
      ItemID: itemId,
      IsRare: isRare
    });
    this.deps.enqueueUserMessage(userId, GameAction.ShakeTreeResult, payload);
  }

  onTreeExhausted(treeEntityId: number): void {
    // Reserved hook for future shake state if we need extra behavior on depletion.
    if (!Number.isInteger(treeEntityId) || treeEntityId <= 0) {
      return;
    }
  }

  onTreeReplenished(treeEntityId: number): void {
    if (!Number.isInteger(treeEntityId) || treeEntityId <= 0) {
      return;
    }
    this.shakenTrees.delete(treeEntityId);
  }
}
