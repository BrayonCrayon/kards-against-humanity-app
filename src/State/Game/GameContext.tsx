import { createContext, FC } from "react";
import {
  BaseContext,
  useGenericContext,
  useGenericReducer,
} from "../GeneralContext";
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

function useGame() {
  return useGenericContext(GameContext);
}

export { useGame, GameProvider };
