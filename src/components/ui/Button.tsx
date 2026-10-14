import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fired" | "glass" | "secondary" | "ghost" | "outline" | "primary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "glass",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-9 px-3.5 text-xs rounded-xl font-medium",
      md: "h-11 px-5 text-sm rounded-xl font-semibold",
      lg: "h-13 px-8 text-base rounded-2xl font-bold tracking-wide",
      icon: "h-10 w-10 p-0 rounded-xl flex items-center justify-center",
    };

    const variantClasses = {
      fired: "glass-button-fired text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
      primary: "glass-button-fired text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
      glass:
        "bg-white/[0.05] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/25 backdrop-blur-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
      secondary:
        "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/5 hover:border-white/15 backdrop-blur-md shadow-md transition-all active:scale-95",
      ghost:
        "bg-transparent hover:bg-white/[0.06] text-neutral-300 hover:text-white transition-all active:scale-95",
      outline:
        "bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/30 hover:border-red-500/60 shadow-[0_0_15px_rgba(255,7,58,0.1)] transition-all active:scale-95",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 select-none outline-none transition-all duration-200 cursor-pointer disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
