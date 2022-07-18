import { render, RenderResult } from "@testing-library/react";
import { GameProvider } from "State/Game/GameContext";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { VoteProvider } from "State/Vote/VoteContext";
import { PlayersProvider } from "State/Players/PlayersContext";
import { HandProvider } from "State/Hand/HandContext";
import { AuthProvider } from "State/Auth/AuthContext";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";

export const history = createMemoryHistory();
history.push = jest.fn();

export const kardsRender = (children: JSX.Element): RenderResult => {
  return render(
    <Router history={history}>
      <GameProvider>
        <AuthProvider>
          <HandProvider>
            <VoteProvider>
              <PlayersProvider>{children}</PlayersProvider>
            </VoteProvider>
          </HandProvider>
        </AuthProvider>
      </GameProvider>
    </Router>
  );
};

export const kardsHookRender = <TProps, TResult>(
  callback: (props: TProps) => TResult
) => {
  return renderHook(callback, {
    wrapper: ({ children }) => (
      <Router history={history}>
        <GameProvider>
          <AuthProvider>
            <HandProvider>
              <VoteProvider>
                <PlayersProvider>{children}</PlayersProvider>
              </VoteProvider>
            </HandProvider>
          </AuthProvider>
        </GameProvider>
      </Router>
    ),
  });
};
