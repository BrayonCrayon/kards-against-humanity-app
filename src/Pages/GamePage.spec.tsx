import {screen, waitFor} from "@testing-library/react";
import GamePage from "./GamePage";
import {gameStateExampleResponse} from "Api/fixtures/gameStateExampleResponse";
import {listenWhenGameRotates, listenWhenUserJoinsGame, listenWhenUserSubmittedCards} from "Services/PusherService";
import userEvent from "@testing-library/user-event";
import {gameStateSubmittedWhiteCardsExampleResponse} from "Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import {getWhiteCardElement, selectedCardClass, whiteCardOrderTestId, whiteCardTestId} from "Tests/selectors";
import {selectAndSubmitWhiteCards, selectWhiteCards, togglePlayerList} from "Tests/actions";
import {gameStateJudgeExampleResponse} from "Api/fixtures/gameStateJudgeExampleResponse";
import {kardsRender} from "Tests/testRenders";
import {
  gameStateAllPlayerSubmittedCardsExampleResponse
} from "Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import {submittedCardsResponse} from "Api/fixtures/submittedCardsResponse";
import {gameStateOnePlayerInGameExampleResponse} from "Api/fixtures/gameStateOnePlayerInGameExampleResponse";
import {service} from "setupTests";
import {fetchState} from "Services/GameService";
import {AxiosResponse} from "axios";
import {confirmedSweetAlert, spyOnUseVote} from "Tests/testHelpers";
import {blackCardFixture} from "Api/fixtures/blackcardFixture";
import {gameStatePickTwoExampleResponse} from "Api/fixtures/gameStatePickTwoExampleResponse";

jest.mock("../Services/PusherService");
jest.mock("../Utilities/toasts");

let mockGameId = gameStateExampleResponse.data.game.id;
const cardsInHand = gameStateExampleResponse.data.hand;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: mockGameId,
  }),
}));

jest.mock("Hooks/Game/State/useGameStateCallback", () => {
  return () => jest.fn();
});

