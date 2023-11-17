import React, {FC} from "react";
import {User} from "Types/User";
import PlayerListItem from "./PlayerListItem";

interface PlayerListProps {
  users?: User[];
}

const PlayerList: FC<PlayerListProps> = ({ users = [] }) => {
  return (
    <div>
      {users.map((player) => (
        <div data-testid="players" className="font-semibold flex py-4 pl-2 justify-between" key={player.id}>
          <PlayerListItem player={player} />
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
