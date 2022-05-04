import { FC, useCallback, useEffect } from "react";
import { useGame } from "State/Game/useGame";
import { useVote } from "State/Vote/useVote";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import useFetchRoundWinner from "Hooks/Game/useFetchRoundWinner";
import { Button } from "./Button";
import { Selectable } from "./Selectable";
import { SelectWinnerAction } from "State/Vote/VoteActions";
import { useAuth } from "State/Auth/useAuth";
import useSubmittedCards from "Hooks/Game/useSubmittedCards";
import useSubmitWinner from "Hooks/Game/useSubmitWinner";

export const VotingSection: FC = () => {
  const { state: { game, blackCard }, } = useGame();
  const { state: { selectedPlayerId, selectedRoundWinner }, dispatch, } = useVote();
  const { state: { auth }, } = useAuth();

  const {submittedCards, getSubmittedCards} = useSubmittedCards();
  const submitWinner = useSubmitWinner();

  const fetchRoundWinner = useFetchRoundWinner();
  useEffect(() => {
    listenWhenWinnerIsSelected(game.id, fetchRoundWinner);
  }, []);

  useEffect(() => {
    if (submittedCards.length > 0) return;
    getSubmittedCards(game.id);
  }, []);

  const selectCard = useCallback((user_id) => {
      if (game.judgeId !== auth.id) return;
      dispatch(new SelectWinnerAction(user_id));
  }, [dispatch, game, auth]);

  return (
    <div data-testid="voting-section">
      <div className="mt-6 border-b-2  border-gray-500 mx-2 text-xl font-semibold text-center">
        Submitted cards
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 justify-items-center md:grid-cols-2 lg:grid-cols-4">
        {submittedCards.map((submission) => (
          <Selectable
            key={submission.user_id}
            dataTestid={`selectable-${submission.user_id}`}
            isSelected={submission.user_id === selectedPlayerId}
            onClick={() => selectCard(submission.user_id)}
          >
            <PlayerSubmittedCCard
              playerSubmission={submission}
              blackCard={blackCard}
            />
          </Selectable>
        ))}
      </div>
      <div className="flex justify-center">
        {auth.id === game.judgeId && !selectedRoundWinner && (
          <Button
            text="Submit Winner"
            onClick={() => submitWinner(game.id, selectedPlayerId)}
            className={selectedPlayerId > 0 ? "" : "disabled cursor-not-allowed opacity-75"}
            dataTestid="submit-selected-winner"
          />
        )}
      </div>
    </div>
  );
};
