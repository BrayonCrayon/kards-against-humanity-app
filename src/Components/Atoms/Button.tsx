import React, {FC, PropsWithChildren, useMemo} from "react";

export enum ButtonVariant {
  "primary" = "bg-black py-3 px-4 text-white font-bold shadow mt-4 mb-4 hover:bg-gray-800 ",
  "light-outline" = "bg-black border-2 border-white py-3 px-4 text-white font-bold shadow mt-4 mb-4 hover:bg-gray-800 ",
  "light-compact" = "bg-black px-2 py-1 text-white font-bold shadow mt-4 mb-4 capitalize hover:bg-gray-800 ",
  "dark-outline" = "bg-white py-3 px-4 text-black border-2 border-black font-bold mt-4 mb-4 hover:bg-gray-100 ",
  "dark-compact" = "bg-white shadow-2xl px-2 py-1 capitalize text-black border-2 border-black font-bold mt-4 mb-4 hover:bg-gray-100 ",
  "submit-test" = "bg-white p-3 text-black flex gap-3 items-center text-base w-1/2",
}

interface ButtonProps extends PropsWithChildren {
  text: string;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dataTestid?: string;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  isLoading?: boolean;
  role?: string;
  iconClass?: string;
  beforeLoadingClass?: string;
}

export const Button: FC<ButtonProps> = ({
  text,
  type = "button",
  onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {},
  dataTestid = "",
  className = "",
  disabled = false,
  variant = ButtonVariant.primary,
  isLoading = false,
  role = "button",
  iconClass = "",
  beforeLoadingClass = "",
  children,
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
      <span className={beforeLoadingClass}>
        {children}
        {text}
      </span>
      {isLoading ? <i className={`ml-2 fa-solid fa-spinner animate-spin ${iconClass}`} /> : null}
    </button>
  );
};
