import React, { FC, useMemo } from "react";

export enum ButtonVariant {
  "primary" = "bg-black py-3 px-4 text-white font-bold shadow mt-4 mb-4 hover:bg-gray-800 ",
  "light-outline" = "bg-black border-2 border-white py-3 px-4 text-white font-bold shadow mt-4 mb-4 hover:bg-gray-800 ",
  "dark-outline" = "bg-white py-3 px-4 text-black border-2 border-black font-bold mt-4 mb-4 hover:bg-gray-100 ",
}

interface ButtonProps {
  text: string;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dataTestid?: string;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  isLoading?: boolean;
  role?: string;
}

export const Button: FC<ButtonProps> = ({
  text,
  type = "button",
  onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
  dataTestid = "",
  className = "",
  disabled = false,
  variant= ButtonVariant.primary,
  isLoading = false,
  role= 'button',
}) => {

  const style = useMemo(() => {
    return `${variant} ${className}`;
  }, [variant]);

  return (
    <button
      role={role}
      type={type}
      onClick={(e) => onClick(e)}
      data-testid={dataTestid}
      className={style}
      disabled={disabled || isLoading}
    >
      {text}
      {
        isLoading
          ? <i className="ml-2 fa-solid fa-spinner animate-spin"/>
          : null
      }
    </button>
  );
};
