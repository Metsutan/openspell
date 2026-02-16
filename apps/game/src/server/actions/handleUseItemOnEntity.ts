import { EntityType } from "../../protocol/enums/EntityType";
import { PlayerSetting } from "../../protocol/enums/PlayerSetting";
import { decodeUseItemOnEntityPayload } from "../../protocol/packets/actions/UseItemOnEntity";
import type { ActionContext, ActionHandler } from "./types";
import type { NPCState, WorldEntityState } from "../state/EntityState";
import type { PlayerState } from "../../world/PlayerState";
import type { EntityRef } from "../events/GameEvents";
import { buildMovementPathAdjacent } from "./utils/pathfinding";
import { checkAdjacentToEnvironment, checkAdjacentToNPC } from "./entity-actions/shared";

const DEFAULT_INTERACTION_MESSAGE = "Nothing interesting happens.";
const CELADON_RECHARGE_OBJECT_ID = 88;
const FULLY_CHARGED_CELADON_ORB_ID = 408;
const LAST_CELADON_ORB_ID = 413;

export const handleUseItemOnEntity: ActionHandler = (ctx, actionData) => {
  const payload = decodeUseItemOnEntityPayload(actionData);
  const logInvalid = (reason: string, details?: Record<string, unknown>) => {
    ctx.packetAudit?.logInvalidPacket({
      userId: ctx.userId,
      packetName: "UseItemOnEntity",
      reason,
      payload,
      details
    });
  };

  if (!ctx.userId) {
    console.warn("[handleUseItemOnEntity] No userId - action ignored");
    return;
  }

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) {
    console.warn(`[handleUseItemOnEntity] No player state for user ${ctx.userId}`);
    return;
  }

  //lol? The packets from the client are backwards. This needs to stay.
  const itemId = Number(payload.ItemID);
  const entityId = Number(payload.EntityType);
  const entityType = Number(payload.EntityID);

  if (!Number.isInteger(itemId) || !Number.isInteger(entityType) || !Number.isInteger(entityId)) {
    logInvalid("invalid_payload", { itemId, entityType, entityId });
    console.warn("[handleUseItemOnEntity] Invalid payload:", payload);
    return;
  }

  if (!playerState.hasItem(itemId)) {
    logInvalid("item_missing_in_inventory", { itemId });
    ctx.messageService.sendServerInfo(playerState.userId, "You don't have that item.");
    return;
  }

  switch (entityType) {
    case EntityType.Environment: {
      const entityState = ctx.worldEntityStates.get(entityId);
      if (!entityState) {
        logInvalid("environment_missing", { entityId });
        ctx.messageService.sendServerInfo(playerState.userId, "That doesn't exist anymore.");
        return;
      }
      if (entityState.mapLevel !== playerState.mapLevel) {
        logInvalid("environment_wrong_map", {
          entityId,
          entityMapLevel: entityState.mapLevel,
          playerMapLevel: playerState.mapLevel
        });
        return;
      }
      handleItemOnEnvironment(ctx, playerState, itemId, entityState, logInvalid);
      break;
    }
    case EntityType.NPC: {
      const npcState = ctx.npcStates.get(entityId);
      if (!npcState) {
        logInvalid("npc_missing", { entityId });
        ctx.messageService.sendServerInfo(playerState.userId, "They aren't here.");
        return;
      }
      if (npcState.mapLevel !== playerState.mapLevel) {
        logInvalid("npc_wrong_map", {
          entityId,
          entityMapLevel: npcState.mapLevel,
          playerMapLevel: playerState.mapLevel
        });
        return;
      }
      handleItemOnNpc(ctx, playerState, itemId, npcState, logInvalid);
      break;
    }
    case EntityType.Item:
      ctx.messageService.sendServerInfo(playerState.userId, DEFAULT_INTERACTION_MESSAGE);
      break;
    default:
      console.warn(`[handleUseItemOnEntity] Unknown entity type: ${entityType}`);
      break;
  }
};

