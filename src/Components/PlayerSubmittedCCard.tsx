import React, {FC, useMemo} from "react";
import {PlayerSubmittedCard} from "../Types/ResponseTypes";
import {BlackCard} from "../Types/BlackCard";
import {fillOutBlackCard} from "../Utilities/helpers";
import parser from "html-react-parser";

interface PlayerSubmittedCCardProps {
  className?: string;
  playerSubmission: PlayerSubmittedCard;
  blackCard: BlackCard;
}

export const PlayerSubmittedCCard: FC<PlayerSubmittedCCardProps> = ({
  playerSubmission: { user_id, submitted_cards },
  blackCard,
  className = "",
}) => {
  const playerResponse = useMemo(() => {
    return fillOutBlackCard(blackCard, submitted_cards);
  }, [blackCard, submitted_cards]);

  return (
    <div
      className={`relative border border-black bg-black text-white shadow-md flex flex-col px-6 py-7 text-3xl leading-normal min-h-72 max-w-64 ${className}`}
      data-testid={`player-submitted-response-${user_id}`}
    >
      <span>{parser(playerResponse)}</span>
      <div className="absolute bottom-1 right-1 font-bold text-2xl self-end pt-3 text-gray-600">K.</div>
    </div>
  );
};
