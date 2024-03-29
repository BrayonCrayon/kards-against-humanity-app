import React from "react";

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
       <i className="fa-solid fa-toggle-on text-2xl item-end" />
     </>
    )}
    {!on && (
     <>
       {offText}
       <i className="fa-solid fa-toggle-off text-2xl item-end"/>
     </>
    )}
  </div>);
};