import React, { useCallback, useContext, useMemo } from "react";
import { WhiteCard } from "../Types/WhiteCard";
import { GameContext } from "../State/Game/GameContext";

interface WhiteKardProps {
  card: WhiteCard;
}

export const WhiteKard: React.FC<WhiteKardProps> = ({ card }) => {
  const { setHand, hand, blackCard, hasSubmittedCards } =
    useContext(GameContext);

  const highestOrder = useMemo(() => {
    return Math.max(...hand.map((item) => item.order));
  }, [hand]);

  const canSelect = useMemo(() => {
    return (
      hand.filter((item) => item.selected).length < blackCard.pick ||
      card.selected
    );
  }, [hand, blackCard, card]);

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

    setHand(() => clone);
  }, [
    card,
    setHand,
    canSelect,
    hand,
    hasSubmittedCards,
    highestOrder,
    blackCard,
  ]);

  return (
    <div
      className={`rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-wrap cursor-pointer hover:bg-gray-100 ${
        card.selected ? "border-4 border-blue-400" : "border border-black"
      } ${canSelect ? "" : "opacity-25 cursor-not-allowed"} `}
      onClick={toggle}
      data-testid={`white-card-${card.id}`}
    >
      {card.order > 0 && (
        <div
          data-testid={`white-card-${card.id}-order`}
          className=" text-sm w-full text-right"
        >
          {card.order}
        </div>
      )}
      <span>{card.text}</span>
      <div className="text-xs self-end hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
