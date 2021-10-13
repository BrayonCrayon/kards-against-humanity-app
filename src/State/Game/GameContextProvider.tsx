import React, {useCallback, useState} from "react";
import { GameContext, IGameContext, initialState } from "./GameContext";
import {Game} from "../../Types/Game";
import {User} from "../../Types/User";
import {WhiteCard} from "../../Types/WhiteCard";

const GameContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<IGameContext>(initialState);

  const [game, setRealGame] = useState<Game>(initialState.game);

  const setGame = (game: Game) => {
    setRealGame(game)
  }

  const setUser = useCallback((user: User) => {
    setState({
      ...state,
      user
    });
  }, []);

  const setHand = useCallback((hand: WhiteCard[]) => {
    setState({
      ...state,
      hand
    });
  }, []);


  return <GameContext.Provider value={{...state, game, setGame, setUser, setHand}}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
