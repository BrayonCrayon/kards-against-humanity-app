import { useCallback } from "react";
import { SetBlackCardAction, SetGameAction } from "State/Game/GameActions";
import { SetAuthAction, SetHasSubmittedCards } from "State/Auth/AuthActions";
import { transformUser, transformUsers } from "Types/User";
import { SetPlayersAction } from "State/Players/PlayersActions";
import { SetHandAction } from "State/Hand/HandActions";
import { transformWhiteCardArray } from "Types/WhiteCard";
import gameService from "Services/GameService";
import { useHistory } from "react-router-dom";
import { usePlayers } from "State/Players/usePlayers";
import { useHand } from "State/Hand/useHand";
import { useAuth } from "State/Auth/useAuth";
import { useGame } from "State/Game/useGame";

function useCreateGame() {
  const history = useHistory();
  const { dispatch: usersDispatch } = usePlayers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: userDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();

  return useCallback(async (userName: string, expansionIds: number[]) => {
    try {
      const { data } = await gameService.createGame(userName, expansionIds);

      gameDispatch(new SetGameAction(data.game));
      userDispatch(new SetAuthAction(transformUser(data.currentUser)));
      usersDispatch(new SetPlayersAction(transformUsers(data.users)));
      handDispatch(new SetHandAction(transformWhiteCardArray(data.hand, false, [])));
      gameDispatch(new SetBlackCardAction(data.blackCard));
      userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
      history.push(`/game/${data.game.id}`);
    } catch (error) {
      console.error(error);
    }
  }, []);
}

export default useCreateGame;