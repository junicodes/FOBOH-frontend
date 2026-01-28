/**
 * Radio group primitives with green border and white center.
 * Custom styling to match FOBOH design.
 */
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn("flex flex-wrap gap-4", className)}
      {...props}
    />
  );
}

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(({ className, id, label, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn("flex cursor-pointer items-center gap-2 text-xs text-slate-500", className)}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className="h-3 w-3 accent-[#309e67]"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";
