import { FC, useCallback, useState } from "react";

interface KAHRangeProps {
  name: string;
  onChange: (value: number) => void;
  dataTestid?: string;
  className?: string;
  min?: number;
  max?: number;
}

export const KAHRange: FC<KAHRangeProps> = ({ name, onChange, dataTestid, className, max = 100, min = 0 }) => {
  const [value, setValue] = useState(150);

  const onValueChange = useCallback(
    (value) => {
      setValue(value);
      onChange(value);
    },
    [onChange, setValue]
  );

  return (
    <input
      data-testid={dataTestid}
      onChange={(event) => onValueChange(event.target.value)}
      type="range"
      min={min}
      max={max}
      value={value}
    />
  );
};
