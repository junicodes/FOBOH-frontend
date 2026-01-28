/**
 * ProductSearchFilters Component
 * Reusable component for product search and filtering
 * Includes search input and filter dropdowns (SKU, Category, Segment, Brand)
 */

"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export interface ProductSearchFiltersProps {
  // Search input
  searchInput: string;
  onSearchChange: (value: string) => void;

  // Filter dropdowns
  selectedSku: string;
  onSkuChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSegment: string;
  onSegmentChange: (value: string) => void;
  selectedBrand: string;
  onBrandChange: (value: string) => void;

  // Data
  skus: Array<{ id: number; skuCode: string }>;
  categories: Array<{ id: number; name: string }>;
  segments: Array<{ id: number; name: string }>;
  brands: Array<{ id: number; name: string }>;

  // Loading state
  isLoadingDropdowns: boolean;
}

/**
 * Clear button component for dropdowns
 */
const ClearButton: React.FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
}> = ({ onClick, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
    aria-label={ariaLabel}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

/**
 * Loading spinner component for dropdowns
 */
const LoadingSpinner: React.FC = () => (
  <div className="absolute right-8 top-1/2 -translate-y-1/2">
    <svg
      className="h-4 w-4 animate-spin text-slate-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

/**
 * Filter dropdown with clear button and loading state
 */
const FilterDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: number; name?: string; skuCode?: string }>;
  placeholder: string;
  isLoading: boolean;
  showClear: boolean;
  onClear: () => void;
  ariaLabel: string;
  getOptionValue: (option: { id: number; name?: string; skuCode?: string }) => string;
  getOptionLabel: (option: { id: number; name?: string; skuCode?: string }) => string;
}> = ({
  value,
  onChange,
  options,
  placeholder,
  isLoading,
  showClear,
  onClear,
  ariaLabel,
  getOptionValue,
  getOptionLabel,
}) => (
  <div className="relative">
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={getOptionValue(option)} className="text-slate-700">
          {getOptionLabel(option)}
        </option>
      ))}
    </Select>
    {showClear && !isLoading && (
      <ClearButton
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        ariaLabel={ariaLabel}
      />
    )}
    {isLoading && <LoadingSpinner />}
  </div>
);

export function ProductSearchFilters({
  searchInput,
  onSearchChange,
  selectedSku,
  onSkuChange,
  selectedCategory,
  onCategoryChange,
  selectedSegment,
  onSegmentChange,
  selectedBrand,
  onBrandChange,
  skus,
  categories,
  segments,
  brands,
  isLoadingDropdowns,
}: ProductSearchFiltersProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium text-slate-500">Search for Products</p>
      <div className="grid gap-3 md:grid-cols-5">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            className="pl-9"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* SKU Dropdown */}
        <FilterDropdown
          value={selectedSku}
          onChange={onSkuChange}
          options={skus}
          placeholder="Select Product / SKU"
          isLoading={isLoadingDropdowns}
          showClear={!!selectedSku}
          onClear={() => onSkuChange("")}
          ariaLabel="Clear SKU selection"
          getOptionValue={(option) => option.skuCode || ""}
          getOptionLabel={(option) => option.skuCode || ""}
        />

        {/* Category Dropdown */}
        <FilterDropdown
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories}
          placeholder="Select Category"
          isLoading={isLoadingDropdowns}
          showClear={!!selectedCategory}
          onClear={() => onCategoryChange("")}
          ariaLabel="Clear category selection"
          getOptionValue={(option) => option.name || ""}
          getOptionLabel={(option) => option.name || ""}
        />

        {/* Segment Dropdown */}
        <FilterDropdown
          value={selectedSegment}
          onChange={onSegmentChange}
          options={segments}
          placeholder="Select Segment"
          isLoading={isLoadingDropdowns}
          showClear={!!selectedSegment}
          onClear={() => onSegmentChange("")}
          ariaLabel="Clear segment selection"
          getOptionValue={(option) => option.name || ""}
          getOptionLabel={(option) => option.name || ""}
        />

        {/* Brand Dropdown */}
        <FilterDropdown
          value={selectedBrand}
          onChange={onBrandChange}
          options={brands}
          placeholder="Select Brand"
          isLoading={isLoadingDropdowns}
          showClear={!!selectedBrand}
          onClear={() => onBrandChange("")}
          ariaLabel="Clear brand selection"
          getOptionValue={(option) => option.name || ""}
          getOptionLabel={(option) => option.name || ""}
        />
      </div>
    </div>
  );
}
