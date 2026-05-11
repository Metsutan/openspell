/**
 * PacketBuilder.ts - Centralized packet building for all outgoing packets.
 * 
 * This module provides a unified interface for building game packets,
 * abstracting away the protocol details from the game logic.
 */

import { GameAction } from "../../protocol/enums/GameAction";
import { EntityType } from "../../protocol/enums/EntityType";
import { States } from "../../protocol/enums/States";
import type { MapLevel } from "../../world/Location";
import type { PlayerState, SkillSlug, EquipmentSlot } from "../../world/PlayerState";

import { buildPlayerEnteredChunkPayload } from "../../protocol/packets/actions/PlayerEnteredChunk";
import { buildNPCEnteredChunkPayload } from "../../protocol/packets/actions/NPCEnteredChunk";
import { buildItemEnteredChunkPayload } from "../../protocol/packets/actions/ItemEnteredChunk";
import { buildEntityExitedChunkPayload } from "../../protocol/packets/actions/EntityExitedChunk";
import { buildEntityMoveToPayload } from "../../protocol/packets/actions/EntityMoveTo";
import { buildTeleportToPayload } from "../../protocol/packets/actions/TeleportTo";
import { TeleportType } from "../../protocol/enums/TeleportType";
import { buildStartedTargetingPayload } from "../../protocol/packets/actions/StartedTargeting";
import { buildStoppedTargetingPayload } from "../../protocol/packets/actions/StoppedTargeting";
import { buildEnteredIdleStatePayload } from "../../protocol/packets/actions/EnteredIdleState";
import { buildWentThroughDoorPayload } from "../../protocol/packets/actions/WentThroughDoor";

import type { PacketBuilder as IPacketBuilder, OutgoingPacket } from "./VisibilitySystem";
import type { NPCSpatialEntry, ItemSpatialEntry } from "./SpatialIndexManager";
import type { EntityRef } from "../events/GameEvents";

/**
 * Default implementation of the PacketBuilder interface.
 * Converts game state into protocol packets using the existing packet builders.
 */
export class DefaultPacketBuilder implements IPacketBuilder {
  /**
   * Builds a PlayerEnteredChunk packet for a player.
   */
  buildPlayerEnteredChunk(player: PlayerState): OutgoingPacket {
    const getLvl = (slug: SkillSlug) => player.skills[slug]?.level ?? 1;
    const combatLevel = DefaultPacketBuilder.calculateCombatLevel(player);
    const equipId = (slot: EquipmentSlot): number | null => player.equipment[slot]?.[0] ?? null;

    const payload = buildPlayerEnteredChunkPayload({
      EntityID: player.userId,
      EntityTypeID: player.userId,
      PlayerType: player.playerType,
      Username: player.displayName ?? player.username,
      CombatLevel: combatLevel,
      HitpointsLevel: getLvl("hitpoints"),
      CurrentHitpointsLevel: getLvl("hitpoints"),
      MapLevel: player.mapLevel,
      X: player.x,
      Y: player.y,
      HairStyleID: player.appearance.hairStyleId,
      BeardStyleID: player.appearance.beardStyleId,
      ShirtID: player.appearance.shirtId,
      BodyTypeID: player.appearance.bodyTypeId,
      LegsID: player.appearance.legsId,
      EquipmentHeadID: equipId("helmet"),
      EquipmentBodyID: equipId("chest"),
      EquipmentLegsID: equipId("legs"),
      EquipmentBootsID: equipId("boots"),
      EquipmentNecklaceID: equipId("neck"),
      EquipmentWeaponID: equipId("weapon"),
      EquipmentShieldID: equipId("shield"),
      EquipmentBackPackID: equipId("back"),
      EquipmentGlovesID: equipId("gloves"),
      EquipmentProjectileID: equipId("projectile"),
      CurrentState: player.currentState,
      MentalClarity: 0
    });

    return { action: GameAction.PlayerEnteredChunk, payload };
  }

  /**
   * Builds an NPCEnteredChunk packet for an NPC.
   */
  buildNPCEnteredChunk(npc: NPCSpatialEntry): OutgoingPacket {
    const payload = buildNPCEnteredChunkPayload({
      EntityID: npc.id,
      NPCID: npc.definitionId,
      CurrentMapLevel: npc.mapLevel,
      X: npc.x,
      Y: npc.y,
      CurrentHitpointsLevel: npc.hitpointsLevel,
      VisibilityRequirements: npc.aggroRadius
    });

    return { action: GameAction.NPCEnteredChunk, payload };
  }

