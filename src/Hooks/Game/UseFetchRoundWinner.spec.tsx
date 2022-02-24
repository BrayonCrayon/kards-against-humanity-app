import { renderHook } from "@testing-library/react-hooks";
import UseFetchRoundWinner from "./UseFetchRoundWinner";
import { apiClient } from "../../Api/apiClient";
import { WINNER_SELECTED } from "../../State/Vote/VoteActions";
import { PlayerSubmittedCard } from "../../Types/ResponseTypes";
import { VoteProvider } from "../../State/Vote/VoteContext";
import { gameFixture } from "../../Api/fixtures/gameFixture";

const renderUseFetchRoundWinner = () => {
  return renderHook(UseFetchRoundWinner, {
    wrapper: ({ children }) => <VoteProvider>{children}</VoteProvider>,
  });
};

const mockDispatch = jest.fn();

jest.mock("../../State/Vote/VoteContext", () => {
  return {
    ...jest.requireActual("../../State/Vote/VoteContext"),
    useVote: () => {
      return {
        state: {
          selectedPlayerId: 0,
          selectedRoundWinner: {
            user_id: -1,
            submitted_cards: [],
          },
        },
        dispatch: mockDispatch,
      };
    },
  };
});

jest.mock("../../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const mockApiData: PlayerSubmittedCard = {
  submitted_cards: [],
  user_id: 0,
};

describe("UseFetchRoundWinner", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockApiData });
  });

  it("it will hit the api to fetch round winner", async () => {
    const gameId = gameFixture.id;
    const { result } = renderUseFetchRoundWinner();

    await result.current({ game_id: gameId, user_id: 2 });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/game/${gameId}/round/winner`
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: WINNER_SELECTED,
      payload: mockApiData,
    });
  });

  it("will catch error if api call fails", async () => {
    const mockErrorMessage = {
      code: 500,
      message: "server failure",
    };
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());
    mockedAxios.get.mockRejectedValueOnce(mockErrorMessage);
    const gameId = gameFixture.id;
    const { result } = renderUseFetchRoundWinner();

    await result.current({ game_id: gameId, user_id: 2 });

    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);

    spyConsole.mockRestore();
  });
});
