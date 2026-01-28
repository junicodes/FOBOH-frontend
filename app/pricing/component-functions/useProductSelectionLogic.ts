/**
 * Hook for managing product selection logic
 * Handles product selection, scope, and selection state
 */

import * as React from "react";
import { useProductSelection } from "@/hooks";
import { Product } from "@/app/api/interfaces";

export function useProductSelectionLogic(products: Product[]) {
  // Memoize product IDs to avoid recreating array on every render
  const allProductIds = React.useMemo(
    () => products.map((p) => p.id),
    [products]
  );

  // Product selection logic
  const {
    selectedProducts,
    pricingScope,
    setPricingScope,
    toggleProduct,
    selectAllProducts,
    deselectAllProducts,
    isProductSelected,
  } = useProductSelection({
    initialScope: "multiple",
    allProductIds,
  });

  // Expose selectAllProducts for external use (e.g., initializing from profile)
  const initializeSelectedProducts = React.useCallback(
    (productIds: number[]) => {
      selectAllProducts(productIds);
    },
    [selectAllProducts]
  );

  // Convert selected products Set to array for API calls
  const selectedProductIds = React.useMemo(
    () => Array.from(selectedProducts),
    [selectedProducts]
  );

  // Get selected products from store
  const selectedProductsList = React.useMemo(() => {
    return products.filter((p) => selectedProducts.has(p.id));
  }, [products, selectedProducts]);

  // Handle product toggle
  const handleProductToggle = React.useCallback(
    (productId: number, setModalError: (error: string) => void) => {
      const result = toggleProduct(productId);
      if (!result.success && result.error) {
        setModalError(result.error);
      }
    },
    [toggleProduct]
  );

  // Handle select all
  const handleSelectAll = React.useCallback(
    (setModalError: (error: string) => void) => {
      if (pricingScope === "one") {
        setModalError("Cannot select all products when 'One Product' is selected. Please change to 'Multiple Products' to select all.");
        return;
      }
      selectAllProducts(allProductIds);
    },
    [pricingScope, selectAllProducts, allProductIds]
  );

  // Handle deselect all
  const handleDeselectAll = React.useCallback(() => {
    deselectAllProducts();
    if (pricingScope === "all") {
      setPricingScope("multiple");
    }
  }, [deselectAllProducts, pricingScope, setPricingScope]);

  // Sync select all state with actual selection
  const selectAllState = React.useMemo<"all" | "none" | "partial" | null>(() => {
    if (pricingScope === "one") {
      return null;
    }
    if (selectedProducts.size === 0) return "none";
    if (products.length > 0 && selectedProducts.size === products.length) return "all";
    return "partial";
  }, [selectedProducts.size, products.length, pricingScope]);

  return {
    pricingScope,
    setPricingScope,
    selectedProducts,
    selectedProductIds,
    allProductIds,
    selectedProductsList,
    isProductSelected,
    handleProductToggle,
    handleSelectAll,
    handleDeselectAll,
    selectAllState,
    initializeSelectedProducts,
  };
}
