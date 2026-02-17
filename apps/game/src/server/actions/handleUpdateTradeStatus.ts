import { decodeUpdateTradeStatusPayload } from "../../protocol/packets/actions/UpdateTradeStatus";
import type { ActionHandler } from "./types";

export const handleUpdateTradeStatus: ActionHandler = (ctx, actionData) => {
  if (ctx.userId === null) {
    return;
  }

  const payload = decodeUpdateTradeStatusPayload(actionData);
  const status = Number(payload.Status);
  if (!Number.isInteger(status)) {
    return;
  }

  ctx.tradingService.updateTradeStatus(ctx.userId, status);
};
