import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../Api/apiClient";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "../../Api/fixtures/getExpansionsExampleResponse";
import JoinGameForm from "./JoinGameForm";
import { Game } from "../../Types/Game";
import { errorToast } from "../../Utilities/toasts";
import { transformUser, transformUsers } from "../../Types/User";
import { customKardsRender, history } from "../../Tests/testRenders";
import { setupAndSubmitForm } from "../../Tests/actions";
import { IWhiteCard, WhiteCard } from "../../Types/WhiteCard";

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

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;
const userName = "Joe";
const code = "1234";

const setGame = jest.fn();
const setUser = jest.fn();
const setHand = jest.fn();
const setBlackCard = jest.fn();
const setHasSubmittedCards = jest.fn();
const setJudge = jest.fn();

const renderer = () => {
  return customKardsRender(<JoinGameForm />, {
    setGame,
    setBlackCard,
    setJudge,
  });
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
      expect(setGame).toHaveBeenCalledWith({
        id: gameStateExampleResponse.data.id,
        judge_id: gameStateExampleResponse.data.judge.id,
        code: gameStateExampleResponse.data.code,
        name: gameStateExampleResponse.data.name,
      } as Game);
      // expect(setUser).toHaveBeenCalledWith(
      //   transformUser(gameStateExampleResponse.data.current_user)
      // );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          execute: expect.any(Function),
          payload: transformUser(gameStateExampleResponse.data.current_user),
        })
      );
      // expect(setHand).toHaveBeenCalledWith(gameStateExampleResponse.data.hand);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          execute: expect.any(Function),
          payload: gameStateExampleResponse.data.hand.map(
            (item: IWhiteCard) => {
              return new WhiteCard(item.id, item.text, item.expansion_id);
            }
          ),
        })
      );
      expect(setBlackCard).toHaveBeenCalledWith(
        gameStateExampleResponse.data.current_black_card
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          execute: expect.any(Function),
          payload: transformUsers(gameStateExampleResponse.data.users),
        })
      );
      // expect(setHasSubmittedCards).toHaveBeenCalledWith(
      //   gameStateExampleResponse.data.hasSubmittedWhiteCards
      // );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          execute: expect.any(Function),
          payload: gameStateExampleResponse.data.hasSubmittedWhiteCards,
        })
      );
      expect(setJudge).toHaveBeenCalledWith(
        transformUser(gameStateExampleResponse.data.judge)
      );
    });
  });
});
