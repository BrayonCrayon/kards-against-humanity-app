import React, {useCallback, useState} from "react";
import {GameContext, initialState} from "./GameContext";
import {UpdateGameState} from "../../Services/PusherService";
import useFetchGameState from "../../Hooks/Game/useFetchGameState";

const GameContextProvider: React.FC = ({children}) => {
    const [game, setGame] = useState(initialState.game);
    const [user, setUser] = useState(initialState.user);
    const [hand, setHand] = useState(initialState.hand);
    const [judge, setJudge] = useState(initialState.judge);
    const [blackCard, setBlackCard] = useState(initialState.blackCard);
    const [hasSubmittedCards, setHasSubmittedCards] = useState(
        initialState.hasSubmittedCards
    );

  const fetchGameState = useFetchGameState(
    setUser,
    setGame,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge
  );

  const updateGameStateCallback = useCallback(
    async (data: UpdateGameState) => {
      await fetchGameState(data.gameId);
    },
    [fetchGameState]
  );

  return (
    <GameContext.Provider
      value={{
        game,
        user,
        judge,
        hand,
        blackCard,
        hasSubmittedCards,
        setGame,
        setUser,
        setJudge,
        setHand,
        setBlackCard,
        setHasSubmittedCards,
        updateGameStateCallback,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
