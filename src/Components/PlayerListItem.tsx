import React, { FC, useCallback, useMemo } from "react";
import { User } from "Types/User";
import { useGame } from "State/Game/GameContext";
import useKickPlayer from "Hooks/Game/useKickPlayer";
import Swal from "sweetalert2";
import { useUser } from "State/User/UserContext";

interface PlayerListItemProps {
  player: User;
}

const PlayerListItem: FC<PlayerListItemProps> = ({ player }) => {
  const {
    state: { judge, game },
  } = useGame();

  const {
    state: { user },
  } = useUser();

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
      <div className="flex text-2xl" data-testid={`user-${player.id}`}>
        <p className="mr-1 w-8">{player.score}</p>
        <p
          className={`${player.hasSubmittedWhiteCards ? "text-green-500" : ""}`}
        >
          - {player.name}
        </p>
        {user.id === player.id && (
          <i className="fas fa-user-check ml-4 text-gray-400" />
        )}
      </div>
      <div>
        {judge.id === player.id && (
          <div data-testid={`user-${player.id}-judge`} className="mr-2">
            <i className="fas fa-gavel text-2xl" />
          </div>
        )}
        {canKickPeople && (
          <i
            onClick={() => kickPlayer(player)}
            data-testid={`kick-player-${player.id}`}
            className="fas fa-user-slash cursor-pointer px-2 self-center text-2xl justify-self-end hover:text-red-700"
          />
        )}
      </div>
    </>
  );
};

export default PlayerListItem;
