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
  minLength?: number;
  maxLength?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  ariaRole?: string;
}


const KAHInput: FC<KAHInputProps> = ({
  ariaRole= "input",
  type = "text",
  label = "",
  dataTestid = "",
  name = "",
  required = false,
  labelClass = "",
  inputClass = "",
  pattern,
  placeholder = "",
  maxLength = Infinity,
  minLength = 0,
  onChange = (event: ChangeEvent<HTMLInputElement>) => {},
}) => {
  return (
    <label className={`mb-4 pl-2 mt-4 flex ${labelClass}`}>
      {label}:
      <input
        role={ariaRole}
        placeholder={placeholder}
        type={type}
        data-testid={dataTestid}
        name={name}
        className={`border-2 rounded shadow ml-2 px-2 ${inputClass}`}
        pattern={pattern}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        onChange={(e) => onChange(e)}
      />
    </label>
  );
};

export default KAHInput;
