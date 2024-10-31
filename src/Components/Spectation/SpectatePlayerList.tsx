import React, {FC} from "react";
import {User} from "Types/User";
import SpectatePlayerListItem from "Components/Spectation/SpectatePlayerListItem";

interface SpectatePlayerListProps {
  players: User[];
  judgeId: number;
}

const SpectatePlayerList: FC<SpectatePlayerListProps> = ({ players, judgeId }) => {

  return <div className="w-1/4 bg-white p-6 shadow-md">
    <div className="grid grid-cols-6">
      <p className="text-md border-b-2 border-lukewarmGray-300 pb-2 mb-4 col-span-2">Score | Player</p>
      <p className="text-md border-b-2 border-lukewarmGray-300 pb-2 mb-4 col-span-4 text-right">Card Submitted</p>
    </div>
    <div className="grid grid-cols-1">
      {
        players.map((player) => (
            <SpectatePlayerListItem
                key={player.id}
                player={player}
                isJudge={player.id === judgeId}
            />
        ))
      }
    </div>
  </div>;
};

export default SpectatePlayerList;