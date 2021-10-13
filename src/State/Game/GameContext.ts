import {createContext, SetStateAction, Dispatch} from "react";
import {WhiteCard} from "../../Types/WhiteCard";
import {Game} from "../../Types/Game";
import {User} from "../../Types/User";

export interface IGameContext {
    hand: WhiteCard[];
    game: Game;
    user: User;
    setGame: Dispatch<SetStateAction<Game>>;
    setUser: (user: User) => void;
    setHand: (hand: WhiteCard[]) => void;
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
