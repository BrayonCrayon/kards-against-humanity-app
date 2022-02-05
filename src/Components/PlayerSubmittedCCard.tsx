import { FC, useCallback, useContext, useMemo } from "react";
import { PlayerSubmittedCard } from "../Types/ResponseTypes";
import { GameContext } from "../State/Game/GameContext";
import { useVote } from "../State/Vote/VoteContext";
import { SELECT_WINNER } from "../State/Vote/VoteActions";

interface PlayerSubmittedCCardProps {
  playerSubmission: PlayerSubmittedCard;
}

export const PlayerSubmittedCCard: FC<PlayerSubmittedCCardProps> = ({
  playerSubmission: { user_id, submitted_cards },
}) => {
  const { blackCard } = useContext(GameContext);
  const {
    state: { selectedPlayerId },
    dispatch,
  } = useVote();

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

  const selectCard = useCallback(() => {
    dispatch({ type: SELECT_WINNER, payload: { userId: user_id } });
  }, [user_id, dispatch]);

  return (
    <div
      className={`bg-black text-white rounded shadow-md p-8 cursor-pointer 
          ${user_id === selectedPlayerId ? "opacity-75" : ""}
      `}
      data-testid={`player-submitted-response-${user_id}`}
      onClick={selectCard}
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
