import React from "react";
import {BlackCard} from "Types/BlackCard";

interface BlackCardProps {
  card: BlackCard;
}

export const BlackKard: React.FC<BlackCardProps> = ({ card }) => {
  return (
    <div
      className="relative border border-black bg-black text-white shadow-md font-bold flex flex-col px-4 py-2 text-3xl leading-normal min-h-72 max-w-64 md:text-3xl"
      data-testid={`black-card-${card.id}`}
    >
      <span>{card.text}</span>
      <div className="absolute bottom-1 right-1 text-base self-end pt-3 hidden md:block">K.</div>
    </div>
  );
};
