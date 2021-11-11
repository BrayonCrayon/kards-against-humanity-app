import { fireEvent, render, wait, waitFor } from "@testing-library/react";
import { GameContext, initialState } from "../State/Game/GameContext";
import GamePage from "../Pages/GamePage";
import { CreateGamePage } from "../Pages/CreateGamePage";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../Api/apiClient";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("JoinGameSection", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({ gameStateExampleResponse });
  });

  it("renders", () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <CreateGamePage />
      </GameContext.Provider>
    );

    expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
  });

  it("Check if form is displayed", async () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <CreateGamePage />
      </GameContext.Provider>
    );
    expect(wrapper.queryByTestId("join-game-form")).not.toBeNull();

    const nameInput = wrapper.getByTestId("join-game-name-input");
    const codeInput = wrapper.getByTestId("join-game-code-input");

    fireEvent.change(nameInput, { target: { value: "joe" } });
    fireEvent.change(codeInput, { target: { value: "1234" } });

    const submit = wrapper.getByTestId("join-game-form-submit");
    userEvent.click(submit);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/game/1234/join", {
        name: "joe",
      });
    });
  });
});
