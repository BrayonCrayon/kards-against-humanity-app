import { useCallback } from "react";
import { apiClient } from "../../Api/apiClient";
import { constructWhiteCardArray } from "../../Types/WhiteCard";
import { transformUser, transformUsers } from "../../Types/User";
import { useUsers } from "../../State/Users/UsersContext";
import { SetPlayersAction } from "../../State/Users/UsersActions";
import { useHand } from "../../State/Hand/HandContext";
import { SetHandAction } from "../../State/Hand/HandActionts";
import { useUser } from "../../State/User/UserContext";
import {
  SetHasSubmittedCards,
  SetUserAction,
} from "../../State/User/UserActions";
import { useGame } from "../../State/Game/GameContext";
import {
  SetBlackCardAction,
  SetGameAction,
  SetJudgeAction,
} from "../../State/Game/GameActions";

function useFetchGameState() {
  const { dispatch: usersDispatch } = useUsers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: userDispatch } = useUser();
  const { dispatch: gameDispatch } = useGame();

  const fetchGameState = useCallback(
    async (gameId: string) => {
      try {
        const { data } = await apiClient.get(`/api/game/${gameId}`);

        userDispatch(new SetUserAction(transformUser(data.current_user)));
        usersDispatch(new SetPlayersAction(transformUsers(data.users)));
        gameDispatch(
          new SetGameAction({
            id: data.id,
            judge_id: data.judge.id,
            name: data.name,
            code: data.code,
          })
        );

        userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
        handDispatch(
          new SetHandAction(
            constructWhiteCardArray(
              data.hand,
              data.hasSubmittedWhiteCards,
              data.submittedWhiteCardIds
            )
          )
        );
        gameDispatch(new SetBlackCardAction(data.current_black_card));
        gameDispatch(new SetJudgeAction(transformUser(data.judge)));
      } catch (error) {
        console.error(error);
      }
    },
    [handDispatch, userDispatch, usersDispatch, gameDispatch]
  );

  return fetchGameState;
}

export default useFetchGameState;
