import { kardsRender } from "Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "State/Vote/useVote";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import userEvent from "@testing-library/user-event";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { Game } from "Types/Game";
import { transformUser, transformUsers } from "Types/User";
import { waitFor } from "@testing-library/react";
import { roundWinnerExampleResponse } from "Api/fixtures/roundWinnerExampleResponse";
import { fillOutBlackCard } from "Utilities/helpers";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers, spyOnUseVote } from "Tests/testHelpers";

const mockRotateGame = jest.fn();
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

const { data: { id, name, code, judge, redrawLimit, users, currentUser, blackCard } } = gameStateAllPlayerSubmittedCardsExampleResponse;
const game: Game = {
  id,
  name,
  code,
  judge_id: judge.id,
  redrawLimit
};

let players = transformUsers(users);
let auth = transformUser(currentUser);

const renderComponent = () => {
  return kardsRender(<RoundWinnerModal />);
};

describe("RoundWinnerModal", () => {
  beforeEach(() => {
    spyOnUseGame({ game, blackCard: blackCard, judge });
    spyOnUseAuth({ auth, hasSubmittedCards: false });
    spyOnUsePlayers({ players });
    spyOnUseVote({
      selectedRoundWinner: {
        ...submittedCardsResponse.data[0],
        black_card: blackCard
      },
      selectedPlayerId: 1
    });
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
        selectedPlayerId: 1
      }
    }));

    const wrapper = renderComponent();

    userEvent.click(
      await wrapper.findByTestId("round-winner-modal-close-button")
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: undefined
      })
    );

    expect(
      wrapper.queryByTestId("round-winner-modal-close-button")
    ).toBeInTheDocument();
  });

  it("will display round winners name", () => {
    const winner = submittedCardsResponse.data[0];
    const winnerName = players.find(user => user.id === winner.user_id)!.name;
    spyOnUseVote({
      selectedPlayerId: 1,
      selectedRoundWinner: { ...winner, black_card: blackCard }
    });
    const wrapper = renderComponent();

    expect(
      wrapper.getByText(`The winner is: ${winnerName}`)
    ).toBeInTheDocument();
  });

  it("will call round rotation hook", async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockRotateGame).toHaveBeenCalledTimes(1);
      expect(mockRotateGame).toHaveBeenCalledWith(game.id);
    });
  });

  it("will only call round rotation hook when a winner is selected", () => {
    spyOnUseVote({ selectedRoundWinner: undefined, selectedPlayerId: 1 });

    renderComponent();

    expect(mockRotateGame).toHaveBeenCalledTimes(0);
    expect(mockRotateGame).not.toHaveBeenCalledWith(game.id);
  });

  it("does not call game rotate when user is not a judge", async () => {
    spyOnUseAuth({ auth: players[0], hasSubmittedCards: false });
    renderComponent();

    await waitFor(() => {
      expect(mockRotateGame).toHaveBeenCalledTimes(0);
    });
  });

  it("will continue to show previous black card after game rotate", async () => {
    spyOnUseVote({
      selectedPlayerId: 1,
      selectedRoundWinner: roundWinnerExampleResponse.data
    });
    const { data: { black_card, submitted_cards, user_id } } = roundWinnerExampleResponse;
    const expectedCardText = fillOutBlackCard(black_card, submitted_cards)
      .replaceAll("<strong>", "")
      .replaceAll("</strong>", "");

    const wrapper = renderComponent();

    await waitFor(() => {
      const winnerCardElement = wrapper.getByTestId(
        `player-card-response-${user_id}`
      );
      expect(winnerCardElement.textContent).toEqual(expectedCardText);
    });
  });
});
