import { screen, waitFor } from "@testing-library/react";
import { CreateGameForm } from "./CreateGameForm";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "../../Api/fixtures/getExpansionsExampleResponse";
import { Game } from "../../Types/Game";
import { apiClient } from "../../Api/apiClient";
import { SELECTED_CARD_BACKGROUND } from "../ExpansionCard";
import { transformUser, transformUsers } from "../../Types/User";
import { customKardsRender, history } from "../../Tests/testRenders";

jest.mock("../../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

let mockDispatch = jest.fn();
jest.mock("../../State/Users/UsersContext", () => ({
  ...jest.requireActual("../../State/Users/UsersContext"),
  useUsers: () => ({
    state: {
      users: [],
    },
    dispatch: mockDispatch,
  }),
}));

const setGame = jest.fn();
const setUser = jest.fn();
const setHand = jest.fn();
const setBlackCard = jest.fn();
const setHasSubmittedCards = jest.fn();
const setJudge = jest.fn();

const renderer = () => {
  return customKardsRender(<CreateGameForm />, {
    setGame,
    setUser,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge,
  });
};

describe("CreateGameForm", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
  });

  it("renders expansion cards with blue background to indicate that it is selected", async () => {
    renderer();

    const expansion = getExpansionsExampleResponse.data[0];

    const expansionCard = await screen.findByTestId(
      `expansion-${expansion.id}`
    );

    expect(expansionCard).toHaveClass(SELECTED_CARD_BACKGROUND);
  });

  it("handles form submit", async () => {
    const name = "Slim Shady";

    renderer();

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

    renderer();

    const expansionToExclude = getExpansionsExampleResponse.data[0];

    const expansionCard = await screen.findByTestId(
      `expansion-${expansionToExclude.id}`
    );
    userEvent.click(expansionCard);

    expect(expansionCard).not.toHaveClass(SELECTED_CARD_BACKGROUND);

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

  it("calls setGame, setUser, setUsers, setHand, setHasSubmittedCards and setBlackCard when game is created", async () => {
    mockedAxios.post.mockResolvedValue({
      ...gameStateExampleResponse,
    });

    renderer();

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
        transformUser(gameStateExampleResponse.data.current_user)
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          execute: expect.any(Function),
          payload: transformUsers(gameStateExampleResponse.data.users),
        })
      );
      expect(setBlackCard).toHaveBeenCalledWith(
        gameStateExampleResponse.data.current_black_card
      );
      expect(setHasSubmittedCards).toHaveBeenCalledWith(
        gameStateExampleResponse.data.hasSubmittedWhiteCards
      );
      expect(setJudge).toHaveBeenCalledWith(
        transformUser(gameStateExampleResponse.data.judge)
      );
    });
  });
});
