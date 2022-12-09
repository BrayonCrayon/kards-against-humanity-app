import React, { FC, useCallback, useMemo } from "react";
import { User } from "Types/User";
import useKickPlayer from "Hooks/Game/Actions/useKickPlayer";
import Swal from "sweetalert2";
import { useAuth } from "State/Auth/useAuth";
import { useGame } from "State/Game/useGame";

interface PlayerListItemProps {
  player: User;
}

const PlayerListItem: FC<PlayerListItemProps> = ({ player }) => {
  const {
    state: { game },
  } = useGame();

  const {
    state: { auth },
  } = useAuth();

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
    return auth.id === game.judgeId && auth.id !== player.id;
  }, [auth, game]);

  return (
    <>
      <div
        className="flex text-2xl items-center"
        data-testid={`user-${player.id}`}
        role={`user-${player.id}`}
      >
        <p className="mr-3 w-7 border-r border-black">{player.score}</p>
        <i className="fa-solid fa-user mr-1 text-base self-center"></i>
        <p
          className={`${player.hasSubmittedWhiteCards ? "text-green-500" : ""}`}
        >
          {player.name}
        </p>
      </div>
      <div>
        {game.judgeId === player.id && (
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
