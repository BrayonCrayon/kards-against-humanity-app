import useUserJoinsGameCallback from "Hooks/Helpers/useUserJoinsGameCallback";
import useRefreshPlayersStateCallback from "Hooks/Game/State/useRefreshPlayersStateCallback";
import { useCallback } from "react";
import {
  listenWhenGameRotates,
  listenWhenGameStart,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards
} from "Services/PusherService";
import useSpectatorStateCallback from "Hooks/Game/State/useSpectatorStateCallback";

function useListenOnSpectatorEvents() {
  const updateGameState = useSpectatorStateCallback();
  const userJoinsGameCallback = useUserJoinsGameCallback();
  const refreshPlayersState = useRefreshPlayersStateCallback();

  return useCallback((gameId: string, userId: number) => {
    listenWhenUserSubmittedCards(gameId, refreshPlayersState);
    listenWhenUserJoinsGame(gameId, userJoinsGameCallback);
    listenWhenGameRotates(gameId, updateGameState);
    listenWhenGameStart(userId, updateGameState);
  }, []);

}

export default useListenOnSpectatorEvents;