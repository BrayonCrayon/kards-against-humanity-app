import { render, RenderResult, waitFor } from "@testing-library/react";
import { GameContext, initialState } from "../../State/Game/GameContext";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../Api/apiClient";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "../../Api/fixtures/getExpansionsExampleResponse";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import JoinGameForm from "./JoinGameForm";
import { Game } from "../../Types/Game";

jest.mock("../../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;
const history = createMemoryHistory();
const userName = "Joe";
const code = "1234";

const renderer = () => {
  return render(
    <Router history={history}>
      <GameContext.Provider value={initialState}>
        <JoinGameForm />
      </GameContext.Provider>
    </Router>
  );
};

const setupAndSubmitForm = (): RenderResult => {
  const wrapper = renderer();

  expect(wrapper.queryByTestId("join-game-form")).not.toBeNull();

  const nameInput = wrapper.queryByTestId("join-game-name-input");
  expect(nameInput).not.toBeNull();
  userEvent.type(nameInput!, userName);

  const codeInput = wrapper.queryByTestId("join-game-code-input");
  expect(codeInput).not.toBeNull();
  userEvent.type(codeInput!, code);

  const submit = wrapper.getByTestId("join-game-form-submit");
  userEvent.click(submit);

  return wrapper;
};

describe("JoinGameForm", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
    history.push = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
    });
  });

  it("submits form with username and game code", async () => {
    setupAndSubmitForm();

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/${code}/join`, {
        name: userName,
      });
    });
  });

  it("navigates to game page after join form has been submitted", async () => {
    setupAndSubmitForm();

    await waitFor(() => {
      expect(history.push).toHaveBeenCalledWith(
        `/game/${gameStateExampleResponse.data.id}`
      );
    });
  });

  it("catches error if join game fails", async () => {
    const errorMessage = { message: "No Api" };
    mockedAxios.post.mockRejectedValueOnce(errorMessage);
    console.error = jest.fn();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setupAndSubmitForm();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("sets game state after join game submitted", async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const setGame = jest.fn();
    const setUser = jest.fn();
    const setHand = jest.fn();
    const setBlackCard = jest.fn();
    const setUsers = jest.fn();

    mockedAxios.post.mockResolvedValue({
      ...gameStateExampleResponse,
    });

    const { findByTestId } = render(
      <Router history={history}>
        <GameContext.Provider
          value={{
            ...initialState,
            setGame,
            setUser,
            setHand,
            setBlackCard,
            setUsers,
          }}
        >
          <JoinGameForm />
        </GameContext.Provider>
      </Router>
    );

    const nameInput = await findByTestId("join-game-name-input");
    userEvent.type(nameInput, gameStateExampleResponse.data.current_user.name);

    const codeInput = await findByTestId("join-game-code-input");
    userEvent.type(codeInput, gameStateExampleResponse.data.code);

    const submit = await findByTestId("join-game-form-submit");
    userEvent.click(submit);

    await waitFor(() => {
      expect(setGame).toHaveBeenCalledWith({
        id: gameStateExampleResponse.data.id,
        judge_id: gameStateExampleResponse.data.judge.id,
        code: gameStateExampleResponse.data.code,
      } as Game);
      expect(setUser).toHaveBeenCalledWith(
        gameStateExampleResponse.data.current_user
      );
      expect(setHand).toHaveBeenCalledWith(gameStateExampleResponse.data.hand);
      expect(setBlackCard).toHaveBeenCalledWith(
        gameStateExampleResponse.data.current_black_card
      );
      expect(setUsers).toHaveBeenCalledWith(
        gameStateExampleResponse.data.users
      );
    });
  });
});
