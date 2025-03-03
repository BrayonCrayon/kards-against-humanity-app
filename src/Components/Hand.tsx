import { WhiteKard } from "./WhiteKard";
import React, { FC, useCallback, useMemo } from "react";
import { SetHandAction } from "@/State/Hand/HandActions";
import { WhiteCard } from "@/Types/WhiteCard";
import { canSubmit, decrementPreviouslySelectedCardPositions } from "@/Utilities/helpers";
import { useHand } from "@/State/Hand/useHand";
import { useGame } from "@/State/Game/useGame";
import { useAuth } from "@/State/Auth/useAuth";
import Redraw from "./Redraw";
import SubmitButton from "./SubmitButton";

interface HandProps {
  onSubmit?: () => void;
}

const Hand: FC<HandProps> = ({ onSubmit = () => {} }) => {
  const {
    state: { hand },
    dispatch: handDispatch,
  } = useHand();

  const {
    state: { blackCard, game },
  } = useGame();

  const {
    state: { auth, hasSubmittedCards },
  } = useAuth();

  const positionOfLastSelectedCard = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const hasSelectedAmountReached = useMemo(() => {
    return blackCard.pick < positionOfLastSelectedCard + 1;
  }, [positionOfLastSelectedCard, blackCard]);

  const nextCardPosition = useMemo(() => {
    return hasSelectedAmountReached ? positionOfLastSelectedCard : positionOfLastSelectedCard + 1;
  }, [hasSelectedAmountReached, positionOfLastSelectedCard]);

  // TODO: Come back to find an easier way to approaching this
  const showSubmitButton = useMemo(() => {
    return canSubmit(hand, blackCard.pick);
  }, [hand, blackCard]);

  const select = useCallback(
    (card: WhiteCard) => {
      if (hasSubmittedCards) return;

      const clone = [...hand];
      const cardToSelect = clone.find((item) => item.id === card.id);

      if (!cardToSelect) return;

      if (hasSelectedAmountReached) decrementPreviouslySelectedCardPositions(clone);

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
    <>
      <div className="grid place-items-center md:grid-cols-6">
        <SubmitButton
          onSubmit={() => onSubmit()}
          show={showSubmitButton}
          transitionClassName="submit-button"
          buttonClass="submit-button hidden md:flex"
          dataTestId="submit"
        />
        <Redraw
          game={game}
          redrawsUsed={auth.redrawCount}
          className="flex flex-col pb-4 pt-10 items-center gap-4 md:mr-4 md:col-start-6"
          buttonClass="w-full min-w-64 py-3 mb-5 md:min-w-[100%] md:py-0.5 md:px-3"
        />
      </div>
      <div className="grid grid-cols-1 pb-10 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {hand.map((card) => (
          <div className="w-full flex flex-col" key={card.id}>
            <WhiteKard
              card={card}
              onClick={select}
              className={`h-full min-w-64 self-center md:m-0 ${
                showSubmitButton && positionOfLastSelectedCard === card.order ? "" : "mb-16"
              }`}
            />
            <SubmitButton
              show={showSubmitButton && positionOfLastSelectedCard === card.order}
              timeout={400}
              onSubmit={() => onSubmit()}
              transitionClassName="submit-button-slide"
              buttonClass="white-card-submit-button md:hidden"
              dataTestId={`submit-${card.id}`}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Hand;
