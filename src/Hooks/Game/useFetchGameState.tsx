import { useCallback } from "react";
import { Game } from "../../Types/Game";
import { apiClient } from "../../Api/apiClient";
import { setState } from "../../State/GeneralTypes";
import { constructWhiteCardArray } from "../../Types/WhiteCard";
import { BlackCard } from "../../Types/BlackCard";
import { transformUser, transformUsers, User } from "../../Types/User";
import { useUsers } from "../../State/Users/UsersContext";
import { SetPlayersAction } from "../../State/Users/UsersActions";
import { useHand } from "../../State/Hand/HandContext";
import { SetHandAction } from "../../State/Hand/HandActionts";

function useFetchGameState(
  setUser: setState<User>,
  setGame: setState<Game>,
  setBlackCard: setState<BlackCard>,
  setHasSubmittedWhiteCards: setState<boolean>,
  setJudge: setState<User>
) {
  const { dispatch } = useUsers();
  const { dispatch: handDispatch } = useHand();

  const fetchGameState = useCallback(
    async (gameId: string) => {
      try {
        const { data } = await apiClient.get(`/api/game/${gameId}`);
        setUser(transformUser(data.current_user));
        dispatch(new SetPlayersAction(transformUsers(data.users)));
        setGame({
          id: data.id,
          judge_id: data.judge.id,
          name: data.name,
          code: data.code,
        } as Game);
        setHasSubmittedWhiteCards(data.hasSubmittedWhiteCards);
        handDispatch(
          new SetHandAction(
            constructWhiteCardArray(
              data.hand,
              data.hasSubmittedWhiteCards,
              data.submittedWhiteCardIds
            )
          )
        );
        setBlackCard(data.current_black_card);
        setJudge(transformUser(data.judge));
      } catch (error) {
        console.error(error);
      }
    },
    [setUser, setGame, setBlackCard, setHasSubmittedWhiteCards]
  );

  return fetchGameState;
}

export default useFetchGameState;
