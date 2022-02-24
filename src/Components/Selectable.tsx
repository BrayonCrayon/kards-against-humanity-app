import React from "react";

interface SelectableProps {
  isSelected: boolean;
  onClick: () => void;
  dataTestid: string;
}

export const Selectable: React.FC<SelectableProps> = ({
  isSelected,
  onClick,
  dataTestid,
  children,
}) => {
  return (
    <div
      className={`cursor-pointer ${isSelected ? "opacity-75" : ""} `}
      data-testid={dataTestid}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
