import { useCallback } from "react";
import { transformWhiteCardArray } from "@/Types/WhiteCard";
import { transformUser, transformUsers } from "@/Types/User";
import { usePlayers } from "@/State/Players/usePlayers";
import { SetPlayersAction } from "@/State/Players/PlayersActions";
import { useHand } from "@/State/Hand/useHand";
import { SetHandAction } from "@/State/Hand/HandActions";
import { useAuth } from "@/State/Auth/useAuth";
import { SetAuthAction, SetHasSubmittedCards } from "@/State/Auth/AuthActions";
import { useGame } from "@/State/Game/useGame";
import { SetBlackCardAction, SetGameAction } from "@/State/Game/GameActions";
import { fetchState } from "@/Services/GameService";

function useFetchGameState() {
    const {dispatch: usersDispatch} = usePlayers();
    const {dispatch: handDispatch} = useHand();
    const {dispatch: userDispatch} = useAuth();
    const {dispatch: gameDispatch} = useGame();

    return useCallback(async (gameId: string) => {
        try {
            const { data } = await fetchState(gameId);

            userDispatch(new SetAuthAction(transformUser(data.currentUser)));
            usersDispatch(new SetPlayersAction(transformUsers(data.users)));
            gameDispatch(new SetGameAction(data.game));
            userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
            handDispatch(
              new SetHandAction(
                  transformWhiteCardArray(
                      data.hand,
                      data.hasSubmittedWhiteCards,
                      data.submittedWhiteCardIds
                  )
              )
            );
            gameDispatch(new SetBlackCardAction(data.blackCard));
        } catch (error) {
            console.error(error);
        }
    }, [handDispatch, userDispatch, usersDispatch, gameDispatch]);
}

export default useFetchGameState;
