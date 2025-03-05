import { render, renderHook, RenderResult } from "@testing-library/react";
import { GameProvider } from "@/State/Game/GameContext";
// import { MemoryRouter } from "react-router-dom";
import { VoteProvider } from "@/State/Vote/VoteContext";
import { PlayersProvider } from "@/State/Players/PlayersContext";
import { HandProvider } from "@/State/Hand/HandContext";
import { AuthProvider } from "@/State/Auth/AuthContext";
import React, { ReactNode } from "react";

export const kardsRender = (children: ReactNode): RenderResult => render(
  // <MemoryRouter>
    <GameProvider>
      <AuthProvider>
        <HandProvider>
          <VoteProvider>
            <PlayersProvider>
              {children}
            </PlayersProvider>
          </VoteProvider>
        </HandProvider>
      </AuthProvider>
    </GameProvider>,
  // </MemoryRouter>,
);

export const kardsHookRender = <TProps, TResult>(callback: (props: TProps) => TResult, props?: TProps) => renderHook(callback, {
    wrapper: ({ children }) => (
        <GameProvider>
          <AuthProvider>
            <HandProvider>
              <VoteProvider>
                <PlayersProvider>
                  {children}
                </PlayersProvider>
              </VoteProvider>
            </HandProvider>
          </AuthProvider>
        </GameProvider>
    ),
    initialProps: props
  });
