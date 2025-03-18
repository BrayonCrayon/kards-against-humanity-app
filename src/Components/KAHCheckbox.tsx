import React, { FC, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { type SizeProp } from "@fortawesome/fontawesome-svg-core";

interface KAHCheckboxProps {
  onClick?: (value: boolean) => void;
  size?: SizeProp;
  className?: string;
  dataTestid?: string;
  value?: boolean;
}

export const KAHCheckbox: FC<KAHCheckboxProps> = ({
  size = "lg",
  onClick= () => {},
  className= "",
  dataTestid = "",
  value = false,
}) => {

  const [checked, setChecked] = useState(value);

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const toggle = useCallback(() => {
    setChecked((old) => !old);
    onClick(!checked);
  }, [checked]);

  return (<div className={`flex items-center justify-center ${className} cursor-pointer`} data-testid={dataTestid} onClick={toggle}>
    {
      checked &&
      <FontAwesomeIcon icon={faCheck} size={size} />
    }
  </div>);
};