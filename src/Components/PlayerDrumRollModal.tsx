import { FC, useCallback, useMemo } from "react";
import { useVote } from "@/State/Vote/useVote";
import WinnerRoom from "@/Components/Spectation/WinnerRoom";
import { usePlayers } from "@/State/Players/usePlayers";
import { transformSubmissionsToWhiteCard } from "@/Types/WhiteCard";
import { useGame } from "@/State/Game/useGame";
import useRotateGame from "@/Hooks/Game/Actions/useRotateGame";
import { useAuth } from "@/State/Auth/useAuth";
import { ClearStateAction } from "@/State/Vote/VoteActions";

export const PlayerDrumRollModal: FC = () => {
  const { state: { selectedRoundWinner }, dispatch: voteDispatch } = useVote()
  const { state: { players } } = usePlayers()
  const { state: { game } } = useGame()
  const { state: { auth } } = useAuth()
  const rotate = useRotateGame()

  const player = useMemo(() => {
    return players.find(user => user.id === selectedRoundWinner?.user_id)
  }, [selectedRoundWinner, players])

  const cards = useMemo(() => {
    if (!selectedRoundWinner) {
      return [];
    }

    return transformSubmissionsToWhiteCard(selectedRoundWinner.submitted_cards)
  }, [selectedRoundWinner])

  const afterShowingWinner = useCallback(async () => {
    if (auth.id === game.judgeId) {
      await rotate(game.id)
    }

    voteDispatch(new ClearStateAction());
  }, [])

  if (!player) return null;

  return (
    <div
      data-testid="player-drum-roll-modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-lukewarmGray-300"
    >
      <WinnerRoom player={player} cards={cards} onEnd={afterShowingWinner} />
    </div>
  )
}

export default PlayerDrumRollModal