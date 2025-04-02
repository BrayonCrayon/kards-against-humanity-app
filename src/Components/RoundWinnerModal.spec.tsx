import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "@/State/Vote/useVote";
import { submittedCardsResponse } from "@/Api/fixtures/submittedCardsResponse";
import userEvent from "@testing-library/user-event";
import {
  gameStateAllPlayerSubmittedCardsExampleResponse
} from "@/Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { transformUser, transformUsers } from "@/Types/User";
import { waitFor } from "@testing-library/react";
import { roundWinnerExampleResponse } from "@/Api/fixtures/roundWinnerExampleResponse";
import { fillOutBlackCard } from "@/Utilities/helpers";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers, spyOnUseVote } from "@/Tests/testHelpers";

const mocks = vi.hoisted(() => ({
  rotateGame: vi.fn(),
  fetchGameState: vi.fn(),
  pusherListener: vi.fn(),
}))

vi.mock("@/Hooks/Game/Actions/useRotateGame", () => ({ default: () => mocks.rotateGame }));
vi.mock("@/Hooks/Game/State/useFetchGameState", () => ({ default: () => mocks.fetchGameState }));
vi.mock("@/Services/PusherService", () => ({ listenWhenSpectatorDisplaysWinner: mocks.pusherListener }));

const { data: { game, users, currentUser, blackCard } } = gameStateAllPlayerSubmittedCardsExampleResponse;

let players = transformUsers(users);
let auth = transformUser(currentUser);

const renderComponent = () => {
  return kardsRender(<RoundWinnerModal />);
};

describe("RoundWinnerModal", () => {
  beforeEach(() => {
    spyOnUseGame(vi.fn(), { game, blackCard: blackCard, hasSpectator: false });
    spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards: false });
    spyOnUsePlayers(vi.fn(), { players });
    spyOnUseVote(vi.fn(), {
      selectedRoundWinner: {
        ...submittedCardsResponse.data[0],
        black_card: blackCard
      },
      selectedPlayerId: 1
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  })

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
    const dispatchSpy = vi.fn();
    vi.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: dispatchSpy,
      state: {
        selectedRoundWinner: roundWinnerExampleResponse.data,
        selectedPlayerId: 1
      }
    }));

    const wrapper = renderComponent();

    await userEvent.click(await wrapper.findByTestId("round-winner-modal-close-button"));

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
    spyOnUseVote(vi.fn(), {
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
      expect(mocks.rotateGame).toHaveBeenCalledTimes(1);
      expect(mocks.rotateGame).toHaveBeenCalledWith(game.id);
    });
  });

  it("will only call round rotation hook when a winner is selected", () => {
    spyOnUseVote(vi.fn(), { selectedRoundWinner: undefined, selectedPlayerId: 1 });

    renderComponent();

    expect(mocks.rotateGame).toHaveBeenCalledTimes(0);
    expect(mocks.rotateGame).not.toHaveBeenCalledWith(game.id);
  });

  it("does not call game rotate when user is not a judge", async () => {
    spyOnUseAuth(vi.fn(), { auth: players[0], hasSubmittedCards: false });
    renderComponent();

    await waitFor(() => {
      expect(mocks.rotateGame).toHaveBeenCalledTimes(0);
    });
  });

  it("will continue to show previous black card after game rotate", async () => {
    spyOnUseVote(vi.fn(), {
      selectedPlayerId: 1,
      selectedRoundWinner: roundWinnerExampleResponse.data
    });
    const { data: { black_card, submitted_cards, user_id } } = roundWinnerExampleResponse;
    const expectedCardText = fillOutBlackCard(black_card, submitted_cards).replace(/<(\/)?strong>/g, "");

    const wrapper = renderComponent();

    await waitFor(() => {
      const winnerCardElement = wrapper.getByTestId(
        `player-submitted-response-${user_id}`
      );
      expect(winnerCardElement.textContent).toContain(expectedCardText);
    });
  });

  it("will hook into pusher event when spectator is in a game", () => {
    spyOnUseGame(vi.fn(), { game, blackCard: blackCard, hasSpectator: true });
    renderComponent();

    expect(mocks.pusherListener).toHaveBeenCalledWith(game.id, expect.any(Function));
  });

  it("will not hook into pusher event when there is no spectator in a game", () => {
    spyOnUseGame(vi.fn(), { game, blackCard: blackCard, hasSpectator: false });
    renderComponent();

    expect(mocks.pusherListener).not.toHaveBeenCalled();
  });

  it("will show the winner modal when we have received that the spectator has shown the winner", async () => {
    spyOnUseVote(vi.fn(), {
      selectedPlayerId: 1,
      selectedRoundWinner: roundWinnerExampleResponse.data
    });
    const { data: { user_id } } = roundWinnerExampleResponse;
    mocks.pusherListener.mockImplementationOnce((_: string, callback: () => void) => {
      callback();
    })
    spyOnUseGame(vi.fn(), { game, blackCard: blackCard, hasSpectator: true });
    const wrapper = renderComponent();

    await waitFor(() => {
      expect(wrapper.queryByTestId(`player-submitted-response-${user_id}`)).toBeInTheDocument();
    })
  });

  it("will not show winner when a spectator is watching and a winner is chosen", async () => {
    spyOnUseGame(vi.fn(), { game, blackCard: blackCard, hasSpectator: true });
    spyOnUseVote(vi.fn(), {
      selectedPlayerId: 1,
      selectedRoundWinner: roundWinnerExampleResponse.data
    });
    const { data: { user_id } } = roundWinnerExampleResponse;
    const wrapper = renderComponent();

    await waitFor(() => {
      expect(wrapper.queryByTestId(`player-submitted-response-${user_id}`)).not.toBeInTheDocument();
    })
  });
});
