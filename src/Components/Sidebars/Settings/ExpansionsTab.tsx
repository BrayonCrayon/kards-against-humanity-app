import { FC, useCallback, useState } from "react";
import { ExpansionOption } from "@/Types/Expansion";
import { KAHToggler } from "../../KAHToggler";
import ExpansionCard from "../../ExpansionCard";

interface ExpansionsTabProps {
  expansions: ExpansionOption[];
  onToggle: (id: number) => void;
  toggleAll: (toggledState: boolean) => void;
}

export const ExpansionsTab: FC<ExpansionsTabProps> = ({ expansions, onToggle, toggleAll }) => {
  const [selectAll, setSelectAll] = useState(true);

  const onChange = useCallback(() => {
    setSelectAll(!selectAll);
    toggleAll(!selectAll);
  }, [selectAll, setSelectAll]);

  return (
    <>
      <div className="flex h-5% px-5 py-2 shadow-md items-center justify-end">
        <KAHToggler
          role="toggle-all-expansions"
          on={selectAll}
          onText="Select All"
          offText="Select All"
          onClick={onChange}
        />
      </div>
      <div className="h-5/6 overflow-y-scroll px-2 rounded-sm">
        {expansions.map(({ expansion, isSelected }) => {
          return (
            <ExpansionCard
              key={`expansion-${expansion.id}`}
              id={expansion.id}
              cardCount={expansion.cardCount}
              name={expansion.name}
              checked={isSelected}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </>
  );
};
