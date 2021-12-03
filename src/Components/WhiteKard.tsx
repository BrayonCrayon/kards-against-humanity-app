import React, { useCallback, useContext, useState } from "react";
import { WhiteCard } from "../Types/WhiteCard";
import { GameContext } from "../State/Game/GameContext";

interface KardProps {
  card: WhiteCard;
  disable?: boolean;
}

export const WhiteKard: React.FC<KardProps> = ({ card, disable }) => {
  const { setHand, hand } = useContext(GameContext);

  // const toggle = useCallback(() => {
  //   if (disable) return;
  //   setHand()
  //   setIsSelected(!card.selected);
  // }, [setIsSelected, disable]);

  return (
    <div
      className={`rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-col justify-between cursor-pointer hover:bg-gray-100 ${
        card.selected ? "border-4 border-blue-400" : "border border-black"
      }`}
      onClick={() => {}}
      data-testid={`white-card-${card.id}`}
    >
      <span>{card.text}</span>
      <div className="text-xs self-end hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
