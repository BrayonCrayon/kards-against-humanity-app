import { act, RenderResult, waitFor, screen } from "@testing-library/react";
import GamePage from "./GamePage";
import { IGameContext, initialState } from "../State/Game/GameContext";
import { apiClient } from "../Api/apiClient";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { whiteCardFixture as cardsInHand } from "../Api/fixtures/whiteCardFixture";
import { userFixture } from "../Api/fixtures/userFixture";
import { blackCardFixture } from "../Api/fixtures/blackcardFixture";
import { gameFixture } from "../Api/fixtures/gameFixture";
import { transformUsers } from "../Types/User";
import {
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards,
} from "../Services/PusherService";
import userEvent from "@testing-library/user-event";
import { happyToast } from "../Utilities/toasts";
import { gameStateSubmittedWhiteCardsExampleResponse } from "../Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import {
  cannotSelectCardClass,
  getWhiteCardElement,
  selectedCardClass,
  whiteCardOrderTestId,
  whiteCardTestId,
} from "../Tests/selectors";
import { selectAndSubmitWhiteCards, selectWhiteCards } from "../Tests/actions";
import { gameStateJudgeExampleResponse } from "../Api/fixtures/gameStateJudgeExampleResponse";
import {
  customGameWrapperRender,
  gameWrapperRender,
} from "../Tests/testRenders";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";
import { gameStateOnePlayerInGameExampleResponse } from "../Api/fixtures/gameStateOnePlayerInGameExampleResponse";

jest.mock("../Api/apiClient");
jest.mock("../Services/PusherService");
jest.mock("../Utilities/toasts");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const gameId = "123123";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: gameId,
  }),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

const setHand = jest.fn();
const setHasSubmittedCards = jest.fn();
const setUsers = jest.fn();
const updateGameStateCallback = jest.fn();

const renderer = (value?: Partial<IGameContext>): RenderResult => {
  return customGameWrapperRender(<GamePage />, {
    ...initialState,
    setHand,
    setHasSubmittedCards,
    setUsers,
    updateGameStateCallback,
    game: gameFixture,
    user: userFixture,
    users: transformUsers(gameStateExampleResponse.data.users),
    hand: cardsInHand,
    blackCard: blackCardFixture,
    ...value,
  });
};

