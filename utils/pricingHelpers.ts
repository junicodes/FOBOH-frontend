/**
 * Business logic for pricing calculations and validations.
 * Separated from UI components for clean code architecture.
 */
import type { CalculatePricingRequest } from "@/app/api/pricing";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates pricing calculation request.
 */
export function validatePricingRequest(
  request: Partial<CalculatePricingRequest>
): ValidationResult {
  if (!request.productIds || request.productIds.length === 0) {
    return {
      isValid: false,
      error: "Please select at least one product to calculate pricing.",
    };
  }

  if (!request.adjustmentValue || request.adjustmentValue <= 0) {
    return {
      isValid: false,
      error: "Please enter a valid adjustment value greater than 0.",
    };
  }

  if (!request.basedOn) {
    return {
      isValid: false,
      error: "Based on field is required.",
    };
  }

  return { isValid: true };
}

/**
 * Formats adjustment value with appropriate sign based on mode.
 */
export function formatAdjustmentSign(mode: "fixed" | "dynamic"): string {
  return mode === "fixed" ? "$" : "%";
}
