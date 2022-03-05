import {useCallback} from "react";
import {apiClient} from "../../Api/apiClient";
import {useUsers} from "../../State/Users/UsersContext";
import {KICK_PLAYER} from "../../State/Users/UsersActions";

function useKickPlayer() {
  const {dispatch} = useUsers();

  const kickPlayer = useCallback(async (gameId: string, userId: number) => {
    try {
      await apiClient.post(`/api/game/${gameId}/player/${userId}/kick`);
      dispatch({type: KICK_PLAYER, payload: {userId}});
    } catch (error) {
      console.error(error);
    }
  }, []);

  return kickPlayer;
}

export default useKickPlayer;
