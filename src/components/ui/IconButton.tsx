"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "ghost" | "solid";
  label: string;
  active?: boolean;
}

export function IconButton({
  icon: Icon,
  size = "md",
  variant = "default",
  label,
  active = false,
  className = "",
  ...props
}: IconButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-full transition-smooth btn-press
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-vintage-black
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    default: `
      bg-vintage-charcoal/80 text-vintage-cream
      backdrop-blur-sm
      hover:bg-vintage-charcoal
      focus:ring-vintage-cream/30
      ${active ? "bg-vintage-cream text-vintage-black" : ""}
    `,
    ghost: `
      bg-transparent text-vintage-cream
      hover:bg-white/10
      focus:ring-white/20
      ${active ? "bg-white/20" : ""}
    `,
    solid: `
      bg-vintage-cream text-vintage-black
      hover:bg-vintage-beige
      focus:ring-vintage-cream
    `,
  };

  const sizes = {
    sm: { button: "w-9 h-9", icon: "w-4 h-4" },
    md: { button: "w-11 h-11", icon: "w-5 h-5" },
    lg: { button: "w-14 h-14", icon: "w-6 h-6" },
    xl: { button: "w-18 h-18", icon: "w-8 h-8" },
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size].button} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className={sizes[size].icon} />
    </button>
  );
}
