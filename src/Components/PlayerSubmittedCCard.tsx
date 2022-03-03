import { FC, useMemo } from "react";
import { PlayerSubmittedCard } from "../Types/ResponseTypes";
import { BlackCard } from "../Types/BlackCard";

interface PlayerSubmittedCCardProps {
  playerSubmission: PlayerSubmittedCard;
  blackCard: BlackCard;
}

export const PlayerSubmittedCCard: FC<PlayerSubmittedCCardProps> = ({
  playerSubmission: { user_id, submitted_cards },
  blackCard,
}) => {
  const playerResponse = useMemo(() => {
    let blackCardText = blackCard.text;
    submitted_cards
      .sort((left, right) => left.order - right.order)
      .forEach((card) => {
        if (blackCardText.indexOf("_", 0) < 0) return;

        blackCardText = blackCardText.replace(
          "_",
          card.text.replace(/\.$/, "")
        );
      });

    return blackCardText;
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
