import React, { useCallback, useState } from "react";
import ToggleSidebar from "Components/ToggleSidebar";
import ExpansionCard from "Components/ExpansionCard";
import { ExpansionOption } from "Types/Expansion";
import { Button, ButtonVariant } from "Components/Button";
import { KAHToggler } from "Components/KAHToggler";

type ExpansionSelectorProps = {
  expansions: ExpansionOption[];
  onToggle: (id: number) => void;
  toggleAll: (toggledState: boolean) => void;
  className?: string;
}

export const ExpansionSelector: React.FC<ExpansionSelectorProps> = ({ expansions, onToggle, toggleAll, className = "" }) =>
{
  const [selectAll, setSelectAll] = useState(true);

  const onChange = useCallback(() => {
    setSelectAll(!selectAll);
    toggleAll(!selectAll);
  }, [selectAll, setSelectAll]);

  return (
    <ToggleSidebar
      className={className}
      toggleElement={
        <Button
          className="w-full"
          variant={ButtonVariant["dark-outline"]}
          role="expansion-menu-button"
          text="+Select Expansions" />
      }
    >
      <>
        <div className="h-full">
          <div className="flex h-5% px-5 py-2 my-1 shadow-md items-center justify-end">
              <KAHToggler
                role="toggle-all-expansions"
                on={selectAll}
                onText='Select All'
                offText='Select All'
                onClick={onChange}
              />
            </div>
          <div className="overflow-y-scroll px-2 rounded h-95%" >
            {expansions.map(({ expansion, isSelected }) => {
              return (
                <ExpansionCard
                  key={`expansion-${expansion.id}`}
                  id={expansion.id}
                  whiteCardCount={expansion.whiteCardCount}
                  name={expansion.name}
                  checked={isSelected}
                  onToggle={onToggle}
                />
              );
            })}
          </div>
        </div>
      </>
    </ToggleSidebar>
  )
}