import React, {FC} from "react";
import {User} from "Types/User";
import SpectatePlayerListItem from "Components/Spectation/SpectatePlayerListItem";

interface SpectatePlayerListProps {
  players: User[];
  judgeId: number;
}

const SpectatePlayerList: FC<SpectatePlayerListProps> = ({ players, judgeId }) => {

  return <div className="w-1/4 bg-white p-2 shadow-md">
    <p className="text-xl border-b-2 border-lukewarmGray-300 pb-2 mb-4">Players</p>
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