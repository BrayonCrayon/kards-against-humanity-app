import React, { FC, useContext, useMemo } from "react";
import { User } from "../Types/User";
import { GameContext } from "../State/Game/GameContext";
import useKickPlayer from "../Hooks/Game/useKickPlayer";

interface PlayerListItemProps {
  player: User;
}

const PlayerListItem: FC<PlayerListItemProps> = ({ player }) => {
  const { judge, game, user } = useContext(GameContext);

  const kickPlayer = useKickPlayer();

  const canKickPeople = useMemo(() => {
    return user.id === judge.id && user.id !== player.id;
  }, [user, judge]);

  return (
    <>
      <p
        data-testid={`user-${player.id}`}
        className={`text-lg ${
          player.hasSubmittedWhiteCards ? "text-green-500" : ""
        }`}
      >
        {player.name}
      </p>
      <div>
        {judge.id === player.id && (
          <div data-testid={`user-${player.id}-judge`} className="mr-2">
            <i className="fas fa-gavel text-lg" />
          </div>
        )}
        {canKickPeople && (
          <i
            onClick={() => kickPlayer(game.id, player.id)}
            data-testid={`kick-player-${player.id}`}
            className="fas fa-minus cursor-pointer px-2 self-center text-lg justify-self-end hover:text-red-500"
          />
        )}
      </div>
    </>
  );
};

export default PlayerListItem;
