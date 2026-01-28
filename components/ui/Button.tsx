/**
 * Reusable button primitive with FOBOH brand green styling.
 * Supports primary, secondary, and ghost variants with multiple sizes.
 */
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#147D64] text-white hover:bg-[#0f6350]",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-10 px-10 text-sm",
  lg: "h-10 px-10 text-sm",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          !props.disabled && "cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
