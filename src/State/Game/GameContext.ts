import { createContext, SetStateAction, Dispatch } from "react";
import { WhiteCard } from "../../Types/WhiteCard";
import { Game } from "../../Types/Game";
import { User } from "../../Types/User";
import { BlackCard } from "../../Types/BlackCard";

export type setState<T> = Dispatch<SetStateAction<T>>;

export interface IGameContext {
  hand: WhiteCard[];
  game: Game;
  user: User;
  blackCard: BlackCard;
  users: User[];
  setGame: setState<Game>;
  setUser: setState<User>;
  setUsers: setState<User[]>;
  setHand: setState<WhiteCard[]>;
  setBlackCard: setState<BlackCard>;
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
  setGame: (game) => {},
  setUser: (user) => {},
  setUsers: (user) => {},
  setHand: (hand) => {},
  setBlackCard: () => {},
};

export const GameContext = createContext<IGameContext>(initialState);
