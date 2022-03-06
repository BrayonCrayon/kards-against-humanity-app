import { User } from "../../Types/User";
import { BaseAction } from "../GeneralContext";
import { IUsersState } from "./UsersState";

// export const KICK_PLAYER = "KICK_PLAYER";
// export const SET_PLAYERS = "SET_PLAYERS";

export class KickPlayerAction implements BaseAction<IUsersState> {
  userId: number;
  constructor(userId: number) {
    this.userId = userId;
  }

  execute(state: IUsersState) {
    return state;
  }
}

export class SetPlayersAction implements BaseAction<IUsersState> {
  users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  execute(state: IUsersState) {
    return {
      ...state,
      users: this.users,
    };
  }
}

export type UsersActionTypes = KickPlayerAction | SetPlayersAction;
