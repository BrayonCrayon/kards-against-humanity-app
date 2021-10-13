import React, {useCallback, useState} from "react";
import {GameContext, IGameContext, initialState} from "./GameContext";
import {Game} from "../../Types/Game";
import {User} from "../../Types/User";
import {WhiteCard} from "../../Types/WhiteCard";

const GameContextProvider: React.FC = ({children}) => {
    const [game, setRealGame] = useState(initialState.game);
    const [user, setContextUser] = useState(initialState.user);
    const [hand, setContextHand] = useState(initialState.hand);

    const setGame = (game: Game) => {
        setRealGame(game);
    }

    const setUser = useCallback((user: User) => {
        setContextUser(user);
    }, []);

    const setHand = useCallback((hand: WhiteCard[]) => {
        setContextHand(hand);
    }, []);


    return <GameContext.Provider
        value={{
            game,
            user,
            hand,
            setGame: setRealGame,
            setUser,
            setHand
        }}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
