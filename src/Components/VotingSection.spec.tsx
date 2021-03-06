import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { RenderResult, waitFor } from "@testing-library/react";
import { transformUser, transformUsers } from "Types/User";
import { VotingSection } from "./VotingSection";
import { transformWhiteCardArray } from "Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import { happyToast } from "Utilities/toasts";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import { act } from "react-dom/test-utils";
import { kardsRender } from "Tests/testRenders";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseVote } from "Tests/testHelpers";
import { initialVoteState } from "State/Vote/VoteState";
import { mockedAxios, service } from "setupTests";
import { fetchSubmittedCards } from "Services/GameService";
import { AxiosResponse } from "axios";

const mockFetchRoundWinner = jest.fn();
const mockDispatch = jest.fn();

jest.mock("../Utilities/toasts");
jest.mock("../Services/PusherService");
jest.mock("../Hooks/Game/UseFetchRoundWinner", () => {
  return () => mockFetchRoundWinner;
});

const { data } = gameStateAllPlayerSubmittedCardsExampleResponse;

const game = {
  id: data.id,
  code: data.code,
  name: data.name,
  judge_id: data.judge.id,
  redrawLimit: data.redrawLimit
};

const mockProps = {
  game,
  judge: transformUser(data.judge),
  users: transformUsers(data.users),
  hand: transformWhiteCardArray(data.hand, false, []),
  blackCard: data.blackCard,
};

let auth = transformUser(data.currentUser);
const mockHasSubmittedWhiteCards = data.hasSubmittedWhiteCards;

const renderer = async (): Promise<RenderResult> => {
  return kardsRender(<VotingSection />);
};

describe("VotingSection", () => {
  beforeEach(() => {
    spyOnUseGame({ game, judge: mockProps.judge, blackCard: mockProps.blackCard, });
    spyOnUseAuth({ auth, hasSubmittedCards: mockHasSubmittedWhiteCards});
  })

  describe("Api call", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    });

    it("calls backend api for submitted cards", async () => {
      await renderer();

      await waitFor(() => {
        expect(fetchSubmittedCards).toHaveBeenCalledTimes(1);
        expect(fetchSubmittedCards).toHaveBeenCalledWith(
          mockProps.game.id
        );
      });
    });

    it("catches axios error if api call fails", async () => {
      const errorMessage = { message: "failed api call" };
      service.fetchSubmittedCards.mockRejectedValueOnce(errorMessage)
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await renderer();

      await waitFor(() => {
        expect(consoleSpy).toBeCalledWith(errorMessage);
      });
      consoleSpy.mockRestore();
    });

    it("submits selected winner to api", async () => {
      const { user_id } = submittedCardsResponse.data[0];

      const wrapper = await renderer();

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(`player-submitted-response-${user_id}`)
        );
      });

      userEvent.click(wrapper.getByTestId("submit-selected-winner"));

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          `/api/game/${mockProps.game.id}/winner`,
          { user_id }
        );
        expect(happyToast).toHaveBeenCalledWith("Winner Selected!", "top");
      });
    });

    it("catches error if submitting winner api call fails", async () => {
      const apiPostError = { message: "api failed" };
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => apiPostError);
      mockedAxios.post.mockRejectedValueOnce(apiPostError);
      const { user_id } = submittedCardsResponse.data[0];

      const wrapper = await renderer();

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(`player-submitted-response-${user_id}`)
        );
      });

      userEvent.click(wrapper.getByTestId("submit-selected-winner"));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(apiPostError);
      });
      consoleSpy.mockRestore();
    });

    it("will not allow user to submit winner without selecting a winner first", async () => {
      const wrapper = await renderer();

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId("submit-selected-winner"));
      });

      await waitFor(() => {
        expect(wrapper.queryByTestId(`submit-selected-winner`)).toHaveClass(
          "disabled cursor-not-allowed opacity-75"
        );
        expect(mockedAxios.post).not.toHaveBeenCalled();
      });
    });
  });

  describe("pusher events", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    });
    it("listens on winner selected pusher event when loading game page", async () => {
      await act(async () => {
        await renderer();
      });

      expect(listenWhenWinnerIsSelected).toHaveBeenCalledWith(
        game.id,
        mockFetchRoundWinner
      );
    });
  });

  describe("select a player submitted card", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    });

    it("allows user to select a player submitted card", async () => {
      const wrapper = await renderer();
      const { user_id } = submittedCardsResponse.data[0];

      const submittedCardElement = await waitFor(() => {
        return wrapper.getByTestId(`selectable-${user_id}`);
      });
      userEvent.click(submittedCardElement);

      await waitFor(() => {
        expect(submittedCardElement).toHaveClass("opacity-75");
      });
    });

    it("will not show submit winner button when user is not the judge", async () => {
      spyOnUseGame({
        game: {...mockProps.game, judge_id: mockProps.users[0].id},
        judge: mockProps.users[0],
        blackCard: mockProps.blackCard
      });
      const wrapper = await renderer();

      await waitFor(() => {
        expect(
          wrapper.queryByTestId("submit-selected-winner")
        ).not.toBeInTheDocument();
      });
    });

    it("calls dispatch with correct action and payload when a user is selected", async () => {
      spyOnUseVote(initialVoteState, mockDispatch);
      const wrapper = await renderer();
      const { user_id } = submittedCardsResponse.data[0];

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(`player-submitted-response-${user_id}`)
        );
      });

      await waitFor(() => {
        expectDispatch(mockDispatch, user_id);
      });
    });

    it("does not show submit winner button when a winner is in state", async () => {
      spyOnUseVote({
        selectedRoundWinner: { ...submittedCardsResponse.data[0], black_card: mockProps.blackCard, },
        selectedPlayerId: -1
      });
      const wrapper = await renderer();

      await waitFor(() => {
        expect(
          wrapper.queryByTestId("submit-selected-winner")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("displaying players submitted card", () => {
    beforeEach(() => {
      service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
      spyOnUseVote({ selectedPlayerId: -1, selectedRoundWinner: undefined}, mockDispatch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("will display players submitted card", async () => {
      const wrapper = await renderer();

      await waitFor(() => {
        submittedCardsResponse.data.forEach((submittedData) => {
          expect(
            wrapper.queryByTestId(
              `player-submitted-response-${submittedData.user_id}`
            )
          ).toBeInTheDocument();

          submittedData.submitted_cards.forEach((card) =>
            expect(
              wrapper.queryByTestId(
                `player-card-response-${submittedData.user_id}`
              )?.textContent
            ).toEqual(expect.stringContaining(card.text.replace(".", "")))
          );
        });
      });
    });

    it("will display players submitted cards in order", async () => {
      const submittedResponse = submittedCardsResponse.data[0];
      const sortedCards = submittedResponse.submitted_cards.sort(
        (left, right) => left.order - right.order
      );

      const { text: blackCardText } = data.blackCard;

      const expectedCardText = blackCardText
        .replace("_", sortedCards[0].text.replace(/\.$/, ""))
        .replace("_", sortedCards[1].text.replace(/\.$/, ""));

      const wrapper = await renderer();

      await waitFor(() => {
        const submittedCard = wrapper.getByTestId(
          `player-card-response-${submittedResponse.user_id}`
        );
        expect(submittedCard.textContent).toEqual(expectedCardText);
      });
    });

    it("will not allow non judge users to select submitted cards", async () => {
      spyOnUseAuth({ auth: mockProps.users[0], hasSubmittedCards: false});
      const wrapper = await renderer();

      const [submittedCard] = submittedCardsResponse.data;

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(`player-card-response-${submittedCard.user_id}`)
        );
      });
      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });
  });
});
