import { useCallback } from "react";
import { transformUser, transformUsers } from "@/Types/User";
import { useGame } from "@/State/Game/useGame";
import { SetBlackCardAction, SetGameAction } from "@/State/Game/GameActions";
import { joinAsSpectator } from "@/Services/GameService";
import { SetPlayersAction } from "@/State/Players/PlayersActions";
import { usePlayers } from "@/State/Players/usePlayers";
import { useAuth } from "@/State/Auth/useAuth";
import { SetAuthAction } from "@/State/Auth/AuthActions";
import { useNavigate } from "react-router-dom";

function useJoinAsSpectator() {
  const { dispatch: usersDispatch } = usePlayers();
  const { dispatch: userDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();
  const navigate = useNavigate();

  return useCallback(async (gameCode: string) => {
      try {
        const { data } = await joinAsSpectator(gameCode.toUpperCase());

        userDispatch(new SetAuthAction(transformUser(data.user)));
        usersDispatch(new SetPlayersAction(transformUsers(data.users)));
        gameDispatch(new SetGameAction(data.game));
        gameDispatch(new SetBlackCardAction(data.blackCard));
        navigate(`/game/${data.game.id}/spectate`);
      } catch (error) {
        console.error(error);
      }
    },
    [userDispatch, usersDispatch, gameDispatch]
  );
}

export default useJoinAsSpectator;
