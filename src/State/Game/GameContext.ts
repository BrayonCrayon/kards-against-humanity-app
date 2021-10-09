import {createContext} from "react";
import {WhiteCard} from "../../Types/WhiteCard";
import {Game} from "../../Types/Game";

export interface IGameContext {
    hand: WhiteCard[];
    game: Game;
}

export const initialState: IGameContext = {
    hand: [],
    game: {
        id: "",
        name: "",
        judge_id: 0,
    }
}

export const GameContext = createContext<IGameContext>(initialState);

