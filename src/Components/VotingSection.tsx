import { FC, useCallback, useEffect, useState } from "react";
import { apiClient } from "Api/apiClient";
import { useGame } from "State/Game/GameContext";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { useVote } from "State/Vote/VoteContext";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";
import { happyToast } from "Utilities/toasts";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import UseFetchRoundWinner from "Hooks/Game/UseFetchRoundWinner";
import { Button } from "./Button";
import { Selectable } from "./Selectable";
import { SelectWinnerAction } from "State/Vote/VoteActions";
import { useUser } from "State/User/UserContext";

export const VotingSection: FC = () => {
  const {
    state: { game, judge, blackCard },
  } = useGame();
  const {
    state: { selectedPlayerId, selectedRoundWinner },
    dispatch,
  } = useVote();
  const {
    state: { user },
  } = useUser();

  const [submittedCards, setSubmittedCards] = useState<
    Array<PlayerSubmittedCard>
  >([]);

  const getSubmittedCards = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Array<PlayerSubmittedCard>>(
        `/api/game/${game.id}/submitted-cards`
      );
      setSubmittedCards(data);
    } catch (error) {
      console.error(error);
    }
  }, [setSubmittedCards]);

  const fetchRoundWinner = UseFetchRoundWinner();
  useEffect(() => {
    listenWhenWinnerIsSelected(game.id, fetchRoundWinner);
  }, []);

  useEffect(() => {
    if (submittedCards.length > 0) return;
    getSubmittedCards();
  }, [submittedCards]);

  const submitWinner = useCallback(async () => {
    if (selectedPlayerId <= 0) return;
    try {
      await apiClient.post(`/api/game/${game.id}/winner`, {
        user_id: selectedPlayerId,
      });
      happyToast("Winner Selected!", "top");
    } catch (error) {
      console.error(error);
    }
  }, [selectedPlayerId, game]);

  const selectCard = useCallback(
    (user_id) => {
      if (judge.id !== user.id) return;

      dispatch(new SelectWinnerAction(user_id));
    },
    [dispatch, judge, user]
  );

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
        {user.id === judge.id && !selectedRoundWinner && (
          <Button
            text="Submit Winner"
            onClick={submitWinner}
            className={
              selectedPlayerId > 0
                ? ""
                : "disabled cursor-not-allowed opacity-75"
            }
            dataTestid="submit-selected-winner"
          />
        )}
      </div>
    </div>
  );
};
