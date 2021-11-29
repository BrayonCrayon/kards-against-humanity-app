import React, { useCallback, useState } from "react";
import { GameContext, initialState } from "./GameContext";
import { apiClient } from "../../Api/apiClient";
import { Game } from "../../Types/Game";
import {
  listenWhenUserJoinsGame,
  UserJoinedGameData,
} from "../../Services/PusherService";
import useFetchGameState from "../../Hooks/Game/UseFetchGameState";

const GameContextProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState(initialState.game);
  const [user, setUser] = useState(initialState.user);
  const [users, setUsers] = useState(initialState.users);
  const [hand, setHand] = useState(initialState.hand);
  const [blackCard, setBlackCard] = useState(initialState.blackCard);

  const fetchGameState = useFetchGameState();

  const userJoinedGameCallback = useCallback(
    async (dataish: UserJoinedGameData) => {
      const data = await fetchGameState(dataish.gameId);

      setUser(data.current_user);
      setUsers(data.users);
      setGame({
        id: data.id,
        judge_id: data.judge.id,
        name: data.name,
        code: data.code,
      } as Game);
      setHand(data.hand);
      setBlackCard(data.current_black_card);
    },
    []
  );

  return (
    <GameContext.Provider
      value={{
        game,
        user,
        users,
        hand,
        blackCard,
        setGame,
        setUser,
        setUsers,
        setHand,
        setBlackCard,
        userJoinedGameCallback,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
