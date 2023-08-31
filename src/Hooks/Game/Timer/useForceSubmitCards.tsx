import {useCallback} from "react";
import {WhiteCard} from "Types/WhiteCard";
import {BlackCard} from "Types/BlackCard";
import {shuffle, take} from "lodash";
import {submitCards} from "Services/GameService";
import {useAuth} from "State/Auth/useAuth";
import {SetHasSubmittedCards} from "State/Auth/AuthActions";

export function useForceSubmitCards() {
  const { dispatch } = useAuth();


  return useCallback(async (gameId: string, hand: WhiteCard[], blackCard: BlackCard) => {
    try {
      const selectedCards = take(shuffle(hand), blackCard.pick).map(card => card.id);

      await submitCards(gameId, blackCard.pick, selectedCards);
      dispatch(new SetHasSubmittedCards(true));
    }
    catch (e) {
      console.error(e);
    }
  }, []);
}