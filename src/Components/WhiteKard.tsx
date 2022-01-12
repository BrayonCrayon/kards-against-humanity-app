import React, { useCallback, useContext, useMemo } from "react";
import { WhiteCard } from "../Types/WhiteCard";
import { GameContext } from "../State/Game/GameContext";

interface WhiteKardProps {
  card: WhiteCard;
}

export const WhiteKard: React.FC<WhiteKardProps> = ({ card }) => {
  const { setHand, hand, blackCard, hasSubmittedCards } =
    useContext(GameContext);

  const nextOrder = useMemo(() => {
    return Math.max(...hand.map((item) => item.order)) + 1;
  }, [hand]);

  const canSelect = useMemo(() => {
    return (
      hand.filter((item) => item.selected).length < blackCard.pick ||
      card.selected
    );
  }, [hand, blackCard, card]);

  const toggle = useCallback(() => {
    if (!canSelect) return;
    if (hasSubmittedCards) return;

    const clone = [...hand];
    const cardToSelect = clone.find((item) => item.id === card.id);

    if (!cardToSelect) return;

    if (cardToSelect.selected) {
      clone.forEach((item) => {
        item.selected = false;
        item.order = 0;
      });
    } else {
      cardToSelect.selected = !card.selected;
      cardToSelect.order = nextOrder;
    }

    setHand(() => clone);
  }, [card, setHand, canSelect, hand, hasSubmittedCards, nextOrder]);

  return (
    <div
      className={`rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-col justify-between cursor-pointer hover:bg-gray-100 ${
        card.selected ? "border-4 border-blue-400" : "border border-black"
      } ${canSelect ? "" : "opacity-25 cursor-not-allowed"} `}
      onClick={toggle}
      data-testid={`white-card-${card.id}`}
    >
      {card.order > 0 && (
        <div data-testid={`white-card-${card.id}-order`} className="">
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
