import { kardsRender } from "Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "State/Vote/VoteContext";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import userEvent from "@testing-library/user-event";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { Game } from "Types/Game";
import { transformUser, transformUsers } from "Types/User";
import { waitFor } from "@testing-library/react";
import { roundWinnerExampleResponse } from "Api/fixtures/roundWinnerExampleResponse";
import { fillOutBlackCard } from "Utilities/helpers";

const mockRotateGame = jest.fn(async () => {});
jest.mock("Hooks/Game/useRotateGame", () => {
  return () => {
    return mockRotateGame;
  };
});

const mockFetchGameState = jest.fn();
jest.mock("Hooks/Game/useFetchGameState", () => {
  return () => {
    return mockFetchGameState;
  };
});

const mockGame: Game = {
  id: gameStateAllPlayerSubmittedCardsExampleResponse.data.id,
  name: gameStateAllPlayerSubmittedCardsExampleResponse.data.name,
  code: gameStateAllPlayerSubmittedCardsExampleResponse.data.code,
  judge_id: gameStateAllPlayerSubmittedCardsExampleResponse.data.judge.id,
};

const props = {
  judge: transformUser(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.judge
  ),
  blackCard:
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card,
};

let mockUsers = transformUsers(
  gameStateAllPlayerSubmittedCardsExampleResponse.data.users
);
jest.mock("State/Users/UsersContext", () => ({
  ...jest.requireActual("State/Users/UsersContext"),
  useUsers: () => ({
    state: {
      users: mockUsers,
    },
    dispatch: jest.fn(),
  }),
}));

let mockUser = transformUser(
  gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user
);
jest.mock("State/User/UserContext", () => ({
  ...jest.requireActual("State/User/UserContext"),
  useUser: () => ({
    state: {
      user: mockUser,
      hasSubmittedWhiteCards: false,
    },
    dispatch: jest.fn(),
  }),
}));

jest.mock("State/Game/GameContext", () => ({
  ...jest.requireActual("State/Game/GameContext"),
  useGame: () => ({
    state: {
      game: mockGame,
    },
    dispatch: jest.fn(),
  }),
}));

const renderComponent = () => {
  return kardsRender(<RoundWinnerModal />);
};

describe("RoundWinnerModal", () => {
  beforeEach(() => {
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn(),
      state: {
        selectedRoundWinner: {
          ...submittedCardsResponse.data[0],
          black_card:
            gameStateAllPlayerSubmittedCardsExampleResponse.data
              .current_black_card,
        },
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
        selectedRoundWinner: roundWinnerExampleResponse.data,
        selectedPlayerId: 1,
      },
    }));

    const wrapper = renderComponent();

    userEvent.click(
      await wrapper.findByTestId("round-winner-modal-close-button")
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: undefined,
      })
    );

    expect(
      wrapper.queryByTestId("round-winner-modal-close-button")
    ).toBeInTheDocument();
  });

  it("will display round winners name", () => {
    const winner = submittedCardsResponse.data[0];
    const winnerName = mockUsers.find((user) => {
      return user.id === winner.user_id;
    })!.name;
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn,
      state: {
        selectedRoundWinner: {
          ...winner,
          black_card:
            gameStateAllPlayerSubmittedCardsExampleResponse.data
              .current_black_card,
        },
        selectedPlayerId: 1,
      },
    }));
    const wrapper = renderComponent();

    expect(
      wrapper.getByText(`The winner is: ${winnerName}`)
    ).toBeInTheDocument();
  });

  it("will call round rotation hook", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockRotateGame).toHaveBeenCalledTimes(1);
      expect(mockRotateGame).toHaveBeenCalledWith(mockGame.id);
    });
  });

  it("will only call round rotation hook when a winner is selected", () => {
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn,
      state: {
        selectedRoundWinner: undefined,
        selectedPlayerId: 1,
      },
    }));

    renderComponent();

    expect(mockRotateGame).toHaveBeenCalledTimes(0);
    expect(mockRotateGame).not.toHaveBeenCalledWith(mockGame.id);
  });

  it("does not call game rotate when user is not a judge", async () => {
    mockUser = mockUsers[0];
    renderComponent();

    await waitFor(() => {
      expect(mockRotateGame).toHaveBeenCalledTimes(0);
    });
  });

  it("will continue to show previous black card after game rotate", async () => {
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn(),
      state: {
        selectedRoundWinner: roundWinnerExampleResponse.data,
        selectedPlayerId: 1,
      },
    }));
    const {
      data: { black_card, submitted_cards, user_id },
    } = roundWinnerExampleResponse;
    const expectedCardText = fillOutBlackCard(black_card, submitted_cards);

    const wrapper = renderComponent();

    await waitFor(() => {
      const winnerCardElement = wrapper.getByTestId(
        `player-card-response-${user_id}`
      );
      expect(winnerCardElement.textContent).toEqual(
        expectedCardText.replaceAll("<strong>", "").replaceAll("</strong>", "")
      );
    });
  });
});
