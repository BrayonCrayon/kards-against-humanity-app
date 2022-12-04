import React, { FC } from "react";
import { User } from "Types/User";
import PlayerListItem from "./PlayerListItem";

interface PlayerListProps {
  users?: User[];
}

const PlayerList: FC<PlayerListProps> = ({ users = [] }) => {
  return (
    <div className="p-2">
      {users.map((player) => (
        <div
          className="font-semibold flex py-2 pl-2 border-b flex justify-between"
          key={player.id}
        >
          <PlayerListItem player={player} />
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
