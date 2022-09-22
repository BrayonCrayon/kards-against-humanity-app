import React, { FC } from "react";
import { User } from "Types/User";
import PlayerListItem from "./PlayerListItem";

interface PlayerListProps {
  users?: User[];
}

const PlayerList: FC<PlayerListProps> = ({ users = [] }) => {
  return (
    <div className="p-2">
      <div className="text-sm font-semibold text-gray-500 border-b-2 border-gray-300 pb-1 md:text-md">
        Players
      </div>
      {users.map((player) => (
        <div
          className="font-semibold flex py-1 pl-2 border-dashed border-b flex justify-between"
          key={player.id}
        >
          <PlayerListItem player={player} />
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
