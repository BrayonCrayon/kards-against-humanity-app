import { FC, useMemo } from "react";
import { PlayerSubmittedCard } from "../Types/ResponseTypes";
import { BlackCard } from "../Types/BlackCard";
import { fillOutBlackCard } from "../Utilities/helpers";
import parser from "html-react-parser";

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
      role={'playerSubmittedCard'}
      className={`bg-black text-white shadow-md px-4 py-2 min-h-72 max-w-64 `}
      data-testid={`player-submitted-response-${user_id}`}
    >
      <div
        className="text-xl md:text-3xl font-weight-800"
        data-testid={`player-card-response-${user_id}`}
      >
        <p>{parser(playerResponse)}</p>
      </div>
    </div>
  );
};
