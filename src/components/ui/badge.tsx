import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-looop-bg text-looop-muted border-looop-border",
    info: "bg-blue-50 text-looop-info border-blue-200",
    success: "bg-emerald-50 text-looop-success border-emerald-200",
    warning: "bg-amber-50 text-looop-warning border-amber-200",
    danger: "bg-rose-50 text-looop-danger border-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function getStatusBadgeVariant(status: string): BadgeProps["variant"] {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "PAID":
    case "ACCEPTED":
      return "success";
    case "WEIGHING":
    case "AWAITING CONFIRMATION":
    case "AWAITING_CONFIRMATION":
    case "PROCESSING":
    case "SCHEDULED":
      return "warning";
    case "REJECTED":
    case "FAILED":
    case "CANCELLED":
    case "DISPUTED":
      return "danger";
    case "SUBMITTED":
    case "RECEIVED":
    case "REQUESTED":
    case "APPROVED":
      return "info";
    default:
      return "neutral";
  }
}
