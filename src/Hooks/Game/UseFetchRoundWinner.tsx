import { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";
import { useVote } from "../../State/Vote/VoteContext";
import { WINNER_SELECTED } from "../../State/Vote/VoteActions";

function UseFetchRoundWinner() {
  const { dispatch } = useVote();
  const fetchRoundWinner = useCallback(async (data) => {
    const response = await apiClient.get(
      `/api/game/${data.gameId}/round/winner`
    );
    dispatch({ type: WINNER_SELECTED, payload: response.data.data });
  }, []);

  return fetchRoundWinner;
}

export default UseFetchRoundWinner;
