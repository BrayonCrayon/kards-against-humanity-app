import React, {useEffect, useState} from "react";
import ToggleSidebar from "Components/ToggleSidebar";
import {ExpansionOption} from "Types/Expansion";
import {Button, ButtonVariant} from "Components/Atoms/Button";
import {ExpansionsTab} from "./Settings/ExpansionsTab";
import TabView, {Tab} from "./Settings/TabView";
import GameSettingsTab, {Options} from "Components/Sidebars/Settings/GameSettingsTab";

interface IGameOptions {
  expansions: ExpansionOption[];
  onToggle: (id: number) => void;
  toggleAll: (toggledState: boolean) => void;
  onSettingsChange: (options: Options) => void;
  className?: string;
  timer: number | null;
  hasAnimations: boolean;
}

export const GameOptions: React.FC<IGameOptions> = ({
  expansions,
  onToggle,
  toggleAll,
  onSettingsChange,
  className = "",
  timer = null,
    hasAnimations = false,
}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    setTabs([
      {
        key: "Expansions",
        element: <ExpansionsTab toggleAll={toggleAll} onToggle={onToggle} expansions={expansions}></ExpansionsTab>,
        className: "h-screen",
      },
      {
        key: "Settings",
        element: <GameSettingsTab onUpdatedSettings={onSettingsChange} options={{timer, hasAnimations}}  />,
      },
    ]);
  }, [expansions, timer, hasAnimations]);

  return (
    <ToggleSidebar
      className={className}
      toggleElement={
        <Button
          className="w-full"
          variant={ButtonVariant["dark-outline"]}
          role="settings-menu-button"
          text="Settings"
        />
      }
    >
      <div className="w-full pt-8 h-full flex flex-col">
        <TabView tabs={tabs} />
      </div>
    </ToggleSidebar>
  );
};
