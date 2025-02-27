import { User } from "Types/User";
import { useMemo } from "react";
import { useVote } from "State/Vote/useVote";
import { transformSubmissionsToWhiteCard } from "Types/WhiteCard";

export const useDetermineWinner = (players: User[]) => {
  const { state: { selectedRoundWinner } } = useVote();

  const winner = useMemo(() => {
    return players.find((player) => player.id === selectedRoundWinner?.user_id);
  }, [players, selectedRoundWinner]);

  return {
    winner,
    winnerCards: transformSubmissionsToWhiteCard(selectedRoundWinner?.submitted_cards ?? [])
  }
}

export default useDetermineWinner;