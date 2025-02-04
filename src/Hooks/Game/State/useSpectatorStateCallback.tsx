import { useCallback } from "react";
import { gameCallbackData } from "Services/PusherService";
import useFetchSpectatorState from "Hooks/Game/State/useFetchSpectatorState";

function useSpectatorStateCallback() {
  const fetchGameState = useFetchSpectatorState();

  return useCallback(async (data: gameCallbackData) => {
    await fetchGameState(data.gameId);
  }, []);
}

export default useSpectatorStateCallback;
