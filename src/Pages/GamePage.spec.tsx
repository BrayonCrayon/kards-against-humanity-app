import { render, RenderResult, waitFor } from "@testing-library/react";
import GamePage from "./GamePage";
import { GameContext, IGameContext, initialState } from "../State/Game/GameContext";
import { apiClient } from "../Api/apiClient";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { whiteCardFixture as cardsInHand } from "../Api/fixtures/whiteCardFixture";
import { userFixture } from "../Api/fixtures/userFixture";
import { blackCardFixture } from "../Api/fixtures/blackcardFixture";
import { gameFixture } from "../Api/fixtures/gameFixture";
import { User } from "../Types/User";
import { listenWhenUserJoinsGame } from "../Services/PusherService";
import userEvent from "@testing-library/user-event";
import GameContextProvider from "../State/Game/GameContextProvider";
import { happyToast } from "../Utilities/toasts";
import { gameStateSubmittedWhiteCardsExampleResponse } from "../Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import { cannotSelectCardClass, selectedCardClass, whiteCardTestId } from "../Tests/selectors";
import { selectWhiteCards } from "../Tests/actions";

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
const userJoinedGameCallback = jest.fn();

const renderer = (value?: Partial<IGameContext>): RenderResult => {
  return render(
    <GameContext.Provider
      value={{
        ...initialState,
        setHand,
        setHasSubmittedCards,
        setUsers,
        userJoinedGameCallback,
        game: gameFixture,
        user: userFixture,
        users: gameStateExampleResponse.data.users as User[],
        hand: cardsInHand,
        blackCard: blackCardFixture,
        ...value,
      }}
    >
      <GamePage />
    </GameContext.Provider>
  );
};

const renderGameWrapper = (): RenderResult => {
  return render(
    <GameContextProvider>
      <GamePage />
    </GameContextProvider>
  );
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

      expect(happyToast).toHaveBeenCalledWith("Game code copied!", "top-start");
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

    renderer({ ...initialState, setUsers, userJoinedGameCallback });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${gameId}`);
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(setUsers).toHaveBeenCalledWith(
        gameStateExampleResponse.data.users
      );
      expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(
        gameId,
        userJoinedGameCallback
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

  it("listens on pusher event when loading game page", () => {
    renderer();

    expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(
      gameFixture.id,
      userJoinedGameCallback
    );
  });

  describe("Selecting Cards", () => {
    it("calls set hand when a user selects a card", async () => {
      const wrapper = renderer();

      const [cardToSelect] = cardsInHand;

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(whiteCardTestId(cardToSelect.id)));
      });

      expect(setHand).toHaveBeenCalled();
    });

    it("can toggle white card twice when black card pick amount is already reached", async () => {
      mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

      const wrapper = renderGameWrapper();

      const [cardToSelect] = gameStateExampleResponse.data.hand;

      let selectedCard: HTMLElement | undefined = undefined;
      await waitFor(() => {
        selectedCard = wrapper.getByTestId(whiteCardTestId(cardToSelect.id));
      });

      await waitFor(() => {
        userEvent.click(selectedCard!);
      });

      expect(selectedCard).toHaveClass(selectedCardClass);

      await waitFor(() => {
        userEvent.click(selectedCard!);
      });

      expect(selectedCard).not.toHaveClass(selectedCardClass);
    });

    it("does not allow user to select more white cards than the black card pick amount", async () => {
      mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

      const wrapper = renderGameWrapper();

      const cardsToSelect = gameStateExampleResponse.data.hand.slice(
        0,
        gameStateExampleResponse.data.current_black_card.pick + 1
      );

      await selectWhiteCards(cardsToSelect);

      const cardNotSelected = cardsToSelect[cardsToSelect.length - 1];
      expect(
        wrapper.getByTestId(whiteCardTestId(cardNotSelected.id))
      ).not.toHaveClass(selectedCardClass);
    });

    it("applies correct class when a white card is selected", async () => {
      const cardsToSelect = gameStateExampleResponse.data.hand.slice(
        0,
        blackCardFixture.pick
      );
      mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

      const wrapper = renderGameWrapper();

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

    it("visually disables cards after select limit was reached", async () => {
      const cardsToSelect = gameStateExampleResponse.data.hand.slice(
        0,
        blackCardFixture.pick
      );
      mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

      const wrapper = renderGameWrapper();

      await waitFor(() => {
        userEvent.click(
          wrapper.getByTestId(whiteCardTestId(cardsToSelect[0].id))
        );
      });

      await waitFor(() => {
        expect(
          wrapper.getByTestId(whiteCardTestId(cardsToSelect[1].id))
        ).toHaveClass(cannotSelectCardClass);
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
    const wrapper = renderGameWrapper();
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

  it("will console error when submit white cards api call fails", async () => {
    const apiFailedResponse = { message: "500 error" };
    mockedAxios.post.mockRejectedValueOnce(apiFailedResponse);
    const wrapper = renderGameWrapper();
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
    const wrapper = renderGameWrapper();

    userEvent.click(wrapper.getByTestId("white-card-submit-btn"));

    await waitFor(() => {
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });

  it("will make submit white card button disabled when user has submitted their cards", async () => {
    const wrapper = renderGameWrapper();
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
    const wrapper = renderGameWrapper();
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

    const wrapper = renderGameWrapper();

    const submitButton = wrapper.getByTestId("white-card-submit-btn");

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

    const wrapper = renderGameWrapper();

    await waitFor(() => {
      alreadySubmittedCardIds.forEach((cardId) => {
        expect(wrapper.getByTestId(whiteCardTestId(cardId))).toHaveClass(
          selectedCardClass
        );
      });
    });
  });
});
