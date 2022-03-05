import {Action} from "../Vote/VoteActions";


export const KICK_PLAYER = "KICK_PLAYER";

export interface KickPlayerAction extends Action {
    type: typeof KICK_PLAYER;
    payload: { userId: number }
}

export type UsersActionTypes = KickPlayerAction;