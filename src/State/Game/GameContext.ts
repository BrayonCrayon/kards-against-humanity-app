import {createContext} from "react";
import {WhiteCard} from "../../Types/WhiteCard";

export interface IGameContext {
    hand: WhiteCard[];
}

export const initialState: IGameContext = {
    hand: []
}

export const GameContext = createContext<IGameContext>(initialState);

