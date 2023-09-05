import React, { FC, useMemo } from "react";
import { User } from "Types/User";

interface SpectatePlayerListItemProps {
  player: User,
  isJudge: boolean
}

const SpectatePlayerListItem: FC<SpectatePlayerListItemProps> = ({ player , isJudge}) => {

  const submittedStatus = useMemo(() => {
    return player.hasSubmittedWhiteCards ? "Submitted" : "Not Submitted";
  }, [player]);

  return <div className="flex text-2xl m-5 align-center border-2 border-gray-300 shadow-md rounded-md">
    <div data-testid={player.id} className="p-2">
      <span className="w-full">{player.name}</span>
      <i className={`fas ${isJudge ? "fa-gavel" : "fa-user"} text-2xl mx-2`} />
      <p className="text-sm text-gray-600 ml-1 mt-1">Status: <span className="text-gray-800 font-semibold">{ submittedStatus }</span></p>
    </div>
  </div>
}

export default SpectatePlayerListItem;