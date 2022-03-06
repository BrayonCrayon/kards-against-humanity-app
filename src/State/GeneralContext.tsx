import React, { useReducer } from "react";

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
