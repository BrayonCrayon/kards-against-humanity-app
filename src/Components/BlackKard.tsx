import React, { useMemo } from "react";
import { BlackCard } from "Types/BlackCard";
import PlayButton from "./Molecules/PlayButton";

export enum CardSize {
  SMALL,
  MEDIUM,
  LARGE
}

interface BlackCardProps {
  card: BlackCard;
  className?: string;
  size?: CardSize
}

export const BlackKard: React.FC<BlackCardProps> = (props) => {
  const {
    card,
    className = "",
    size = CardSize.SMALL
  } = props

  const sizeClasses = useMemo(() => {
    switch (size) {
      case CardSize.LARGE:
        return "w-1/2 h-3/4 text-base"
      default:
        return "min-h-72 max-w-64"
    }
  }, [size])

  return (
    <div
      className={`relative border border-black bg-black text-white shadow-md font-bold flex flex-col px-6 py-7 text-3xl leading-normal ${sizeClasses} ${className}`}
      data-testid={`black-card-${card.id}`}
    >
      <p className="text-ellipsis overflow-hidden">{card.text}</p>
      <PlayButton text={card.text} />
      <div className="absolute bottom-1 right-1 text-2xl self-end pt-3 text-gray-600">K.</div>
    </div>
  );
};
