import React, { Context, useReducer } from "react";
import { VoteContext } from "./Vote/VoteContext";

export interface BaseAction {
  type: string;
  payload: object;
}

export type Dispatch<T> = (action: T) => void;

export type BaseContext<T, ActionType> =
  | {
      state: T;
      dispatch: Dispatch<ActionType>;
    }
  | undefined;

export function getReducer<T, R>(
  reducer: (state: T, action: R) => T,
  initialState: T
) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

export function getContext<T>(value: Context<T>) {
  const context = React.useContext(value);
  if (context === undefined) {
    throw new Error("getContext must be used within the context Provider");
  }
  return context;
}
