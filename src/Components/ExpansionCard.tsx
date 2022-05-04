import React, { useCallback } from "react";
import { Expansion } from "Types/Expansion";

interface ExpansionCardProps extends Pick<Expansion, "id" | "name"> {
  checked: boolean;
  onToggle: (id: number, checked: boolean) => void;
}

export const SELECTED_CARD_BACKGROUND = "bg-blue-100";

const ExpansionCard: React.FC<ExpansionCardProps> = ({
  id,
  name,
  checked,
  onToggle,
}) => {
  const onChange = useCallback(() => {
    onToggle(id, checked);
  }, [onToggle, checked, id]);

  return (
    <div
      className={`bg-white py-2 mt-4 rounded border my-2 px-2 hover:font-bold hover:shadow-md cursor-pointer my-2 text-center border-gray-500 border-2 ${
        checked ? ` ${SELECTED_CARD_BACKGROUND}` : ""
      }`}
      data-testid={`expansion-${id}`}
      onClick={onChange}
    >
      <input
        className="mr-2"
        type="checkbox"
        data-testid={`checkbox-${id}`}
        checked={checked}
        readOnly={true}
        onChange={() => {}}
      />
      {name}
    </div>
  );
};

export default ExpansionCard;
