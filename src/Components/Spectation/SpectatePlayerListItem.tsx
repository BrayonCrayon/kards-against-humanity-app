import React, {FC, useMemo} from "react";
import {User} from "Types/User";

interface SpectatePlayerListItemProps {
  player: User,
  isJudge: boolean
}

const SpectatePlayerListItem: FC<SpectatePlayerListItemProps> = ({ player , isJudge}) => {

  const submittedStatus = useMemo(() => {
    return player.hasSubmittedWhiteCards ? "Submitted Card" : "";
  }, [player]);

  return <div className="w-full">
    <div data-testid={player.id} className="flex text-lg items-center">
      <p className="border-r-2 border-black pr-2 mr-2">{player.score}</p>
      <i className={`fas ${isJudge ? "fa-gavel" : "fa-user"} text-xl mr-2`} />
      <span className="mr-1">{player.name}</span>
      { player.hasSubmittedWhiteCards
          ? <p className="">- { submittedStatus }</p>
          : null
      }
    </div>
  </div>
}

export default SpectatePlayerListItem;