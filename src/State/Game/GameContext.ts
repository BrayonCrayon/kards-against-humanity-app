import {createContext, SetStateAction, Dispatch} from "react";
import {WhiteCard} from "../../Types/WhiteCard";
import {Game} from "../../Types/Game";
import {User} from "../../Types/User";

export type setState<T> = Dispatch<SetStateAction<T>>;

export interface IGameContext {
    hand: WhiteCard[];
    game: Game;
    user: User;
    setGame: setState<Game>;
    setUser: setState<User>;
    setHand: setState<WhiteCard[]>;
}

export const initialState: IGameContext = {
    hand: [],
    user: {
        id: 0,
        name: "",
        whiteCards: []
    },
    game: {
        id: "",
        name: "",
        judge_id: 0,
    },
    setGame: (game) => {},
    setUser: (user) => {},
    setHand: (hand) => {}
};

export const GameContext = createContext<IGameContext>(initialState);
