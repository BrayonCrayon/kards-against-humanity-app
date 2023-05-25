import {
  BaseContext,
  useGenericContext,
  useGenericReducer,
} from "../GeneralContext";
import { initialAuthState, IAuthState } from "State/Auth/AuthState";
import { AuthActions } from "State/Auth/AuthActions";
import React, {FC, PropsWithChildren} from "react";

export const AuthContext = React.createContext<BaseContext<IAuthState, AuthActions>>({
  state: initialAuthState,
  dispatch: () => {},
});

function authReducer(state: IAuthState, action: AuthActions): IAuthState {
  return action.execute(state);
}

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={useGenericReducer(authReducer, initialAuthState)}
    >
      {children}
    </AuthContext.Provider>
  );
};



export { AuthProvider };
