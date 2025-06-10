import { useCallback } from "react";
import gameService from "@/Services/GameService";
import { useToasts } from "@/Hooks/Notification/useToasts";
import { Location } from "@/Types/Notification";

function useSubmitWinner() {
  const { happyToast } = useToasts();

  return useCallback(async (gameId: string, playerId: number) => {
    try {
      await gameService.submitWinner(gameId, playerId);
      happyToast("Winner Selected!", Location.TOP_CENTER);
    } catch (e) {
      console.error(e);
    }
  }, []);
}

export default useSubmitWinner;
