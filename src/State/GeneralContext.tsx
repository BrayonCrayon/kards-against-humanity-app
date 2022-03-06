import React, { Context, useReducer } from "react";

export interface BaseAction<T> {
  execute: (state: T) => T;
}

export type Dispatch<T> = (action: T) => void;

export type BaseContext<T, ActionType> = {
  state: T;
  dispatch: Dispatch<ActionType>;
};

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
