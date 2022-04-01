import { useVote } from "../State/Vote/VoteContext";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { ClearStateAction } from "../State/Vote/VoteActions";
import { Button } from "./Button";
import { GameContext } from "../State/Game/GameContext";
import useRotateGame from "../Hooks/Game/useRotateGame";
import { useUsers } from "../State/Users/UsersContext";
import { useUser } from "../State/User/UserContext";

export function RoundWinnerModal() {
  const {
    dispatch,
    state: { selectedRoundWinner },
  } = useVote();
  const { game } = useContext(GameContext);
  const {
    state: { user },
  } = useUser();
  const {
    state: { users },
  } = useUsers();

  const rotateGame = useRotateGame();

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
    dispatch(new ClearStateAction());
  }, []);

  const rotate = useCallback(async () => {
    await rotateGame(game.id);
  }, [game]);

  useEffect(() => {
    if (selectedRoundWinner && user.id === game.judge_id) rotate();
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
