import { useCallback } from "react";
import gameService from "@/Services/GameService";
import { SetAuthAction } from "@/State/Auth/AuthActions";
import { transformUser, transformUsers } from "@/Types/User";
import { useAuth } from "@/State/Auth/useAuth";
import { usePlayers } from "@/State/Players/usePlayers";
import { SetPlayersAction } from "@/State/Players/PlayersActions";
import { useGame } from "@/State/Game/useGame";
import { SetBlackCardAction, SetGameAction } from "@/State/Game/GameActions";

function useFetchSpectatorState() {
  const { dispatch: usersDispatch } = usePlayers();
  const { dispatch: userDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();

  return useCallback(async (gameId: string) => {
    try {

      const { data } = await gameService.fetchSpectatorState(gameId);

      userDispatch(new SetAuthAction(transformUser(data.user)));
      usersDispatch(new SetPlayersAction(transformUsers(data.users)));
      gameDispatch(new SetGameAction(data.game));
      gameDispatch(new SetBlackCardAction(data.blackCard));

    } catch (e) {
      console.error(e);
    }
  }, [usersDispatch, userDispatch, gameDispatch]);
}

export default useFetchSpectatorState;