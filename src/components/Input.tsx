import React from "react";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  label?: string;
  errors?: Record<
    string,
    {
      message?: string;
    }
  >;
  name: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, errors, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor={props.name}
        >
          {label}
        </label>
        <input
          {...props}
          className="text-text focus:border-main w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight focus:outline-none"
          ref={ref}
        />
        {props.name && errors?.[props.name] && (
          <p className="text-xs italic text-red-500">
            {errors[props.name]?.message}
          </p>
        )}
      </div>
    );
  },
);

export default Input;

Input.displayName = "Input";
