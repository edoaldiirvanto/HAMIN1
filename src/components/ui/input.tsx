import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-looop-text mb-1.5">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-input border border-looop-border bg-white px-3.5 py-2 text-sm text-looop-text placeholder:text-looop-muted/60 transition focus:border-looop-secondary focus:outline-none focus:ring-1 focus:ring-looop-secondary disabled:cursor-not-allowed disabled:bg-looop-bg/50",
            error && "border-looop-danger focus:border-looop-danger focus:ring-looop-danger",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-looop-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
