/**
 * Business logic for pricing calculations and validations.
 * Separated from UI components for clean code architecture.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}


/**
 * Formats adjustment value with appropriate sign based on mode.
 */
export function formatAdjustmentSign(mode: "fixed" | "dynamic"): string {
  return mode === "fixed" ? "$" : "%";
}
