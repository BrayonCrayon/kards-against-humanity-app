import {FC, PropsWithChildren, useCallback, useState} from "react";
import {Button, ButtonVariant} from "Components/Atoms/Button";

interface FloatingButtonProps extends PropsWithChildren {
  className?: string;
  buttonClass?: string;
  iconClass?: string;
  role?: string;
  showButton: boolean;
  variant?: ButtonVariant;
  onClick: () => void;
}

const FloatingButton: FC<FloatingButtonProps> = ({
 children,
 className = "",
 buttonClass = "",
 iconClass = "",
 role = "button",
 variant = ButtonVariant.primary,
 showButton = false,
 onClick
}) => {

  const [loading, setLoading] = useState(false);

  const clickHandler = useCallback(() => {
    setLoading(true);
    onClick();
  }, [onClick]);

  return (
    <div className={`relative ${className}`}>
      {children}
      {
        showButton
          ? <Button
            variant={variant}
            onClick={clickHandler}
            isLoading={loading}
            role={role}
            dataTestid={role}
            iconClass={iconClass}
            text="Submit"
            className={`absolute bg-white text-black text-xs shadow-xl ${buttonClass}`}
          />
          : null
      }
    </div>
  );
};

export default FloatingButton;