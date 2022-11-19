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
      className="bg-black text-white flex py-2 mt-2.5 px-2.5 cursor-pointer relative"
      data-testid={`expansion-${id}`}
      onClick={() => onToggle(id)}
    >
      <KAHCheckbox
        value={checked}
        className="bg-white text-black mr-2 h-8 w-8 min-w-8 absolute top-2.5"
      />
      <span className="inline-block mb-3 ml-10 align-text-top">{name}</span>
      <span
        role={`white-card-count-${id}`}
        className="font-normal absolute bottom-0.5 right-2.5 text-xs"
      >
        Cards: {whiteCardCount}
      </span>
    </div>
  );
};

export default ExpansionCard;
