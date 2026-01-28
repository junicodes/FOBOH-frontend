/**
 * Pricing Profile Validation
 * Business logic for validating pricing profile data
 */

export interface PricingProfileFormData {
  name: string;
  adjustmentType: "fixed" | "dynamic";
  adjustmentValue: string;
  incrementType: "increase" | "decrease";
  productIds: number[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate pricing profile form data
 */
export function validatePricingProfileForm(
  data: PricingProfileFormData
): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Profile name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Profile name must be at least 3 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Profile name must be less than 100 characters";
  }

  // Validate adjustment type
  if (!data.adjustmentType || !["fixed", "dynamic"].includes(data.adjustmentType)) {
    errors.adjustmentType = "Adjustment type must be 'fixed' or 'dynamic'";
  }

  // Validate adjustment value
  const adjustmentValueNum = parseFloat(data.adjustmentValue);
  if (isNaN(adjustmentValueNum)) {
    errors.adjustmentValue = "Adjustment value must be a valid number";
  } else if (adjustmentValueNum <= 0) {
    errors.adjustmentValue = "Adjustment value must be greater than 0";
  } else if (data.adjustmentType === "dynamic" && adjustmentValueNum > 100) {
    errors.adjustmentValue = "Percentage adjustment cannot exceed 100%";
  } else if (data.adjustmentType === "fixed" && adjustmentValueNum > 1000000) {
    errors.adjustmentValue = "Fixed adjustment cannot exceed $1,000,000";
  }

  // Validate increment type
  if (!data.incrementType || !["increase", "decrease"].includes(data.incrementType)) {
    errors.incrementType = "Increment type must be 'increase' or 'decrease'";
  }

  // Validate product IDs
  if (!data.productIds || !Array.isArray(data.productIds)) {
    errors.productIds = "At least one product must be selected";
  } else if (data.productIds.length === 0) {
    errors.productIds = "At least one product must be selected";
  } else if (data.productIds.length > 1000) {
    errors.productIds = "Cannot select more than 1000 products at once";
  }

  // Validate that all product IDs are numbers
  if (data.productIds && Array.isArray(data.productIds)) {
    const invalidIds = data.productIds.filter((id) => typeof id !== "number" || isNaN(id));
    if (invalidIds.length > 0) {
      errors.productIds = "All product IDs must be valid numbers";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format adjustment value for display
 */
export function formatAdjustmentValue(
  value: number,
  type: "fixed" | "dynamic"
): string {
  if (type === "dynamic") {
    return `${value}%`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format increment type for display
 */
export function formatIncrementType(type: "increase" | "decrease"): string {
  return type === "increase" ? "Increase" : "Decrease";
}