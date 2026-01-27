import { assertIsArray, type PacketArray } from "../../codec/arrayCodec";
import { PlayerEnteredChunkFields } from "../../fields/actions/PlayerEnteredChunkFields";

/** Auto-generated from `apps/game/gameActionFactory.js` (PlayerEnteredChunk) */
export type PlayerEnteredChunkPayload = {
  EntityID: unknown;
  EntityTypeID: unknown;
  PlayerType: unknown;
  Username: unknown;
  CombatLevel: unknown;
  HitpointsLevel: unknown;
  CurrentHitpointsLevel: unknown;
  MapLevel: unknown;
  X: unknown;
  Y: unknown;
  HairStyleID: unknown;
  BeardStyleID: unknown;
  ShirtID: unknown;
  BodyTypeID: unknown;
  LegsID: unknown;
  EquipmentHeadID: unknown;
  EquipmentBodyID: unknown;
  EquipmentLegsID: unknown;
  EquipmentBootsID: unknown;
  EquipmentNecklaceID: unknown;
  EquipmentWeaponID: unknown;
  EquipmentShieldID: unknown;
  EquipmentBackPackID: unknown;
  EquipmentGlovesID: unknown;
  EquipmentProjectileID: unknown;
  CurrentState: unknown;
  MentalClarity: unknown;
};

export function decodePlayerEnteredChunkPayload(payload: unknown): PlayerEnteredChunkPayload {
  assertIsArray(payload, "PlayerEnteredChunk payload");
  const arr = payload as PacketArray;
  return {
    EntityID: arr[PlayerEnteredChunkFields.EntityID] as any,
    EntityTypeID: arr[PlayerEnteredChunkFields.EntityTypeID] as any,
    PlayerType: arr[PlayerEnteredChunkFields.PlayerType] as any,
    Username: arr[PlayerEnteredChunkFields.Username] as any,
    CombatLevel: arr[PlayerEnteredChunkFields.CombatLevel] as any,
    HitpointsLevel: arr[PlayerEnteredChunkFields.HitpointsLevel] as any,
    CurrentHitpointsLevel: arr[PlayerEnteredChunkFields.CurrentHitpointsLevel] as any,
    MapLevel: arr[PlayerEnteredChunkFields.MapLevel] as any,
    X: arr[PlayerEnteredChunkFields.X] as any,
    Y: arr[PlayerEnteredChunkFields.Y] as any,
    HairStyleID: arr[PlayerEnteredChunkFields.HairStyleID] as any,
    BeardStyleID: arr[PlayerEnteredChunkFields.BeardStyleID] as any,
    ShirtID: arr[PlayerEnteredChunkFields.ShirtID] as any,
    BodyTypeID: arr[PlayerEnteredChunkFields.BodyTypeID] as any,
    LegsID: arr[PlayerEnteredChunkFields.LegsID] as any,
    EquipmentHeadID: arr[PlayerEnteredChunkFields.EquipmentHeadID] as any,
    EquipmentBodyID: arr[PlayerEnteredChunkFields.EquipmentBodyID] as any,
    EquipmentLegsID: arr[PlayerEnteredChunkFields.EquipmentLegsID] as any,
    EquipmentBootsID: arr[PlayerEnteredChunkFields.EquipmentBootsID] as any,
    EquipmentNecklaceID: arr[PlayerEnteredChunkFields.EquipmentNecklaceID] as any,
    EquipmentWeaponID: arr[PlayerEnteredChunkFields.EquipmentWeaponID] as any,
    EquipmentShieldID: arr[PlayerEnteredChunkFields.EquipmentShieldID] as any,
    EquipmentBackPackID: arr[PlayerEnteredChunkFields.EquipmentBackPackID] as any,
    EquipmentGlovesID: arr[PlayerEnteredChunkFields.EquipmentGlovesID] as any,
    EquipmentProjectileID: arr[PlayerEnteredChunkFields.EquipmentProjectileID] as any,
    CurrentState: arr[PlayerEnteredChunkFields.CurrentState] as any,
    MentalClarity: arr[PlayerEnteredChunkFields.MentalClarity] as any,
  };
}

export function buildPlayerEnteredChunkPayload(data: PlayerEnteredChunkPayload): unknown[] {
  const arr: unknown[] = new Array(27);
  arr[PlayerEnteredChunkFields.EntityID] = data.EntityID;
  arr[PlayerEnteredChunkFields.EntityTypeID] = data.EntityTypeID;
  arr[PlayerEnteredChunkFields.PlayerType] = data.PlayerType;
  arr[PlayerEnteredChunkFields.Username] = data.Username;
  arr[PlayerEnteredChunkFields.CombatLevel] = data.CombatLevel;
  arr[PlayerEnteredChunkFields.HitpointsLevel] = data.HitpointsLevel;
  arr[PlayerEnteredChunkFields.CurrentHitpointsLevel] = data.CurrentHitpointsLevel;
  arr[PlayerEnteredChunkFields.MapLevel] = data.MapLevel;
  arr[PlayerEnteredChunkFields.X] = data.X;
  arr[PlayerEnteredChunkFields.Y] = data.Y;
  arr[PlayerEnteredChunkFields.HairStyleID] = data.HairStyleID;
  arr[PlayerEnteredChunkFields.BeardStyleID] = data.BeardStyleID;
  arr[PlayerEnteredChunkFields.ShirtID] = data.ShirtID;
  arr[PlayerEnteredChunkFields.BodyTypeID] = data.BodyTypeID;
  arr[PlayerEnteredChunkFields.LegsID] = data.LegsID;
  arr[PlayerEnteredChunkFields.EquipmentHeadID] = data.EquipmentHeadID;
  arr[PlayerEnteredChunkFields.EquipmentBodyID] = data.EquipmentBodyID;
  arr[PlayerEnteredChunkFields.EquipmentLegsID] = data.EquipmentLegsID;
  arr[PlayerEnteredChunkFields.EquipmentBootsID] = data.EquipmentBootsID;
  arr[PlayerEnteredChunkFields.EquipmentNecklaceID] = data.EquipmentNecklaceID;
  arr[PlayerEnteredChunkFields.EquipmentWeaponID] = data.EquipmentWeaponID;
  arr[PlayerEnteredChunkFields.EquipmentShieldID] = data.EquipmentShieldID;
  arr[PlayerEnteredChunkFields.EquipmentBackPackID] = data.EquipmentBackPackID;
  arr[PlayerEnteredChunkFields.EquipmentGlovesID] = data.EquipmentGlovesID;
  arr[PlayerEnteredChunkFields.EquipmentProjectileID] = data.EquipmentProjectileID;
  arr[PlayerEnteredChunkFields.CurrentState] = data.CurrentState;
  arr[PlayerEnteredChunkFields.MentalClarity] = data.MentalClarity;
  return arr;
}
