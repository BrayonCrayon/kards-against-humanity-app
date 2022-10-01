import React, { ChangeEvent, FC } from "react";

interface KAHInputProps {
  type?: string;
  label?: string;
  name?: string;
  value?: string;
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
  value = "",
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
    <label className={`my-4 flex flex-wrap font-sans ${labelClass}`}>
      {label}
      <input
        value={value}
        role={ariaRole}
        placeholder={placeholder}
        type={type}
        data-testid={dataTestid}
        name={name}
        className={`border-2 border-black py-1 px-2 mt-2 w-full ${inputClass}`}
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
