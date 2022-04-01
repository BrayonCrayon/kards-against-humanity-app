import { useHand } from "../State/Hand/HandContext";
import { WhiteKard } from "./WhiteKard";
import { useCallback, useContext, useMemo } from "react";
import { useUser } from "../State/User/UserContext";
import { GameContext } from "../State/Game/GameContext";
import { SetHandAction } from "../State/Hand/HandActionts";
import { WhiteCard } from "../Types/WhiteCard";
import { reorderHand } from "../Utilities/helpers";

const Hand = () => {
  const {
    state: { hand },
    dispatch: handDispatch,
  } = useHand();

  const { blackCard } = useContext(GameContext);

  const {
    state: { hasSubmittedCards },
  } = useUser();

  /*
   #1 white card - 1
   #2 white card - 2
   #3 white card - 0
   #4 white card - 0
   #5 white card - 0
   #6 white card - 0
   #7 white card - 0
   orderOfLastSelectedCard
   */
  const positionOfLastSelectedCard = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const toggle = useCallback(
    (card: WhiteCard) => {
      if (hasSubmittedCards) return;

      const clone = [...hand];
      const cardToSelect = clone.find((item) => item.id === card.id);

      if (!cardToSelect) return;

      if (blackCard.pick < positionOfLastSelectedCard + 1) {
        reorderHand(clone);
        cardToSelect.order = positionOfLastSelectedCard;
      } else {
        cardToSelect.order = positionOfLastSelectedCard + 1;
      }
      cardToSelect.selected = !card.selected;

      handDispatch(new SetHandAction(clone));
    },
    [
      handDispatch,
      hand,
      hasSubmittedCards,
      positionOfLastSelectedCard,
      blackCard,
    ]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {hand.map((card) => (
        <WhiteKard card={card} key={card.id} onClick={toggle} />
      ))}
    </div>
  );
};

export default Hand;
