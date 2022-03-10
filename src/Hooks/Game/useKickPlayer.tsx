import { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";
import { useUsers } from "../../State/Users/UsersContext";
import { KickPlayerAction } from "../../State/Users/UsersActions";

function useKickPlayer() {
  const { dispatch } = useUsers();

  const kickPlayer = useCallback(async (gameId: string, userId: number) => {
    try {
      await apiClient.post(`/api/game/${gameId}/player/${userId}/kick`);
      dispatch(new KickPlayerAction(userId));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return kickPlayer;
}

export default useKickPlayer;