describe("GamePage", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("Displaying game features", () => {
    it("shows users hand of seven white cards", async () => {
      const wrapper = renderer();

      await waitFor(() => {
        cardsInHand.forEach((card) => {
          const whiteCardElement = wrapper.queryByTestId(
            whiteCardTestId(card.id)
          );
          expect(whiteCardElement).not.toBeNull();
        });
      });
    });

    it("shows game code", async () => {
      const wrapper = renderer();

      await waitFor(() => {
        const gameCodeDisplayElement = wrapper.queryByTestId(
          `game-${gameFixture.id}`
        ) as HTMLElement;
        expect(gameCodeDisplayElement).not.toBeNull();
        expect(gameCodeDisplayElement).toHaveTextContent(gameFixture.code);
      });
    });

    it("displays notification when game code is clicked", async () => {
      const wrapper = renderer();

      const gameIdDisplayElement = wrapper.queryByTestId(
        `game-${gameFixture.id}`
      ) as HTMLElement;
      gameIdDisplayElement.click();

      await waitFor(() => {
        expect(happyToast).toHaveBeenCalledWith(
          "Game code copied!",
          "top-start"
        );
      });
    });

    it("displays the user's name", async () => {
      const wrapper = renderer();

      expect(wrapper.getByText(userFixture.name)).toBeInTheDocument();
    });

    it("displays the black card", () => {
      const wrapper = renderer();

      expect(
        wrapper.queryByTestId(`black-card-${blackCardFixture.id}`)
      ).toBeInTheDocument();
      expect(
        wrapper.queryByTestId(`black-card-${blackCardFixture.id}`)
      ).toHaveTextContent(blackCardFixture.text);
    });
  });

  it("copies game code to clipboard when clicked", async () => {
    jest.spyOn(navigator.clipboard, "writeText");

    const wrapper = renderer();

    const gameIdDisplayElement = wrapper.queryByTestId(
      `game-${gameFixture.id}`
    ) as HTMLElement;
    gameIdDisplayElement.click();
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toBeCalledWith(gameFixture.code);
    });
  });

  it("performs an api call to get game state data to be loaded on refresh", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderer({ ...initialState, setUsers, updateGameStateCallback });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${gameId}`);
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(setUsers).toHaveBeenCalledWith(
        transformUsers(gameStateExampleResponse.data.users)
      );
      expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(
        gameId,
        updateGameStateCallback
      );
    });
  });

  it("catches error if api call to fetch game state fails", async () => {
    const errorResponse = { message: "No Api" };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    console.error = jest.fn();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderer(initialState);

    await waitFor(() => {
      expect(consoleSpy).toBeCalledWith(errorResponse);
    });
  });

  it("shows names of users after api call", () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const wrapper = renderer();

    gameStateExampleResponse.data.users.forEach((user) => {
      expect(wrapper.getByText(user.name)).toBeInTheDocument();
    });
  });

  it("listens on user joins pusher event when loading game page", () => {
    renderer();

    expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(
      gameFixture.id,
      updateGameStateCallback
    );
  });

  it("listens on user joins pusher event when user refreshes game page", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);
    renderer({ ...initialState, updateGameStateCallback });

    await waitFor(() => {
      expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(
        gameId,
        updateGameStateCallback
      );
    });
  });

  it("listens on submitted cards pusher event when game page is loaded", () => {
    renderer();

    expect(listenWhenUserSubmittedCards).toHaveBeenCalledWith(
      gameFixture.id,
      updateGameStateCallback
    );
  });

  it("changes user name colour when we receive submitted cards event from pusher", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);
    renderer({ ...initialState, updateGameStateCallback });

    await waitFor(() => {
      expect(listenWhenUserSubmittedCards).toHaveBeenCalledWith(
        gameId,
        updateGameStateCallback
      );
    });
  });

  describe("Selecting Cards", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);
    });

    it("shows all cards visibly", async () => {
      gameWrapperRender(<GamePage />);

      await waitFor(() => {
        gameStateExampleResponse.data.hand.forEach((item) => {
          expect(getWhiteCardElement(item.id)).not.toHaveClass("opacity-25");
        });
      });
    });

    it("calls set hand when a user selects a card", async () => {
      const wrapper = renderer();

      const [cardToSelect] = cardsInHand;

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
      });

      expect(setHand).toHaveBeenCalled();
    });

    it("applies correct class when a white card is selected", async () => {
      const cardsToSelect = gameStateExampleResponse.data.hand.slice(
        0,
        blackCardFixture.pick
      );
      const wrapper = gameWrapperRender(<GamePage />);

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(whiteCardTestId(cardsToSelect[0].id))
        );
      });

      await waitFor(() => {
        expect(
          wrapper.getByTestId(whiteCardTestId(cardsToSelect[0].id))
        ).toHaveClass(selectedCardClass);
      });
    });

    it("sets next selected card to the last pick order when select limit is reached", async () => {
      gameStateExampleResponse.data.current_black_card.pick = 2;
      const cardsToSelect = gameStateExampleResponse.data.hand.slice(
        0,
        gameStateExampleResponse.data.current_black_card.pick
      );
      const nextCardToSelect =
        gameStateExampleResponse.data.hand[
          gameStateExampleResponse.data.current_black_card.pick
        ];
      const wrapper = gameWrapperRender(<GamePage />);

      await selectWhiteCards(cardsToSelect);

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(whiteCardTestId(nextCardToSelect.id))
        );
      });

      await waitFor(() => {
        expect(getWhiteCardElement(cardsToSelect[0].id)).not.toHaveClass(
          selectedCardClass
        );
        expect(
          wrapper.queryByTestId(whiteCardOrderTestId(cardsToSelect[0].id))
        ).toBeNull();

        expect(getWhiteCardElement(cardsToSelect[1].id)).toHaveClass(
          selectedCardClass
        );
        expect(
          wrapper.getByTestId(whiteCardOrderTestId(cardsToSelect[1].id))
        ).toHaveTextContent("1");

        expect(getWhiteCardElement(nextCardToSelect.id)).toHaveClass(
          selectedCardClass
        );
        expect(
          wrapper.getByTestId(whiteCardOrderTestId(nextCardToSelect.id))
        ).toHaveTextContent("2");
      });
    });
  });

  describe("Judging", () => {
    it("will not display white cards when current user is judge", async () => {
      mockedAxios.get.mockResolvedValueOnce(gameStateJudgeExampleResponse);
      const cards = gameStateJudgeExampleResponse.data.hand;

      const wrapper = gameWrapperRender(<GamePage />);

      await waitFor(() => {
        cards.forEach((item) => {
          expect(wrapper.queryByTestId(whiteCardTestId(item.id))).toBeNull();
        });
      });
    });

    it("will not display submit white cards button when current user is judge", async () => {
      mockedAxios.get.mockResolvedValueOnce(gameStateJudgeExampleResponse);

      const wrapper = gameWrapperRender(<GamePage />);

      await waitFor(() => {
        expect(wrapper.queryByTestId("white-card-submit-btn")).toBeNull();
      });
    });
  });
});

describe("Submitting cards", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(gameStateExampleResponse);
    mockedAxios.post.mockResolvedValue({});
  });

  it("can submit white card selection", async () => {
    const wrapper = gameWrapperRender(<GamePage />);
    const [cardToSelect] = gameStateExampleResponse.data.hand;

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
    });

    userEvent.click(wrapper.getByTestId("white-card-submit-btn"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/api/game/${gameStateExampleResponse.data.id}/submit`,
        {
          submitAmount: gameStateExampleResponse.data.current_black_card.pick,
          whiteCardIds: [cardToSelect.id],
        }
      );
    });
  });

  it("visually disables cards when selected cards are submitted", async () => {
    const cardsToSelect = gameStateExampleResponse.data.hand.slice(
      0,
      blackCardFixture.pick
    );
    const wrapper = gameWrapperRender(<GamePage />);

    await waitFor(() => {
      userEvent.click(
        wrapper.getByTestId(whiteCardTestId(cardsToSelect[0].id))
      );
    });

    userEvent.click(wrapper.getByTestId("white-card-submit-btn"));

    await waitFor(() => {
      expect(
        wrapper.getByTestId(whiteCardTestId(cardsToSelect[1].id))
      ).toHaveClass(cannotSelectCardClass);
    });
  });

  it("will console error when submit white cards api call fails", async () => {
    const apiFailedResponse = { message: "500 error" };
    mockedAxios.post.mockRejectedValueOnce(apiFailedResponse);
    const wrapper = gameWrapperRender(<GamePage />);
    const [cardToSelect] = gameStateExampleResponse.data.hand;
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
    });

    userEvent.click(wrapper.getByTestId("white-card-submit-btn"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(apiFailedResponse);
    });
  });

  it("will not allow api to be called when no cards are selected", async () => {
    const wrapper = gameWrapperRender(<GamePage />);

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId("white-card-submit-btn"));
    });

    await waitFor(() => {
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });

  it("will make submit white card button disabled when user has submitted their cards", async () => {
    const wrapper = gameWrapperRender(<GamePage />);
    const cardsToSelect = gameStateExampleResponse.data.hand.slice(
      0,
      gameStateExampleResponse.data.current_black_card.pick
    );

    await selectWhiteCards(cardsToSelect);

    const submitButton = wrapper.getByTestId("white-card-submit-btn");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass(
        "shadow-inner opacity-70 cursor-not-allowed"
      );
      expect(submitButton).not.toHaveClass("hover:bg-gray-200");
    });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).not.toBeCalledTimes(2);
    });
  });

  it("will not allow user to toggle white cards after they have submitted their cards", async () => {
    const wrapper = gameWrapperRender(<GamePage />);
    const cardsToSelect = gameStateExampleResponse.data.hand.slice(
      0,
      gameStateExampleResponse.data.current_black_card.pick
    );
    const notSelectedCards = gameStateExampleResponse.data.hand.slice(
      gameStateExampleResponse.data.current_black_card.pick,
      gameStateExampleResponse.data.hand.length - 1
    );

    await selectWhiteCards(cardsToSelect);

    await waitFor(() => {
      const submitButton = wrapper.getByTestId("white-card-submit-btn");
      userEvent.click(submitButton);
    });

    await selectWhiteCards(cardsToSelect);

    cardsToSelect.forEach((item) => {
      expect(wrapper.getByTestId(whiteCardTestId(item.id))).toHaveClass(
        selectedCardClass
      );
    });

    await selectWhiteCards(notSelectedCards);

    notSelectedCards.forEach((item) => {
      expect(wrapper.getByTestId(whiteCardTestId(item.id))).toHaveClass(
        cannotSelectCardClass
      );
    });
  });

  it("will not allow user to submit white cards when they are already submitted before refresh", async () => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse
    );

    const wrapper = gameWrapperRender(<GamePage />);

    const submitButton = await waitFor(() => {
      return wrapper.getByTestId("white-card-submit-btn");
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });

  it("will toggle already submitted white cards after user refresh", async () => {
    mockedAxios.get.mockResolvedValue(
      gameStateSubmittedWhiteCardsExampleResponse
    );
    const alreadySubmittedCardIds =
      gameStateSubmittedWhiteCardsExampleResponse.data.submittedWhiteCardIds;

    const wrapper = gameWrapperRender(<GamePage />);

    await waitFor(() => {
      alreadySubmittedCardIds.forEach((cardId) => {
        expect(wrapper.getByTestId(whiteCardTestId(cardId))).toHaveClass(
          selectedCardClass
        );
      });
    });
  });

  it("shows selected cards as not selectable when cards are submitted", async () => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse
    );
    const cards = gameStateSubmittedWhiteCardsExampleResponse.data.hand;

    gameWrapperRender(<GamePage />);

    await waitFor(() => {
      cards.forEach((item) => {
        expect(getWhiteCardElement(item.id)).toHaveClass("cursor-not-allowed");
      });
    });
  });

  it("fades unselected cards when cards are submitted", async () => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse
    );
    const cards = gameStateSubmittedWhiteCardsExampleResponse.data.hand;

    gameWrapperRender(<GamePage />);

    await waitFor(() => {
      cards
        .filter((card) =>
          gameStateSubmittedWhiteCardsExampleResponse.data.submittedWhiteCardIds.includes(
            card.id
          )
        )
        .forEach((card) =>
          expect(getWhiteCardElement(card.id)).toHaveClass(selectedCardClass)
        );

      cards
        .filter(
          (card) =>
            !gameStateSubmittedWhiteCardsExampleResponse.data.submittedWhiteCardIds.includes(
              card.id
            )
        )
        .forEach((card) =>
          expect(getWhiteCardElement(card.id)).toHaveClass(
            cannotSelectCardClass
          )
        );
    });
  });

  describe("Selecting cards", () => {
    const cardsToSelect = gameStateExampleResponse.data.hand
      .slice(0, 2)
      .reverse();

    beforeAll(() => {
      gameStateExampleResponse.data.current_black_card.pick = 2;
    });

    it("when submitting two white cards the order is maintained", async () => {
      gameWrapperRender(<GamePage />);

      await selectAndSubmitWhiteCards(cardsToSelect);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          `/api/game/${gameStateExampleResponse.data.id}/submit`,
          expect.objectContaining({
            whiteCardIds: cardsToSelect.map((card) => card.id),
          })
        );
      });
    });
    it("when selecting and deselecting cards, order is properly updated", async () => {
      gameWrapperRender(<GamePage />);

      await selectAndSubmitWhiteCards(cardsToSelect);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          `/api/game/${gameStateExampleResponse.data.id}/submit`,
          expect.objectContaining({
            whiteCardIds: cardsToSelect.map((card) => card.id),
          })
        );
      });
    });
    it("indicator of card matches card order", async () => {
      const wrapper = gameWrapperRender(<GamePage />);

      await selectWhiteCards(cardsToSelect);

      let order = 1;
      cardsToSelect.forEach((card) => {
        expect(
          wrapper.queryByTestId(whiteCardOrderTestId(card.id))
        ).toHaveTextContent(order.toString());
        ++order;
      });
    });
  });
});

