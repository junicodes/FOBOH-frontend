/**
 * Reusable input primitive with FOBOH styling.
 * Consistent text field styling across the application.
 */
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#147D64] focus:outline-none focus:ring-1 focus:ring-[#147D64]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
