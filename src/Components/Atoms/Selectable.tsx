import React, {PropsWithChildren} from "react";

interface SelectableProps extends PropsWithChildren {
  isSelected: boolean;
  onClick: () => void;
  dataTestid: string;
  role?: string;
  selectedClass?: string;
  className?: string;
}

export const Selectable: React.FC<SelectableProps> = ({
  isSelected,
  onClick,
  dataTestid,
  children,
  role = "",
  selectedClass = "",
  className = "",
}) => {
  return (
    <div
      className={`cursor-pointer ${className} ${isSelected ? selectedClass : ""} `}
      data-testid={dataTestid}
      role={role}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
