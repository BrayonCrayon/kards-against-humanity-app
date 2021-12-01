import { useCallback } from "react";
import { IGameContext } from "../../State/Game/GameContext";
import { Game } from "../../Types/Game";
import { apiClient } from "../../Api/apiClient";
import { setState } from "../../State/GeneralTypes";
import { WhiteCard } from "../../Types/WhiteCard";
import { BlackCard } from "../../Types/BlackCard";
import { User } from "../../Types/User";

function useFetchGameState(
  setUsers: setState<User[]>,
  setUser: setState<User>,
  setGame: setState<Game>,
  setHand: setState<WhiteCard[]>,
  setBlackCard: setState<BlackCard>
) {
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
    [setUsers, setUser, setGame, setHand, setBlackCard]
  );

  return fetchGameState;
}

export default useFetchGameState;
