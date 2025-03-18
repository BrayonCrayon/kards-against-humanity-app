import { BaseAction } from "../GeneralContext";
import { IAuthState } from "@/State/Auth/AuthState";
import { User } from "@/Types/User";

export class SetAuthAction extends BaseAction<IAuthState, User> {
  execute = (state: IAuthState): IAuthState => ({
    ...state,
    auth: this.payload,
  });
}

export class SetHasSubmittedCards extends BaseAction<IAuthState, boolean> {
  execute = (state: IAuthState): IAuthState => ({
    ...state,
    hasSubmittedCards: this.payload,
  });
}

export class IncrementRedrawCount extends BaseAction<IAuthState, number> {
  execute = (state: IAuthState): IAuthState => ({
    ...state,
    auth: {
      ...state.auth,
      redrawCount: state.auth.redrawCount + this.payload
    }
  })
}

export type AuthActions = SetAuthAction | SetHasSubmittedCards | IncrementRedrawCount;
