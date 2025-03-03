import React, { FC, useCallback, useMemo } from "react";
import { User } from "@/Types/User";
import useKickPlayer from "@/Hooks/Game/Actions/useKickPlayer";
import Swal from "sweetalert2";
import { useAuth } from "@/State/Auth/useAuth";
import { useGame } from "@/State/Game/useGame";
import KickPlayerIcon from "./Icons/KickPlayerIcon";

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

  const kickPlayer = useCallback(async (player: User) => {
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

  const playerIcon = useMemo(() => {
      return game.judgeId === player.id ? "fas fa-gavel" : "fa-solid fa-user";
  }, [game, player]);

  const canKickPeople = useMemo(() => {
    return auth.id === game.judgeId && auth.id !== player.id;
  }, [auth, game]);

  return (
    <>
      <div
        className="flex text-2xl items-center font-normal"
        data-testid={`user-${player.id}`}
        role={`user-${player.id}`}
      >
        <p className="w-10 border-r border-black text-right pr-2">{player.score}</p>
          <span className="w-8 mx-2 flex justify-center">
            <i className={`${playerIcon} text-xl`}></i>
          </span>
        <p className={`${player.hasSubmittedWhiteCards ? "text-emerald-500" : ""}`}>
          {player.name}
        </p>
      </div>
      <div>
          {canKickPeople && (
              <div onClick={() => kickPlayer(player)} data-testid={`kick-player-${player.id}`}>
                  <KickPlayerIcon className="w-8 cursor-pointer mx-2" />
              </div>
          )}
      </div>
    </>
  );
};

export default PlayerListItem;
