import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  obligatory?: boolean;
}

const InputWithIcon: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className,
  labelClassName,
  disabled,
  obligatory,
  ...props
}) => {
  return (
    <div className={` ${className}`}>
      {label && (
        <label
          className={`block mb-1 bg-white text-body-desktop-lg font-medium text-extensions-content-contentPrimary ${labelClassName}`}
        >
          {label} {obligatory && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          {...props}
          disabled={disabled}
          className={`text-gray-700 bg-white w-full ${
            icon ? "pl-10" : "pl-4"
          } h-[40px]  border rounded-full focus:ring-2 focus:outline-none
                                        ${
                                          error
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-gray-300 focus:ring-blue-500"
                                        } ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } `}
        />
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputWithIcon;
