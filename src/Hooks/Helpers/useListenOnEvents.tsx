import {useCallback} from "react";
import {
  listenWhenGameRotates,
  listenWhenGameStart,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards
} from "Services/PusherService";
import useGameStateCallback from "Hooks/Game/State/useGameStateCallback";
import useUserJoinsGameCallback from "./useUserJoinsGameCallback";

function useListenOnEvents() {
  const updateGameState = useGameStateCallback();
  const userJoinsGameCallback = useUserJoinsGameCallback();

  return useCallback((gameId: string, userId: number) => {
    listenWhenUserSubmittedCards(gameId, updateGameState);
    listenWhenUserJoinsGame(gameId, userJoinsGameCallback);
    listenWhenGameRotates(gameId, updateGameState);
    listenWhenGameStart(userId, updateGameState);
  }, []);
}

export default useListenOnEvents;
