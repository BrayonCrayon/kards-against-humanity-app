import React from "react";
import {BlackCard} from "Types/BlackCard";
import PlayButton from "./Molecules/PlayButton";

interface BlackCardProps {
  card: BlackCard;
  className?: string;
}

export const BlackKard: React.FC<BlackCardProps> = ({ card, className = "" }) => {
  return (
    <div
      className={`relative border border-black bg-black text-white shadow-md font-bold flex flex-col px-6 py-7 text-3xl leading-normal min-h-72 max-w-64 ${className}`}
      data-testid={`black-card-${card.id}`}
    >
      <p className="text-ellipsis overflow-hidden">{card.text}</p>
      <PlayButton text={card.text} />
      <div className="absolute bottom-1 right-1 text-2xl self-end pt-3 text-gray-600">K.</div>
    </div>
  );
};
