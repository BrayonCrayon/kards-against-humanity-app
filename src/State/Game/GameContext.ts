import { createContext } from "react";
import { WhiteCard } from "../../Types/WhiteCard";
import { Game } from "../../Types/Game";
import { User } from "../../Types/User";
import { BlackCard } from "../../Types/BlackCard";
import { setState } from "../GeneralTypes";
import { UserJoinedGameData } from "../../Services/PusherService";

export interface IGameContext {
  hand: WhiteCard[];
  game: Game;
  user: User;
  blackCard: BlackCard;
  users: User[];
  hasSubmittedCards: boolean;

  setGame: setState<Game>;
  setUser: setState<User>;
  setUsers: setState<User[]>;
  setHand: setState<WhiteCard[]>;
  setBlackCard: setState<BlackCard>;
  setHasSubmittedCards: setState<boolean>;
  setJudge: setState<User>;

  userJoinedGameCallback: (data: UserJoinedGameData) => void;
}

export const initialState: IGameContext = {
  hand: [],
  users: [],
  user: {
    id: 0,
    name: "",
    whiteCards: [],
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
  setUsers: (user) => {},
  setHand: (hand) => {},
  setBlackCard: () => {},
  setHasSubmittedCards: () => {},
  setJudge: () => {},

  userJoinedGameCallback: () => {},
};

export const GameContext = createContext<IGameContext>(initialState);
