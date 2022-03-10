import React, { Context, useReducer } from "react";

export abstract class BaseAction<T, PayloadType> {
  payload: PayloadType;

  public constructor(payload: PayloadType) {
    this.payload = payload;
  }

  abstract execute: (state: T) => T;
}

export type Dispatch<T> = (action: T) => void;

export type BaseContext<T, ActionType> = {
  state: T;
  dispatch: Dispatch<ActionType>;
};

export function useGenericReducer<T, R>(
  reducer: (state: T, action: R) => T,
  initialState: T
) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}

export function useGenericContext<T>(value: Context<T>) {
  const context = React.useContext(value);
  if (context === undefined) {
    throw new Error("getContext must be used within the context Provider");
  }
  return context;
}
