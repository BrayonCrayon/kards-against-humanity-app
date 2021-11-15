import React, { useState } from "react";
import { GameContext, initialState } from "./GameContext";

const GameContextProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState(initialState.game);
  const [user, setUser] = useState(initialState.user);
  const [users, setUsers] = useState(initialState.users);
  const [hand, setHand] = useState(initialState.hand);
  const [blackCard, setBlackCard] = useState(initialState.blackCard);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
