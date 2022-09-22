import { useCallback } from "react";
import { usePlayers } from "State/Players/usePlayers";
import { KickPlayerAction } from "State/Players/PlayersActions";
import gameService from "Services/GameService";

function useKickPlayer() {
  const { dispatch } = usePlayers();

  return useCallback(async (gameId: string, userId: number) => {
    try {
      await gameService.kick(gameId, userId);
      dispatch(new KickPlayerAction(userId));
    } catch (error) {
      console.error(error);
    }
  }, []);
}

export default useKickPlayer;
