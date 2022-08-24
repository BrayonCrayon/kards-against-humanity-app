import React from "react";
import { Expansion } from "Types/Expansion";
import { KAHCheckbox } from "Components/KAHCheckbox";

interface ExpansionCardProps extends Pick<Expansion, "id" | "name"> {
  checked: boolean;
  onToggle: (id: number) => void;
}

const ExpansionCard: React.FC<ExpansionCardProps> = ({
  id,
  name,
  checked,
  onToggle,
}) => {

  return (
    <div
      className="bg-black text-white flex py-2 mt-2.5 px-2 cursor-pointer hover:font-bold hover:shadow-md"
      data-testid={`expansion-${id}`}
      onClick={() => onToggle(id)}
    >
      <KAHCheckbox
        value={checked}
        className="bg-white text-black mr-2 h-8 w-8"
      />
      <span className="flex flex-wrap">{name}</span>
    </div>
  );
};

export default ExpansionCard;
