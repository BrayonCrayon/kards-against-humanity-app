import {useCallback} from "react";
import {
  listenWhenGameRotates,
  listenWhenGameStart,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards
} from "Services/PusherService";
import useGameStateCallback from "Hooks/Game/State/useGameStateCallback";
import useUserJoinsGameCallback from "./useUserJoinsGameCallback";
import useRefreshPlayersStateCallback from "Hooks/Game/State/useRefreshPlayersStateCallback";

function useListenOnEvents() {
  const updateGameState = useGameStateCallback();
  const userJoinsGameCallback = useUserJoinsGameCallback();
  const refreshPlayersState = useRefreshPlayersStateCallback();

  return useCallback((gameId: string, userId: number) => {
    listenWhenUserSubmittedCards(gameId, refreshPlayersState);
    listenWhenUserJoinsGame(gameId, userJoinsGameCallback);
    listenWhenGameRotates(gameId, updateGameState);
    listenWhenGameStart(userId, updateGameState);
  }, []);
}

export default useListenOnEvents;
