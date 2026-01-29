"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl transition-smooth btn-press
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-vintage-black
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-vintage-cream text-vintage-black
      hover:bg-vintage-beige
      focus:ring-vintage-cream
    `,
    secondary: `
      bg-vintage-charcoal text-vintage-cream
      border border-vintage-brown/30
      hover:bg-vintage-brown/20
      focus:ring-vintage-brown
    `,
    ghost: `
      bg-transparent text-vintage-cream
      hover:bg-white/10
      focus:ring-white/20
    `,
    danger: `
      bg-red-500/80 text-white
      hover:bg-red-500
      focus:ring-red-500
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full spin" />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );
}
