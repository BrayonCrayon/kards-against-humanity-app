import { submittedCardsResponse } from "@/Api/fixtures/submittedCardsResponse";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "@/Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { waitFor } from "@testing-library/react";
import { transformUser, transformUsers } from "@/Types/User";
import { VotingSection } from "./VotingSection";
import { transformWhiteCardArray } from "@/Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import { listenWhenWinnerIsSelected } from "@/Services/PusherService";
import { kardsRender } from "@/Tests/testRenders";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseVote } from "@/Tests/testHelpers";
import { service } from "@/setupTests";
import gameService, { fetchSubmittedCards } from "@/Services/GameService";
import { AxiosResponse } from "axios";
import { initialVoteState } from "@/State/Vote/VoteState";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { Location } from "@/Types/Notification";

const mocks = vi.hoisted(() => ({
  FetchRoundWinner: vi.fn(),
  Dispatch: vi.fn(),
  happyToast: vi.fn(),
}));

vi.mock("@/Hooks/Notification/useToasts", () => ({
  useToasts: () => ({ happyToast: mocks.happyToast }),
}));
vi.mock("@/Services/PusherService");
vi.mock("@/Hooks/Game/State/useFetchRoundWinner", () => ({
  default: () => mocks.FetchRoundWinner,
}));

const {
  data: { game, hand, blackCard, users, currentUser, hasSubmittedWhiteCards },
} = gameStateAllPlayerSubmittedCardsExampleResponse;

const mockProps = {
  game,
  users: transformUsers(users),
  hand: transformWhiteCardArray(hand, false, []),
  blackCard: blackCard,
};

let auth = transformUser(currentUser);
const mockHasSubmittedWhiteCards = hasSubmittedWhiteCards;

const renderer = () => {
  return kardsRender(<VotingSection />);
};

describe("VotingSection", () => {
  beforeEach(() => {
    spyOnUseGame(vi.fn(), { game, blackCard: blackCardFactory(mockProps.blackCard), hasSpectator: false });
    spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards: mockHasSubmittedWhiteCards });
  });

  describe("Api call", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    });

    it("calls backend api for submitted cards", async () => {
      renderer();

      await waitFor(() => {
        expect(fetchSubmittedCards).toHaveBeenCalledTimes(1);
        expect(fetchSubmittedCards).toHaveBeenCalledWith(mockProps.game.id);
      });
    });

    it("catches axios error if api call fails", async () => {
      const errorMessage = { message: "failed api call" };
      service.fetchSubmittedCards.mockRejectedValueOnce(errorMessage);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      renderer();

      await waitFor(() => {
        expect(consoleSpy).toBeCalledWith(errorMessage);
      });
      consoleSpy.mockRestore();
    });

    it("submits selected winner to api", async () => {
      const { user_id } = submittedCardsResponse.data[0];
      const spy = spyOnUseVote(vi.fn(), { selectedPlayerId: user_id });

      const wrapper = renderer();

      const submitButtons = await waitFor(() => {
        const buttons = wrapper.getAllByTestId("submit-selected-winner");
        expect(buttons).toHaveLength(2);
        return buttons;
      });

      await userEvent.click(submitButtons[0]);

      await waitFor(() => {
        expect(gameService.submitWinner).toHaveBeenCalledWith(mockProps.game.id, user_id);
        expect(mocks.happyToast).toHaveBeenCalledWith("Winner Selected!", Location.TOP_CENTER);
      });
      spy.mockRestore();
    });
  });

  describe("pusher events", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    });

    it("listens on winner selected pusher event when loading game page", async () => {
      renderer();

      await waitFor(() => {
        expect(listenWhenWinnerIsSelected).toHaveBeenCalledWith(game.id, mocks.FetchRoundWinner);
      });
    });
  });

  describe("select a player submitted card", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    });

    it("allows user to select a player submitted card", async () => {
      const wrapper = renderer();
      const { user_id } = submittedCardsResponse.data[0];

      const submittedCardElement = await waitFor(() => {
        return wrapper.getByRole(`selectable-${user_id}`);
      });
      await userEvent.click(submittedCardElement);

      await waitFor(() => {
        expect(wrapper.getAllByTestId("submit-selected-winner")[0]).toBeInTheDocument();
      });
    });

    it("will not show submit winner button when user is not the judge", async () => {
      spyOnUseGame(vi.fn(), {
        game: { ...mockProps.game, judgeId: mockProps.users[0].id },
        blackCard: blackCardFactory(mockProps.blackCard),
        hasSpectator: false,
      });
      const wrapper = renderer();

      await waitFor(() => {
        expect(wrapper.queryByRole("submit-selected-winner")).not.toBeInTheDocument();
      });
    });

    it("calls dispatch with correct action and payload when a user is selected", async () => {
      spyOnUseVote(mocks.Dispatch, initialVoteState);
      const wrapper = renderer();
      const { user_id } = submittedCardsResponse.data[0];

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`player-submitted-response-${user_id}`));
      });

      await waitFor(() => {
        expectDispatch(mocks.Dispatch, user_id);
      });
    });

    it("does not show submit winner button when a winner is in state", async () => {
      spyOnUseVote(vi.fn(), {
        selectedRoundWinner: { ...submittedCardsResponse.data[0], black_card: blackCardFactory(mockProps.blackCard) },
        selectedPlayerId: -1,
      });
      const wrapper = renderer();

      await waitFor(() => {
        expect(wrapper.queryByRole("submit-selected-winner")).not.toBeInTheDocument();
      });
    });
  });

  describe("displaying players submitted card", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
      spyOnUseVote(mocks.Dispatch, { selectedPlayerId: -1, selectedRoundWinner: undefined });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("will display players submitted card", async () => {
      const wrapper = renderer();

      await waitFor(() => {
        submittedCardsResponse.data.forEach((submittedData) => {
          expect(wrapper.queryByTestId(`player-submitted-response-${submittedData.user_id}`)).toBeInTheDocument();

          submittedData.submitted_cards.forEach((card) =>
            expect(wrapper.queryByTestId(`player-submitted-response-${submittedData.user_id}`)?.textContent).toEqual(
              expect.stringContaining(card.text.replace(".", "")),
            ),
          );
        });
      });
    });

    it("will display players submitted cards in order", async () => {
      const submittedResponse = submittedCardsResponse.data[0];
      const sortedCards = submittedResponse.submitted_cards.sort((left, right) => left.order - right.order);

      const { text: blackCardText } = blackCard;

      const expectedCardText = blackCardText
        .replace("_", sortedCards[0].text.replace(/\.$/, ""))
        .replace("_", sortedCards[1].text.replace(/\.$/, ""));

      const wrapper = renderer();

      await waitFor(() => {
        const submittedCard = wrapper.getByTestId(`player-submitted-response-${submittedResponse.user_id}`);
        expect(submittedCard.textContent).toContain(expectedCardText);
      });
    });

    it("will not allow non judge users to select submitted cards", async () => {
      spyOnUseAuth(mocks.Dispatch, { auth: mockProps.users[0], hasSubmittedCards: false });
      const [submittedCard] = submittedCardsResponse.data;
      const wrapper = renderer();

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`player-submitted-response-${submittedCard.user_id}`));
      });
      await waitFor(() => {
        expect(mocks.Dispatch).not.toHaveBeenCalled();
      });
    });
  });
});
