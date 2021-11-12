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
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders", () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <CreateGamePage />
      </GameContext.Provider>
    );

    expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
  });

  it("submits form with username and game code", async () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <CreateGamePage />
      </GameContext.Provider>
    );
    const userName = "Joe";
    const code = "1234";
    expect(wrapper.queryByTestId("join-game-form")).not.toBeNull();

    const nameInput = wrapper.queryByTestId("join-game-name-input");
    expect(nameInput).not.toBeNull();
    userEvent.type(nameInput!, userName);

    const codeInput = wrapper.queryByTestId("join-game-code-input");
    expect(codeInput).not.toBeNull();
    userEvent.type(codeInput!, code);

    const submit = wrapper.getByTestId("join-game-form-submit");
    userEvent.click(submit);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/${code}/join`, {
        userName,
      });
    });
  });
});
