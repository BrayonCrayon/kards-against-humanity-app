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
import { UsersProvider } from "../State/Users/UsersContext";
import { HandProvider } from "../State/Hand/HandContext";

export const history = createMemoryHistory();
history.push = jest.fn();

export const customKardsRender = (
  children: JSX.Element,
  value?: Partial<IGameContext>
): RenderResult => {
  return render(
    <Router history={history}>
      <HandProvider>
        <GameContext.Provider
          value={{
            ...initialState,
            ...value,
          }}
        >
          <VoteProvider>
            <UsersProvider>{children}</UsersProvider>
          </VoteProvider>
        </GameContext.Provider>
      </HandProvider>
    </Router>
  );
};

export const kardsRender = (children: JSX.Element): RenderResult => {
  return render(
    <Router history={history}>
      <GameContextProvider>
        <HandProvider>
          <VoteProvider>
            <UsersProvider>{children}</UsersProvider>
          </VoteProvider>
        </HandProvider>
      </GameContextProvider>
    </Router>
  );
};
