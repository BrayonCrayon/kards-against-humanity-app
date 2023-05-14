import { BaseContext, useGenericReducer } from "../GeneralContext";
import { IHandState, initialHandState } from "./HandState";
import { HandActionTypes } from "State/Hand/HandActions";
import React, {FC, PropsWithChildren} from "react";

export const HandContext = React.createContext<
  BaseContext<IHandState, HandActionTypes>
>({
  state: initialHandState,
  dispatch: () => {},
});

function handReducer(state: IHandState, action: HandActionTypes): IHandState {
  return action.execute(state);
}

const HandProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <HandContext.Provider
      value={useGenericReducer(handReducer, initialHandState)}
    >
      {children}
    </HandContext.Provider>
  );
};

export { HandProvider };
