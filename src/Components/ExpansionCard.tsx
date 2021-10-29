import React, { useCallback, useState } from "react";
import { Expansion } from "../Types/Expansion";

interface ExpansionCardProps extends Pick<Expansion, "id" | "name"> {
  checked: boolean;
  onToggle: (id: number, checked: boolean) => void;
}

const ExpansionCard: React.FC<ExpansionCardProps> = ({
  id,
  name,
  checked,
  onToggle,
}) => {
  const [isChecked, setIsChecked] = useState(true);

  const onChange = useCallback(() => {
    onToggle(id, checked);
    setIsChecked((checked) => !checked);
  }, [onToggle, setIsChecked, checked, id]);

  return (
    <div
      className={`bg-white py-2 mt-4 rounded border my-2 px-2 hover:font-bold hover:shadow-md cursor-pointer my-2 text-center border-gray-500 border-2 ${
        isChecked ? " bg-blue-100" : ""
      }`}
      data-testid={`expansion-${id}`}
      onClick={onChange}
    >
      <input
        className="mr-2"
        type="checkbox"
        data-testid={`checkbox-${id}`}
        checked={isChecked}
        readOnly={true}
        onChange={() => {}}
      />
      {name}
    </div>
  );
};

export default ExpansionCard;
