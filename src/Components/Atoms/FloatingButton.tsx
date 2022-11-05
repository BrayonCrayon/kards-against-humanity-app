import { FC } from "react";
import { Button } from "Components/Button";

interface FloatingButtonProps {
  className?: string;
  role?: string;
  showButton: boolean;
  onClick: () => void;
}

const FloatingButton: FC<FloatingButtonProps> = ({
 children,
 className = "",
 role = "button",
 showButton = false,
 onClick
}) => {

  return (
    <div className={`w-full h-full relative ${className}`}>
      {children}
      {
        showButton
          ? <Button
            onClick={onClick}
            role={role}
            text="submit"
            className="absolute -top-6 -right-1 rounded-full text-xs shadow-xl"
          />
          : null
      }
    </div>
  );
};

export default FloatingButton;