import React, { useCallback } from "react";
import { usePlayers } from "State/Players/usePlayers";
import { transformUsers } from "Types/User";
import { SetPlayersAction } from "State/Players/PlayersActions";
import { fetchPlayers } from "Services/GameService";

function useRefreshPlayers() {
  const { dispatch } = usePlayers();

  return useCallback(async (gameId: string) => {
    try {
      const { data } = await fetchPlayers(gameId);
      dispatch(new SetPlayersAction(transformUsers(data)));
    } catch (e) {
      console.error(e);
    }
  }, []);
}

export default useRefreshPlayers;
