import { FC, useCallback, useContext, useEffect, useState } from "react";
import { apiClient } from "../Api/apiClient";
import { GameContext } from "../State/Game/GameContext";
import {
  PlayerSubmittedCard,
  SubmittedCardsResponse,
} from "../Types/ResponseTypes";

export const VotingSection: FC = () => {
  const { game } = useContext(GameContext);

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

  return (
    <div data-testid="voting-section">
      {submittedCards.map((submittedCard) => (
        <div
          key={submittedCard.user_id}
          data-testid={`player-submitted-response-${submittedCard.user_id}`}
        ></div>
      ))}
    </div>
  );
};
