import { useHand } from "../State/Hand/HandContext";
import { WhiteKard } from "./WhiteKard";
import { useCallback, useContext, useMemo } from "react";
import { useUser } from "../State/User/UserContext";
import { GameContext } from "../State/Game/GameContext";
import { SetHandAction } from "../State/Hand/HandActionts";
import { WhiteCard } from "../Types/WhiteCard";
import { decrementPreviouslySelectedCardPositions } from "../Utilities/helpers";

const Hand = () => {
  const {
    state: { hand },
    dispatch: handDispatch,
  } = useHand();

  const { blackCard } = useContext(GameContext);

  const {
    state: { hasSubmittedCards },
  } = useUser();

  const positionOfLastSelectedCard = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const hasSelectedAmountReached = useMemo(() => {
    return blackCard.pick < positionOfLastSelectedCard + 1;
  }, [positionOfLastSelectedCard, blackCard]);

  const nextCardPosition = useMemo(() => {
    return hasSelectedAmountReached
      ? positionOfLastSelectedCard
      : positionOfLastSelectedCard + 1;
  }, [hasSelectedAmountReached, positionOfLastSelectedCard]);

  const select = useCallback(
    (card: WhiteCard) => {
      if (hasSubmittedCards) return;

      const clone = [...hand];
      const cardToSelect = clone.find((item) => item.id === card.id);

      if (!cardToSelect) return;

      if (hasSelectedAmountReached)
        decrementPreviouslySelectedCardPositions(clone);

      cardToSelect.order = nextCardPosition;
      cardToSelect.selected = true;

      handDispatch(new SetHandAction(clone));
    },
    [
      handDispatch,
      hand,
      hasSubmittedCards,
      nextCardPosition,
      hasSelectedAmountReached,
      positionOfLastSelectedCard,
      blackCard,
    ]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {hand.map((card) => (
        <WhiteKard card={card} key={card.id} onClick={select} />
      ))}
    </div>
  );
};

export default Hand;
