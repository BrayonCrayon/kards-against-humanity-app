import { FC, useCallback, useState } from "react";
import { Button, ButtonVariant } from "Components/Button";

interface FloatingButtonProps {
  className?: string;
  role?: string;
  showButton: boolean;
  variant?: ButtonVariant;
  onClick: () => void;
}

const FloatingButton: FC<FloatingButtonProps> = ({
 children,
 className = "",
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
    <div className={`w-full h-full relative ${className}`}>
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
            className="absolute -top-6 -right-1 rounded-full text-xs shadow-xl"
          />
          : null
      }
    </div>
  );
};

export default FloatingButton;