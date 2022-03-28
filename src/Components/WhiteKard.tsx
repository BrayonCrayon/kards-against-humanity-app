import React, { useCallback, useContext, useMemo } from "react";
import { WhiteCard } from "../Types/WhiteCard";
import { GameContext } from "../State/Game/GameContext";
import { useHand } from "../State/Hand/HandContext";
import { SetHandAction } from "../State/Hand/HandActionts";

interface WhiteKardProps {
  card: WhiteCard;
}

export const WhiteKard: React.FC<WhiteKardProps> = ({ card }) => {
  const { blackCard, hasSubmittedCards } = useContext(GameContext);
  const {
    state: { hand },
    dispatch,
  } = useHand();

  const highestOrder = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const nonSubmittedCards = useMemo(() => {
    return !card.selected && hasSubmittedCards;
  }, [card, hasSubmittedCards]);

  const toggle = useCallback(() => {
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

    dispatch(new SetHandAction(clone));
  }, [card, dispatch, hand, hasSubmittedCards, highestOrder, blackCard]);

  return (
    <div
      className={`relative rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-wrap cursor-pointer hover:bg-gray-100 
        ${
          card.selected
            ? "border-2 border-blue-400 bg-gray-100"
            : "border border-black"
        } 
        ${hasSubmittedCards ? "cursor-not-allowed" : ""} 
        ${nonSubmittedCards ? "opacity-25" : ""}
      `}
      onClick={toggle}
      data-testid={`white-card-${card.id}`}
    >
      {card.order > 0 && (
        <div
          data-testid={`white-card-${card.id}-order`}
          className="absolute text-sm top-1 right-2 font-bold"
        >
          {card.order}
        </div>
      )}
      <span>{card.text}</span>
      <div className="absolute text-xs bottom-1 right-1 ">
        Kards Against Humanity
      </div>
    </div>
  );
};
