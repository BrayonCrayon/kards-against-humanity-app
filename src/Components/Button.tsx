import React, { FC } from "react";

interface ButtonProps {
  text: string;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dataTestid?: string;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "light-outline";
}

export const Button: FC<ButtonProps> = ({
  text,
  type = "button",
  onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
  dataTestid = "",
  className = "",
  disabled = false,
  variant= 'primary'
}) => {
  const classNames = variant === 'primary' ?
    "bg-black py-3 px-4 text-white font-bold shadow mt-4 mb-4 hover:bg-gray-800 " +
    className : "bg-black border-2 border-white py-3 px-4 text-white font-bold shadow mt-4 mb-4 hover:bg-gray-800 " +
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
