import { useCallback } from "react";
import { UpdateGameState } from "../../Services/PusherService";
import useFetchGameState from "./useFetchGameState";

function useGameStateCallback() {
  const fetchGameState = useFetchGameState();

  return useCallback(async (data: UpdateGameState) => {
    await fetchGameState(data.gameId);
  }, []);
}

export default useGameStateCallback;
