import React from "react";
import { BlackCard } from "Types/BlackCard";

interface BlackCardProps {
  card: BlackCard;
}

export const BlackKard: React.FC<BlackCardProps> = ({ card }) => {
  return (
    <div
      className="border border-black bg-black text-white shadow-md font-bold flex flex-col justify-between px-4 py-2 text-3xl leading-normal min-h-72 max-w-64 md:text-3xl"
      data-testid={`black-card-${card.id}`}
    >
      <span>K.<br/>{card.text}</span>
      <div className="text-xs self-end pt-3 hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
