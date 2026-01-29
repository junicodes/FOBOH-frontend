/**
 * Pricing table component for displaying product pricing adjustments.
 * Features: grid layout, checkboxes, editable adjustment inputs with proper border handling.
 */
"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/Checkbox";

export interface PricingTableRow {
  id: number;
  title: string;
  sku: string;
  category: string;
  wholesalePrice: number;
  adjustment: number; // Calculated adjustment amount (for reference, not displayed)
  newPrice: number;
  adjustmentType?: "fixed" | "dynamic"; // Type of adjustment
  originalAdjustmentValue?: number; // Original adjustment value (percentage for dynamic, dollar for fixed)
  incrementType?: "increase" | "decrease"; // Increase or decrease
}

export interface PricingTableProps {
  data: PricingTableRow[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function PricingTable({ data, isLoading = false, onRefresh }: PricingTableProps) {
  const [checkedRows, setCheckedRows] = React.useState<Set<number>>(new Set());

  // Check if all rows are checked
  const allChecked = data.length > 0 && checkedRows.size === data.length;
  // Check if some (but not all) rows are checked (indeterminate state)
  const someChecked = checkedRows.size > 0 && checkedRows.size < data.length;

  // Handle "check all" checkbox
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setCheckedRows(new Set(data.map((row) => row.id)));
    } else {
      setCheckedRows(new Set());
    }
  };

  // Handle individual row checkbox
  const handleRowCheck = (rowId: number, checked: boolean) => {
    const newChecked = new Set(checkedRows);
    if (checked) {
      newChecked.add(rowId);
    } else {
      newChecked.delete(rowId);
    }
    setCheckedRows(newChecked);
  };

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-xs font-semibold"></div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Calculating...
            </>
          ) : (
            <>
              Refresh New Price Table
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </>
          )}
        </button>
      </div>
      <table className="w-full text-xs">
        <thead className="text-slate-50">
          <tr className="border-b border-slate-200">
            <th className="w-12 px-4 py-3 text-left font-medium text-slate-400">
              <Checkbox
                checked={allChecked}
                onChange={(e) => handleCheckAll(e.target.checked)}
                className="cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">
              Product Title
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">
              SKU Code
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">
              Category
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">
              Global Wholesale Price
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-400 ">
              Adjustment
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-800">
              New Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y border-b border-l border-slate-200 divide-slate-100">
          {isLoading && data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                Loading pricing table...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                No pricing data available. Please select products and click "Refresh New Price Table".
              </td>
            </tr>
          ) : (
            data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="w-12 border-r border-slate-200 px-4 py-3">
                <Checkbox
                  checked={checkedRows.has(row.id)}
                  onChange={(e) => handleRowCheck(row.id, e.target.checked)}
                  className="cursor-pointer"
                />
              </td>
              <td className="border-r border-slate-200 px-4 py-3 text-slate-700">
                {row.title}
              </td>
              <td className="border-r border-slate-200 px-4 py-3 text-slate-500">
                {row.sku}
              </td>
              <td className="border-r border-slate-200 px-4 py-3 text-slate-500">
                {row.category}
              </td>
              <td className="border-r border-green-500 px-4 py-3 text-slate-700">
                ${row.wholesalePrice.toFixed(2)}
              </td>
              <td className="border-2 border-green-400 px-4 py-3 text-slate-700 bg-[#51b39c]/10">
                {(() => {

                  // If we have adjustment type and original value, use those
                  if (row.adjustmentType && row.originalAdjustmentValue !== undefined) {
                    const sign = row.incrementType === "decrease" ? "-" : "+";
                    if (row.adjustmentType === "dynamic") {
                      // Show as percentage for dynamic adjustments
                      return `${sign}  ${row.originalAdjustmentValue}%`;
                    } else {
                      // Show as dollar amount for fixed adjustments
                      return `${sign}  ${row.originalAdjustmentValue.toFixed(2)}`;
                    }
                  }
                })()}
              </td>
              <td className="px-4 py-3 text-left font-medium text-slate-900">
                ${row.newPrice.toFixed(2)}
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
