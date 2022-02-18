import { renderHook } from "@testing-library/react-hooks";
import UseFetchRoundWinner from "./UseFetchRoundWinner";
import { apiClient } from "../../Api/apiClient";
import * as Vote from "../../State/Vote/VoteContext";
import { WINNER_SELECTED } from "../../State/Vote/VoteActions";
import { PlayerSubmittedCard } from "../../Types/ResponseTypes";
import { VoteProvider } from "../../State/Vote/VoteContext";

describe("UseFetchRoundWinner", () => {
  it("it will hit the api to fetch round winner", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(Vote, "useVote").mockReturnValue({
      dispatch: mockDispatch,
      state: {
        selectedPlayerId: -1,
      },
    });

    const { result } = renderHook(UseFetchRoundWinner, {
      wrapper: ({ children }) => <VoteProvider>{children}</VoteProvider>,
    });

    const mockApiData: PlayerSubmittedCard = {
      submitted_cards: [],
      user_id: 0,
    };
    const getSpy = jest
      .spyOn(apiClient, "get")
      .mockResolvedValue({ data: mockApiData });
    const gameId = "abcd";
    await result.current({ game_id: gameId, user_id: 2 });
    expect(getSpy).toHaveBeenCalledWith(`/api/game/${gameId}/round/winner`);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: WINNER_SELECTED,
      payload: mockApiData,
    });
  });
});
