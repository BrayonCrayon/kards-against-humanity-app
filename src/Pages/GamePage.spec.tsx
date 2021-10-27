import { render, waitFor } from "@testing-library/react";
import GamePage from "./GamePage";
import { WhiteCard } from "../Types/WhiteCard";
import { BlackCard } from "../Types/BlackCard";
import { GameContext, initialState } from "../State/Game/GameContext";
import { Game } from "../Types/Game";
import { User } from "../Types/User";
import { apiClient } from "../Api/apiClient";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: "abc123",
  }),
}));

const cardsInHand: WhiteCard[] = [
  {
    id: 1625,
    text: "White card 1",
    expansion_id: 4,
  },
  {
    id: 828,
    text: "White card 1",
    expansion_id: 1,
  },
  {
    id: 237,
    text: "White card 1",
    expansion_id: 2,
  },
  {
    id: 408,
    text: "White card 1",
    expansion_id: 8,
  },
  {
    id: 95,
    text: "White card 1",
    expansion_id: 12,
  },
  {
    id: 16,
    text: "White card 1",
    expansion_id: 1,
  },
  {
    id: 253,
    text: "White card 1",
    expansion_id: 1,
  },
];

const user: User = {
  id: 1,
  name: "Rick Sanchez",
  whiteCards: cardsInHand,
};

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe("GamePage", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("shows users hand of seven white cards", async () => {
    const wrapper = render(
      <GameContext.Provider
        value={{
          ...initialState,
          hand: cardsInHand,
          game: { id: "abc123", name: "", judge_id: 0 },
          user,
        }}
      >
        <GamePage />
      </GameContext.Provider>
    );

    await waitFor(() => {
      cardsInHand.forEach((card) => {
        const whiteCardElement = wrapper.queryByTestId(`white-card-${card.id}`);
        expect(whiteCardElement).not.toBeNull();
      });
    });
  });

  it("shows game id", async () => {
    const game: Game = {
      id: "121313klhj3-eqweewq-2323-dasd",
      name: "Game 1",
      judge_id: 1,
    };
    const wrapper = render(
      <GameContext.Provider value={{ ...initialState, game, hand: [], user }}>
        <GamePage />
      </GameContext.Provider>
    );

    await waitFor(() => {
      const gameIdDisplayElement = wrapper.queryByTestId(
        `game-${game.id}`
      ) as HTMLElement;
      expect(gameIdDisplayElement).not.toBeNull();
      expect(gameIdDisplayElement.innerHTML).toBe(game.id);
    });
  });

  it("copies game id to clipboard when clicked", async () => {
    const game: Game = {
      id: "121313klhj3-eqweewq-2323-dasd",
      name: "Game 1",
      judge_id: 1,
    };

    jest.spyOn(navigator.clipboard, "writeText");

    const wrapper = render(
      <GameContext.Provider value={{ ...initialState, game, hand: [], user }}>
        <GamePage />
      </GameContext.Provider>
    );

    const gameIdDisplayElement = wrapper.queryByTestId(
      `game-${game.id}`
    ) as HTMLElement;
    gameIdDisplayElement.click();
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toBeCalledWith(game.id);
    });
  });

  it("displays the user's name", async () => {
    const game: Game = {
      id: "121313klhj3-eqweewq-2323-dasd",
      name: "Game 1",
      judge_id: 1,
    };

    const wrapper = render(
      <GameContext.Provider value={{ ...initialState, game, hand: [], user }}>
        <GamePage />
      </GameContext.Provider>
    );

    expect(wrapper.getByText(user.name)).toBeInTheDocument();
  });

  it("performs an api call to get game state data to be loaded on refresh", () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const gameId = "abc123";

    render(
      <GameContext.Provider value={{ ...initialState }}>
        <GamePage />
      </GameContext.Provider>
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${gameId}`);
  });

  it("displays the black card", () => {
    const game: Game = {
      id: "121313klhj3-eqweewq-2323-dasd",
      name: "Game 1",
      judge_id: 1,
    };

    const mockBlackCard: BlackCard = {
      id: 1234,
      pick: 12,
      text: "_____ is what you tell cheap hookers.",
      expansion_id: 69,
    };

    const wrapper = render(
      <GameContext.Provider
        value={{ ...initialState, game, blackCard: mockBlackCard }}
      >
        <GamePage />
      </GameContext.Provider>
    );

    expect(
      wrapper.queryByTestId(`black-card-${mockBlackCard.id}`)
    ).toBeInTheDocument();
    expect(
      wrapper.queryByTestId(`black-card-${mockBlackCard.id}`)
    ).toHaveTextContent(mockBlackCard.text);
  });
});
