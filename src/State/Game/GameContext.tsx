import { createContext, FC } from "react";
import { BaseContext, useGenericReducer } from "../GeneralContext";
import { IGameState, initialGameState } from "./GameState";
import { GameActions } from "./GameActions";

export const GameContext = createContext<BaseContext<IGameState, GameActions>>({
  state: initialGameState,
  dispatch: () => {},
});

function gameReducer(state: IGameState, action: GameActions) {
  return action.execute(state);
}

const GameProvider: FC = ({ children }) => {
  return (
    <GameContext.Provider
      value={useGenericReducer(gameReducer, initialGameState)}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameProvider };
