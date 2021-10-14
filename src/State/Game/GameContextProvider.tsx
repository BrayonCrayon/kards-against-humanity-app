import React, { useState } from "react";
import { GameContext, initialState } from "./GameContext";

const GameContextProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState(initialState.game);
  const [user, setUser] = useState(initialState.user);
  const [hand, setHand] = useState(initialState.hand);

  return (
    <GameContext.Provider
      value={{
        game,
        user,
        hand,
        setGame,
        setUser,
        setHand,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
