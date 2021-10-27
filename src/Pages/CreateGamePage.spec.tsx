import { act, render, screen, waitFor } from "@testing-library/react";
import { CreateGamePage } from "./CreateGamePage";
import userEvent from "@testing-library/user-event";
import { Expansion } from "../Types/Expansion";
import { API_URL } from "../config";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { apiClient } from "../Api/apiClient";
import { initialState } from "../State/Game/GameContext";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;
const expectedExpansionName = "Some Sweet Expansion";
const expansion = {
  id: 1,
  name: expectedExpansionName,
};
const otherExpansion = {
  id: 2,
  name: expectedExpansionName + " but different",
};

const responses: Expansion[] = [expansion, otherExpansion];

const createGameResponse = {
  ...initialState,
  game: {
    id: "12234455",
  },
};

describe("CreateGamePage", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: { data: responses } });
    mockedAxios.post.mockResolvedValue({ data: createGameResponse });
  });

  it("renders expansion cards", async () => {
    render(<CreateGamePage />);
    await screen.findByText(expectedExpansionName);
  });

  it("renders expansion cards with blue background to indicate that it is selected", async () => {
    render(<CreateGamePage />);

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
      expansionIds: [expansion.id, otherExpansion.id],
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

    const expansionCard = await screen.findByTestId(
      `expansion-${expansion.id}`
    );
    userEvent.click(expansionCard);

    expect(expansionCard).not.toHaveClass("bg-blue-100");

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, name);

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game`, {
      expansionIds: [otherExpansion.id],
      name,
    });

    await waitFor(() => {
      expect(history.push).toHaveBeenCalledWith(
        `/game/${createGameResponse.game.id}`
      );
    });
  });
});
