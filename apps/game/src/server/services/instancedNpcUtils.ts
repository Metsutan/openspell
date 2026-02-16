import type { NPCState } from "../state/EntityState";

export function getInstancedNpcOwnerUserId(npc: NPCState): number | null {
  return npc.instanced?.ownerUserId ?? null;
}

export function canPlayerInteractWithNpc(userId: number, npc: NPCState): boolean {
  const ownerUserId = getInstancedNpcOwnerUserId(npc);
  if (ownerUserId === null) {
    return true;
  }
  return ownerUserId === userId;
}

