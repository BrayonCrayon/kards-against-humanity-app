import { useVote } from "../State/Vote/VoteContext";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import React from "react";

export function RoundWinnerModal() {
  const {
    state: { selectedRoundWinner },
  } = useVote();

  if (!selectedRoundWinner) return null;

  return (
    <div
      data-testid="round-winner-modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white bg-opacity-75"
    >
      <div className="bg-white p-2 shadow-md border-2 rounded">
        <PlayerSubmittedCCard
          playerSubmission={selectedRoundWinner}
        ></PlayerSubmittedCCard>
      </div>
    </div>
  );
}
