import React, { useCallback } from "react";
import { rotate } from "../../Services/GameService";

function useRotateGame() {
  const rotateGame = useCallback(async (gameId: string) => {
    try {
      await rotate(gameId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return rotateGame;
}

export default useRotateGame;
