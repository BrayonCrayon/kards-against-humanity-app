import { useCallback } from "react";
import { updateSettings } from "@/Services/GameService";
import useFetchGameState from "./useFetchGameState";
import { useToasts } from "@/Hooks/Notification/useToasts";

function useUpdateGameSettings() {
  const fetchState = useFetchGameState();
  const { errorToast } = useToasts();

  return useCallback(async (gameId: string, timer: number | null) => {
    try {
      await updateSettings(gameId, timer);
      fetchState(gameId);
    } catch (e) {
      console.error(e);
      errorToast("Could not update settings.");
    }
  }, []);
}

export default useUpdateGameSettings;
