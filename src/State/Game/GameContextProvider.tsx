import React, { useState } from "react";
import { GameContext, IGameContext, initialState } from "./GameContext";

const GameContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<IGameContext>(initialState);

  return <GameContext.Provider value={state}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
