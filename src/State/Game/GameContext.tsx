import { createContext, FC } from "react";
import {
  BaseContext,
  useGenericContext,
  useGenericReducer,
} from "../GeneralContext";
import { IGameState, initialGameState } from "./GameState";
import { GameActions } from "./GameActions";

// export interface IGameContext {
//   game: Game;
//   judge: User;
//   blackCard: BlackCard;
//
//   setGame: setState<Game>;
//   setBlackCard: setState<BlackCard>;
//   setJudge: setState<User>;
//
//   updateGameStateCallback: (data: UpdateGameState) => void;
// }
//
// export const initialState: IGameContext = {
//   judge: {
//     id: 0,
//     name: "",
//     whiteCards: [],
//     hasSubmittedWhiteCards: false,
//   },
//   game: {
//     id: "",
//     name: "",
//     judge_id: 0,
//     code: "",
//   },
//   blackCard: {
//     id: 0,
//     text: "",
//     pick: 0,
//     expansion_id: 0,
//   },
//
//   setGame: (game) => {},
//   setBlackCard: () => {},
//   setJudge: () => {},
//
//   updateGameStateCallback: () => {},
// };

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
