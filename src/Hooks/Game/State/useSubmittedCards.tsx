import { useCallback, useState } from "react";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import gameService from "Services/GameService";

function useSubmittedCards() {
  const [submittedCards, setSubmittedCards] = useState<Array<PlayerSubmittedCard>>([]);

  const getSubmittedCards =  useCallback(async (gameId) => {
    try {
      const { data } = await gameService.fetchSubmittedCards(gameId);
      setSubmittedCards(data);
    } catch (error) {
      console.error(error);
    }
  }, [setSubmittedCards]);

  return {submittedCards, getSubmittedCards};
}

export default useSubmittedCards;