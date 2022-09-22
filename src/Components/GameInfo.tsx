import React, { FC, useCallback } from "react";
import { happyToast } from "Utilities/toasts";
import { BlackKard } from "./BlackKard";
import { usePlayers } from "State/Players/usePlayers";
import PlayerNotificationBar from "./PlayerNotificationBar";
import JudgeMessage from "./JudgeMessage";
import { useAuth } from "State/Auth/useAuth";
import { useGame } from "State/Game/useGame";
import Settings from "Components/Sidebars/Settings";
import CopyIcon from "Components/Icons/CopyIcon";

const GameInfo: FC = () => {
  const {
    state: { game, blackCard },
  } = useGame();
  const {
    state: { players },
  } = usePlayers();
  const {
    state: { auth },
  } = useAuth();

  const copyGameCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(game.code);
      happyToast("Game code copied!", "top-start");
    } catch (error) {
      console.error(error);
    }
  }, [game]);

  return (
    <div>
      <div className="flex flex-wrap md:flex-row md:justify-between">
        <PlayerNotificationBar users={players} judgeId={game.judgeId} />
        <div className="border-2 w-3/5 border-gray-300 shadow-md p-2 m-2 rounded font-semibold md:w-auto">
          <div
            data-testid={`game-${game.id}`}
            onClick={() => copyGameCode()}
            className="cursor-pointer flex"
          >
            <span className="text-gray-700 px-1">Code:</span> {game.code}
            <CopyIcon />
          </div>

          <div data-testid={`game-${game.id}-name`}>
            <span className="text-gray-700 px-1">Name:</span>
            {game.name}
          </div>
        </div>
        <Settings className="flex-grow md:flex-grow-0 md:mr-5" gameId={game.id} players={players} />
      </div>
      <div className="mx-auto my-2 w-full px-2 md:w-1/2 lg:w-1/3">
        <BlackKard card={blackCard} />
      </div>
      <JudgeMessage user={auth} judgeId={game.judgeId} users={players} className="mt-6" />
    </div>
  );
};

export default GameInfo;
