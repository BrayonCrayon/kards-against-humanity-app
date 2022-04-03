import {
  BaseContext,
  useGenericContext,
  useGenericReducer,
} from "../GeneralContext";
import { initialUserState, IUserState } from "./UserState";
import { UserActions } from "./UserActions";
import React, { FC } from "react";

const UserContext = React.createContext<BaseContext<IUserState, UserActions>>({
  state: initialUserState,
  dispatch: () => {},
});

function userReducer(state: IUserState, action: UserActions): IUserState {
  return action.execute(state);
}

const UserProvider: FC = ({ children }) => {
  return (
    <UserContext.Provider
      value={useGenericReducer(userReducer, initialUserState)}
    >
      {children}
    </UserContext.Provider>
  );
};

function useUser() {
  return useGenericContext(UserContext);
}

export { useUser, UserProvider };
