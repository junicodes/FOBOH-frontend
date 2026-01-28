/**
 * Pricing Preview Service
 * Business logic for generating pricing table preview
 * Uses calculation utility to show preview before creating profile
 */

import { calculateBatchPricePreview } from "@/utils/calculatePricePreview";
import { Product } from "@/app/api/interfaces";

export interface PricingPreviewTableItem {
  id: number;
  title: string;
  sku: string;
  category: string;
  wholesalePrice: number;
  adjustment: number;
  newPrice: number;
}

export interface GeneratePreviewParams {
  selectedProducts: Product[];
  adjustmentType: "fixed" | "dynamic";
  adjustmentValue: number;
  incrementType: "increase" | "decrease";
}

/**
 * Generate pricing table preview from selected products and form data
 * Uses frontend calculation for instant preview
 */
export function generatePricingPreview(
  params: GeneratePreviewParams
): PricingPreviewTableItem[] {
  const { selectedProducts, adjustmentType, adjustmentValue, incrementType } = params;

  if (selectedProducts.length === 0) {
    return [];
  }

  // Validate adjustment value
  const adjustmentValueNum = parseFloat(adjustmentValue.toString());
  if (isNaN(adjustmentValueNum) || adjustmentValueNum <= 0) {
    return [];
  }

  // Calculate prices for selected products
  const calculatedPrices = calculateBatchPricePreview(
    selectedProducts.map((p) => ({
      id: p.id,
      globalWholesalePrice: p.globalWholesalePrice || 0,
    })),
    {
      adjustmentType,
      adjustmentValue: adjustmentValueNum,
      incrementType,
    }
  );

  // Map to pricing table format
  return selectedProducts.map((product) => {
    const calculated = calculatedPrices.find((cp) => cp.id === product.id);
    
    if (!calculated || calculated.error) {
      // Fallback if calculation failed - show base price only
      return {
        id: product.id,
        title: product.name,
        sku: product.sku,
        category: product.category || "",
        wholesalePrice: product.globalWholesalePrice || 0,
        adjustment: 0,
        newPrice: product.globalWholesalePrice || 0,
      };
    }

    return {
      id: product.id,
      title: product.name,
      sku: product.sku,
      category: product.category || "",
      wholesalePrice: calculated.basePrice,
      adjustment: calculated.adjustment,
      newPrice: calculated.newPrice,
    };
  });
}