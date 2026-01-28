/**
 * TanStack Query hook for fetching products.
 * Separates data fetching logic from UI components.
 * Updates Zustand store with fetched products.
 */
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllProducts, type Product, type ProductFilters } from "@/app/api/products";
import { useProductStore } from "@/store/productStore";

export interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseProductsOptions {
  filters?: ProductFilters;
  enabled?: boolean;
}

/**
 * Hook for fetching all products using TanStack Query.
 * Handles caching, loading states, and error states.
 * Supports search and filter parameters.
 * Updates Zustand store with fetched products.
 */
export function useProducts(options?: UseProductsOptions): UseProductsReturn {
  const { filters, enabled = true } = options || {};
  const { setProducts, setLoading, setError, products: storeProducts, isLoading: storeLoading, isError: storeError, error: storeErrorValue } = useProductStore();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getAllProducts(filters),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    enabled,
  });

  // Update Zustand store when data changes
  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data, setProducts]);

  // Update loading state in store
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Update error state in store
  useEffect(() => {
    setError(error as Error | null);
  }, [error, setError]);

  // Return products from store (which are updated by the query)
  return {
    products: storeProducts,
    isLoading: storeLoading,
    isError: storeError,
    error: storeErrorValue,
    refetch,
  };
}