import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { RenderResult, waitFor } from "@testing-library/react";
import { apiClient } from "Api/apiClient";
import { transformUser, transformUsers } from "Types/User";
import { VotingSection } from "./VotingSection";
import { constructWhiteCardArray } from "Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import * as Vote from "State/Vote/VoteContext";
import { happyToast } from "Utilities/toasts";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import { act } from "react-dom/test-utils";
import { kardsRender } from "Tests/testRenders";
import { IGameState } from "../State/Game/GameState";

const mockFetchRoundWinner = jest.fn();
const mockDispatch = jest.fn();

jest.mock("../Api/apiClient");
jest.mock("../Utilities/toasts");
jest.mock("../Services/PusherService");
jest.mock("../Hooks/Game/UseFetchRoundWinner", () => {
  return () => mockFetchRoundWinner;
});

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const gameFixture = {
  id: "063a4fa2-7ab7-46d5-b59f-f0d15bb17f65",
  code: "1234",
  name: "Puzzled Penguin",
  judge_id: gameStateAllPlayerSubmittedCardsExampleResponse.data.judge.id,
};

const mockProps = {
  game: gameFixture,
  judge: transformUser(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.judge
  ),
  users: transformUsers(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.users
  ),
  hand: constructWhiteCardArray(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.hand,
    false,
    []
  ),
  blackCard:
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card,
};

let mockUser = transformUser(
  gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user
);
const mockHasSubmittedWhiteCards =
  gameStateAllPlayerSubmittedCardsExampleResponse.data.hasSubmittedWhiteCards;
jest.mock("../State/User/UserContext", () => ({
  ...jest.requireActual("../State/User/UserContext"),
  useUser: () => ({
    state: {
      user: mockUser,
      hasSubmittedWhiteCards: mockHasSubmittedWhiteCards,
    },
    dispatch: () => {},
  }),
}));

jest.mock("State/Game/GameContext", () => ({
  ...jest.requireActual("State/Game/GameContext"),
  useGame: () => ({
    state: {
      game: mockProps.game,
      judge: mockProps.judge,
      blackCard: mockProps.blackCard,
    },
    dispatch: jest.fn(),
  }),
}));

const renderer = async (): Promise<RenderResult> => {
  return kardsRender(<VotingSection />);
};

describe("VotingSection", () => {
  describe("Api call", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(submittedCardsResponse);
    });

    it("calls backend api for submitted cards", async () => {
      await renderer();

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `/api/game/${mockProps.game.id}/submitted-cards`
        );
      });
    });

    it("catches axios error if api call fails", async () => {
      const errorMessage = { message: "failed api call" };
      mockedAxios.get.mockRejectedValueOnce(errorMessage);
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
      mockedAxios.get.mockResolvedValue(submittedCardsResponse);
    });
    it("listens on winner selected pusher event when loading game page", async () => {
      await act(async () => {
        await renderer();
      });

      expect(listenWhenWinnerIsSelected).toHaveBeenCalledWith(
        gameFixture.id,
        mockFetchRoundWinner
      );
    });
  });

  describe("select a player submitted card", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(submittedCardsResponse);
    });

    afterEach(() => {
      jest.clearAllMocks();
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
      mockProps.judge = mockProps.users[0];
      mockProps.game.judge_id = mockProps.judge.id;
      const wrapper = await renderer();

      await waitFor(() => {
        expect(
          wrapper.queryByTestId("submit-selected-winner")
        ).not.toBeInTheDocument();
      });
    });

    it.skip("calls dispatch with correct action and payload when a user is selected", async () => {
      mockUser = mockProps.users[3];
      jest.spyOn(Vote, "useVote").mockImplementation(() => ({
        dispatch: mockDispatch,
        state: {
          selectedPlayerId: -1,
          selectedRoundWinner: undefined,
        },
      }));
      const wrapper = await renderer();
      const { user_id } = submittedCardsResponse.data[0];

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(`player-submitted-response-${user_id}`)
        );
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            execute: expect.any(Function),
            payload: user_id,
          })
        );
      });
      mockUser = mockProps.users[0];
    });

    it("does not show submit winner button when a winner is in state", async () => {
      jest.spyOn(Vote, "useVote").mockImplementation(() => ({
        dispatch: jest.fn(),
        state: {
          selectedPlayerId: -1,
          selectedRoundWinner: {
            ...submittedCardsResponse.data[0],
            black_card: mockProps.blackCard,
          },
        },
      }));
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
      mockedAxios.get.mockResolvedValue(submittedCardsResponse);
      jest.spyOn(Vote, "useVote").mockImplementation(() => ({
        dispatch: mockDispatch,
        state: {
          selectedPlayerId: -1,
          selectedRoundWinner: undefined,
        },
      }));
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

      const { text: blackCardText } =
        gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card;

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
