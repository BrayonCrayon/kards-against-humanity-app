import React, { FC } from "react";
import { User } from "@/Types/User";
import CardSubmittedIcon from "@/Components/Icons/CardSubmittedIcon";
import { displayScore } from "../../Utilities/helpers";

interface SpectatePlayerListItemProps {
  player: User,
  isJudge: boolean
}

const SpectatePlayerListItem: FC<SpectatePlayerListItemProps> = ({ player , isJudge}) => {

  return <div className="w-full flex justify-between items-center border-b border-lukewarmGray-500 mb-2 pb-2">
    <div data-testid={player.id} className="flex text-lg items-center">
      <p className="border-r border-black pr-2 mr-2">{displayScore(player.score)}</p>
      <i className={`fas ${isJudge ? "fa-gavel" : "fa-user"} text-xl mr-2`} />
      <span className="mr-1 text-lightBlack">{player.name}</span>
    </div>
    {
      !isJudge &&
      <CardSubmittedIcon
          dataTestId={`card-submitted-icon-${player.id}`}
          className={!player.hasSubmittedWhiteCards ? "opacity-25" : ""}
      />
    }
  </div>
}

export default SpectatePlayerListItem;