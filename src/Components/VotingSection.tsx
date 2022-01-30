import { FC, useCallback, useContext, useEffect, useState } from "react";
import { apiClient } from "../Api/apiClient";
import { GameContext } from "../State/Game/GameContext";
import { PlayerSubmittedCard, SubmittedCard } from "../Types/ResponseTypes";
import { useVote } from "../State/Vote/VoteContext";
import { SELECT_WINNER } from "../State/Vote/VoteActions";

export const VotingSection: FC = () => {
  const { game, blackCard } = useContext(GameContext);
  const {
    state: { selectedPlayerId },
    dispatch,
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

  const formPlayerResponse = useCallback(
    (cards: Array<SubmittedCard>) => {
      let blackCardText = blackCard.text;
      cards
        .sort((left, right) => left.order - right.order)
        .forEach((card) => {
          if (blackCardText.indexOf("_", 0) < 0) return;

          blackCardText = blackCardText.replace(
            "_",
            card.text.replace(/\.$/, "")
          );
        });

      return blackCardText;
    },
    [blackCard]
  );

  const selectCard = useCallback((userId: number) => {
    dispatch({ type: SELECT_WINNER, payload: { userId } });
  }, []);

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
        {submittedCards.map((submittedCard) => (
          <div
            className={`bg-black text-white rounded shadow-md border p-8 
              ${
                submittedCard.user_id === selectedPlayerId
                  ? "border-blue-400"
                  : "border-black"
              }
            `}
            key={submittedCard.user_id}
            data-testid={`player-submitted-response-${submittedCard.user_id}`}
            onClick={() => selectCard(submittedCard.user_id)}
          >
            <div
              className="text-xl md:text-3xl font-weight-800"
              data-testid={`player-card-response-${submittedCard.user_id}`}
            >
              <span>{formPlayerResponse(submittedCard.submitted_cards)}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={submitWinner}
          className={` ${
            selectedPlayerId > 0 ? "" : "disabled cursor-not-allowed"
          }`}
          data-testid="submit-selected-winner"
        >
          Submit Winner
        </button>
      </div>
    </div>
  );
};
