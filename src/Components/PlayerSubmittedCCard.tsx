import { FC, useMemo } from "react";
import { PlayerSubmittedCard } from "../Types/ResponseTypes";
import { BlackCard } from "../Types/BlackCard";
import { fillOutBlackCard } from "../Utilities/helpers";

interface PlayerSubmittedCCardProps {
  playerSubmission: PlayerSubmittedCard;
  blackCard: BlackCard;
}

export const PlayerSubmittedCCard: FC<PlayerSubmittedCCardProps> = ({
  playerSubmission: { user_id, submitted_cards },
  blackCard,
}) => {
  const playerResponse = useMemo(() => {
    return fillOutBlackCard(blackCard, submitted_cards);
  }, [blackCard, submitted_cards]);

  return (
    <div
      className={`bg-black text-white rounded shadow-md p-8`}
      data-testid={`player-submitted-response-${user_id}`}
    >
      <div
        className="text-xl md:text-3xl font-weight-800"
        data-testid={`player-card-response-${user_id}`}
      >
        <span>{playerResponse}</span>
      </div>
    </div>
  );
};
