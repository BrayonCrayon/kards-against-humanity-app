import React, {useMemo} from "react";
import {WhiteCard} from "Types/WhiteCard";
import {useAuth} from "State/Auth/useAuth";

interface WhiteKardProps {
  card: WhiteCard;
  onClick: (card: WhiteCard) => void;
  className?: string;
}

export const WhiteKard: React.FC<WhiteKardProps> = ({
  card,
  onClick = () => {},
  className = "",
}) => {
  const {
    state: { hasSubmittedCards },
  } = useAuth();

  const nonSubmittedCards = useMemo(() => {
    return !card.selected && hasSubmittedCards;
  }, [card, hasSubmittedCards]);

  return (
    <div
      className={`bg-white font-bold relative px-6 py-7 text-3xl flex flex-wrap cursor-pointer min-h-72 max-w-64 leading-normal hover:bg-gray-100
        ${className} 
        ${
          card.selected
            ? "border-5 border-emerald-500"
            : ""
        } 
        ${hasSubmittedCards ? "cursor-not-allowed" : ""} 
        ${nonSubmittedCards ? "opacity-25" : ""}
      `}
      onClick={(e) => {
        onClick(card);
      }}
      role={`white-card-${card.id}`}
      data-testid={`white-card-${card.id}`}
    >
      {card.order > 0 && (
        <div
          data-testid={`white-card-${card.id}-order`}
          className="absolute text-sm top-0 left-1 font-bold"
        >
          {card.order}
        </div>
      )}
      <span>{card.text}</span>
      <div className="absolute text-2xl font-bold text-gray-200 bottom-1 right-1">K.</div>
    </div>
  );
};
