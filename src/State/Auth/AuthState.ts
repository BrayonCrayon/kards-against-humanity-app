import { initialUserObject, User } from "@/Types/User";

export interface IAuthState {
  auth: User;
  hasSubmittedCards: boolean;
}

export const initialAuthState: IAuthState = {
  auth: initialUserObject(),
  hasSubmittedCards: false,
};
