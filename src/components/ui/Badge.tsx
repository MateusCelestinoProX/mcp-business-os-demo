import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "red" | "gold" | "success" | "outline" | "glow" | "solid";
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", dot = false, children, ...props }, ref) => {
    const variantClasses = {
      default: "glass-pill text-neutral-300 border-white/10",
      red: "glass-pill-red text-red-300 border-red-500/40",
      gold: "bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(255,191,0,0.15)]",
      success: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      outline: "bg-transparent border border-white/15 text-neutral-400",
      glow: "glass-pill-red text-red-300 border-red-500/40 shadow-[0_0_15px_rgba(255,7,58,0.3)]",
      solid: "bg-red-600 text-white font-semibold",
    };

    const dotColors = {
      default: "bg-neutral-400",
      red: "bg-red-500 shadow-[0_0_8px_#ff073a]",
      gold: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
      success: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
      outline: "bg-neutral-400",
      glow: "bg-red-500 shadow-[0_0_8px_#ff073a]",
      solid: "bg-white",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase select-none transition-all",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn("w-1.5 h-1.5 rounded-full inline-block animate-pulse", dotColors[variant])}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
