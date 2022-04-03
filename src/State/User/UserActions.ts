import { BaseAction } from "../GeneralContext";
import { IUserState } from "./UserState";
import { User } from "../../Types/User";

export class SetUserAction extends BaseAction<IUserState, User> {
  execute = (state: IUserState): IUserState => ({
    ...state,
    user: this.payload,
  });
}

export class SetHasSubmittedCards extends BaseAction<IUserState, boolean> {
  execute = (state: IUserState): IUserState => ({
    ...state,
    hasSubmittedCards: this.payload,
  });
}

export type UserActions = SetUserAction | SetHasSubmittedCards;
