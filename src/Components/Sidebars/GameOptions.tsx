import React, { useEffect, useState } from "react";
import ToggleSidebar from "Components/ToggleSidebar";
import { ExpansionOption } from "Types/Expansion";
import { Button, ButtonVariant } from "Components/Atoms/Button";
import { ExpansionsTab } from "./Settings/ExpansionsTab";
import TabView, { Tab } from "./Settings/TabView";
import { TimerTab } from "./Settings/TimerTab";

type GameOptions = {
  expansions: ExpansionOption[];
  onToggle: (id: number) => void;
  toggleAll: (toggledState: boolean) => void;
  className?: string;
};

export const GameOptions: React.FC<GameOptions> = ({ expansions, onToggle, toggleAll, className = "" }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    setTabs([
      {
        key: "Expansions",
        element: <ExpansionsTab toggleAll={toggleAll} onToggle={onToggle} expansions={expansions}></ExpansionsTab>,
      },
      {
        key: "Timer",
        element: <TimerTab onChange={() => {}} />,
      },
    ]);
  }, [expansions]);

  return (
    <ToggleSidebar
      className={className}
      toggleElement={
        <Button
          className="w-full"
          variant={ButtonVariant["dark-outline"]}
          role="expansion-menu-button"
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
