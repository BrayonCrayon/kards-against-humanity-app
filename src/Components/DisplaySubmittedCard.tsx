import React from "react";
import { PlayerSubmittedCard } from "@/Types/ResponseTypes";
import { PlayerSubmittedCCard } from "@/Components/PlayerSubmittedCCard";
import { useGame } from "@/State/Game/useGame";

interface DisplaySubmittedCardProps {
  cards: Array<PlayerSubmittedCard>
}

const DisplaySubmittedCard: React.FC<DisplaySubmittedCardProps> = ({ cards }) => {
  const {
    state: { blackCard },
  } = useGame();

  return(
    <div className="flex flex-col gap-y-2 m-2">
      {
          cards.map((c, index) => (
            <PlayerSubmittedCCard key={index} playerSubmission={c} blackCard={blackCard} />
          ))
      }
    </div>
  )
}

export default DisplaySubmittedCard