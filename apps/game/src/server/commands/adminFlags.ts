import { MessageStyle } from "../../protocol/enums/MessageStyle";
import type { CommandContext, CommandHandler } from "./types";

export const godCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const state = ctx.getPlayerState(ctx.userId);
  if (!state) return;

  state.godMode = !state.godMode;
  ctx.reply(`God mode is now ${state.godMode ? 'ON' : 'OFF'}.`, MessageStyle.Green);
};

export const notargetCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const state = ctx.getPlayerState(ctx.userId);
  if (!state) return;

  state.noTarget = !state.noTarget;
  ctx.reply(`No Target mode is now ${state.noTarget ? 'ON' : 'OFF'}.`, MessageStyle.Green);
};

export const invisCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const state = ctx.getPlayerState(ctx.userId);
  if (!state) return;

  state.invisible = !state.invisible;
  ctx.reply(`Invisibility is now ${state.invisible ? 'ON' : 'OFF'}.`, MessageStyle.Green);
  
  // Teleport the player to their current position to force a visibility update
  // This makes them instantly disappear or appear to other players
  ctx.teleportPlayer(ctx.userId, state.x, state.y, state.mapLevel);
};

export const instakillCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const state = ctx.getPlayerState(ctx.userId);
  if (!state) return;

  state.instakill = !state.instakill;
  ctx.reply(`Instakill mode is now ${state.instakill ? 'ON' : 'OFF'}.`, MessageStyle.Green);
};

export const leapCommand: CommandHandler = (ctx: CommandContext, args: string[]) => {
  const state = ctx.getPlayerState(ctx.userId);
  if (!state) return;

  state.leapMode = !state.leapMode;
  ctx.reply(`Leap mode is now ${state.leapMode ? 'ON' : 'OFF'}.`, MessageStyle.Green);
};
