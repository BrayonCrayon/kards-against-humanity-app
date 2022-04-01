import { createContext } from "react";
import { Game } from "../../Types/Game";
import { User } from "../../Types/User";
import { BlackCard } from "../../Types/BlackCard";
import { setState } from "../GeneralTypes";
import { UpdateGameState } from "../../Services/PusherService";

export interface IGameContext {
  game: Game;
  judge: User;
  blackCard: BlackCard;

  setGame: setState<Game>;
  setBlackCard: setState<BlackCard>;
  setJudge: setState<User>;

  updateGameStateCallback: (data: UpdateGameState) => void;
}

export const initialState: IGameContext = {
  judge: {
    id: 0,
    name: "",
    whiteCards: [],
    hasSubmittedWhiteCards: false,
  },
  game: {
    id: "",
    name: "",
    judge_id: 0,
    code: "",
  },
  blackCard: {
    id: 0,
    text: "",
    pick: 0,
    expansion_id: 0,
  },

  setGame: (game) => {},
  setBlackCard: () => {},
  setJudge: () => {},

  updateGameStateCallback: () => {},
};

export const GameContext = createContext<IGameContext>(initialState);
