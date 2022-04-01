import React, { useCallback, useState } from "react";
import { GameContext, initialState } from "./GameContext";
import { UpdateGameState } from "../../Services/PusherService";
import useFetchGameState from "../../Hooks/Game/useFetchGameState";

const GameContextProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState(initialState.game);
  const [judge, setJudge] = useState(initialState.judge);
  const [blackCard, setBlackCard] = useState(initialState.blackCard);

  const fetchGameState = useFetchGameState(setGame, setBlackCard, setJudge);

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
        judge,
        blackCard,
        setGame,
        setJudge,
        setBlackCard,
        updateGameStateCallback,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
