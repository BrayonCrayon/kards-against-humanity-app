import { useVote } from "../State/Vote/VoteContext";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import React, { useCallback, useContext, useMemo } from "react";
import { CLEAR_STATE } from "../State/Vote/VoteActions";
import { Button } from "./Button";
import { GameContext } from "../State/Game/GameContext";

export function RoundWinnerModal() {
  const {
    dispatch,
    state: { selectedRoundWinner },
  } = useVote();

  const { users } = useContext(GameContext);
  const name = useMemo(() => {
    const user = users.find((user) => {
      return user.id === selectedRoundWinner?.user_id;
    });

    if (!user) {
      return undefined;
    }

    return user.name;
  }, [users, selectedRoundWinner]);

  const close = useCallback(() => {
    dispatch({ type: CLEAR_STATE });
  }, []);

  if (!selectedRoundWinner) return null;

  return (
    <div
      data-testid="round-winner-modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white bg-opacity-75"
    >
      <div className="bg-white p-2 shadow-md border-2 rounded flex flex-col">
        <h1 className="text-4xl text-center pb-1">The winner is: {name}</h1>
        <PlayerSubmittedCCard playerSubmission={selectedRoundWinner} />
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