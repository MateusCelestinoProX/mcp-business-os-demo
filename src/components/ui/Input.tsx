import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, icon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-500">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "glass-input w-full rounded-xl px-4 py-3 text-sm placeholder:text-neutral-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              icon ? "pl-10" : "pl-4",
              error ? "border-red-500/70 focus:border-red-500 shadow-[0_0_15px_rgba(255,7,58,0.2)]" : "",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 mt-1 pl-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
