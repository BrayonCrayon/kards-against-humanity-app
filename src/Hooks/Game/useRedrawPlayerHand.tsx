import { useCallback } from "react";
import gameService from "../../Services/GameService";
import { useHand } from "State/Hand/useHand";
import { SetHandAction } from "State/Hand/HandActions";
import { transformWhiteCardArray } from "Types/WhiteCard";
import { useAuth } from "State/Auth/useAuth";
import { IncrementRedrawCount } from "State/Auth/AuthActions";

function useRedrawPlayerHand() {

    const {dispatch} = useHand();
    const {dispatch: userDispatch} = useAuth();

    return useCallback(async (gameId: string) => {
        try {
            const {data} = await gameService.redraw(gameId);
            // @ts-ignore
            dispatch(new SetHandAction(transformWhiteCardArray(data, false, [])));
            userDispatch(new IncrementRedrawCount(1));
        } catch (error) {
            console.error(error);
        }
    }, []);
}

export default useRedrawPlayerHand;