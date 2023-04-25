import React from "react";
import {BlackCard} from "Types/BlackCard";

interface BlackCardProps {
  card: BlackCard;
}

export const BlackKard: React.FC<BlackCardProps> = ({ card }) => {
  return (
    <div
      className="relative border border-black bg-black text-white shadow-md font-bold flex flex-col px-6 py-7 text-3xl leading-normal min-h-72 max-w-64"
      data-testid={`black-card-${card.id}`}
    >
      <span>{card.text}</span>
      <div className="absolute bottom-1 right-1 text-2xl self-end pt-3 text-gray-600">K.</div>
    </div>
  );
};
