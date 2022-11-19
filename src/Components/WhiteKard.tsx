import React, { useMemo } from "react";
import { WhiteCard } from "Types/WhiteCard";
import { useAuth } from "State/Auth/useAuth";

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
      className={`bg-white relative rounded shadow-md p-8 text-xl font-weight-800 flex flex-wrap cursor-pointer hover:bg-gray-100 md:text-3xl 
        ${className} 
        ${
          card.selected
            ? "border-2 border-blue-400 bg-gray-100"
            : "border border-black"
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
          className="absolute text-sm top-1 right-2 font-bold"
        >
          {card.order}
        </div>
      )}
      <span>{card.text}</span>
      <div className="absolute text-xs bottom-1 right-1 ">
        Kards Against Humanity
      </div>
    </div>
  );
};
