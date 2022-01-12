import { render, RenderResult } from "@testing-library/react";
import {
  GameContext,
  IGameContext,
  initialState,
} from "../State/Game/GameContext";
import GameContextProvider from "../State/Game/GameContextProvider";

export const customGameWrapperRender = (
  children: JSX.Element,
  value?: Partial<IGameContext>
): RenderResult => {
  return render(
    <GameContext.Provider
      value={{
        ...initialState,
        ...value,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const gameWrapperRender = (children: JSX.Element): RenderResult => {
  return render(<GameContextProvider>{children}</GameContextProvider>);
};