describe("GamePage", () => {
  beforeEach(() => {
    // @ts-ignore
    service.fetchState.mockResolvedValue(gameStateExampleResponse);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("Displaying game features", () => {
    it("shows users hand of seven white cards", async () => {
      const wrapper = kardsRender(<GamePage />);

      await waitFor(() => {
        cardsInHand.forEach((card) => {
          const whiteCardElement = wrapper.getByTestId(whiteCardTestId(card.id));
          expect(whiteCardElement).not.toBeNull();
        });
      });
    });

    it("displays the black card", async () => {
      const blackCard = gameStateExampleResponse.data.blackCard;
      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        expect(wrapper.queryByTestId(`black-card-${blackCard.id}`)).toBeInTheDocument();
        expect(wrapper.queryByTestId(`black-card-${blackCard.id}`)).toHaveTextContent(blackCard.text);
      });
    });
  });

  describe("Api call", () => {
    it("performs an api call to get game state data to be loaded on refresh", async () => {
      // @ts-ignore
      service.fetchState.mockResolvedValueOnce(gameStateExampleResponse);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await kardsRender(<GamePage />);

      await waitFor(() => {
        expect(fetchState).toHaveBeenCalledWith(mockGameId);
        expect(consoleSpy).not.toHaveBeenCalled();
        expect(listenWhenUserJoinsGame).toHaveBeenCalled();
      });
    });

    it("catches error if api call to fetch game state fails", async () => {
      const errorResponse = { message: "No Api" };
      service.fetchState.mockRejectedValueOnce(errorResponse);
      console.error = jest.fn();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await kardsRender(<GamePage />);

      await waitFor(() => {
        expect(consoleSpy).toBeCalledWith(errorResponse);
      });
    });

    it("shows names of users after api call", async () => {
      const wrapper = await kardsRender(<GamePage />);

      await togglePlayerList();

      await waitFor(() => {
        gameStateExampleResponse.data.users.forEach((user) => {
          const userElement = wrapper.getByTestId(`user-${user.id}`);
          expect(userElement).toBeInTheDocument();
          expect(userElement.textContent).toContain(user.name);
        });
      });
    });
  });

  it("listens on user joins pusher event when loading game page", async () => {
    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(listenWhenUserJoinsGame).toHaveBeenCalled();
    });
  });

  it("listens on user joins pusher event when user refreshes game page", async () => {
    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(listenWhenUserJoinsGame).toHaveBeenCalled();
    });
  });

  it("listens on game rotate pusher event when user refreshes game page", async () => {
    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(listenWhenGameRotates).toHaveBeenCalled();
    });
  });

  it("listens on submitted cards pusher event when game page is loaded", async () => {
    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(listenWhenUserSubmittedCards).toHaveBeenCalled();
    });
  });

  it("listens on rotate game pusher event when game page is loaded", async () => {
    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(listenWhenGameRotates).toHaveBeenCalled();
    });
  });

  it("changes user name colour when we receive submitted cards event from pusher", async () => {
    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(listenWhenUserSubmittedCards).toHaveBeenCalled();
    });
  });

  describe("Selecting Cards", () => {
    beforeEach(() => {
      service.fetchState.mockResolvedValue(gameStateExampleResponse as AxiosResponse);
    });

    it("shows all cards visibly", async () => {
      await kardsRender(<GamePage />);

      await waitFor(() => {
        gameStateExampleResponse.data.hand.forEach((item) => {
          expect(getWhiteCardElement(item.id)).not.toHaveClass("opacity-25");
        });
      });
    });

    it("applies correct class when a white card is selected", async () => {
      const cardsToSelect = gameStateExampleResponse.data.hand.slice(0, blackCardFixture.pick);
      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(whiteCardTestId(cardsToSelect[0].id)));
      });

      await waitFor(() => {
        expect(wrapper.getByTestId(whiteCardTestId(cardsToSelect[0].id))).toHaveClass(selectedCardClass);
      });
    });

    it("sets next selected card to the last pick order when select limit is reached", async () => {
      service.fetchState.mockResolvedValueOnce(gameStatePickTwoExampleResponse as AxiosResponse);
      const { hand, blackCard } = gameStatePickTwoExampleResponse.data;
      const cardsToSelect = hand.slice(0, blackCard.pick);
      const nextCardToSelect = hand[blackCard.pick];
      const wrapper = await kardsRender(<GamePage />);

      await selectWhiteCards(cardsToSelect);

      await waitFor(() => {
        userEvent.click(getWhiteCardElement(nextCardToSelect.id)!);
      });

      await waitFor(() => {
        expect(getWhiteCardElement(cardsToSelect[0].id)).not.toHaveClass(selectedCardClass);
        expect(wrapper.queryByTestId(whiteCardOrderTestId(cardsToSelect[0].id))).toBeNull();

        expect(getWhiteCardElement(cardsToSelect[1].id)).toHaveClass(selectedCardClass);
        expect(wrapper.getByTestId(whiteCardOrderTestId(cardsToSelect[1].id))).toHaveTextContent("1");

        expect(getWhiteCardElement(nextCardToSelect.id)).toHaveClass(selectedCardClass);
        expect(wrapper.getByTestId(whiteCardOrderTestId(nextCardToSelect.id))).toHaveTextContent("2");
      });
    });
  });

  describe("Judging", () => {
    it("will remove player from players list when kicked", async () => {
      // @ts-ignore
      service.fetchState.mockResolvedValueOnce(gameStateJudgeExampleResponse);
      const { users, currentUser } = gameStateJudgeExampleResponse.data;
      const [playerToKick] = users.filter((item) => item.id !== currentUser.id);
      const sweetSpy = confirmedSweetAlert(true);
      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => togglePlayerList());

      await waitFor(() => userEvent.click(wrapper.getByTestId(`kick-player-${playerToKick.id}`)));

      expect(wrapper.queryByTestId(`user-${playerToKick.id}`)).not.toBeInTheDocument();
      sweetSpy.mockReset();
    });

    it("will not display white cards when current user is judge", async () => {
      service.fetchState.mockResolvedValueOnce(gameStateJudgeExampleResponse as AxiosResponse);
      const cards = gameStateJudgeExampleResponse.data.hand;

      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        cards.forEach((item) => {
          expect(wrapper.queryByTestId(whiteCardTestId(item.id))).toBeNull();
        });
      });
    });

    it("will not display submit white cards button when current user is judge", async () => {
      service.fetchState.mockResolvedValueOnce(gameStateJudgeExampleResponse as AxiosResponse);

      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        expect(wrapper.queryByTestId("white-card-submit-btn")).toBeNull();
      });
    });
  });

  describe("Submitting cards", () => {
    beforeEach(() => {
      service.fetchState.mockResolvedValue(gameStateExampleResponse as AxiosResponse);
      service.submitCards.mockResolvedValue({} as AxiosResponse);
    });

    it("can submit white card selection", async () => {
      const wrapper = await kardsRender(<GamePage />);
      const {
        data: { game, blackCard, hand },
      } = gameStateExampleResponse;
      const [cardToSelect] = hand;

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
      });

      await waitFor(() => userEvent.click(wrapper.getByTestId("submit")));

      await waitFor(() => {
        expect(service.submitCards).toHaveBeenCalledWith(game.id, blackCard.pick, [cardToSelect.id]);
      });
    });

    it("will not show cards when user has submitted", async () => {
      const hand = gameStateExampleResponse.data.hand;
      const [cardToSelect] = hand;
      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
      });

      await waitFor(() => userEvent.click(wrapper.getByTestId("submit")));

      await waitFor(() => {
        hand.forEach((card) => expect(getWhiteCardElement(card.id)).not.toBeInTheDocument());
      });
    });

    it("will console error when submit white cards api call fails", async () => {
      const apiFailedResponse = { message: "500 error" };
      service.submitCards.mockRejectedValueOnce(apiFailedResponse);
      const wrapper = await kardsRender(<GamePage />);
      const [cardToSelect] = gameStateExampleResponse.data.hand;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
      });

      await waitFor(() => userEvent.click(wrapper.getByTestId("submit")));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(apiFailedResponse);
      });
    });

    it("will not show submit card button when no cards are selected", async () => {
      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        expect(wrapper.queryByTestId("white-card-submit-btn")).not.toBeInTheDocument();
      });
    });

    it("will not show submit card button when they have already submitted", async () => {
      service.fetchState.mockResolvedValueOnce(gameStateSubmittedWhiteCardsExampleResponse as AxiosResponse);

      const wrapper = await kardsRender(<GamePage />);

      await waitFor(() => {
        expect(wrapper.queryByTestId("white-card-submit-btn")).not.toBeInTheDocument();
      });
    });

    it("will not show hand after user refresh", async () => {
      service.fetchState.mockResolvedValue(gameStateSubmittedWhiteCardsExampleResponse as AxiosResponse);
      const hand = gameStateSubmittedWhiteCardsExampleResponse.data.hand;

      await kardsRender(<GamePage />);

      await waitFor(() => {
        hand.forEach((card) => expect(getWhiteCardElement(card.id)).not.toBeInTheDocument());
      });
    });

    it("will tell user they have submitted their cards", async () => {
      service.fetchState.mockResolvedValueOnce(gameStateSubmittedWhiteCardsExampleResponse as AxiosResponse);
      const wrapper = await waitFor(() => {
        return kardsRender(<GamePage />);
      });

      expect(wrapper.queryByText("You have submitted your cards, sit tight for judging.")).toBeInTheDocument();
    });

    it("will hide submitted message when all players have submitted their cards", async () => {
      const state = {
        ...gameStateAllPlayerSubmittedCardsExampleResponse.data,
        currentUser: gameStateAllPlayerSubmittedCardsExampleResponse.data.users[0],
      };
      service.fetchState.mockResolvedValueOnce({ data: state } as AxiosResponse);
      service.fetchSubmittedCards.mockResolvedValueOnce(submittedCardsResponse as AxiosResponse);
      const wrapper = await waitFor(() => {
        return kardsRender(<GamePage />);
      });

      expect(wrapper.queryByText("You have submitted your cards, sit tight for judging.")).toBeNull();
    });

    describe("Selecting cards", () => {
      const cardsToSelect = gameStateExampleResponse.data.hand.slice(0, 2).reverse();

      beforeAll(() => {
        gameStateExampleResponse.data.blackCard.pick = 2;
      });

      it("when submitting two white cards the order is maintained", async () => {
        const {
          data: { game },
        } = gameStateExampleResponse;
        await kardsRender(<GamePage />);

        await selectAndSubmitWhiteCards(cardsToSelect);

        await waitFor(() => {
          expect(service.submitCards).toHaveBeenCalledWith(
            game.id,
            cardsToSelect.length,
            cardsToSelect.map((item) => item.id)
          );
        });
      });
      it("when selecting and deselecting cards, order is properly updated", async () => {
        const {
          data: { game },
        } = gameStateExampleResponse;
        await kardsRender(<GamePage />);

        await selectAndSubmitWhiteCards(cardsToSelect);

        await waitFor(() => {
          expect(service.submitCards).toHaveBeenCalledWith(
            game.id,
            cardsToSelect.length,
            cardsToSelect.map((item) => item.id)
          );
        });
      });
      it("indicator of card matches card order", async () => {
        const wrapper = await kardsRender(<GamePage />);

        await selectWhiteCards(cardsToSelect);

        await waitFor(() => {
          let order = 1;
          cardsToSelect.forEach((card) => {
            expect(wrapper.queryByTestId(whiteCardOrderTestId(card.id))).toHaveTextContent(order.toString());
            ++order;
          });
        })
      });
    });
  });
});