  /**
   * Builds an ItemEnteredChunk packet for a ground item.
   */
  buildItemEnteredChunk(item: ItemSpatialEntry): OutgoingPacket {
    const payload = buildItemEnteredChunkPayload({
      EntityID: item.id,
      ItemID: item.itemId,
      Amount: item.amount,
      IsIOU: item.isIOU,
      MapLevel: item.mapLevel,
      X: item.x,
      Y: item.y
    });

    return { action: GameAction.ItemEnteredChunk, payload };
  }

  /**
   * Builds an EntityExitedChunk packet.
   */
  buildEntityExitedChunk(entityRef: EntityRef): OutgoingPacket {
    const payload = buildEntityExitedChunkPayload({
      EntityID: entityRef.id,
      EntityType: entityRef.type
    });

    return { action: GameAction.EntityExitedChunk, payload };
  }

  /**
   * Builds an EntityMoveTo packet.
   */
  buildEntityMoveTo(entityRef: EntityRef, x: number, y: number): OutgoingPacket {
    const payload = buildEntityMoveToPayload({
      EntityID: entityRef.id,
      EntityType: entityRef.type,
      X: x,
      Y: y
    });

    return { action: GameAction.EntityMoveTo, payload };
  }

  /**
   * Builds a TeleportTo packet.
   * @param spellId - Spell ID for teleport animation. -1 for death respawn (no animation).
   */
  buildTeleportTo(
    entityRef: EntityRef,
    x: number,
    y: number,
    mapLevel: MapLevel,
    type: TeleportType,
    spellId?: number
  ): OutgoingPacket {
    // Use -1 for respawn type if no spellId provided, otherwise default to 15 (standard teleport)
    const resolvedSpellId = spellId !== undefined ? spellId : (type === TeleportType.Respawn ? -1 : 15);

    const payload = buildTeleportToPayload({
      EntityID: entityRef.id,
      EntityType: entityRef.type,
      X: x,
      Y: y,
      MapLevel: mapLevel,
      Type: type,
      SpellID: resolvedSpellId
    });

    return { action: GameAction.TeleportTo, payload };
  }

  /**
   * Builds a StartedTargeting packet.
   */
  buildStartedTargeting(entityRef: EntityRef, target: EntityRef): OutgoingPacket {
    const payload = buildStartedTargetingPayload({
      EntityID: entityRef.id,
      EntityType: entityRef.type,
      TargetID: target.id,
      TargetType: target.type
    });

    return { action: GameAction.StartedTargeting, payload };
  }

  /**
   * Builds a StoppedTargeting packet.
   */
  buildStoppedTargeting(entityRef: EntityRef): OutgoingPacket {
    const payload = buildStoppedTargetingPayload({
      EntityID: entityRef.id,
      EntityType: entityRef.type
    });

    return { action: GameAction.StoppedTargeting, payload };
  }

  /**
   * Builds an EnteredIdleState packet.
   */
  buildEnteredIdleState(entityRef: EntityRef): OutgoingPacket {
    const payload = buildEnteredIdleStatePayload({
      EntityID: entityRef.id,
      EntityType: entityRef.type
    });

    return { action: GameAction.EnteredIdleState, payload };
  }

  /**
   * Builds a WentThroughDoor packet for door animation.
   */
  buildWentThroughDoor(doorEntityId: number, playerId: number): OutgoingPacket {
    const payload = buildWentThroughDoorPayload({
      DoorEntityTypeID: doorEntityId,
      EntityID: playerId
    });

    return { action: GameAction.WentThroughDoor, payload };
  }

  // ============================================================================
  // Helpers
  // ============================================================================

  /**
   * Calculates combat level from player skills.
   * 
   */
  public static calculateCombatLevel(player: PlayerState): number {
    if (player.playerType === 1) return 999;

    const skills = player.skills;
    return Math.floor(
      (skills.hitpoints.level +
        skills.accuracy.level +
        skills.strength.level +
        skills.defense.level +
        skills.magic.level / 4 +
        skills.range.level / 4) /
      3.75
    );
  }
}
