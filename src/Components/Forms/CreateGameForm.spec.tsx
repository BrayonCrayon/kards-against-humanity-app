import { screen, waitFor } from "@testing-library/react";
import { CreateGameForm } from "Components/Forms/CreateGameForm";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { Game } from "Types/Game";
import { SELECTED_CARD_BACKGROUND } from "Components/ExpansionCard";
import { transformUser, transformUsers } from "Types/User";
import { history, kardsRender } from "Tests/testRenders";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "Tests/testHelpers";
import { initialGameState } from "State/Game/GameState";
import { initialAuthState } from "State/Auth/AuthState";
import { initialPlayersState } from "State/Players/PlayersState";
import { mockedAxios } from "setupTests";

const mockDispatch = jest.fn();
const {data} = gameStateExampleResponse;

const renderer = () => {
  return kardsRender(<CreateGameForm />);
};

describe("CreateGameForm", () => {
  beforeEach(() => {
    spyOnUseGame(initialGameState, mockDispatch);
    spyOnUseAuth(initialAuthState, mockDispatch);
    spyOnUsePlayers(initialPlayersState, mockDispatch);

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

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game`, {
        expansionIds: getExpansionsExampleResponse.data.map((exp) => exp.id),
        name,
      });
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

    await waitFor(() => {
      expect(expansionCard).not.toHaveClass(SELECTED_CARD_BACKGROUND);
    });

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
        id: data.id,
        name: data.name,
        code: data.code,
        judge_id: data.judge.id,
        redrawLimit: data.redrawLimit,
      };
      expectDispatch(mockDispatch, receivedGame);
      expectDispatch(mockDispatch, transformUser(data.currentUser));
      expectDispatch(mockDispatch, transformUsers(data.users));
      expectDispatch(mockDispatch, data.blackCard);
      expectDispatch(mockDispatch, data.hasSubmittedWhiteCards);
      expectDispatch(mockDispatch, transformUser(data.judge));
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
