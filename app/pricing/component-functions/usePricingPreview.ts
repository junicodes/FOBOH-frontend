/**
 * Hook for managing pricing preview calculations
 * Handles preview table generation based on selected products and form values
 */

import * as React from "react";
import { generatePricingPreview } from "@/services/pricingPreviewService";
import { Product } from "@/app/api/interfaces";


export function usePricingPreview(
  selectedProductsList: Product[],
  adjustmentMode: "fixed" | "dynamic",
  adjustmentValue: string,
  incrementMode: "increase" | "decrease"
) {
  // Generate preview pricing table based on selected products and form values
  const previewPricingTable = React.useMemo(() => {
    if (selectedProductsList.length === 0) {
      return [];
    }

    const adjustmentValueNum = parseFloat(adjustmentValue) || 0;
    if (isNaN(adjustmentValueNum) || adjustmentValueNum <= 0) {
      return [];
    }

    try {
      return generatePricingPreview({
        selectedProducts: selectedProductsList,
        adjustmentType: adjustmentMode,
        adjustmentValue: adjustmentValueNum,
        incrementType: incrementMode,
      });
    } catch (error) {
      // If calculation fails, return empty array (validation error will be shown in form)
      return [];
    }
  }, [selectedProductsList, adjustmentMode, adjustmentValue, incrementMode]);

  return {
    previewPricingTable
  };
}
