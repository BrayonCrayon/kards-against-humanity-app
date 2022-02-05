import { FC, useCallback, useContext, useEffect, useState } from "react";
import { apiClient } from "../Api/apiClient";
import { GameContext } from "../State/Game/GameContext";
import { PlayerSubmittedCard } from "../Types/ResponseTypes";
import { useVote } from "../State/Vote/VoteContext";
import { PlayerSubmittedCCard } from "./PlayerSubmittedCCard";

export const VotingSection: FC = () => {
  const { game, judge, user } = useContext(GameContext);
  const {
    state: { selectedPlayerId },
  } = useVote();

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
    } catch (error) {
      console.error(error);
    }
  }, [selectedPlayerId, game]);

  return (
    <div data-testid="voting-section">
      <div className="mt-6 border-b-2  border-gray-500 mx-2 text-xl font-semibold text-center">
        Submitted cards
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 justify-items-center md:grid-cols-2 lg:grid-flow-col">
        {submittedCards.map((submission) => (
          <PlayerSubmittedCCard
            key={submission.user_id}
            playerSubmission={submission}
          />
        ))}
      </div>
      <div className="flex justify-center">
        {user.id === judge.id && (
          <button
            onClick={submitWinner}
            className={`bg-gray-300 p-2 text-gray-900 font-semibold rounded shadow mt-4 mb-4 text-xl
              ${
                selectedPlayerId > 0
                  ? ""
                  : "disabled cursor-not-allowed opacity-75"
              }
            `}
            data-testid="submit-selected-winner"
          >
            Submit Winner
          </button>
        )}
      </div>
    </div>
  );
};
