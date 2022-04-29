import {initialUserObject, User} from "../../Types/User";

export interface IUserState {
  user: User;
  hasSubmittedCards: boolean;
}

export const initialUserState: IUserState = {
  user: initialUserObject(),
  hasSubmittedCards: false,
};
