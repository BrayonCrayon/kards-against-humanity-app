import { render, waitFor } from "@testing-library/react";
import { GameContext, initialState } from "../../State/Game/GameContext";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../Api/apiClient";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "../../Api/fixtures/getExpansionsExampleResponse";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import JoinGameForm from "./JoinGameForm";

jest.mock("../../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("JoinGameForm", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
  });

  it("renders", async () => {
    const wrapper = render(
      <GameContext.Provider value={initialState}>
        <JoinGameForm />
      </GameContext.Provider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
    });
  });

  it("submits form with username and game code", async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const wrapper = render(
      <Router history={history}>
        <GameContext.Provider value={initialState}>
          <JoinGameForm />
        </GameContext.Provider>
      </Router>
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

  it("navigates to game page after join form has been submitted", async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const wrapper = render(
      <Router history={history}>
        <GameContext.Provider value={initialState}>
          <JoinGameForm />
        </GameContext.Provider>
      </Router>
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
    const history = createMemoryHistory();
    history.push = jest.fn();
    const wrapper = render(
      <Router history={history}>
        <GameContext.Provider value={initialState}>
          <JoinGameForm />
        </GameContext.Provider>
      </Router>
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
      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    });
  });
});
