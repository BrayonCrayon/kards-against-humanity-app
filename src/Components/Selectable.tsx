import React from "react";

interface SelectableProps {
  isSelected: boolean;
  onClick: () => void;
  dataTestid: string;
  role?: string;
}

export const Selectable: React.FC<SelectableProps> = ({
  isSelected,
  onClick,
  dataTestid,
  children,
  role = "",
}) => {
  return (
    <div
      className={`cursor-pointer ${isSelected ? "border-2 border-black p-0.5 rounded" : ""} `}
      data-testid={dataTestid}
      role={role}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
