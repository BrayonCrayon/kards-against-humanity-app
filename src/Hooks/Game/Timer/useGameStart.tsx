import {useCallback} from "react";
import gameService from "Services/GameService";
import useFetchGameState from "../State/useFetchGameState";


function useGameStart() {

    const fetchState = useFetchGameState();
    return useCallback(async (id: string) => {
        try{
            await gameService.startGame(id);
            await fetchState(id);
        } catch (e) {
            console.error(e);
        }
    }, []);
}

export default useGameStart;