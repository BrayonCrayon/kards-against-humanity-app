import { FC, useCallback, useContext, useEffect, useState } from "react";
import { apiClient } from "../Api/apiClient";
import { GameContext } from "../State/Game/GameContext";
import { PlayerSubmittedCard } from "../Types/ResponseTypes";
import { IWhiteCard } from "../Types/WhiteCard";

export const VotingSection: FC = () => {
  const { game, blackCard } = useContext(GameContext);

  const [submittedCards, setSubmittedCards] = useState<
    Array<PlayerSubmittedCard>
  >([]);

  const getSubmittedCards = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Array<PlayerSubmittedCard>>(
        `/api/game/${game.id}/submitted-cards`
      );
      console.log(data);
      setSubmittedCards(data);
    } catch (error) {
      console.error(error);
    }
  }, [setSubmittedCards]);

  useEffect(() => {
    if (submittedCards.length > 0) return;
    getSubmittedCards();
  }, [submittedCards]);

  const formPlayerResponse = useCallback(
    (cards: Array<IWhiteCard>) => {
      let blackCardText = blackCard.text;
      cards
        .filter((card) => card.order)
        .forEach((card) => {
          if (blackCardText.indexOf("_", 0) < 0) return;

          blackCardText = blackCardText.replace("_", card.text);
        });

      return blackCardText;
    },
    [blackCard]
  );

  return (
    <div data-testid="voting-section">
      {submittedCards.map((submittedCard) => (
        <div
          key={submittedCard.user_id}
          data-testid={`player-submitted-response-${submittedCard.user_id}`}
        >
          <div data-testid={`player-card-response-${submittedCard.user_id}`}>
            {formPlayerResponse(submittedCard.submitted_cards)}
          </div>
        </div>
      ))}
    </div>
  );
};
