import { useCallback, useContext } from "react";
import { GameContext } from "../../State/Game/GameContext";
import { Game } from "../../Types/Game";
import { apiClient } from "../../Api/apiClient";

function useFetchGameState() {
  const { setGame, setUsers, setUser, setHand, setBlackCard } =
    useContext(GameContext);

  const fetchGameState = useCallback(
    async (gameId: string) => {
      try {
        const { data } = await apiClient.get(`/api/game/${gameId}`);

        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [setGame, setUsers, setUser, setHand, setBlackCard]
  );

  return fetchGameState;
}

export default useFetchGameState;
