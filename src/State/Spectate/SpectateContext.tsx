import { BaseContext, useGenericReducer } from "State/GeneralContext";
import { InitialSpectateState, ISpectateState } from "State/Spectate/SpectateState";
import { createContext, FC, PropsWithChildren } from "react";
import { SpectateActionType } from "State/Spectate/SpectateActions";

export const SpectateContext = createContext<BaseContext<ISpectateState, SpectateActionType>>({
  state: InitialSpectateState,
  dispatch: () => {}
});

function SpectateReducer(
  state: ISpectateState,
  action: SpectateActionType
): ISpectateState {
  return action.execute(state);
}

const SpectateProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SpectateContext.Provider
      value={useGenericReducer(SpectateReducer, InitialSpectateState)}
    >
      {children}
    </SpectateContext.Provider>
  );
};

export { SpectateProvider };