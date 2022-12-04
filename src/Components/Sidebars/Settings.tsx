import React, { FC, useCallback, useState } from "react";
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
  const [tabs] = useState<Array<string>>(['game', 'players']);
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);

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
             className="fa-solid fa-gear text-4xl cursor-pointer self-center"
           />
         </div>
        }
      >
        <div className="flex flex-col h-full w-full relative">
          <h1 className="w-full text-center self-center font-bold text-lg py-2">Settings</h1>
          <nav className="flex pb-1.5 mx-2 mb-4 border-b-2 w-full relative h-8">
            <div className="absolute top-0 flex gap-4">
              {
                tabs.map(tab => (
                  <p
                    role={`${tab}-tab`}
                    key={tab}
                    className={
                      `capitalize cursor-pointer ${tab === selectedTab ? 'border-b-4 border-black pb-1' : ''}`
                    }
                    onClick={() => setSelectedTab(tab)}
                  >{ tab }</p>
                ))
              }
            </div>
          </nav>
          {
            selectedTab === 'players'
              ? <PlayerList users={players} />
              : null
          }
          {
            selectedTab === 'game'
              ? <button
                  className="bg-black w-full py-3 px-4 text-white font-bold shadow hover:bg-gray-800 "
                  onClick={() => leave()}
                  role="leave-game-button"
              >
                <i className="fa-solid fa-door-open pr-2"></i>
                  Leave Game
                  {
                    loading
                      ? <i className="ml-2 fa-solid fa-spinner animate-spin"/>
                      : null
                  }
                </button>
              : null
          }
        </div>
      </ToggleSidebar>
    </>
  );
}

export default Settings;