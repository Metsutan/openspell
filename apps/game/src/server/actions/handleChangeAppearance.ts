import { ClientActionTypes } from "../../protocol/enums/ClientActionType";
import { decodeChangeAppearancePayload } from "../../protocol/packets/actions/ChangeAppearance";
import type { ActionHandler } from "./types";

export const handleChangeAppearance: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) {
    return;
  }

  const payload = decodeChangeAppearancePayload(actionData);
  const result = ctx.changeAppearanceService.applyChangeRequest(ctx.userId, payload);
  if (result.ok) {
    return;
  }

  if (result.reason === "invalid_state") {
    return;
  }

  ctx.packetAudit?.logInvalidPacket({
    userId: ctx.userId,
    packetName: "ChangeAppearance",
    actionType: ClientActionTypes.ChangeAppearance,
    reason: result.reason ?? "rejected",
    payload
  });
};
