import { useVote } from "State/Vote/useVote";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import React, { useCallback, useEffect, useMemo } from "react";
import { ClearStateAction } from "State/Vote/VoteActions";
import { Button } from "./Button";
import { useGame } from "State/Game/useGame";
import useRotateGame from "Hooks/Game/Actions/useRotateGame";
import { usePlayers } from "State/Players/usePlayers";
import { useAuth } from "State/Auth/useAuth";

export function RoundWinnerModal() {
  const {
    dispatch,
    state: { selectedRoundWinner },
  } = useVote();
  const {
    state: { game },
  } = useGame();
  const {
    state: { auth },
  } = useAuth();
  const {
    state: { players },
  } = usePlayers();

  const rotateGame = useRotateGame();

  const name = useMemo(() => {
    const user = players.find((user) => {
      return user.id === selectedRoundWinner?.user_id;
    });

    if (!user) {
      return undefined;
    }

    return user.name;
  }, [players, selectedRoundWinner]);

  const close = useCallback(() => {
    dispatch(new ClearStateAction());
  }, []);

  const rotate = useCallback(async () => {
    await rotateGame(game.id);
  }, [game]);

  useEffect(() => {
    if (selectedRoundWinner && auth.id === game.judgeId) rotate();
  }, [selectedRoundWinner]);

  if (!selectedRoundWinner) return null;

  return (
    <div
      data-testid="round-winner-modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white bg-opacity-75"
    >
      <div className="bg-white p-2 shadow-md border-2 rounded flex flex-col">
        <h1 className="text-4xl text-center pb-1">The winner is: {name}</h1>
        <PlayerSubmittedCCard
          playerSubmission={selectedRoundWinner}
          blackCard={selectedRoundWinner.black_card}
        />
        <Button
          text="Close"
          onClick={close}
          dataTestid="round-winner-modal-close-button"
          className="self-center"
        />
      </div>
    </div>
  );
}
