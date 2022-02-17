import { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";

function UseFetchRoundWinner() {
  const fetchRoundWinner = useCallback(async (data) => {
    await apiClient.get(`/api/game/${data.gameId}/round/winner`);
  }, []);

  return fetchRoundWinner;
}

export default UseFetchRoundWinner;
