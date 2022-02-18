import { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";
import { useVote } from "../../State/Vote/VoteContext";
import { WINNER_SELECTED } from "../../State/Vote/VoteActions";
import { PlayerSubmittedCard } from "../../Types/ResponseTypes";
import { IWinnerIsSelectedEventData } from "../../Services/PusherService";

function UseFetchRoundWinner() {
  const { dispatch } = useVote();
  const fetchRoundWinner = useCallback(
    async (data: IWinnerIsSelectedEventData) => {
      const response = await apiClient.get<PlayerSubmittedCard>(
        `/api/game/${data.game_id}/round/winner`
      );
      dispatch({ type: WINNER_SELECTED, payload: response.data });
    },
    []
  );

  return fetchRoundWinner;
}

export default UseFetchRoundWinner;
