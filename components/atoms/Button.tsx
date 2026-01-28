"use client";

import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "black";
  ghost?: boolean;
  ghostVariant?: "light" | "dark" | "auto";
};

export default function Button({
  variant = "primary",
  ghost = false,
  ghostVariant = "auto",
  className = "",
  children,
  disabled = false,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xs px-4 py-2 font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const solidMap: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary hover:shadow-lg focus:ring-primary/50 shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary hover:shadow-lg focus:ring-secondary/50 shadow-md px-12 py-3",
    tertiary: "bg-tertiary text-white hover:bg-tertiary hover:shadow-lg focus:ring-tertiary/50 shadow-md",
    black: "bg-black text-secondary hover:bg-black/90 hover:shadow-lg focus:ring-black/50 shadow-md",
  };

  const ghostMapLight: Record<string, string> = {
    primary: "bg-transparent text-primary border-2 border-primary hover:bg-primary/10 hover:border-primary/80 focus:ring-primary/50 active:bg-primary/15",
    secondary: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/10 hover:border-secondary/80 focus:ring-secondary/50 active:bg-secondary/15",
    tertiary: "bg-transparent text-tertiary border-2 border-tertiary hover:bg-tertiary/10 hover:border-tertiary/80 focus:ring-tertiary/50 active:bg-tertiary/15",
    black: "bg-transparent text-black border-2 border-black hover:bg-black/10 hover:border-black/80 focus:ring-black/50 active:bg-black/15",
  };

  // Ghost variant for dark backgrounds (navbar, hero, etc)
  const ghostMapDark: Record<string, string> = {
    primary: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/15 hover:border-secondary focus:ring-secondary/50 active:bg-secondary/25",
    secondary: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/15 hover:border-secondary focus:ring-secondary/50 active:bg-secondary/25",
    tertiary: "bg-transparent text-white border-2 border-white hover:bg-white/10 hover:border-white focus:ring-white/50 active:bg-white/15",
    black: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/15 hover:border-secondary focus:ring-secondary/50 active:bg-secondary/25",
  };

  const ghostMapAuto: Record<string, string> = {
    primary: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/15 hover:border-secondary focus:ring-secondary/50 active:bg-secondary/25",
    secondary: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/15 hover:border-secondary focus:ring-secondary/50 active:bg-secondary/25",
    tertiary: "bg-transparent text-white border-2 border-white hover:bg-white/10 hover:border-white focus:ring-white/50 active:bg-white/15",
    black: "bg-transparent text-secondary border-2 border-secondary hover:bg-secondary/15 hover:border-secondary focus:ring-secondary/50 active:bg-secondary/25",
  };

  let variantClass: string;
  if (ghost) {
    if (ghostVariant === "dark") {
      variantClass = ghostMapDark[variant];
    } else if (ghostVariant === "light") {
      variantClass = ghostMapLight[variant];
    } else {
      // auto defaults to dark (navbar/dark backgrounds)
      variantClass = ghostMapAuto[variant];
    }
  } else {
    variantClass = solidMap[variant];
  }

  return (
    <button
      className={`${base} ${variantClass} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
