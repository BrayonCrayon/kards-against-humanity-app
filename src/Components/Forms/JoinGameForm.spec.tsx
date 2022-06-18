import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import JoinGameForm from "./JoinGameForm";
import { errorToast } from "Utilities/toasts";
import { transformUser, transformUsers } from "Types/User";
import { history, kardsRender } from "Tests/testRenders";
import { setupAndSubmitForm } from "Tests/actions";
import { transformWhiteCardArray } from "Types/WhiteCard";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "Tests/testHelpers";
import { mockedAxios } from "setupTests";
import { initialGameState } from "State/Game/GameState";
import { initialPlayersState } from "State/Players/PlayersState";
import { initialAuthState } from "State/Auth/AuthState";
import { initialHandState } from "State/Hand/HandState";

jest.mock("../../Utilities/toasts");

let mockDispatch = jest.fn();

const {data} = gameStateExampleResponse;
const userName = "Joe";
const code = "1234";

const renderer = () => {
  return kardsRender(<JoinGameForm />);
};

describe("JoinGameForm", () => {
  beforeEach(() => {
    spyOnUseGame(initialGameState, mockDispatch);
    spyOnUsePlayers(initialPlayersState, mockDispatch);
    spyOnUseAuth(initialAuthState, mockDispatch);
    spyOnUseHand(initialHandState, mockDispatch);
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
  });

  it("renders", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
    });
  });

  it("submits form with username and game code", async () => {
    renderer();
    setupAndSubmitForm(userName, code);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/${code}/join`, {
        name: userName,
      });
    });
  });

  it("navigates to game page after join form has been submitted", async () => {
    renderer();
    setupAndSubmitForm(userName, code);

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

    renderer();
    setupAndSubmitForm(userName, code);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    });

    expect(errorToast).toHaveBeenCalledWith("Game does not exist");
  });

  it("sets game state after join game submitted", async () => {
    mockedAxios.post.mockResolvedValue({
      ...gameStateExampleResponse,
    });

    const { findByTestId } = renderer();

    const nameInput = await findByTestId("join-game-name-input");
    userEvent.type(nameInput, data.currentUser.name);

    const codeInput = await findByTestId("join-game-code-input");
    userEvent.type(codeInput, data.code);

    const submit = await findByTestId("join-game-form-submit");
    userEvent.click(submit);

    await waitFor(() => {
      expectDispatch(mockDispatch, {
        id: data.id,
        judge_id: data.judge.id,
        code: data.code,
        name: data.name,
        redrawLimit: data.redrawLimit
      });
      expectDispatch(mockDispatch, transformUser(data.currentUser));
      expectDispatch(
        mockDispatch,
        transformWhiteCardArray(data.hand, false, [])
      );
      expectDispatch(mockDispatch, data.blackCard);
      expectDispatch(mockDispatch, transformUsers(data.users));
      expectDispatch(mockDispatch, data.hasSubmittedWhiteCards);
      expectDispatch(mockDispatch, transformUser(data.judge));
    });
  });
});
