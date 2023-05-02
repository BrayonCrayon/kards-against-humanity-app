import { FC, useCallback, useEffect, useState } from "react";

interface KAHRangeProps {
  name: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  dataTestid?: string;
  className?: string;
  min?: number;
  max?: number;
}

export const KAHRange: FC<KAHRangeProps> = ({
  name,
  onChange,
  disabled = false,
  dataTestid = "",
  className = "",
  max = 100,
  min = 0,
}) => {
  const [value, setValue] = useState(min);

  const onValueChange = useCallback(
    (value) => {
      setValue(value);
      onChange(value);
    },
    [onChange, setValue]
  );

  useEffect(() => {
    if (disabled) return;

    setValue((max + min) / 2);
  }, [disabled]);

  return (
    <input
      className={disabled ? "opacity-25" : ""}
      data-testid={dataTestid}
      onChange={(event) => onValueChange(event.target.value)}
      disabled={disabled}
      type="range"
      min={min}
      max={max}
      value={value}
    />
  );
};
