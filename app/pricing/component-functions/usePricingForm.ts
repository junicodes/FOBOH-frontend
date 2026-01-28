/**
 * Hook for managing pricing profile form state
 * Handles profile name, adjustment values, and modes
 */

import * as React from "react";

export function usePricingForm() {
  const [profileName, setProfileName] = React.useState("");
  const [adjustmentValue, setAdjustmentValue] = React.useState("10");
  const [adjustmentMode, setAdjustmentMode] = React.useState<"fixed" | "dynamic">("fixed");
  const [incrementMode, setIncrementMode] = React.useState<"increase" | "decrease">("decrease");

  return {
    profileName,
    setProfileName,
    adjustmentValue,
    setAdjustmentValue,
    adjustmentMode,
    setAdjustmentMode,
    incrementMode,
    setIncrementMode,
  };
}