describe("Voting section", () => {
  it("should not be visible if judge player is the only player in game", async () => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateOnePlayerInGameExampleResponse
    );

    await act(async () => {
      await gameWrapperRender(<GamePage />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("voting-section")).not.toBeInTheDocument();
    });
  });

  it("is shown when all players have submitted their cards", async () => {
    mockedAxios.get.mockResolvedValue(submittedCardsResponse);
    mockedAxios.get.mockResolvedValueOnce(
      gameStateAllPlayerSubmittedCardsExampleResponse
    );

    const wrapper = gameWrapperRender(<GamePage />);

    await waitFor(() => {
      expect(wrapper.getByTestId("voting-section")).toBeInTheDocument();
    });
  });

  it("does not show voting section when not all players have submitted their cards", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const wrapper = gameWrapperRender(<GamePage />);

    await waitFor(() => {
      expect(wrapper.queryByTestId("voting-section")).not.toBeInTheDocument();
    });
  });

  it("hides card selection when all players have submitted their cards", async () => {
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user =
      gameStateAllPlayerSubmittedCardsExampleResponse.data.users[0];
    mockedAxios.get.mockResolvedValueOnce(
      gameStateAllPlayerSubmittedCardsExampleResponse
    );
    mockedAxios.get.mockResolvedValueOnce(submittedCardsResponse);
    const {
      data: { hand },
    } = gameStateAllPlayerSubmittedCardsExampleResponse;

    await act(async () => {
      await gameWrapperRender(<GamePage />);
    });

    await waitFor(() => {
      hand.forEach((card) =>
        expect(getWhiteCardElement(card.id)).not.toBeInTheDocument()
      );
      expect(
        screen.queryByTestId("white-card-submit-btn")
      ).not.toBeInTheDocument();
    });
  });
});
