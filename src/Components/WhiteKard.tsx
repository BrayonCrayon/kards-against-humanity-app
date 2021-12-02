import React, { useCallback, useState } from "react";
import { WhiteCard } from "../Types/WhiteCard";

interface KardProps {
  card: WhiteCard;
  disable?: boolean;
}

export const WhiteKard: React.FC<KardProps> = ({ card, disable }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (disable) return;
    setIsSelected(!isSelected);
  }, [isSelected, setIsSelected, disable]);

  return (
    <div
      className={`rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-col justify-between cursor-pointer hover:bg-gray-100 ${
        isSelected ? "border-4 border-blue-400" : "border border-black"
      }`}
      onClick={toggle}
      data-testid={`white-card-${card.id}`}
    >
      <span>{card.text}</span>
      <div className="text-xs self-end hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
