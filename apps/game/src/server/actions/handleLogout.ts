import { GameAction } from "../../protocol/enums/GameAction";
import { buildLoggedOutPayload } from "../../protocol/packets/actions/LoggedOut";
import type { ActionHandler } from "./types";

/**
 * Handles player logout requests.
 * Note: The actual cleanup is handled by the socket disconnect handler in GameServer.
 * This just sends the LoggedOut packet and disconnects the socket.
 */
export const handleLogout: ActionHandler = async (ctx, actionData) => {
  if (ctx.userId === null) return;

  const playerState = ctx.playerStatesByUserId.get(ctx.userId);
  if (!playerState) return;

  if (playerState.wasHitWithin(10_000)) {
    ctx.messageService.sendServerInfo(
      ctx.userId,
      "You cannot logout within 10 seconds of being in combat"
    );
    return;
  }

  // Mark this as an intentional/logout-request disconnect so GameServer can
  // distinguish it from an unclean client disconnect.
  const socketData = ctx.socket.data as {
    logoutRequested?: boolean;
    disconnectSource?: "player_logout";
    disconnectNote?: string;
  };
  socketData.logoutRequested = true;
  socketData.disconnectSource = "player_logout";
  socketData.disconnectNote = "Player requested logout";

  ctx.socket.emit(
    GameAction.LoggedOut.toString(),
    buildLoggedOutPayload({ EntityID: ctx.userId })
  );

  // Socket disconnect will trigger cleanupConnectedUser in GameServer
  ctx.socket.disconnect(true);
};
