import { useCallback } from "react";
import {
  listenWhenGameRotates,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards,
} from "Services/PusherService";
import useGameStateCallback from "Hooks/Game/useGameStateCallback";
import useUserJoinsGameCallback from "./useUserJoinsGameCallback";

function useListenOnEvents() {
  const updateGameState = useGameStateCallback();
  const userJoinsGameCallback = useUserJoinsGameCallback();

  return useCallback((gameId: string) => {
    listenWhenUserSubmittedCards(gameId, updateGameState);
    listenWhenUserJoinsGame(gameId, userJoinsGameCallback);
    listenWhenGameRotates(gameId, updateGameState);
  }, []);
}

export default useListenOnEvents;
