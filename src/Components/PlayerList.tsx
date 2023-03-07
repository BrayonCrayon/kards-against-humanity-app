import React, { FC } from "react";
import { User } from "Types/User";
import PlayerListItem from "./PlayerListItem";

interface PlayerListProps {
  users?: User[];
}

const PlayerList: FC<PlayerListProps> = ({ users = [] }) => {
  return (
    <div>
      {users.map((player) => (
        <div className="font-semibold flex py-4 pl-2 flex justify-between" key={player.id}>
          <PlayerListItem player={player} />
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
