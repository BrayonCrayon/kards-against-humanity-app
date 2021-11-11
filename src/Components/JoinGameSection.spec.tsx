import { render } from "@testing-library/react";
import { GameContext, initialState } from "../State/Game/GameContext";
import GamePage from "../Pages/GamePage";
import { CreateGamePage } from "../Pages/CreateGamePage";

describe("JoinGameSection", () => {
  it("renders", () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <CreateGamePage />
      </GameContext.Provider>
    );

    expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
  });

  it("Check if form is displayed", () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <CreateGamePage />
      </GameContext.Provider>
    );
    expect(wrapper.queryByTestId("join-game-form")).not.toBeNull();
  });
});
