import React from "react";

interface SelectableProps {
  isSelected: boolean;
  onClick: () => void;
}

export const Selectable: React.FC<SelectableProps> = ({
  isSelected,
  onClick,
  children,
}) => {
  return (
    <div
      className={`cursor-pointer ${isSelected ? "opacity-75" : ""} `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
