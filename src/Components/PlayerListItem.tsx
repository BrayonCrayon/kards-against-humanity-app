import React, { FC, useCallback, useContext, useMemo } from "react";
import { User } from "../Types/User";
import { GameContext } from "../State/Game/GameContext";
import useKickPlayer from "../Hooks/Game/useKickPlayer";
import Swal from "sweetalert2";

interface PlayerListItemProps {
  player: User;
}

const PlayerListItem: FC<PlayerListItemProps> = ({ player }) => {
  const { judge, game, user } = useContext(GameContext);

  const kick = useKickPlayer();

  const kickPlayer = useCallback(
    async (player) => {
      const result = await Swal.fire({
        title: `Are you sure you want to kick ${player.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, kick!",
      });

      if (!result.isConfirmed) return;

      await kick(game.id, player.id);
    },
    [game, kick]
  );

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
            onClick={() => kickPlayer(player)}
            data-testid={`kick-player-${player.id}`}
            className="fas fa-minus cursor-pointer px-2 self-center text-lg justify-self-end hover:text-red-500"
          />
        )}
      </div>
    </>
  );
};

export default PlayerListItem;