function handleItemOnEnvironment(
  ctx: ActionContext,
  playerState: PlayerState,
  itemId: number,
  entityState: WorldEntityState,
  logInvalid: (reason: string, details?: Record<string, unknown>) => void
): void {
  const handleCeladonOrbRecharge = (): boolean => {
    if (entityState.definitionId !== CELADON_RECHARGE_OBJECT_ID) {
      return false;
    }

    if (itemId < FULLY_CHARGED_CELADON_ORB_ID || itemId > LAST_CELADON_ORB_ID) {
      return false;
    }

    if (itemId === FULLY_CHARGED_CELADON_ORB_ID) {
      ctx.messageService.sendServerInfo(playerState.userId, "Your Celadon Orb is already fully charged");
      return true;
    }

    const removed = ctx.inventoryService.removeItem(playerState.userId, itemId, 1, 0);
    if (removed.removed < 1) {
      ctx.messageService.sendServerInfo(playerState.userId, "You don't have that item.");
      return true;
    }

    const added = ctx.inventoryService.giveItem(playerState.userId, FULLY_CHARGED_CELADON_ORB_ID, 1, 0);
    if (added.added < 1) {
      // Restore original orb if replacement fails for any reason.
      ctx.inventoryService.giveItem(playerState.userId, itemId, 1, 0);
      ctx.messageService.sendServerInfo(playerState.userId, "Nothing interesting happens.");
      return true;
    }

    ctx.messageService.sendServerInfo(playerState.userId, "You recharge your Celadon Orb");
    return true;
  };

  const executeInteraction = () => {
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    if (handleCeladonOrbRecharge()) {
      return;
    }
    ctx.itemInteractionService.handleItemOnWorldEntity(playerState, itemId, entityState);
  };

  const isSmallEntity = entityState.width <= 1 && entityState.length <= 1;
  const allowDiagonal = !isSmallEntity;
  const isAdjacent = checkAdjacentToEnvironment(ctx, playerState, entityState, false, allowDiagonal);

  if (isAdjacent) {
    executeInteraction();
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.Environment, id: entityState.id });

  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    entityState.x,
    entityState.y,
    playerState.mapLevel,
    true,
    null,
    allowDiagonal
  );

  if (!path || path.length <= 1) {
    logInvalid("environment_not_reachable", {
      entityId: entityState.id,
      entityDefinitionId: entityState.definitionId,
      playerX: playerState.x,
      playerY: playerState.y,
      entityX: entityState.x,
      entityY: entityState.y
    });
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that.");
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };

  ctx.pathfindingSystem.scheduleMovementPlan(entityRef, playerState.mapLevel, path, speed, () => {
    const inPosition = checkAdjacentToEnvironment(ctx, playerState, entityState, false, allowDiagonal);
    if (!inPosition) {
      logInvalid("environment_not_adjacent_on_execute", {
        entityId: entityState.id,
        entityDefinitionId: entityState.definitionId,
        playerX: playerState.x,
        playerY: playerState.y,
        entityX: entityState.x,
        entityY: entityState.y
      });
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach that.");
      ctx.targetingService.clearPlayerTarget(playerState.userId);
      return;
    }
    executeInteraction();
  });
}

function handleItemOnNpc(
  ctx: ActionContext,
  playerState: PlayerState,
  itemId: number,
  npcState: NPCState,
  logInvalid: (reason: string, details?: Record<string, unknown>) => void
): void {
  const executeInteraction = () => {
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    const handled = ctx.itemInteractionService.handleItemOnNpc(playerState, itemId, npcState);
    if (!handled) {
      ctx.messageService.sendServerInfo(playerState.userId, DEFAULT_INTERACTION_MESSAGE);
    }
  };

  const isAdjacent = checkAdjacentToNPC(ctx, playerState, npcState);
  if (isAdjacent) {
    executeInteraction();
    return;
  }

  ctx.targetingService.setPlayerTarget(playerState.userId, { type: EntityType.NPC, id: npcState.id });

  const path = buildMovementPathAdjacent(
    ctx,
    playerState.x,
    playerState.y,
    npcState.x,
    npcState.y,
    playerState.mapLevel,
    true,
    128
  );

  if (!path || path.length <= 1) {
    logInvalid("npc_not_reachable", {
      npcId: npcState.id,
      playerX: playerState.x,
      playerY: playerState.y,
      npcX: npcState.x,
      npcY: npcState.y
    });
    ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them.");
    ctx.targetingService.clearPlayerTarget(playerState.userId);
    return;
  }

  const speed = playerState.settings[PlayerSetting.IsSprinting] === 1 ? 2 : 1;
  const entityRef: EntityRef = { type: EntityType.Player, id: playerState.userId };

  ctx.pathfindingSystem.scheduleMovementPlan(entityRef, playerState.mapLevel, path, speed, () => {
    const inPosition = checkAdjacentToNPC(ctx, playerState, npcState);
    if (!inPosition) {
      logInvalid("npc_not_adjacent_on_execute", {
        npcId: npcState.id,
        playerX: playerState.x,
        playerY: playerState.y,
        npcX: npcState.x,
        npcY: npcState.y
      });
      ctx.messageService.sendServerInfo(playerState.userId, "Can't reach them.");
      ctx.targetingService.clearPlayerTarget(playerState.userId);
      return;
    }
    executeInteraction();
  });
}
