/**
 * Reusable select primitive with FOBOH styling.
 * Dropdown input with consistent styling across the application.
 */
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat px-4 py-2 pr-10 text-sm text-slate-700 focus:border-[#147D64] focus:outline-none focus:ring-1 focus:ring-[#147D64] [&>option]:bg-white [&>option]:px-4 [&>option]:py-3 [&>option]:text-slate-700",
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";
