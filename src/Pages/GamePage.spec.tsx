import { render, RenderResult, waitFor } from "@testing-library/react";
import GamePage from "./GamePage";
import { GameContext, initialState } from "../State/Game/GameContext";
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

jest.mock("../Api/apiClient");
jest.mock("../Services/PusherService");

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

const renderer = (): RenderResult => {
  return render(
    <GameContext.Provider
      value={{
        ...initialState,
        setHand,
        game: gameFixture,
        user: userFixture,
        users: gameStateExampleResponse.data.users as User[],
        hand: cardsInHand,
        blackCard: blackCardFixture,
      }}
    >
      <GamePage />
    </GameContext.Provider>
  );
};

describe("GamePage", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("shows users hand of seven white cards", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      cardsInHand.forEach((card) => {
        const whiteCardElement = wrapper.queryByTestId(`white-card-${card.id}`);
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

  it("displays the user's name", async () => {
    const wrapper = renderer();

    expect(wrapper.getByText(userFixture.name)).toBeInTheDocument();
  });

  it("performs an api call to get game state data to be loaded on refresh", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);
    const setUsers = jest.fn();
    const userJoinedGameCallback = jest.fn();

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <GameContext.Provider
        value={{ ...initialState, setUsers, userJoinedGameCallback }}
      >
        <GamePage />
      </GameContext.Provider>
    );

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

  it("displays the black card", () => {
    const wrapper = renderer();

    expect(
      wrapper.queryByTestId(`black-card-${blackCardFixture.id}`)
    ).toBeInTheDocument();
    expect(
      wrapper.queryByTestId(`black-card-${blackCardFixture.id}`)
    ).toHaveTextContent(blackCardFixture.text);
  });

  it("catches error if api call to fetch game state fails", async () => {
    const errorResponse = { message: "No Api" };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    console.error = jest.fn();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <GameContext.Provider value={initialState}>
        <GamePage />
      </GameContext.Provider>
    );

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
      initialState.userJoinedGameCallback
    );
  });

  it("saves selected white cards to state", async () => {
    const wrapper = renderer();

    const cardsToSelect = cardsInHand.slice(0, blackCardFixture.pick);
    for (const item of cardsToSelect) {
      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`white-card-${item.id}`));
      });
    }
  });

  it("calls set hand when a user selects a card", async () => {
    const wrapper = renderer();

    const [cardToSelect] = cardsInHand;

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`white-card-${cardToSelect.id}`));
    });

    expect(setHand).toHaveBeenCalled();
  });

  it("can toggle white card twice when black card pick amount is already reached", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const wrapper = render(
      <GameContextProvider>
        <GamePage />
      </GameContextProvider>
    );

    const [cardToSelect] = gameStateExampleResponse.data.hand;

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`white-card-${cardToSelect.id}`));
    });

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`white-card-${cardToSelect.id}`));
    });

    expect(
      wrapper.getByTestId(`white-card-${cardToSelect.id}`)
    ).not.toHaveClass("border-4 border-blue-400");
  });

  it("does not allow user to select more white cards than the black card pick amount", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const wrapper = render(
      <GameContextProvider>
        <GamePage />
      </GameContextProvider>
    );

    const cardsToSelect = gameStateExampleResponse.data.hand.slice(
      0,
      gameStateExampleResponse.data.current_black_card.pick + 1
    );

    for (const item of cardsToSelect) {
      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`white-card-${item.id}`));
      });
    }
    const cardNotSelected = cardsToSelect[cardsToSelect.length - 1];
    expect(
      wrapper.getByTestId(`white-card-${cardNotSelected.id}`)
    ).not.toHaveClass("border-4 border-blue-400");
  });

  it("applies correct class when a white card is selected", async () => {
    const cardsToSelect = gameStateExampleResponse.data.hand.slice(
      0,
      blackCardFixture.pick
    );
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const wrapper = render(
      <GameContextProvider>
        <GamePage />
      </GameContextProvider>
    );

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`white-card-${cardsToSelect[0].id}`));
    });

    await waitFor(() => {
      expect(
        wrapper.getByTestId(`white-card-${cardsToSelect[0].id}`)
      ).toHaveClass("border-4 border-blue-400");
    });
  });

  it("visually disables cards after select limit was reached", async () => {
    const cardsToSelect = gameStateExampleResponse.data.hand.slice(
      0,
      blackCardFixture.pick
    );
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const wrapper = render(
      <GameContextProvider>
        <GamePage />
      </GameContextProvider>
    );

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`white-card-${cardsToSelect[0].id}`));
    });

    await waitFor(() => {
      expect(
        wrapper.getByTestId(`white-card-${cardsToSelect[1].id}`)
      ).toHaveClass("opacity-25");
      expect(
        wrapper.getByTestId(`white-card-${cardsToSelect[1].id}`)
      ).toHaveClass("cursor-not-allowed");
    });
  });
});
