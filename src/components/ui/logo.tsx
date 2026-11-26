import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export function Logo({ className, size = "md", variant = "dark" }: LogoProps) {
  const sizeMap = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 24, text: "text-2xl" },
    lg: { icon: 32, text: "text-3xl" },
  };

  const isLight = variant === "light";

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 font-bold tracking-tight select-none", className)}>
      {/* Simbol 3 cincin sirkular yang terhubung merepresentasikan tiga pilar dan ekonomi sirkular */}
      <svg
        width={sizeMap[size].icon}
        height={sizeMap[size].icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="10" cy="16" r="6.5" stroke={isLight ? "#B8E4C5" : "#123D32"} strokeWidth="2.5" />
        <circle cx="16" cy="16" r="6.5" stroke={isLight ? "#FFFFFF" : "#2F805C"} strokeWidth="2.5" />
        <circle cx="22" cy="16" r="6.5" stroke={isLight ? "#B8E4C5" : "#23865B"} strokeWidth="2.5" />
      </svg>
      <span className={cn(sizeMap[size].text, isLight ? "text-white" : "text-looop-primary")}>
        Looop
      </span>
    </Link>
  );
}
