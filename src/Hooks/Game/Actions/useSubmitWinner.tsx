import { useCallback } from "react";
import gameService from "@/Services/GameService";
import { happyToast } from "@/Utilities/toasts";


function useSubmitWinner() {

  return useCallback(async (gameId: string, playerId: number) => {
    try {
      await gameService.submitWinner(gameId, playerId);
      happyToast("Winner Selected!", "top");
    } catch (e) {
      console.error(e);
    }
  }, []);
}

export default useSubmitWinner;