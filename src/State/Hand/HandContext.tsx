import { BaseContext, useGenericContext, useGenericReducer } from "../GeneralContext";
import { IHandState, initialHandState } from "./HandState";
import { HandActionTypes } from "./HandActionts";
import React, { FC } from "react";

export const HandContext = React.createContext<
  BaseContext<IHandState, HandActionTypes>
>({
  state: initialHandState,
  dispatch: () => {},
});

function handReducer(state: IHandState, action: HandActionTypes): IHandState {
  return action.execute(state);
}

const HandProvider: FC = ({ children }) => {
  return (
    <HandContext.Provider
      value={useGenericReducer(handReducer, initialHandState)}
    >
      {children}
    </HandContext.Provider>
  );
};

function useHand() {
  return useGenericContext(HandContext);
}

export { HandProvider, useHand };