describe("Voting section", () => {
  it("should not be visible if judge player is the only player in game", async () => {
    service.fetchState.mockResolvedValueOnce(gameStateOnePlayerInGameExampleResponse as AxiosResponse);

    await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(screen.queryByTestId("voting-section")).not.toBeInTheDocument();
    });
  });

  it("is shown when all players have submitted their cards", async () => {
    service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    service.fetchState.mockResolvedValueOnce(gameStateAllPlayerSubmittedCardsExampleResponse as AxiosResponse);

    const wrapper = await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(wrapper.getByTestId("voting-section")).toBeInTheDocument();
    });
  });

  it("does not show voting section when not all players have submitted their cards", async () => {
    service.fetchState.mockResolvedValueOnce(gameStateExampleResponse as AxiosResponse);

    const wrapper = await kardsRender(<GamePage />);

    await waitFor(() => {
      expect(wrapper.queryByTestId("voting-section")).not.toBeInTheDocument();
    });
  });

  it("hides card selection when all players have submitted their cards", async () => {
    const { data } = gameStateAllPlayerSubmittedCardsExampleResponse;
    data.currentUser = data.users[0];
    service.fetchState.mockResolvedValueOnce({ data } as AxiosResponse);
    service.fetchSubmittedCards.mockResolvedValueOnce(submittedCardsResponse as AxiosResponse);

    await kardsRender(<GamePage />);

    await waitFor(() => {
      data.hand.forEach((card) => expect(getWhiteCardElement(card.id)).not.toBeInTheDocument());
      expect(screen.queryByTestId("white-card-submit-btn")).not.toBeInTheDocument();
    });
  });

  it("can display round winner", async () => {
    service.fetchState.mockResolvedValueOnce(gameStateExampleResponse as AxiosResponse);
    const [submittedCard] = submittedCardsResponse.data[0].submitted_cards;
    spyOnUseVote(jest.fn(), {
      selectedPlayerId: -1,
      selectedRoundWinner: {
        user_id: 1,
        submitted_cards: [submittedCard],
        black_card: gameStateExampleResponse.data.blackCard,
      },
    });

    const wrapper = await kardsRender(<GamePage />);

    expect(await wrapper.findByTestId("round-winner-modal")).toBeInTheDocument();
  });
});