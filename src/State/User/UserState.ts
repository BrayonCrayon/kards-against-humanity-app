import { User } from "../../Types/User";

export interface IUserState {
  user: User;
  hasSubmittedCards: boolean;
}

export const initialUserState: IUserState = {
  user: {
    id: 0,
    name: "",
    whiteCards: [],
    hasSubmittedWhiteCards: false,
  },
  hasSubmittedCards: false,
};