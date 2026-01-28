/**
 * SearchResultsHeader Component
 * Displays search results count and active filter badges
 * Shows "Select All" / "Deselect All" radio buttons
 */

"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

export interface SearchResultsHeaderProps {
  // Results count
  productCount: number;

  // Active filters
  searchQuery?: string;
  selectedSku?: string;
  selectedCategory?: string;
  selectedSubCategory?: string;
  selectedSegment?: string;
  selectedBrand?: string;

  // Selection controls
  selectAllState: "all" | "none" | "partial" | null;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function SearchResultsHeader({
  productCount,
  searchQuery,
  selectedSku,
  selectedCategory,
  selectedSubCategory,
  selectedSegment,
  selectedBrand,
  selectAllState,
  onSelectAll,
  onDeselectAll,
}: SearchResultsHeaderProps) {
  const hasActiveFilters =
    !!searchQuery ||
    !!selectedSku ||
    !!selectedCategory ||
    !!selectedSubCategory ||
    !!selectedSegment ||
    !!selectedBrand;

  return (
    <>
      {/* Results Header */}
      <div className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {productCount} Result{productCount !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters ? (
          <>
            {" "}
            for{" "}
            {searchQuery && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {selectedSku && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                SKU: {selectedSku}
              </span>
            )}
            {selectedCategory && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                Category: {selectedCategory}
              </span>
            )}
            {selectedSubCategory && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                Sub-Category: {selectedSubCategory}
              </span>
            )}
            {selectedSegment && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                Segment: {selectedSegment}
              </span>
            )}
            {selectedBrand && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                Brand: {selectedBrand}
              </span>
            )}
          </>
        ) : (
          <span className="text-slate-400"> (all products)</span>
        )}
      </div>

      {/* Select All / Deselect All */}
      <RadioGroup className="flex items-center gap-4">
        <RadioGroupItem
          name="select-all"
          label="Deselect All"
          checked={selectAllState === "none"}
          onChange={onDeselectAll}
        />
        <RadioGroupItem
          name="select-all"
          label="Select all"
          checked={selectAllState === "all"}
          onChange={onSelectAll}
        />
      </RadioGroup>
    </>
  );
}
