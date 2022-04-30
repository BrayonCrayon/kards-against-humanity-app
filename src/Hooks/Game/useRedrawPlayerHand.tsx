import {useCallback} from "react";
import gameService from "../../Services/GameService";
import {useHand} from "State/Hand/HandContext";
import {SetHandAction} from "State/Hand/HandActionts";
import {transformWhiteCardArray} from "Types/WhiteCard";
import {useUser} from "State/User/UserContext";
import {IncrementRedrawCount} from "State/User/UserActions";

function useRedrawPlayerHand() {

    const {dispatch} = useHand();
    const {dispatch: userDispatch} = useUser();

    return useCallback(async (code: string) => {
        try {
            const {data} = await gameService.redraw(code);
            // @ts-ignore
            dispatch(new SetHandAction(transformWhiteCardArray(data, false, [])));
            userDispatch(new IncrementRedrawCount(1));
        } catch (error) {
            console.error(error);
        }
    }, []);
}

export default useRedrawPlayerHand;