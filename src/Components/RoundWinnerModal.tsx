import { useVote } from "@/State/Vote/useVote";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ClearStateAction } from "@/State/Vote/VoteActions";
import { Button } from "@/Components/Atoms/Button";
import { useGame } from "@/State/Game/useGame";
import useRotateGame from "@/Hooks/Game/Actions/useRotateGame";
import { usePlayers } from "@/State/Players/usePlayers";
import { useAuth } from "@/State/Auth/useAuth";
import { listenWhenSpectatorDisplaysWinner } from "@/Services/PusherService";

export function RoundWinnerModal() {
  const {
    dispatch,
    state: { selectedRoundWinner },
  } = useVote();
  const {
    state: { game, hasSpectator },
  } = useGame();
  const {
    state: { auth },
  } = useAuth();
  const {
    state: { players },
  } = usePlayers();

  const rotateGame = useRotateGame();
  const [isSpectatorFinished, setIsSpectatorFinished] = useState(false);

  const name = useMemo(() => {
    const user = players.find((user) => {
      return user.id === selectedRoundWinner?.user_id;
    });

    return !user ? undefined : user.name;
  }, [players, selectedRoundWinner]);

  const close = useCallback(() => {
    dispatch(new ClearStateAction());
  }, []);

  const rotate = useCallback(async () => {
    await rotateGame(game.id);
  }, [game]);

  useEffect(() => {
    if(hasSpectator) {
      listenWhenSpectatorDisplaysWinner(game.id, () => {
        setIsSpectatorFinished(true);
      })
    }
  }, []);

  useEffect(() => {
    if (selectedRoundWinner && auth.id === game.judgeId) rotate();
  }, [selectedRoundWinner]);

  if (!selectedRoundWinner || (hasSpectator && !isSpectatorFinished)) return null;

  return (
    <div
      data-testid="round-winner-modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white/75"
    >
      <div className="bg-white p-8 shadow-md border-2 rounded-sm flex flex-col justify-center">
        <h1 className="text-4xl text-center pb-4">The winner is: {name}</h1>
        <PlayerSubmittedCCard
          className="self-center overflow-y-auto max-h-[462px]"
          playerSubmission={selectedRoundWinner}
          blackCard={selectedRoundWinner.black_card}
        />
        <Button text="Close" onClick={close} dataTestid="round-winner-modal-close-button" className="self-center" />
      </div>
    </div>
  );
}
