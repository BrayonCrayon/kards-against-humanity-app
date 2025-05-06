import { useCallback } from "react";
import gameService, { ICreateGameOptions } from "@/Services/GameService";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "@/State/Players/usePlayers";
import { useHand } from "@/State/Hand/useHand";
import { useAuth } from "@/State/Auth/useAuth";
import { useGame } from "@/State/Game/useGame";
import { transformWhiteCardArray } from "@/Types/WhiteCard";
import { SetHandAction } from "@/State/Hand/HandActions";
import { SetBlackCardAction, SetGameAction } from "@/State/Game/GameActions";
import { SetAuthAction, SetHasSubmittedCards } from "@/State/Auth/AuthActions";
import { SetPlayersAction } from "@/State/Players/PlayersActions";
import { transformUser, transformUsers } from "@/Types/User";
import { transformBlackCard } from "@/Types/BlackCard";

export function useCreateGame() {
  const navigate = useNavigate();
  const { dispatch: usersDispatch } = usePlayers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: userDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();

  return useCallback(async (options: ICreateGameOptions) => {
    try {
      const { data } = await gameService.createGame(options);

      gameDispatch(new SetGameAction(data.game));
      userDispatch(new SetAuthAction(transformUser(data.currentUser)));
      usersDispatch(new SetPlayersAction(transformUsers(data.users)));
      handDispatch(new SetHandAction(transformWhiteCardArray(data.hand, false, [])));
      gameDispatch(new SetBlackCardAction(transformBlackCard(data.blackCard)));
      userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
      navigate(`/game/${data.game.id}`);
    } catch (error) {
      console.error(error);
    }
  }, []);
}

export default useCreateGame;
