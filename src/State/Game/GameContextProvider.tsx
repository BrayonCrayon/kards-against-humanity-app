import React, { useCallback, useState } from "react";
import { GameContext, initialState } from "./GameContext";
import { UserJoinedGameData } from "../../Services/PusherService";
import useFetchGameState from "../../Hooks/Game/UseFetchGameState";

const GameContextProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState(initialState.game);
  const [user, setUser] = useState(initialState.user);
  const [users, setUsers] = useState(initialState.users);
  const [hand, setHand] = useState(initialState.hand);
  const [blackCard, setBlackCard] = useState(initialState.blackCard);
  const [hasSubmittedCards, setHasSubmittedCards] = useState(
    initialState.hasSubmittedCards
  );

  const fetchGameState = useFetchGameState(
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard,
    setHasSubmittedCards
  );

  const userJoinedGameCallback = useCallback(
    async (data: UserJoinedGameData) => {
      await fetchGameState(data.gameId);
    },
    [fetchGameState]
  );

  return (
    <GameContext.Provider
      value={{
        game,
        user,
        users,
        hand,
        blackCard,
        hasSubmittedCards,
        setGame,
        setUser,
        setUsers,
        setHand,
        setBlackCard,
        setHasSubmittedCards,
        userJoinedGameCallback,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
