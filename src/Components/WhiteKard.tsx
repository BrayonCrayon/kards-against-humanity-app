import React, { useMemo } from "react";
import { WhiteCard } from "@/Types/WhiteCard";
import { useAuth } from "@/State/Auth/useAuth";
import PlayButton from "./Molecules/PlayButton";

interface WhiteKardProps {
  card: WhiteCard;
  onClick: (card: WhiteCard) => void;
  className?: string;
  hidePlayButton?: boolean;
}

export const WhiteKard: React.FC<WhiteKardProps> = ({
  card,
  onClick = () => {},
  className = "",
  hidePlayButton = false,
}) => {
  const {
    state: { hasSubmittedCards },
  } = useAuth();

  const baseStyles = `bg-white font-bold relative px-6 py-7 text-3xl flex flex-wrap cursor-pointer min-h-72 max-w-64 leading-normal hover:bg-gray-100 ${className} `;

  const nonSubmittedCards = useMemo(() => {
    return !card.selected && hasSubmittedCards;
  }, [card, hasSubmittedCards]);

  const cardStyles = useMemo(() => {
      const selectedStyles = card.selected ? "border-4 border-emerald-500" : "";
      const alreadySubmittedStyles = hasSubmittedCards ? "cursor-not-allowed" : "";
      const hideOtherCards = nonSubmittedCards ? "opacity-25" : "";

    return `${baseStyles} ${selectedStyles} ${alreadySubmittedStyles} ${hideOtherCards}`;
  }, [card.selected, nonSubmittedCards, hasSubmittedCards, baseStyles]);

  return (
    <div
      className={cardStyles}
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
      { !hidePlayButton && <PlayButton text={card.text} isDark /> }
      <div className="absolute text-2xl font-bold text-gray-200 bottom-1 right-1">K.</div>
    </div>
  );
};
