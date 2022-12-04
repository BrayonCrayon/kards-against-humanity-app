import { FC, useCallback, useState } from "react";
import { Button, ButtonVariant } from "Components/Atoms/Button";

interface FloatingButtonProps {
  className?: string;
  buttonClass?: string;
  role?: string;
  showButton: boolean;
  variant?: ButtonVariant;
  onClick: () => void;
}

const FloatingButton: FC<FloatingButtonProps> = ({
 children,
 className = "",
 buttonClass = "",
 role = "button",
 variant = ButtonVariant.primary,
 showButton = false,
 onClick
}) => {

  const [loading, setLoading] = useState(false);

  const clickHandler = useCallback((e) => {
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
            text="submit"
            className={`absolute rounded-full text-xs shadow-xl ${buttonClass}`}
          />
          : null
      }
    </div>
  );
};

export default FloatingButton;