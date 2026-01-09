import React from "react";

interface FormFieldInputProps {
  label: string;
  name: string;
  placeholder: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  disabled?: boolean;
}

export const FormFieldInput: React.FC<FormFieldInputProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  unit,
  disabled = false,
}) => {
  return (
    <label className="flex flex-col min-w-40 flex-1">
      <p className="text-base font-medium leading-normal pb-2">{label}</p>
      <div className="relative flex items-center">
        <input
          disabled={disabled}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal disabled:opacity-50"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          type="number"
        />
        {unit && (
          <span className="absolute right-4 text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
};
