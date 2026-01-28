/**
 * ProductList Component
 * Displays a scrollable list of products with checkboxes for selection
 * Shows loading and empty states
 */

"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Product } from "@/app/api/interfaces";


export interface ProductListProps {
  // Products data
  products: Product[];
  isLoading: boolean;

  // Selection state
  isProductSelected: (productId: number) => boolean;
  onProductToggle: (productId: number) => void;

  // Selected count display
  selectedCount: number;
  profileName?: string;
}

export function ProductList({
  products,
  isLoading,
  isProductSelected,
  onProductToggle,
  selectedCount,
  profileName,
}: ProductListProps) {
  return (
    <>
      {/* Product List */}
      <div className="max-h-96 space-y-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-slate-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-slate-500">No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 px-4 py-3">
              <Checkbox
                checked={isProductSelected(product.id)}
                onChange={() => onProductToggle(product.id)}
              />
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded">
                <div className="h-10 w-10 rounded bg-linear-to-br from-amber-200 to-amber-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">{product.name}</div>
                <div className="text-xs text-slate-500">
                  {product.sku} {product.quantity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Count */}
      <p className="text-xs text-slate-500">
        You&apos;ve selected{" "}
        <span className="font-medium text-slate-700">
          {selectedCount} Product{selectedCount !== 1 ? "s" : ""}
        </span>
        , these will be added to{" "}
        <span className="font-medium text-slate-700">{profileName || "the profile"}</span>
      </p>
    </>
  );
}
