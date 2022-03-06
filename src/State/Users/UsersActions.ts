import { User } from "../../Types/User";
import { BaseAction } from "../GeneralContext";

export const KICK_PLAYER = "KICK_PLAYER";
export const SET_PLAYERS = "SET_PLAYERS";

export interface KickPlayerAction extends BaseAction {
  type: typeof KICK_PLAYER;
  payload: { userId: number };
}

export interface SetPlayersAction extends BaseAction {
  type: typeof SET_PLAYERS;
  payload: { users: User[] };
}

export type UsersActionTypes = KickPlayerAction | SetPlayersAction;
