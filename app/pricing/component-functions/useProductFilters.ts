/**
 * Hook for managing product filters and search
 * Handles search input, dropdown filters, and API calls
 */

import * as React from "react";
import { useProducts, useReferenceData } from "@/hooks";

export function useProductFilters() {
  // Filter states for dropdowns - all trigger API calls
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string>("");
  const [selectedSegment, setSelectedSegment] = React.useState<string>("");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("");
  const [selectedSku, setSelectedSku] = React.useState<string>("");

  // Load all products on mount (no filters) - stores in Zustand
  const { refetch: refetchAllProducts } = useProducts({ enabled: false });

  React.useEffect(() => {
    // Load all products on initial mount
    refetchAllProducts();
  }, [refetchAllProducts]);

  // Fetch reference data (brands, categories, sub-categories, segments, skus)
  const {
    brands,
    categories,
    subCategories,
    segments,
    skus,
    isLoading: isLoadingReferenceData,
  } = useReferenceData();

  // Combined loading state
  const isLoadingDropdowns = isLoadingReferenceData;

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build filters object - all filters trigger API call
  const filters = React.useMemo(() => {
    const filterObj: {
      search?: string;
      category?: string;
      subCategory?: string;
      segment?: string;
      brand?: string;
      sku?: string;
    } = {};

    if (searchQuery.trim()) filterObj.search = searchQuery.trim();
    if (selectedCategory) filterObj.category = selectedCategory;
    if (selectedSubCategory) filterObj.subCategory = selectedSubCategory;
    if (selectedSegment) filterObj.segment = selectedSegment;
    if (selectedBrand) filterObj.brand = selectedBrand;
    if (selectedSku) filterObj.sku = selectedSku;

    return Object.keys(filterObj).length > 0 ? filterObj : undefined;
  }, [searchQuery, selectedCategory, selectedSubCategory, selectedSegment, selectedBrand, selectedSku]);

  // Fetch products from API with filters - this updates Zustand store
  const { products, isLoading: isLoadingProducts } = useProducts({ filters });

  return {
    // Filter state
    searchInput,
    setSearchInput,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSegment,
    setSelectedSegment,
    selectedBrand,
    setSelectedBrand,
    selectedSku,
    setSelectedSku,

    // Data
    products,
    isLoadingProducts,
    brands,
    categories,
    subCategories,
    segments,
    skus,
    isLoadingDropdowns,
  };
}
