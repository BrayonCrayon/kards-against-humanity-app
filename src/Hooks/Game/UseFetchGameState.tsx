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

        setUser(data.current_user);
        setUsers(data.users);
        setGame({
          id: data.id,
          judge_id: data.judge.id,
          name: data.name,
          code: data.code,
        } as Game);
        setHand(data.hand);
        setBlackCard(data.current_black_card);

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [setGame, setUsers, setUser, setHand, setBlackCard]
  );

  return fetchGameState;
}

export default useFetchGameState;
