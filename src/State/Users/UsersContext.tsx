import { User } from "../../Types/User";
import React, { FC } from "react";
import { SET_PLAYERS, UsersActionTypes } from "./UsersActions";
import { BaseContext, getContext, getReducer } from "../GeneralContext";

export interface IUsersState {
  users: Array<User>;
}

export const initialUsersState: IUsersState = {
  users: [],
};

export const UsersContext =
  React.createContext<BaseContext<IUsersState, UsersActionTypes>>(undefined);

function usersReducer(
  state: IUsersState,
  action: UsersActionTypes
): IUsersState {
  switch (action.type) {
    case SET_PLAYERS:
      return {
        ...state,
        users: action.payload.users,
      };
    case "KICK_PLAYER":
    default:
      return state;
  }
}

const UsersProvider: FC = ({ children }) => {
  return (
    <UsersContext.Provider value={getReducer(usersReducer, initialUsersState)}>
      {children}
    </UsersContext.Provider>
  );
};

function useUsers() {
  return getContext(UsersContext);
}

export { useUsers, UsersProvider };
