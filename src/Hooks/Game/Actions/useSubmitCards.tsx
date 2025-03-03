import { useCallback } from "react";
import { WhiteCard } from "@/Types/WhiteCard";
import { submitCards } from "@/Services/GameService";
import { SetHasSubmittedCards } from "@/State/Auth/AuthActions";
import { useAuth } from "@/State/Auth/useAuth";

function useSubmitCards() {
  const { dispatch } = useAuth();

  return useCallback(
    async (gameId: string, blackCardPick: number, hand: WhiteCard[]) => {
      try {
        const selectedCardIds = hand.filter((card) => card.selected)
          .sort((leftCard, rightCard) => leftCard.order - rightCard.order)
          .map((card) => card.id);
        await submitCards(gameId, blackCardPick, selectedCardIds);
        dispatch(new SetHasSubmittedCards(true));
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
}

export default useSubmitCards;
