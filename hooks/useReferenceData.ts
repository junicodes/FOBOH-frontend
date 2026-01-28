/**
 * TanStack Query hooks for fetching reference data (brands, categories, segments, sub-categories).
 * Separates data fetching logic from UI components.
 */
import { useQuery } from "@tanstack/react-query";
import {
  getAllBrands,
  getAllCategories,
  getAllSubCategories,
  getAllSegments,
  getAllSkus,
  type Brand,
  type Category,
  type SubCategory,
  type Segment,
  type Sku,
} from "@/app/api/products";

export interface UseReferenceDataReturn {
  brands: Brand[];
  categories: Category[];
  subCategories: SubCategory[];
  segments: Segment[];
  skus: Sku[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook for fetching all reference data using TanStack Query.
 * Handles caching, loading states, and error states.
 */
export function useReferenceData(): UseReferenceDataReturn {
  const {
    data: brands,
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
    error: errorBrands,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: subCategories,
    isLoading: isLoadingSubCategories,
    isError: isErrorSubCategories,
    error: errorSubCategories,
  } = useQuery({
    queryKey: ["subCategories"],
    queryFn: getAllSubCategories,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: segments,
    isLoading: isLoadingSegments,
    isError: isErrorSegments,
    error: errorSegments,
  } = useQuery({
    queryKey: ["segments"],
    queryFn: getAllSegments,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: skus,
    isLoading: isLoadingSkus,
    isError: isErrorSkus,
    error: errorSkus,
  } = useQuery({
    queryKey: ["skus"],
    queryFn: getAllSkus,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading =
    isLoadingBrands ||
    isLoadingCategories ||
    isLoadingSubCategories ||
    isLoadingSegments ||
    isLoadingSkus;

  const isError =
    isErrorBrands ||
    isErrorCategories ||
    isErrorSubCategories ||
    isErrorSegments ||
    isErrorSkus;

  const error =
    errorBrands ||
    errorCategories ||
    errorSubCategories ||
    errorSegments ||
    errorSkus;

  return {
    brands: brands ?? [],
    categories: categories ?? [],
    subCategories: subCategories ?? [],
    segments: segments ?? [],
    skus: skus ?? [],
    isLoading,
    isError: isError as boolean,
    error: error as Error | null,
  };
}