/**
 * Checkbox component - just the box, no checkmark by default.
 * Used for product selection in pricing profiles.
 */
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, label, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    if (label) {
      return (
        <label
          htmlFor={inputId}
          className={cn("flex cursor-pointer items-center gap-2 text-sm", className)}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="h-3 w-3 rounded border border-slate-300 bg-white appearance-none checked:bg-[#51b39c] checked:border-[#51b39c] focus:ring-2 focus:ring-[#51b39c] focus:ring-offset-1"
            {...props}
          />
          <span className="text-slate-700">{label}</span>
        </label>
      );
    }

    return (
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={cn(
          "h-3 w-3 rounded border border-slate-300 bg-white appearance-none checked:bg-[#51b39c] checked:border-[#51b39c] focus:ring-2 focus:ring-[#51b39c] focus:ring-offset-1",
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
