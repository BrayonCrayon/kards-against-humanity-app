import { useHand } from "../State/Hand/HandContext";
import { WhiteKard } from "./WhiteKard";
import { useCallback, useContext, useMemo } from "react";
import { useUser } from "../State/User/UserContext";
import { GameContext } from "../State/Game/GameContext";
import { SetHandAction } from "../State/Hand/HandActionts";
import { WhiteCard } from "../Types/WhiteCard";

const Hand = () => {
  const {
    state: { hand },
    dispatch: handDispatch,
  } = useHand();

  const { blackCard } = useContext(GameContext);

  const {
    state: { hasSubmittedCards },
  } = useUser();

  const highestOrder = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const toggle = useCallback(
    (card: WhiteCard) => {
      if (hasSubmittedCards) return;

      const clone = [...hand];
      const cardToSelect = clone.find((item) => item.id === card.id);

      if (!cardToSelect) return;

      if (blackCard.pick < highestOrder + 1) {
        clone.forEach((item) => {
          if (item.order > 0) {
            item.order -= 1;
          }
          item.selected = item.order !== 0;
        });
        cardToSelect.order = highestOrder;
      } else {
        cardToSelect.order = highestOrder + 1;
      }
      cardToSelect.selected = !card.selected;

      handDispatch(new SetHandAction(clone));
    },
    [handDispatch, hand, hasSubmittedCards, highestOrder, blackCard]
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
