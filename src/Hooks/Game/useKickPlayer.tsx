import {useCallback} from "react";
import {apiClient} from "../../Api/apiClient";

function useKickPlayer() {
  const kickPlayer = useCallback(async (gameId: string, userId: number) => {
    try {
      await apiClient.post(`/api/game/${gameId}/player/${userId}/kick`);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return kickPlayer;
}

export default useKickPlayer;
