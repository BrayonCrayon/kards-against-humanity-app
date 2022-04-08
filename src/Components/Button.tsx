import React, { FC } from "react";

interface ButtonProps {
  text: string;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dataTestid?: string;
  className?: string;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  text,
  type = "button",
  onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
  dataTestid = "",
  className = "",
  disabled = false,
}) => {
  const classNames =
    "bg-gray-300 py-2 px-4 text-gray-900 font-semibold rounded shadow mt-4 mb-4 text-xl hover:bg-gray-200 " +
    className;
  return (
    <button
      type={type}
      onClick={(e) => onClick(e)}
      data-testid={dataTestid}
      className={classNames}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
