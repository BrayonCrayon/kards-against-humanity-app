import { WhiteKard } from "./WhiteKard";
import { FC, useCallback, useMemo } from "react";
import { SetHandAction } from "State/Hand/HandActions";
import { WhiteCard } from "Types/WhiteCard";
import { decrementPreviouslySelectedCardPositions } from "Utilities/helpers";
import Swal from "sweetalert2";
import useRedrawPlayerHand from "Hooks/Game/Actions/useRedrawPlayerHand";
import { errorToast } from "Utilities/toasts";
import { useHand } from "State/Hand/useHand";
import { useGame } from "State/Game/useGame";
import { useAuth } from "State/Auth/useAuth";
import FloatingButton from "Components/Atoms/FloatingButton";
import { ButtonVariant } from "Components/Atoms/Button";

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

  const redrawHand = useRedrawPlayerHand();

  const redrawText = useMemo(() => {
    return `${game.redrawLimit - auth.redrawCount} Redraws Left`;
  }, [auth, game]);

  const redraw = useCallback(async () => {
    if (auth.redrawCount === game.redrawLimit) {
      errorToast("Cannot redraw, please wait until next round.");
      return;
    }

    const result = await Swal.fire({
      title: `Are you sure you want to redraw?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isDismissed || result.isDenied) {
      return;
    }

    await redrawHand(game.id);
  }, [game, auth]);

  const positionOfLastSelectedCard = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const hasSelectedAmountReached = useMemo(() => {
    return blackCard.pick < positionOfLastSelectedCard + 1;
  }, [positionOfLastSelectedCard, blackCard]);

  const nextCardPosition = useMemo(() => {
    return hasSelectedAmountReached ? positionOfLastSelectedCard : positionOfLastSelectedCard + 1;
  }, [hasSelectedAmountReached, positionOfLastSelectedCard]);

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

  const showSubmitButton = useMemo(() => {
    return hand.filter((card) => card.selected).length === blackCard.pick;
  }, [hand, blackCard]);

  return (
    <>
      <div className="w-full flex justify-center">
        <button
          className="w-1/2 py-1 bg-gray-300 text-gray-900 rounded-full mb-5"
          data-testid="redraw-button"
          onClick={redraw}
        >
          <i className="fas fa-sync-alt pr-2" />
          {redrawText}
        </button>
      </div>
      <div className="grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
        {hand.map((card) => (
          <FloatingButton
            variant={ButtonVariant['light-compact']}
            key={card.id}
            role={`submit-${card.id}`}
            showButton={showSubmitButton && positionOfLastSelectedCard === card.order}
            onClick={onSubmit}
            className="min-w-64"
            buttonClass="-top-6 -right-2"
          >
            <WhiteKard card={card} onClick={select} className="h-full" />
          </FloatingButton>
        ))}
      </div>
    </>
  );
};

export default Hand;
