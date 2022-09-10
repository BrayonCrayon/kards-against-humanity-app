import React from "react";
import { Expansion } from "Types/Expansion";
import { KAHCheckbox } from "Components/KAHCheckbox";

interface ExpansionCardProps extends Pick<Expansion, "id" | "name" | "whiteCardCount"> {
  checked: boolean;
  onToggle: (id: number) => void;
}

const ExpansionCard: React.FC<ExpansionCardProps> = ({
   id,
   name,
   whiteCardCount,
   checked,
   onToggle
 }) => {

  return (
    <div
      className="items-center bg-black text-white flex py-2 mt-2.5 px-2 cursor-pointer relative hover:font-bold hover:shadow-md"
      data-testid={`expansion-${id}`}
      onClick={() => onToggle(id)}
    >
      <KAHCheckbox
        value={checked}
        className="bg-white text-black mr-2 h-8 w-8 min-w-8"
      />
      <span className="flex flex-wrap mb-2">{name}</span>
      <span
        role={`white-card-count-${id}`}
        className="font-normal absolute bottom-0 right-1 text-xs"
      >
        Cards: {whiteCardCount}
      </span>
    </div>
  );
};

export default ExpansionCard;
