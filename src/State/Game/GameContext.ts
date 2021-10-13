import {createContext} from "react";
import {WhiteCard} from "../../Types/WhiteCard";
import {Game} from "../../Types/Game";
import {User} from "../../Types/User";

export interface IGameContext {
    hand: WhiteCard[];
    game: Game;
    user: User;
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
};

export const GameContext = createContext<IGameContext>(initialState);
