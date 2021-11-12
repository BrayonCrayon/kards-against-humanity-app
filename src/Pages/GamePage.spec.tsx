import { render, RenderResult, waitFor } from "@testing-library/react";
import GamePage from "./GamePage";
import { BlackCard } from "../Types/BlackCard";
import { GameContext, initialState } from "../State/Game/GameContext";
import { Game } from "../Types/Game";
import { User } from "../Types/User";
import { apiClient } from "../Api/apiClient";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { whiteCardFixture as cardsInHand } from "../Api/fixtures/whiteCardFixture";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const user: User = {
  id: 1,
  name: "Rick Sanchez",
  whiteCards: cardsInHand,
};

const game: Game = {
  id: "121313klhj3-eqweewq-2323-dasd",
  name: "Game 1",
  judge_id: 1,
  code: "1234",
};

const mockBlackCard: BlackCard = {
  id: 1234,
  pick: 12,
  text: "_____ is what you tell cheap hookers.",
  expansion_id: 69,
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: game.id,
  }),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

const renderer = (): RenderResult => {
  return render(
    <GameContext.Provider
      value={{
        ...initialState,
        game,
        user,
        hand: cardsInHand,
        blackCard: mockBlackCard,
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
        `game-${game.id}`
      ) as HTMLElement;
      expect(gameCodeDisplayElement).not.toBeNull();
      expect(gameCodeDisplayElement.innerHTML).toBe(game.code);
    });
  });

  it("copies game code to clipboard when clicked", async () => {
    jest.spyOn(navigator.clipboard, "writeText");

    const wrapper = renderer();

    const gameIdDisplayElement = wrapper.queryByTestId(
      `game-${game.id}`
    ) as HTMLElement;
    gameIdDisplayElement.click();
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toBeCalledWith(game.code);
    });
  });

  it("displays the user's name", async () => {
    const wrapper = renderer();

    expect(wrapper.getByText(user.name)).toBeInTheDocument();
  });

  it("performs an api call to get game state data to be loaded on refresh", async () => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <GameContext.Provider value={initialState}>
        <GamePage />
      </GameContext.Provider>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${game.id}`);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  it("displays the black card", () => {
    const wrapper = renderer();

    expect(
      wrapper.queryByTestId(`black-card-${mockBlackCard.id}`)
    ).toBeInTheDocument();
    expect(
      wrapper.queryByTestId(`black-card-${mockBlackCard.id}`)
    ).toHaveTextContent(mockBlackCard.text);
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
});
