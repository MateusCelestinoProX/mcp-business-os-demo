import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "crystal" | "interactive" | "luxury" | "subtle" | "ultra" | "clear";
  glow?: boolean;
  glowColor?: "red" | "gold" | "white";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "crystal", glow = false, glowColor = "red", children, ...props }, ref) => {
    const variantClasses = {
      crystal: "glass-crystal rounded-2xl p-6",
      clear: "glass-clear rounded-2xl p-6",
      interactive: "glass-interactive rounded-2xl p-6 cursor-pointer",
      luxury: "glass-card-luxury p-8",
      ultra: "glass-card-luxury p-8 backdrop-blur-2xl border-white/20",
      subtle: "bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-xl p-5 hover:border-white/10 transition-all",
    };

    const glowClasses = {
      red: "shadow-[0_0_35px_rgba(255,7,58,0.18)] border-red-500/30",
      gold: "shadow-[0_0_35px_rgba(255,215,0,0.15)] border-amber-500/30",
      white: "shadow-[0_0_35px_rgba(255,255,255,0.1)] border-white/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          glow && glowClasses[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
