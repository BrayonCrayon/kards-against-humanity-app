import React from "react";
import { BlackCard } from "Types/BlackCard";

interface BlackCardProps {
  card: BlackCard;
}

export const BlackKard: React.FC<BlackCardProps> = ({ card }) => {
  return (
    <div
      className="border border-black bg-black text-white rounded shadow-md font-weight-800 flex flex-col justify-between p-8 text-2xl md:text-3xl"
      data-testid={`black-card-${card.id}`}
    >
      <span>{card.text}</span>
      <div className="text-xs self-end hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
