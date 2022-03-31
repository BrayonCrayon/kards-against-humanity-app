import React, { ChangeEvent, FC } from "react";

interface KAHInputProps {
  type?: string;
  label?: string;
  name?: string;
  dataTestid?: string;
  required?: boolean;
  labelClass?: string;
  inputClass?: string;
  pattern?: string;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const KAHInput: FC<KAHInputProps> = ({
  type = "text",
  label = "",
  dataTestid = "",
  name = "",
  required = false,
  labelClass = "",
  inputClass = "",
  pattern = "",
  placeholder = "",
  onChange = (event: ChangeEvent<HTMLInputElement>) => {},
}) => {
  return (
    <label className={`mb-4 pl-2 mt-4 flex justify-between ${labelClass}`}>
      {label}:
      <input
        placeholder={placeholder}
        type={type}
        data-testid={dataTestid}
        name={name}
        className={`border-2 rounded shadow ml-2 px-2 ${inputClass}`}
        pattern={pattern}
        required={required}
        onChange={(e) => onChange(e)}
      />
    </label>
  );
};

export default KAHInput;
