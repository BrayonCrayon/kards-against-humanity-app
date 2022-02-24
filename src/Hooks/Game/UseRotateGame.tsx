import React, { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";

export function UseRotateGame() {
  const rotateGame = useCallback(
    async (gameId: string, blackCardId: number) => {
      try {
        await apiClient.post(`/api/game/${gameId}/rotate`, {
          blackCardId,
        });
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  return rotateGame;
}
