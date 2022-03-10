import React, { FC } from "react";
import { UsersActionTypes } from "./UsersActions";
import {
  BaseContext,
  useGenericContext,
  useGenericReducer,
} from "../GeneralContext";
import { initialUsersState, IUsersState } from "./UsersState";

export const UsersContext = React.createContext<
  BaseContext<IUsersState, UsersActionTypes>
>({
  state: initialUsersState,
  dispatch: () => {},
});

function usersReducer(
  state: IUsersState,
  action: UsersActionTypes
): IUsersState {
  return action.execute(state);
}

const UsersProvider: FC = ({ children }) => {
  return (
    <UsersContext.Provider
      value={useGenericReducer(usersReducer, initialUsersState)}
    >
      {children}
    </UsersContext.Provider>
  );
};

function useUsers() {
  return useGenericContext(UsersContext);
}

export { useUsers, UsersProvider };
