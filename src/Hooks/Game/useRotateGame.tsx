import React, { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";

function useRotateGame() {
  const rotateGame = useCallback(async (gameId: string) => {
    try {
      await apiClient.post(`/api/game/${gameId}/rotate`);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return rotateGame;
}

export default useRotateGame;
