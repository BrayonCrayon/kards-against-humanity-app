import {FC, useCallback, useEffect, useState} from "react";

interface KAHRangeProps {
  name: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  dataTestid?: string;
  className?: string;
  min?: number;
  max?: number;
  timeLimit?: number;
}

export const KAHRange: FC<KAHRangeProps> = ({
  name,
  onChange,
  disabled = false,
  dataTestid = "",
  className = "",
  max = 100,
  min = 0,
  timeLimit = undefined,
}) => {
  const [value, setValue] = useState(timeLimit);

  const onValueChange = useCallback((value: number) => {
      setValue(value);
      onChange(value);
    },
    [onChange, setValue]
  );

  useEffect(() => {
      if (disabled) return;
      if (!timeLimit) {
        setValue((max + min) / 2);
      }
  }, [disabled]);

  useEffect(() => {
    if (timeLimit) {
      setValue(timeLimit);
    }
  }, [timeLimit]);

  return (
    <input
      className={disabled ? "opacity-25" : ""}
      data-testid={dataTestid}
      onChange={(event) => onValueChange(Number.parseInt(event.target.value))}
      disabled={disabled}
      type="range"
      min={min}
      max={max}
      value={value}
    />
  );
};
