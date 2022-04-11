import { useCallback } from "react";
import { WhiteCard } from "Types/WhiteCard";
import { submitCards } from "Services/GameService";
import { SetHasSubmittedCards } from "State/User/UserActions";
import { useUser } from "State/User/UserContext";

function useSubmitCards() {
  const { dispatch } = useUser();

  return useCallback(
    async (gameId: string, blackCardPick: number, hand: WhiteCard[]) => {
      try {
        await submitCards(gameId, blackCardPick, hand);
        dispatch(new SetHasSubmittedCards(true));
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
}

export default useSubmitCards;
