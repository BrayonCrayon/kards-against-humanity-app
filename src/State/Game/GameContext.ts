import { createContext } from "react";
import { Game } from "../../Types/Game";
import { User } from "../../Types/User";
import { BlackCard } from "../../Types/BlackCard";
import { setState } from "../GeneralTypes";
import { UpdateGameState } from "../../Services/PusherService";

export interface IGameContext {
  game: Game;
  user: User;
  judge: User;
  blackCard: BlackCard;
  hasSubmittedCards: boolean;

  setGame: setState<Game>;
  setUser: setState<User>;
  setBlackCard: setState<BlackCard>;
  setHasSubmittedCards: setState<boolean>;
  setJudge: setState<User>;

  updateGameStateCallback: (data: UpdateGameState) => void;
}

export const initialState: IGameContext = {
  user: {
    id: 0,
    name: "",
    whiteCards: [],
    hasSubmittedWhiteCards: false,
  },
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
  hasSubmittedCards: false,

  setGame: (game) => {},
  setUser: (user) => {},
  setBlackCard: () => {},
  setHasSubmittedCards: () => {},
  setJudge: () => {},

  updateGameStateCallback: () => {},
};

export const GameContext = createContext<IGameContext>(initialState);
