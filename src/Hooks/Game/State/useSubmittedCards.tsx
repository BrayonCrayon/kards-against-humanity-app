import { useCallback, useState } from "react";
import { PlayerSubmittedCard } from "@/Types/ResponseTypes";
import { SubmittedCard, transformSubmittedCardArray } from "@/Types/SubmittedCard";
import { WhiteCard } from "@/Types/WhiteCard";
import gameService from "@/Services/GameService";

function useSubmittedCards() {
  const [submittedCards, setSubmittedCards] = useState<Array<PlayerSubmittedCard>>([]);
  const [whiteCards, setWhiteCards] = useState<WhiteCard[][]>([]);

  const getSubmittedCards =  useCallback(async (gameId: string) => {
    try {
      const { data } = await gameService.fetchSubmittedCards(gameId);

      data.forEach(submission => {
        submission.submitted_cards = transformSubmittedCardArray(submission.submitted_cards)
      })
      const submittedWhiteCards = data.map(submission => submission.submitted_cards)
        .map((submittedCards: SubmittedCard[]) => {
          return submittedCards.map(card => new WhiteCard(card.id, card.text, card.expansionId, true, card.order))
        })

      setWhiteCards(submittedWhiteCards)
      setSubmittedCards(data);
    } catch (error) {
      console.error(error);
    }
  }, [setSubmittedCards]);

  const reset = useCallback(() => {
    setSubmittedCards([]);
    setWhiteCards([]);
  }, [whiteCards, submittedCards]);

  return {submittedCards, getSubmittedCards, whiteCards, reset};
}

export default useSubmittedCards;