import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { leaveGame } from "Services/GameService";
import { useHand } from "State/Hand/useHand";
import { useVote } from "State/Vote/useVote";
import { usePlayers } from "State/Players/usePlayers";
import { useGame } from "State/Game/useGame";
import { useAuth } from "State/Auth/useAuth";
import { SetHasSubmittedCards } from "State/Auth/AuthActions";
import { SetBlackCardAction, SetGameAction } from "State/Game/GameActions";
import { initialGameState } from "State/Game/GameState";
import { SetPlayersAction } from "State/Players/PlayersActions";
import { initialPlayersState } from "State/Players/PlayersState";
import { initialHandState } from "State/Hand/HandState";
import { SetHandAction } from "State/Hand/HandActions";
import { ClearStateAction } from "State/Vote/VoteActions";

function useLeaveGame() {
  const history = useHistory();
  const { dispatch: authDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();
  const { dispatch: playerDispatch } = usePlayers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: voteDispatch } = useVote();

  return useCallback(async (gameId: string) => {
    try {
      await leaveGame(gameId);

      authDispatch(new SetHasSubmittedCards(false));
      gameDispatch(new SetGameAction(initialGameState.game));
      gameDispatch(new SetBlackCardAction(initialGameState.blackCard));
      playerDispatch(new SetPlayersAction(initialPlayersState.players));
      handDispatch(new SetHandAction(initialHandState.hand));
      voteDispatch(new ClearStateAction());

      history.push("/");
    } catch (e) {
      console.error(e);
    }
  }, []);
}

export default useLeaveGame;