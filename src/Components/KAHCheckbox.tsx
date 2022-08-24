import React, { FC, useCallback, useMemo, useState } from "react";

interface KAHCheckboxProps {
  onClick?: (value: boolean) => void;
  size?: string;
  text?: string;
  classNames?: string;
  dataTestid?: string;
}

export const KAHCheckbox: FC<KAHCheckboxProps> = ({
  text = "",
  size = "text-lg",
  onClick= () => {},
  classNames= "",
  dataTestid = ""
}) => {

  const [checked, setChecked] = useState(false)
  const toggle = useCallback(() => {
    setChecked((old) => !old);
    onClick(!checked);
  }, [checked]);

  const iconClass = useMemo(() => {
    return `fa-regular ${size} ${checked ? 'fa-square-check' : 'fa-square'}`;
  }, [checked]);

  return (<div className={`flex items-center ${classNames} cursor-pointer`} data-testid={dataTestid} onClick={toggle}>
    <i className={iconClass}/>
    <span className="m-2">{text}</span>
  </div>);
};