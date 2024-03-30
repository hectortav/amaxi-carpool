import { type ReactNode } from "react";

import cn from "classnames";

interface ButtonProps {
  disabled?: boolean;
  submit?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "cancel" | "delete";
  icon?: boolean;
}

//TODO: Add tooltip if disabled
const Button = ({
  children,
  disabled = false,
  submit = false,
  onClick,
  className,
  variant = "primary",
  icon,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={submit ? "submit" : "button"}
      className={cn(
        `rounded-lg text-sm font-medium 
          focus:outline-none focus:ring-1`,
        icon ? "p-2" : "px-5 py-2.5",
        variant === "primary"
          ? "bg-main text-background hover:bg-main/80 focus:ring-slate-900"
          : "",
        variant === "cancel"
          ? "bg-slate-300 text-black hover:bg-slate-400 focus:ring-slate-400"
          : "",
        variant === "delete"
          ? "bg-red-500 text-white hover:bg-red-400 focus:ring-red-400"
          : "",
        disabled
          ? `bg-slate-400 text-white hover:bg-slate-400 focus:ring-slate-300`
          : "",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
