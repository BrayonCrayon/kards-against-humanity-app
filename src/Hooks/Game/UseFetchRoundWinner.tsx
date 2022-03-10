import { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";
import { useVote } from "../../State/Vote/VoteContext";
import { WinnerSelectedAction } from "../../State/Vote/VoteActions";
import { RoundWinner } from "../../Types/ResponseTypes";
import { IWinnerIsSelectedEventData } from "../../Services/PusherService";

function UseFetchRoundWinner() {
  const { dispatch } = useVote();
  const fetchRoundWinner = useCallback(
    async (data: IWinnerIsSelectedEventData) => {
      try {
        const response = await apiClient.get<RoundWinner>(
          `/api/game/${data.gameId}/round/winner/${data.blackCardId}`
        );
        dispatch(new WinnerSelectedAction(response.data));
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  return fetchRoundWinner;
}

export default UseFetchRoundWinner;
