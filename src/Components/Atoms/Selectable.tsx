import React from "react";

interface SelectableProps {
  isSelected: boolean;
  onClick: () => void;
  dataTestid: string;
  role?: string;
  selectedClass?: string;
}

export const Selectable: React.FC<SelectableProps> = ({
  isSelected,
  onClick,
  dataTestid,
  children,
  role = "",
  selectedClass= ""
}) => {
  return (
    <div
      className={`cursor-pointer ${isSelected ? selectedClass : ""} `}
      data-testid={dataTestid}
      role={role}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
