import { useVote } from "../State/Vote/VoteContext";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import React, { useCallback } from "react";
import { CLEAR_STATE } from "../State/Vote/VoteActions";

export function RoundWinnerModal() {
  const {
    dispatch,
    state: { selectedRoundWinner },
  } = useVote();

  if (!selectedRoundWinner) return null;

  const close = useCallback(() => {
    dispatch({ type: CLEAR_STATE });
  }, []);

  return (
    <div
      data-testid="round-winner-modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white bg-opacity-75"
    >
      <div className="bg-white p-2 shadow-md border-2 rounded">
        <PlayerSubmittedCCard playerSubmission={selectedRoundWinner} />
        <button
          onClick={close}
          data-testid="round-winner-modal-close-button"
          className=""
        >
          Close
        </button>
      </div>
    </div>
  );
}
