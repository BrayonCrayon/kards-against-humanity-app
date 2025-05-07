import React, { FC, useCallback, useMemo, useState } from "react";
import { User } from "@/Types/User";
import useKickPlayer from "@/Hooks/Game/Actions/useKickPlayer";
import { useAuth } from "@/State/Auth/useAuth";
import { useGame } from "@/State/Game/useGame";
import KickPlayerIcon from "./Icons/KickPlayerIcon";
import { faGavel, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import KickPlayerModal from "@/Components/Molecules/KickPlayerModal";

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
  const [showKickModal, setShowKickModal] = useState(false);

  const onPlayerKick = useCallback(
    async (playerId: number) => {
      setShowKickModal(false);
      await kick(game.id, playerId);
    },
    [game],
  );

  const playerIcon = useMemo(() => {
    return game.judgeId === player.id ? faGavel : faUser;
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
          <FontAwesomeIcon icon={playerIcon} size="sm" />
        </span>
        <p className={`${player.hasSubmittedWhiteCards ? "text-emerald-500" : ""}`}>{player.name}</p>
      </div>
      <div>
        {canKickPeople && (
          <div onClick={() => setShowKickModal(true)} data-testid={`kick-player-${player.id}`}>
            <KickPlayerIcon className="w-8 cursor-pointer mx-2" />
            <KickPlayerModal
              show={showKickModal}
              playerName={player.name}
              onYesCallback={() => onPlayerKick(player.id)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PlayerListItem;
