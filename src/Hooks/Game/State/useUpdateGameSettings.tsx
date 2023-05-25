import {useCallback} from "react";
import {updateSettings} from "Services/GameService";
import useFetchGameState from "./useFetchGameState";
import {errorToast} from "Utilities/toasts";


function useUpdateGameSettings() {
    const fetchState = useFetchGameState();

    return useCallback(async (gameId: string, timer: number) => {
        try {
            await updateSettings(gameId, timer);
            fetchState(gameId);
        }
        catch (e) {
            console.error(e);
            errorToast("Could not update settings.");
        }
    }, []);
}

export default useUpdateGameSettings;