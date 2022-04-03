import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../Api/apiClient";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "../../Api/fixtures/getExpansionsExampleResponse";
import JoinGameForm from "./JoinGameForm";
import { errorToast } from "../../Utilities/toasts";
import { transformUser, transformUsers } from "../../Types/User";
import { history, kardsRender } from "../../Tests/testRenders";
import { setupAndSubmitForm } from "../../Tests/actions";
import { IWhiteCard, WhiteCard } from "../../Types/WhiteCard";
import { expectDispatch } from "../../Tests/testHelpers";

jest.mock("../../Api/apiClient");
jest.mock("../../Utilities/toasts");

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

jest.mock("../../State/User/UserContext", () => ({
  ...jest.requireActual("../../State/User/UserContext"),
  useUser: () => ({
    state: {
      user: {},
      hasSubmittedWhiteCards: false,
    },
    dispatch: mockDispatch,
  }),
}));

jest.mock("../../State/Hand/HandContext", () => ({
  ...jest.requireActual("../../State/Hand/HandContext"),
  useHand: () => ({
    state: {
      hand: [],
    },
    dispatch: mockDispatch,
  }),
}));

jest.mock("../../State/Game/GameContext", () => ({
  ...jest.requireActual("../../State/Game/GameContext"),
  useGame: () => ({
    state: {
      game: {},
    },
    dispatch: mockDispatch,
  }),
}));

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;
const userName = "Joe";
const code = "1234";

const renderer = () => {
  return kardsRender(<JoinGameForm />);
};

describe("JoinGameForm", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue(gameStateExampleResponse);
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
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
    userEvent.type(nameInput, gameStateExampleResponse.data.current_user.name);

    const codeInput = await findByTestId("join-game-code-input");
    userEvent.type(codeInput, gameStateExampleResponse.data.code);

    const submit = await findByTestId("join-game-form-submit");
    userEvent.click(submit);

    await waitFor(() => {
      expectDispatch(mockDispatch, {
        id: gameStateExampleResponse.data.id,
        judge_id: gameStateExampleResponse.data.judge.id,
        code: gameStateExampleResponse.data.code,
        name: gameStateExampleResponse.data.name,
      });
      expectDispatch(
        mockDispatch,
        transformUser(gameStateExampleResponse.data.current_user)
      );
      expectDispatch(
        mockDispatch,
        gameStateExampleResponse.data.hand.map((item: IWhiteCard) => {
          return new WhiteCard(item.id, item.text, item.expansion_id);
        })
      );
      expectDispatch(
        mockDispatch,
        gameStateExampleResponse.data.current_black_card
      );
      expectDispatch(
        mockDispatch,
        transformUsers(gameStateExampleResponse.data.users)
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
});
