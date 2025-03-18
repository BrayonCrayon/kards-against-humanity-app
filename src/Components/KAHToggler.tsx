import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

type KAHTogglerProps = {
  on: boolean;
  onText: string;
  offText: string;
  onClick: () => void;
  role?: string;
  className?: string;
  dataTestId?: string;
}


export const KAHToggler: React.FC<KAHTogglerProps> = ({
  onText = "On",
  on,
  offText = "Off",
  onClick,
  role = "toggle-button",
  className = "",
  dataTestId= "",
}) => {

  return (<div role={role} data-testid={dataTestId} onClick={onClick} className={`flex items-center gap-3 cursor-pointer ${className}`}>
    {on && (
     <>
       {onText}
       <FontAwesomeIcon icon={faToggleOn} size="xl" />
     </>
    )}
    {!on && (
     <>
       {offText}
       <FontAwesomeIcon icon={faToggleOff} size="xl" />
     </>
    )}
  </div>);
};