import { useCallback } from "react";
import { gameCallbackData } from "../../Services/PusherService";
import useRefreshPlayers from "../Game/useRefreshPlayers";

function useUserJoinsGameCallback() {
  const refreshPlayers = useRefreshPlayers();
  return useCallback(async (data: gameCallbackData) => {
    await refreshPlayers(data.gameId);
  }, []);
}

export default useUserJoinsGameCallback;
