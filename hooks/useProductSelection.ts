/**
 * Custom hook for managing product selection logic.
 * Separates business logic from UI components.
 */
import { useState, useCallback, useEffect, useMemo, useRef } from "react";

export type PricingScope = "one" | "multiple" | "all";

export interface UseProductSelectionOptions {
  initialScope?: PricingScope;
  allProductIds?: number[];
}

export interface UseProductSelectionReturn {
  selectedProducts: Set<number>;
  pricingScope: PricingScope;
  setPricingScope: (scope: PricingScope) => void;
  toggleProduct: (productId: number) => { success: boolean; error?: string };
  selectAllProducts: (productIds: number[]) => void;
  deselectAllProducts: () => void;
  isProductSelected: (productId: number) => boolean;
}

export function useProductSelection(
  options: UseProductSelectionOptions = {}
): UseProductSelectionReturn {
  const {
    initialScope = "multiple",
    allProductIds = [],
  } = options;

  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [pricingScope, setPricingScope] = useState<PricingScope>(initialScope);
  const scopeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleProduct = useCallback(
    (productId: number): { success: boolean; error?: string } => {
      let shouldReturnError = false;

      setSelectedProducts((prev) => {
        const isCurrentlySelected = prev.has(productId);

        // If in "one" mode and trying to select a new product when one is already selected
        if (pricingScope === "one" && !isCurrentlySelected && prev.size >= 1) {
          shouldReturnError = true;
          return prev; // Don't change state
        }

        // If in "all" mode and user unchecks a product, switch to "multiple" mode
        if (pricingScope === "all" && isCurrentlySelected) {
          // Clear any pending timeout
          if (scopeChangeTimeoutRef.current) {
            clearTimeout(scopeChangeTimeoutRef.current);
          }
          // Schedule scope change for next tick
          scopeChangeTimeoutRef.current = setTimeout(() => {
            setPricingScope("multiple");
          }, 0);
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        }

        // Normal toggle behavior
        const newSet = new Set(prev);
        if (isCurrentlySelected) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });

      // Return error if trying to select multiple in "one" mode
      if (shouldReturnError) {
        return {
          success: false,
          error: "Only one product can be selected. Please change to 'Multiple Products' to select more.",
        };
      }

      return { success: true };
    },
    [pricingScope]
  );

  const selectAllProducts = useCallback(
    (productIds: number[]) => {
      if (pricingScope === "one") {
        // Can't select all when scope is "one"
        return;
      }
      setSelectedProducts(new Set(productIds));
    },
    [pricingScope]
  );

  const deselectAllProducts = useCallback(() => {
    // Deselect all products regardless of pricing scope
    setSelectedProducts(new Set());
  }, []);

  const isProductSelected = useMemo(
    () => (productId: number) => selectedProducts.has(productId),
    [selectedProducts]
  );

  const handleSetPricingScope = useCallback(
    (scope: PricingScope) => {
      setPricingScope((currentScope) => {
        // If switching to "one" and multiple products are selected, keep only the first one
        if (scope === "one") {
          setSelectedProducts((prev) => {
            if (prev.size > 1) {
              const firstProductId = Array.from(prev)[0];
              return new Set([firstProductId]);
            }
            return prev;
          });
        }
        
        // If switching to "all", select all products from API
        if (scope === "all" && allProductIds.length > 0) {
          setSelectedProducts(new Set(allProductIds));
        }
        
        return scope;
      });
    },
    [allProductIds]
  );

  // Memoize all product IDs set for efficient comparison
  const allProductIdsSet = useMemo(() => new Set(allProductIds), [allProductIds]);

  // Auto-select all products when allProductIds change and we're in "all" mode
  useEffect(() => {
    if (pricingScope === "all" && allProductIds.length > 0) {
      setSelectedProducts(allProductIdsSet);
    }
  }, [allProductIdsSet, allProductIds.length, pricingScope]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scopeChangeTimeoutRef.current) {
        clearTimeout(scopeChangeTimeoutRef.current);
      }
    };
  }, []);

  return {
    selectedProducts,
    pricingScope,
    setPricingScope: handleSetPricingScope,
    toggleProduct,
    selectAllProducts,
    deselectAllProducts,
    isProductSelected,
  };
}
