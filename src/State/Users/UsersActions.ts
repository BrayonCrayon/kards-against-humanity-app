import { User } from "../../Types/User";
import { BaseAction } from "../GeneralContext";
import { IUsersState } from "./UsersState";

export class KickPlayerAction extends BaseAction<IUsersState, number> {
  execute = (state: IUsersState) => state;
}

export class SetPlayersAction extends BaseAction<IUsersState, User[]> {
  execute = (state: IUsersState) => ({
    ...state,
    users: this.payload,
  });
}

export type UsersActionTypes = KickPlayerAction | SetPlayersAction;
