import { useNavigate } from "react-router-dom";
import { usePlayers } from "State/Players/usePlayers";
import { useHand } from "State/Hand/useHand";
import { useAuth } from "State/Auth/useAuth";
import { useGame } from "State/Game/useGame";
import { useCallback } from "react";
import { SetBlackCardAction, SetGameAction } from "State/Game/GameActions";
import { SetAuthAction, SetHasSubmittedCards } from "State/Auth/AuthActions";
import { transformUser, transformUsers } from "Types/User";
import { SetPlayersAction } from "State/Players/PlayersActions";
import { SetHandAction } from "State/Hand/HandActions";
import { transformWhiteCardArray } from "Types/WhiteCard";
import { errorToast } from "Utilities/toasts";
import { joinGame } from "Services/GameService";

function useJoinGame () {
  const navigate = useNavigate();
  const { dispatch } = usePlayers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: userDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();

  return useCallback(async (code: string, userName: string) => {

    try {
      const { data } = await joinGame(code, userName);
      gameDispatch(new SetGameAction(data.game));
      userDispatch(new SetAuthAction(transformUser(data.currentUser)));
      dispatch(new SetPlayersAction(transformUsers(data.users)));
      handDispatch(new SetHandAction(transformWhiteCardArray(data.hand, false, [])));
      gameDispatch(new SetBlackCardAction(data.blackCard));
      userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));

      navigate(`/game/${data.game.id}`);
    } catch (e) {
      console.error(e);
      errorToast("Game does not exist");
    }
  }, []);
}

export default useJoinGame;