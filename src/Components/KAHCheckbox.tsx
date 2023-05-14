import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

interface KAHCheckboxProps {
  onClick?: (value: boolean) => void;
  size?: string;
  className?: string;
  dataTestid?: string;
  value?: boolean;
}

export const KAHCheckbox: FC<KAHCheckboxProps> = ({
  size = "text-lg",
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

  const iconClass = useMemo(() => {
    return `fa-solid ${size} ${checked ? "fa-check" : "" }`;
  }, [checked]);

  return (<div className={`flex items-center justify-center ${className} cursor-pointer`} data-testid={dataTestid} onClick={toggle}>
    <i className={iconClass}/>
  </div>);
};