import { useCallback } from "react";
import { gameCallbackData } from "Services/PusherService";
import useFetchGameState from "Hooks/Game/State/useFetchGameState";

function useGameStateCallback() {
  const fetchGameState = useFetchGameState();

  return useCallback(async (data: gameCallbackData) => {
    await fetchGameState(data.gameId);
  }, []);
}

export default useGameStateCallback;
