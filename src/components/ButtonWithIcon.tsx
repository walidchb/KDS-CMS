import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  textStyle?: string;
}

const ButtonWithIcon: React.FC<ButtonProps> = ({
  label,
  icon,
  loading,
  className,
  disabled,
  textStyle,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`flex items-center justify-center   rounded-lg focus:ring-2 focus:outline-none ${
        disabled || loading
          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
          : ""
      } ${className}`}
    >
      {loading ? (
        <span className="mr-2">Loading...</span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {label && <span className={` ${textStyle}`}>{label}</span>}
        </>
      )}
    </button>
  );
};

export default ButtonWithIcon;
