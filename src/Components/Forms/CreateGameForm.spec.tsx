import { getByTestId, screen, waitFor } from "@testing-library/react";
import { CreateGameForm } from "Components/Forms/CreateGameForm";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { Game } from "Types/Game";
import { apiClient } from "Api/apiClient";
import { SELECTED_CARD_BACKGROUND } from "Components/ExpansionCard";
import { transformUser, transformUsers } from "Types/User";
import { history, kardsRender } from "Tests/testRenders";
import { act } from "react-dom/test-utils";
import { expectDispatch } from "Tests/testHelpers";

jest.mock("Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

let mockDispatch = jest.fn();
jest.mock("State/Users/UsersContext", () => ({
  ...jest.requireActual("State/Users/UsersContext"),
  useUsers: () => ({
    state: {
      users: [],
    },
    dispatch: mockDispatch,
  }),
}));

jest.mock("State/User/UserContext", () => ({
  ...jest.requireActual("State/User/UserContext"),
  useUser: () => ({
    state: {
      user: {},
      hasSubmittedWhiteCards: false,
    },
    dispatch: mockDispatch,
  }),
}));

jest.mock("State/Game/GameContext", () => ({
  ...jest.requireActual("State/Game/GameContext"),
  useGame: () => ({
    state: {
      game: {},
      blackCard: {},
      judge: {},
    },
    dispatch: mockDispatch,
  }),
}));

const renderer = () => {
  return kardsRender(<CreateGameForm />);
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

    await act(async () => {
      const nameInput = await screen.findByTestId("user-name");
      userEvent.type(nameInput, name);

      const submitBtn = await screen.findByTestId("create-game-submit-button");
      userEvent.click(submitBtn);
    });

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
      expectDispatch(mockDispatch, receivedGame);
      expectDispatch(
        mockDispatch,
        transformUser(gameStateExampleResponse.data.current_user)
      );
      expectDispatch(
        mockDispatch,
        transformUsers(gameStateExampleResponse.data.users)
      );
      expectDispatch(
        mockDispatch,
        gameStateExampleResponse.data.current_black_card
      );
      expectDispatch(
        mockDispatch,
        gameStateExampleResponse.data.hasSubmittedWhiteCards
      );
      expectDispatch(
        mockDispatch,
        transformUser(gameStateExampleResponse.data.judge)
      );
    });
  });

  it("toggle all expansion packs", async () => {
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
    const wrapper = renderer();

    const toggle = await waitFor(() => {
      return wrapper.getByTestId("toggle-all-expansions");
    });

    expect(
      wrapper.container.querySelectorAll("input[type=checkbox]:checked")
    ).toHaveLength(2);

    userEvent.click(toggle);

    await waitFor(() => {
      expect(
        wrapper.container.querySelectorAll("input[type=checkbox]:not(:checked)")
      ).toHaveLength(2);
    });
  });
});
