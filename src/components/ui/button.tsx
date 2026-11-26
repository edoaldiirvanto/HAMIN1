import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-button transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-looop-primary text-white hover:bg-opacity-90 active:scale-[0.98] focus:ring-looop-primary",
      secondary:
        "bg-looop-secondary text-white hover:bg-opacity-90 active:scale-[0.98] focus:ring-looop-secondary",
      accent:
        "bg-looop-accent text-looop-primary hover:bg-opacity-80 active:scale-[0.98] focus:ring-looop-accent",
      outline:
        "border border-looop-border text-looop-text bg-transparent hover:bg-looop-bg hover:border-looop-muted/40 focus:ring-looop-secondary",
      ghost:
        "text-looop-text bg-transparent hover:bg-looop-bg focus:ring-looop-secondary",
      danger:
        "bg-looop-danger text-white hover:bg-opacity-90 focus:ring-looop-danger",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2.5 h-10 gap-2",
      lg: "text-base px-6 py-3 h-12 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
