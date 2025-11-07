"use client";

import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
  ghost?: boolean;
};

export default function Button({
  variant = "primary",
  ghost = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const solidMap: Record<string, string> = {
    primary: "bg-primary text-white hover:opacity-95",
    secondary: "bg-secondary text-white hover:opacity-95",
    tertiary: "bg-tertiary text-white hover:opacity-95",
  };

  const ghostMap: Record<string, string> = {
    primary: "bg-transparent text-primary border border-primary hover:bg-[rgba(0,0,0,0.04)]",
    secondary: "bg-transparent text-secondary border border-secondary hover:bg-[rgba(0,0,0,0.04)]",
    tertiary: "bg-transparent text-tertiary border border-tertiary hover:bg-[rgba(0,0,0,0.04)]",
  };

  const variantClass = ghost ? ghostMap[variant] : solidMap[variant];

  return (
    <button className={`${base} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
}
