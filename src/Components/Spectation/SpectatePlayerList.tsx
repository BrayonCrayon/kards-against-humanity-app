import React, { FC } from "react";
import { User } from "Types/User";
import SpectatePlayerListItem from "Components/Spectation/SpectatePlayerListItem";

interface SpectatePlayerListProps {
  players: User[];
  judgeId: number;
}

const SpectatePlayerList: FC<SpectatePlayerListProps> = ({ players, judgeId }) => {

  return <div className="grid grid-cols-3 lg:grid-cols-4">
    {
      players.map((player) => (
        <SpectatePlayerListItem
          key={player.id}
          player={player}
          isJudge={player.id === judgeId}
        />
      ))
    }
  </div>;
};

export default SpectatePlayerList;