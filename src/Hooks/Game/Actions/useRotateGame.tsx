import React, { useCallback } from "react";
import { rotate } from "Services/GameService";

function useRotateGame() {
  return useCallback(async (gameId: string) => {
    try {
      await rotate(gameId);
    } catch (e) {
      console.error(e);
    }
  }, []);
}

export default useRotateGame;
