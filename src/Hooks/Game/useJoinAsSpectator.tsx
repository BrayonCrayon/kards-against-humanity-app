import {useCallback} from "react";
import {transformWhiteCardArray} from "Types/WhiteCard";
import {transformUser, transformUsers} from "Types/User";
import {useUsers} from "State/Users/UsersContext";
import {SetPlayersAction} from "State/Users/UsersActions";
import {useHand} from "State/Hand/HandContext";
import {SetHandAction} from "State/Hand/HandActionts";
import {useUser} from "State/User/UserContext";
import {SetHasSubmittedCards, SetUserAction} from "State/User/UserActions";
import {useGame} from "State/Game/GameContext";
import {SetBlackCardAction, SetGameAction, SetJudgeAction,} from "State/Game/GameActions";
import { fetchState, joinAsSpectator } from "Services/GameService";

function useJoinAsSpectator() {
    const {dispatch: usersDispatch} = useUsers();
    const {dispatch: userDispatch} = useUser();
    const {dispatch: gameDispatch} = useGame();

    return useCallback(
        async (gameCode: string) => {
            try {
        const { data } = await joinAsSpectator(gameCode);

        userDispatch(new SetUserAction(transformUser(data.user)));
        usersDispatch(new SetPlayersAction(transformUsers(data.users)));
        gameDispatch(new SetGameAction(data.game));
      } catch (error) {
        console.error(error);
      }
    },
    [userDispatch, usersDispatch, gameDispatch]
  );
}

export default useJoinAsSpectator;
