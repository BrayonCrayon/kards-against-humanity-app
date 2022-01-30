import { render, RenderResult } from "@testing-library/react";
import {
  GameContext,
  IGameContext,
  initialState,
} from "../State/Game/GameContext";
import GameContextProvider from "../State/Game/GameContextProvider";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { VoteProvider } from "../State/Vote/VoteContext";

export const history = createMemoryHistory();
history.push = jest.fn();

export const customGameWrapperRender = (
  children: JSX.Element,
  value?: Partial<IGameContext>
): RenderResult => {
  return render(
    <Router history={history}>
      <GameContext.Provider
        value={{
          ...initialState,
          ...value,
        }}
      >
        {children}
      </GameContext.Provider>
    </Router>
  );
};

export const gameWrapperRender = (children: JSX.Element): RenderResult => {
  return render(<GameContextProvider>{children}</GameContextProvider>);
};

export const customGameVoteRender = (
  children: JSX.Element,
  value?: Partial<IGameContext>
): RenderResult => {
  return render(
    <Router history={history}>
      <GameContext.Provider
        value={{
          ...initialState,
          ...value,
        }}
      >
        <VoteProvider>{children}</VoteProvider>
      </GameContext.Provider>
    </Router>
  );
};
