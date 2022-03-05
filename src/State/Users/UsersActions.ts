import {Action} from "../Vote/VoteActions";
import {User} from "../../Types/User";


export const KICK_PLAYER = "KICK_PLAYER";
export const SET_PLAYERS = "SET_PLAYERS";

export interface KickPlayerAction extends Action {
    type: typeof KICK_PLAYER;
    payload: { userId: number }
}

export interface SetPlayersAction extends Action {
    type: typeof SET_PLAYERS;
    payload: { users: User[] }
}

export type UsersActionTypes = | KickPlayerAction | SetPlayersAction;