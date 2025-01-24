import { useCallback, useState } from "react";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { SubmittedCard, transformSubmittedCardArray } from "Types/SubmittedCard";
import { WhiteCard } from "Types/WhiteCard";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";
import { randNumber } from "@ngneat/falso";

function useSubmittedCards() {
  const [submittedCards, setSubmittedCards] = useState<Array<PlayerSubmittedCard>>([]);
  const [whiteCards, setWhiteCards] = useState<WhiteCard[][]>([]);

  const getSubmittedCards =  useCallback(async (gameId: string) => {
    try {
      // const { data } = await gameService.fetchSubmittedCards(gameId);
      // TODO: Please remove this part!!
      const data = Array.from({ length: 3 }).map(() => ({
        user_id: randNumber(),
        submitted_cards: [
          submittedCardFactory(),
          submittedCardFactory(),
          submittedCardFactory(),
          submittedCardFactory(),
          submittedCardFactory(),
          submittedCardFactory(),
          submittedCardFactory()
        ]
      }));

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

  return {submittedCards, getSubmittedCards, whiteCards};
}

export default useSubmittedCards;