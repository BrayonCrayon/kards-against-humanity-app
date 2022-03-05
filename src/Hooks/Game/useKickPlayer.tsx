import { useCallback } from "react";
import {apiClient} from "../../Api/apiClient";

function useKickPlayer() {
  const kickPlayer = useCallback(async (gameId: string, userId: number) => {
    await apiClient.post(`/api/game/${gameId}/player/${userId}/kick`);
  }, []);

  return kickPlayer;
}

export default useKickPlayer;
