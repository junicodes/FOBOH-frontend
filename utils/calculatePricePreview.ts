/**
 * Price Preview Calculation Utility
 * Frontend calculation for quick preview (matches backend logic)
 * Pure functions - no side effects
 * Includes edge case validation
 */

export interface PricePreviewParams {
  basePrice: number;
  adjustmentType: "fixed" | "dynamic";
  adjustmentValue: number;
  incrementType: "increase" | "decrease";
}

export interface PricePreviewResult {
  basePrice: number;
  newPrice: number;
  adjustment: number;
}

/**
 * Round price to 2 decimal places
 */
function roundPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

/**
 * Clamp price to never be negative
 */
function clampPrice(price: number, min: number = 0): number {
  return Math.max(price, min);
}

/**
 * Validate calculation parameters
 * Returns error message if invalid, null if valid
 * Exported for use in form validation
 */
export function validateCalculationParams(params: PricePreviewParams): string | null {
  const { basePrice, adjustmentType, adjustmentValue } = params;

  // Validate base price
  if (isNaN(basePrice) || basePrice < 0) {
    return "Base price must be a valid positive number";
  }

  // Validate adjustment value
  if (isNaN(adjustmentValue) || adjustmentValue < 0) {
    return "Adjustment value must be a valid positive number";
  }

  // Validate dynamic percentage (should not exceed 100%)
  if (adjustmentType === "dynamic" && adjustmentValue > 100) {
    return "Percentage adjustment cannot exceed 100%";
  }

  // Validate that decrease won't result in negative price
  if (params.incrementType === "decrease") {
    if (adjustmentType === "fixed" && adjustmentValue > basePrice) {
      return "Fixed decrease amount cannot exceed base price";
    }
    if (adjustmentType === "dynamic" && adjustmentValue > 100) {
      return "Percentage decrease cannot exceed 100%";
    }
  }

  return null;
}

/**
 * Calculate new price based on adjustment parameters
 * Matches backend calculation logic exactly
 * Includes edge case validation
 * 
 * Formulas:
 * Fixed + Increase: basePrice + adjustmentValue
 * Fixed + Decrease: basePrice - adjustmentValue
 * Dynamic + Increase: basePrice + (adjustmentValue% * basePrice)
 * Dynamic + Decrease: basePrice - (adjustmentValue% * basePrice)
 * 
 * @param params - Pricing calculation parameters
 * @returns Calculated price result (never negative)
 * @throws Error if validation fails
 */
export function calculatePricePreview(params: PricePreviewParams): PricePreviewResult {
  // Validate parameters
  const validationError = validateCalculationParams(params);
  if (validationError) {
    throw new Error(validationError);
  }

  const { basePrice, adjustmentType, adjustmentValue, incrementType } = params;

  let newPrice: number;

  if (adjustmentType === "fixed") {
    // Fixed adjustment: Add or subtract the exact adjustment value
    if (incrementType === "increase") {
      newPrice = basePrice + adjustmentValue;
    } else {
      // decrease - ensure it doesn't go negative
      newPrice = Math.max(0, basePrice - adjustmentValue);
    }
  } else {
    // Dynamic (percentage) adjustment: Calculate percentage of base price first
    const adjustmentAmount = (adjustmentValue / 100) * basePrice;
    if (incrementType === "increase") {
      newPrice = basePrice + adjustmentAmount;
    } else {
      // decrease - ensure it doesn't go negative
      newPrice = Math.max(0, basePrice - adjustmentAmount);
    }
  }

  // Round to 2 decimal places and clamp to prevent negative prices
  const roundedPrice = clampPrice(roundPrice(newPrice));
  const adjustment = roundedPrice - basePrice;

  return {
    basePrice,
    newPrice: roundedPrice,
    adjustment,
  };
}

/**
 * Calculate price preview for multiple products
 * Includes validation for each product
 */
export function calculateBatchPricePreview(
  products: Array<{ id: number; globalWholesalePrice: number }>,
  adjustmentParams: Omit<PricePreviewParams, "basePrice">
): Array<{
  id: number;
  basePrice: number;
  newPrice: number;
  adjustment: number;
  error?: string;
}> {
  return products.map((product) => {
    try {
      // Validate product has valid price
      if (!product.globalWholesalePrice || product.globalWholesalePrice <= 0) {
        return {
          id: product.id,
          basePrice: 0,
          newPrice: 0,
          adjustment: 0,
          error: "Invalid product price",
        };
      }

      const result = calculatePricePreview({
        basePrice: product.globalWholesalePrice,
        ...adjustmentParams,
      });

      return {
        id: product.id,
        basePrice: result.basePrice,
        newPrice: result.newPrice,
        adjustment: result.adjustment,
      };
    } catch (error) {
      return {
        id: product.id,
        basePrice: product.globalWholesalePrice || 0,
        newPrice: product.globalWholesalePrice || 0,
        adjustment: 0,
        error: error instanceof Error ? error.message : "Calculation error",
      };
    }
  });
}