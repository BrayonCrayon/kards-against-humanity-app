import React, { FC, useEffect, useState } from "react";
import ToggleSidebar from "@/Components/ToggleSidebar";
import { User } from "@/Types/User";
import TabView, { Tab } from "./Settings/TabView";
import GameSettingsTab from "./Settings/GameSettingsTab";
import PlayerList from "@/Components/PlayerList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

interface SettingsProps {
  players: User[];
  className?: string;
}

const Settings: FC<SettingsProps> = ({
     players,
     className = "",
}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    setTabs([
      { key: "players", element: <PlayerList users={players} /> },
      { key: "settings", element: <GameSettingsTab />, className: "h-full"}
    ]);
  }, [players]);

  return (
    <>
      <ToggleSidebar
        className={`flex justify-end items-center mr-3 ${className}`}
        dataTestId="game-settings"
        toggleElement={
          <div className="flex flex-col hover:text-gray-700">
            <FontAwesomeIcon aria-roledescription="Game settings" icon={faGear} size="2xl" className="cursor-pointer self-center" />
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
};

export default Settings;
