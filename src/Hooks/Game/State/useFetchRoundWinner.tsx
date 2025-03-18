import { useCallback } from "react";
import { useVote } from "@/State/Vote/useVote";
import { WinnerSelectedAction } from "@/State/Vote/VoteActions";
import { IWinnerIsSelectedEventData } from "@/Services/PusherService";
import gameService from "@/Services/GameService";

function useFetchRoundWinner() {
  const { dispatch } = useVote();
  return useCallback(async (data: IWinnerIsSelectedEventData) => {
      try {
        const response = await gameService.roundWinner(data.gameId, data.blackCardId);
        dispatch(new WinnerSelectedAction(response.data));
      } catch (e) {
        console.error(e);
      }
    }, []);
}

export default useFetchRoundWinner;
