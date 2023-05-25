import React, {FC, PropsWithChildren} from "react";
import { PlayersActionTypes } from "State/Players/PlayersActions";
import { BaseContext, useGenericReducer } from "../GeneralContext";
import { initialPlayersState, IPlayersState } from "State/Players/PlayersState";

export const PlayersContext = React.createContext<
  BaseContext<IPlayersState, PlayersActionTypes>
>({
  state: initialPlayersState,
  dispatch: () => {},
});

function playersReducer(
  state: IPlayersState,
  action: PlayersActionTypes
): IPlayersState {
  return action.execute(state);
}

const PlayersProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PlayersContext.Provider
      value={useGenericReducer(playersReducer, initialPlayersState)}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export { PlayersProvider };
