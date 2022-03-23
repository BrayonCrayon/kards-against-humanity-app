import React, { FC, useCallback, useContext } from "react";
import { happyToast } from "../Utilities/toasts";
import { BlackKard } from "./BlackKard";
import { GameContext } from "../State/Game/GameContext";
import { useUsers } from "../State/Users/UsersContext";
import ToggleSidebar from "./ToggleSidebar";
import { Button } from "./Button";
import PlayerList from "./PlayerList";

const GameInfo: FC = () => {
  const { game, user, blackCard, judge } = useContext(GameContext);
  const {
    state: { users },
  } = useUsers();

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
      <div className="flex flex-wrap justify-between md:items-start md:flex-row">
        <div className="border-2 w-3/5 border-gray-300 shadow-md p-2 m-2 rounded font-semibold md:w-auto">
          <div
            data-testid={`game-${game.id}`}
            onClick={() => copyGameCode()}
            className="cursor-pointer flex"
          >
            <span className="text-gray-700 px-1">Code:</span> {game.code}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>

          <div data-testid={`game-${game.id}-name`}>
            <span className="text-gray-700 px-1">Name:</span>
            {game.name}
          </div>
        </div>
        <ToggleSidebar
          className="w-auto mr-2"
          toggleElement={<Button text="Players" />}
        >
          <PlayerList users={users} />
        </ToggleSidebar>
      </div>
      <div className="mx-auto my-2 w-full px-2 md:w-1/2 lg:w-1/3">
        <BlackKard card={blackCard} />
      </div>
    </div>
  );
};

export default GameInfo;
