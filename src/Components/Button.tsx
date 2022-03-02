import React, { FC } from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  dataTestid?: string;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  text,
  onClick,
  dataTestid = "",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      data-testid={dataTestid}
      className={`bg-gray-300 py-2 px-4 text-gray-900 font-semibold rounded shadow mt-4 mb-4 text-xl ${className}`}
    >
      {text}
    </button>
  );
};
