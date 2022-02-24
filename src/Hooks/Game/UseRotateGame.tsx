import React, { useCallback, useContext } from "react";
import { apiClient } from "../../Api/apiClient";

export function UseRotateGame() {
  const rotateGame = useCallback(
    async (gameId: string, blackCardId: number) => {
      await apiClient.post(`/api/game/${gameId}/rotate`, {
        blackCardId,
      });
    },
    []
  );

  return rotateGame;
}
