import { render, screen, waitFor } from "@testing-library/react";
import { CreateGamePage } from "./CreateGamePage";
import userEvent from "@testing-library/user-event";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { apiClient } from "../Api/apiClient";
import { GameContext, initialState } from "../State/Game/GameContext";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "../Api/fixtures/getExpansionsExampleResponse";
import { Game } from "../Types/Game";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("CreateGamePage", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
  });

  it("renders expansion cards", async () => {
    render(<CreateGamePage />);
    await screen.findByText(getExpansionsExampleResponse.data[0].name);
  });

  it("renders expansion cards with blue background to indicate that it is selected", async () => {
    render(<CreateGamePage />);

    const expansion = getExpansionsExampleResponse.data[0];

    const expansionCard = await screen.findByTestId(
      `expansion-${expansion.id}`
    );

    expect(expansionCard).toHaveClass("bg-blue-100");
  });

  it("handles form submit", async () => {
    const name = "Slim Shady";
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
      <Router history={history}>
        <CreateGamePage />
      </Router>
    );

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, name);

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game`, {
      expansionIds: getExpansionsExampleResponse.data.map((exp) => exp.id),
      name,
    });
  });

  it("handles form submit with selected expansions only", async () => {
    const name = "Slim Shady";
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
      <Router history={history}>
        <CreateGamePage />
      </Router>
    );

    const expansionToExclude = getExpansionsExampleResponse.data[0];

    const expansionCard = await screen.findByTestId(
      `expansion-${expansionToExclude.id}`
    );
    userEvent.click(expansionCard);

    expect(expansionCard).not.toHaveClass("bg-blue-100");

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, name);

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game`, {
      expansionIds: getExpansionsExampleResponse.data
        .filter((exp) => exp.id !== expansionToExclude.id)
        .map((exp) => exp.id),
      name,
    });

    await waitFor(() => {
      expect(history.push).toHaveBeenCalledWith(
        `/game/${gameStateExampleResponse.data.id}`
      );
    });
  });

  it("calls setGame, setUser, setHand, and setBlackCard when game is created", async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const setGame = jest.fn();
    const setUser = jest.fn();
    const setHand = jest.fn();
    const setBlackCard = jest.fn();

    mockedAxios.post.mockResolvedValue({
      ...gameStateExampleResponse,
    });

    render(
      <Router history={history}>
        <GameContext.Provider
          value={{ ...initialState, setGame, setUser, setHand, setBlackCard }}
        >
          <CreateGamePage />
        </GameContext.Provider>
      </Router>
    );

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, "Chewy");

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    await waitFor(() => {
      const receivedGame: Game = {
        id: gameStateExampleResponse.data.id,
        name: gameStateExampleResponse.data.name,
        code: gameStateExampleResponse.data.code,
        judge_id: gameStateExampleResponse.data.judge.id,
      };
      expect(setGame).toHaveBeenCalledWith(receivedGame);
      expect(setHand).toHaveBeenCalledWith(gameStateExampleResponse.data.hand);
      expect(setUser).toHaveBeenCalledWith(
        gameStateExampleResponse.data.current_user
      );
      expect(setBlackCard).toHaveBeenCalledWith(
        gameStateExampleResponse.data.current_black_card
      );
    });
  });
});
