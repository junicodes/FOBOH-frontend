/**
 * PricingControls Component
 * Handles pricing adjustment configuration
 * Includes adjustment mode, value input, and increment mode
 */

"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { formatAdjustmentSign } from "@/utils/pricingHelpers";

export interface PricingControlsProps {
  // Adjustment mode (fixed or dynamic)
  adjustmentMode: "fixed" | "dynamic";
  onAdjustmentModeChange: (mode: "fixed" | "dynamic") => void;

  // Adjustment value
  adjustmentValue: string;
  onAdjustmentValueChange: (value: string) => void;
  adjustmentValueError?: string | null;

  // Increment mode (increase or decrease)
  incrementMode: "increase" | "decrease";
  onIncrementModeChange: (mode: "increase" | "decrease") => void;
}

export function PricingControls({
  adjustmentMode,
  onAdjustmentModeChange,
  adjustmentValue,
  onAdjustmentValueChange,
  adjustmentValueError,
  incrementMode,
  onIncrementModeChange,
}: PricingControlsProps) {
  return (
    <div className="col w-1/3 pt-5">
      {/* Based on Price Type */}
      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Based on</p>
        <Select value="wholesale" onChange={() => {}} className="w-full bg-white px-4 py-2">
          <option value="wholesale">Global Wholesale Price</option>
        </Select>
      </div>

      {/* Adjustment Mode */}
      <div className="pt-5">
        <p className="mb-2 text-xs font-medium text-slate-500">Set Price Adjustment Mode</p>
        <RadioGroup className="flex flex-row gap-2">
          <RadioGroupItem
            name="adjustment-mode"
            value="fixed"
            label="Fixed ($)"
            checked={adjustmentMode === "fixed"}
            onChange={() => onAdjustmentModeChange("fixed")}
          />
          <RadioGroupItem
            name="adjustment-mode"
            value="dynamic"
            label="Dynamic (%)"
            checked={adjustmentMode === "dynamic"}
            onChange={() => onAdjustmentModeChange("dynamic")}
          />
        </RadioGroup>

        {/* Adjustment Value Input */}
        <div className="pt-5">
          <p className="mb-2 text-xs font-medium text-slate-500">Adjustment Value</p>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-slate-600">
                {formatAdjustmentSign(adjustmentMode)}
              </span>
              <Input
                type="number"
                value={adjustmentValue}
                onChange={(e) => onAdjustmentValueChange(e.target.value)}
                className={`w-2 appearance-none rounded-b-none border-b focus:outline-none focus:ring-0 focus:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] ${
                  adjustmentValueError
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-300 focus:border-slate-500"
                }`}
                style={{
                  borderBottom: adjustmentValueError
                    ? "2px solid #EF4444"
                    : "1px solid #E2E8F0",
                  borderRadius: "0px",
                  width: "100px",
                }}
              />
            </div>
            {adjustmentValueError && (
              <p className="mt-1 text-xs text-red-600">{adjustmentValueError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Increment Mode */}
      <div className="pt-5">
        <p className="mb-2 text-xs font-medium text-slate-500">
          Set Price Adjustment Increment Mode
        </p>
        <RadioGroup className="flex flex-row gap-2">
          <RadioGroupItem
            name="adjustment-increment"
            value="increase"
            label="Increase +"
            checked={incrementMode === "increase"}
            onChange={() => onIncrementModeChange("increase")}
          />
          <RadioGroupItem
            name="adjustment-increment"
            value="decrease"
            label="Decrease -"
            checked={incrementMode === "decrease"}
            onChange={() => onIncrementModeChange("decrease")}
          />
        </RadioGroup>
      </div>
    </div>
  );
}
