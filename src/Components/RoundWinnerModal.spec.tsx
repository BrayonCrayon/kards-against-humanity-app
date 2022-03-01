import { customGameVoteRender } from "../Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "../State/Vote/VoteContext";
import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";
import userEvent from "@testing-library/user-event";
import { CLEAR_STATE } from "../State/Vote/VoteActions";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { Game } from "../Types/Game";
import { transformUser, transformUsers } from "../Types/User";
import { waitFor } from "@testing-library/react";

const mockRotateGame = jest.fn(async () => {});
jest.mock("../Hooks/Game/useRotateGame", () => {
  return () => {
    return mockRotateGame;
  };
});

const mockFetchGameState = jest.fn();
jest.mock("../Hooks/Game/useFetchGameState", () => {
  return () => {
    return mockFetchGameState;
  };
});

const game: Game = {
  id: gameStateAllPlayerSubmittedCardsExampleResponse.data.id,
  name: gameStateAllPlayerSubmittedCardsExampleResponse.data.name,
  code: gameStateAllPlayerSubmittedCardsExampleResponse.data.code,
  judge_id: gameStateAllPlayerSubmittedCardsExampleResponse.data.judge.id,
};
const mockSetUsers = jest.fn();
const mockSetUser = jest.fn();
const mockSetHand = jest.fn();
const mockSetGame = jest.fn();
const mockSetBlackCard = jest.fn();
const mockSetHasSubmittedWhiteCards = jest.fn();
const mockSetJudge = jest.fn();
const props = {
  game,
  user: transformUser(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user
  ),
  users: transformUsers(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.users
  ),
  judge: transformUser(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.judge
  ),
  blackCard:
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card,
  hand: gameStateAllPlayerSubmittedCardsExampleResponse.data.hand,
  setUsers: mockSetUsers,
  setUser: mockSetUser,
  setHand: mockSetHand,
  setGame: mockSetGame,
  setBlackCard: mockSetBlackCard,
  setHasSubmittedWhiteCards: mockSetHasSubmittedWhiteCards,
  setJudge: mockSetJudge,
};
const renderComponent = () => {
  return customGameVoteRender(<RoundWinnerModal />, props);
};

describe("RoundWinnerModal", () => {
  beforeEach(() => {
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn(),
      state: {
        selectedRoundWinner: submittedCardsResponse.data[0],
        selectedPlayerId: 1,
      },
    }));
  });

  it("will render the modal", async () => {
    const wrapper = renderComponent();
    expect(
      await wrapper.findByTestId("round-winner-modal")
    ).toBeInTheDocument();
  });

  it("will render a button to close modal", () => {
    const wrapper = renderComponent();
    expect(
      wrapper.queryByTestId("round-winner-modal-close-button")
    ).toBeInTheDocument();
  });

  it("will close model when user clicks close button", async () => {
    const dispatchSpy = jest.fn();
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: dispatchSpy,
      state: {
        selectedRoundWinner: submittedCardsResponse.data[0],
        selectedPlayerId: 1,
      },
    }));

    const wrapper = renderComponent();

    userEvent.click(
      await wrapper.findByTestId("round-winner-modal-close-button")
    );

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: CLEAR_STATE,
    });

    expect(
      wrapper.queryByTestId("round-winner-modal-close-button")
    ).toBeInTheDocument();
  });

  it("will display round winners name", () => {
    const winner = submittedCardsResponse.data[0];
    const winnerName = props.users.find((user) => {
      return user.id === winner.user_id;
    })!.name;
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn,
      state: {
        selectedRoundWinner: winner,
        selectedPlayerId: 1,
      },
    }));
    const wrapper = renderComponent();

    expect(
      wrapper.getByText(`The winner is: ${winnerName}`)
    ).toBeInTheDocument();
  });

  it("will call round rotation hook", () => {
    renderComponent();

    expect(mockRotateGame).toHaveBeenCalledTimes(1);
    expect(mockRotateGame).toHaveBeenCalledWith(props.game.id);
  });

  it("will only call round rotation hook when a winner is selected", () => {
    const spyer = jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn,
      state: {
        selectedRoundWinner: undefined,
        selectedPlayerId: 1,
      },
    }));

    renderComponent();

    expect(mockRotateGame).toHaveBeenCalledTimes(0);
    expect(mockRotateGame).not.toHaveBeenCalledWith(props.game.id);
  });

  it("refreshes the game state when the round is rotated", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockFetchGameState).toHaveBeenCalledTimes(1);
      expect(mockFetchGameState).toHaveBeenCalledWith(props.game.id);
    });
  });

  it("does not call game rotate when user is not a judge", async () => {
    props.user = props.users[0];
    renderComponent();

    await waitFor(() => {
      expect(mockRotateGame).toHaveBeenCalledTimes(0);
    });
  });
});
