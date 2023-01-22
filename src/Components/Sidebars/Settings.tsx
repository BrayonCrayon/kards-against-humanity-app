import React, { FC, useEffect, useState } from "react";
import ToggleSidebar from "Components/ToggleSidebar";
import PlayerList from "Components/PlayerList";
import { User } from "Types/User";
import TabView, { Tab } from "./Settings/TabView";
import GameTab from "Components/Sidebars/Settings/GameTab";

interface SettingsProps {
  gameId: string;
  players: User[];
  className?: string;
}

const Settings: FC<SettingsProps> = ({ gameId, players, className = ""}) => {

  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    setTabs([
      { key: 'players-tab', element: <PlayerList users={players}/> },
      { key: 'game-tab', element: <GameTab gameId={gameId} /> }
    ]);
  }, [gameId, players]);

  return (
    <>
      <ToggleSidebar
          className={`flex justify-center items-center ${className}`}
          toggleElement={
            <div className="flex flex-col hover:text-gray-700">
              <i
                  data-testid="game-settings"
                  aria-roledescription="Game settings"
                  className="fa-solid fa-gear text-4xl cursor-pointer self-center"
              />
            </div>
          }
      >
        <div className="flex flex-col h-full w-full relative">
          <h1 className="w-full text-center self-center font-bold text-lg py-2">Settings</h1>
          <TabView tabs={tabs} />
        </div>
      </ToggleSidebar>
    </>
  );
}

export default Settings;