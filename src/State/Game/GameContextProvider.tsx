import React, {useCallback, useState} from "react";
import {GameContext, IGameContext, initialState} from "./GameContext";
import {Game} from "../../Types/Game";
import {User} from "../../Types/User";
import {WhiteCard} from "../../Types/WhiteCard";

const GameContextProvider: React.FC = ({children}) => {
    const [game, setGame] = useState(initialState.game);
    const [user, setUser] = useState(initialState.user);
    const [hand, setHand] = useState(initialState.hand);

    // const setGame = (game: Game) => {
    //     setRealGame(game);
    // }

    // const setUser = useCallback((user: User) => {
    //     setContextUser(user);
    // }, []);

    // const setHand = useCallback((hand: WhiteCard[]) => {
    //     setContextHand(hand);
    // }, []);


    return <GameContext.Provider
        value={{
            game,
            user,
            hand,
            setGame,
            setUser,
            setHand
        }}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
