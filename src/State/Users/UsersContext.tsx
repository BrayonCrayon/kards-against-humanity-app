import { User } from "../../Types/User";
import React, { FC, useReducer } from "react";
import { SET_PLAYERS, UsersActionTypes } from "./UsersActions";
import { getContext, getReducer } from "../GeneralContext";

export interface IUsersState {
  users: Array<User>;
}

export const initialUsersState: IUsersState = {
  users: [],
};

type Dispatch = (action: UsersActionTypes) => void;

export const UsersContext = React.createContext<
  { state: IUsersState; dispatch: Dispatch } | undefined
>(undefined);

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
  const value = getReducer(usersReducer, initialUsersState);
  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

function useUsers() {
  return getContext(UsersContext);
}

export { useUsers, UsersProvider };
