import React, { FC, useCallback, useContext } from "react";
import { happyToast } from "../Utilities/toasts";
import { BlackKard } from "./BlackKard";
import { GameContext } from "../State/Game/GameContext";

const GameInfo: FC = () => {
  const { game, user, users, blackCard, judge } = useContext(GameContext);

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
      <div className="flex justify-between items-start">
        <div className="border-2 border-gray-300 shadow-md p-2 m-2 rounded font-semibold ">
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

        <div className="border-2 border-gray-300 shadow-md p-2 m-2 rounded font-semibold">
          <span className="text-gray-700">You:</span> {user.name}
        </div>
        <div className="border-2 border-gray-300 shadow-md p-2 m-2 rounded flex-col">
          <h1 className="text-gray-700 text-xl border-b-2 border-gray-500">
            Users
          </h1>
          {users.map((user) => (
            <div className="py-2 font-semibold flex" key={user.id}>
              {judge.id === user.id && (
                <div data-testid={`user-${user.id}-judge`} className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
              )}
              <p
                data-testid={`user-${user.id}`}
                className={` ${
                  user.hasSubmittedWhiteCards ? "text-green-500" : ""
                }`}
              >
                {user.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto my-2 w-1/3">
        <BlackKard card={blackCard} />
      </div>
    </div>
  );
};

export default GameInfo;
