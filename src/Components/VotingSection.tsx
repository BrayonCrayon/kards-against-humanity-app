import { FC, useCallback, useEffect } from "react";
import { useGame } from "State/Game/useGame";
import { useVote } from "State/Vote/useVote";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import useFetchRoundWinner from "Hooks/Game/State/useFetchRoundWinner";
import { Selectable } from "Components/Atoms/Selectable";
import { SelectWinnerAction } from "State/Vote/VoteActions";
import { useAuth } from "State/Auth/useAuth";
import useSubmittedCards from "Hooks/Game/State/useSubmittedCards";
import useSubmitWinner from "Hooks/Game/Actions/useSubmitWinner";
import FloatingButton from "Components/Atoms/FloatingButton";
import { ButtonVariant } from "Components/Atoms/Button";

export const VotingSection: FC = () => {
  const { state: { game, blackCard }, } = useGame();
  const { state: { selectedPlayerId }, dispatch, } = useVote();
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
      <div className="grid place-items-center grid-cols-1 gap-4 p-4 justify-items-center md:grid-cols-2 lg:grid-cols-4">
        {submittedCards.map((submission) => (
          <FloatingButton
            key={submission.user_id}
            role="submit-selected-winner"
            variant={ButtonVariant['dark-compact']}
            showButton={auth.id === game.judgeId && selectedPlayerId === submission.user_id}
            onClick={() => submitWinner(game.id, selectedPlayerId)}
            buttonClass="-top-7 -right-2"
          >
            <Selectable
              dataTestid={`selectable-${submission.user_id}`}
              role={`selectable-${submission.user_id}`}
              isSelected={submission.user_id === selectedPlayerId}
              selectedClass="border-5 border-green-500"
              onClick={() => selectCard(submission.user_id)}
            >
              <PlayerSubmittedCCard
                playerSubmission={submission}
                blackCard={blackCard}
              />
            </Selectable>
          </FloatingButton>
        ))}
      </div>
    </div>
  );
};
