import React, { FC, useCallback } from "react";
import ToggleSidebar from "Components/ToggleSidebar";
import useLeaveGame from "Hooks/Game/Actions/useLeaveGame";
import PlayerList from "Components/PlayerList";
import { User } from "Types/User";
import useLoading from "Hooks/Game/Shared/useLoading";

interface SettingsProps {
  gameId: string;
  players: User[];
  className?: string;
}

const Settings: FC<SettingsProps> = ({ gameId, players, className = ""}) => {

  const leaveGame = useLeaveGame();
  const {loading, setLoading} = useLoading();

  const leave = useCallback(async () => {
    setLoading(true);
    await leaveGame(gameId);
  }, [gameId])

  return (
    <>
      <ToggleSidebar
        className={`flex justify-center items-center ${className}`}
        toggleElement={
         <div className="flex flex-col hover:text-gray-700">
           <i
             role="game-settings"
             className="fa-solid fa-gear text-5xl cursor-pointer self-center"
           />
           <h5 className="font-bold">Settings</h5>
         </div>
        }
      >
        <div className="flex flex-col h-full w-full relative">
          <h1 className="w-full text-center self-center font-bold text-lg py-2 border-b">Settings</h1>
          <PlayerList users={players} />
          <button
            className="absolute bottom-0 bg-black w-full py-3 px-4 text-white font-bold shadow hover:bg-gray-800 "
            onClick={() => leave()}
            role='leave-game-button'>
            Leave Game
            {
              loading
                ? <i className="ml-2 fa-solid fa-spinner animate-spin"/>
                : null
            }
          </button>
        </div>
      </ToggleSidebar>
    </>
  );
}

export default Settings;