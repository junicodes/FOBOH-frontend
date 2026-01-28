/**
 * Mock data for development and testing.
 * All mock data is centralized here for easy management.
 */

export interface MockProduct {
  id: number;
  name: string;
  sku: string;
  quantity: string;
  selected?: boolean;
}

export interface MockPricingTableRow {
  id: number;
  title: string;
  sku: string;
  category: string;
  wholesalePrice: number;
  adjustment: number;
  newPrice: number;
}

export const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: "HN Half Day Hazy",
    sku: "SKU 802221906T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 2,
    name: "Crumbl Cookies",
    sku: "SKU 802221906T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 3,
    name: "Necessaire",
    sku: "SKU 802221906T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 4,
    name: "Product 4",
    sku: "SKU 802221907T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 5,
    name: "Product 5",
    sku: "SKU 802221908T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 6,
    name: "Product 6",
    sku: "SKU 802221909T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 7,
    name: "Product 7",
    sku: "SKU 802221910T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 8,
    name: "Product 8",
    sku: "SKU 802221911T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 9,
    name: "Product 9",
    sku: "SKU 802221912T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 10,
    name: "Product 10",
    sku: "SKU 802221913T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 11,
    name: "Product 11",
    sku: "SKU 802221914T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 12,
    name: "Product 12",
    sku: "SKU 802221915T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
  {
    id: 13,
    name: "Product 13",
    sku: "SKU 802221916T",
    quantity: "12 × 375ML, Can Case",
    selected: false,
  },
];

// Pricing table data matching design
export const mockPricingTable: MockPricingTableRow[] = [
  {
    id: 1,
    title: "HN Half Day Hazy",
    sku: "SKU or UOM",
    category: "Wine",
    wholesalePrice: 45.0,
    adjustment: -5.0,
    newPrice: 40.0,
  },
  {
    id: 2,
    title: "Crumbl Cookies",
    sku: "SKU or UOM",
    category: "Wine",
    wholesalePrice: 45.0,
    adjustment: -5.0,
    newPrice: 40.0,
  },
  {
    id: 3,
    title: "Necessaire",
    sku: "SKU or UOM",
    category: "Wine",
    wholesalePrice: 45.0,
    adjustment: -5.0,
    newPrice: 40.0,
  },
];
