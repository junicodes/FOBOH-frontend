/**
 * Product interfaces
*/

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: string;
  selected?: boolean;
  brand?: string | null;
  category?: string | null;
  subCategory?: string | null;
  segment?: string | null;
  globalWholesalePrice?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface Segment {
  id: number;
  name: string;
}

export interface Sku {
  id: number;
  skuCode: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subCategory?: string;
  segment?: string;
  brand?: string;
  sku?: string;
}

/*
 * Pricing Profile interfaces
*/

export interface PricingProfile {
  id: number;
  name: string;
  adjustmentType: "fixed" | "dynamic";
  adjustmentValue: number;
  incrementType: "increase" | "decrease";
  createdAt: Date | string;
  updatedAt: Date | string;
  pricingTable?: PricingTableItem[];
}

export interface PricingTableItem {
  id: number;
  title: string;
  sku: string;
  category: string;
  wholesalePrice: number;
  adjustment: number;
  newPrice: number;
}

export interface CreatePricingProfileRequest {
  name: string;
  adjustmentType: "fixed" | "dynamic";
  adjustmentValue: number;
  incrementType: "increase" | "decrease";
  productIds: number[];
}

export interface UpdatePricingProfileRequest {
  name?: string;
  adjustmentType?: "fixed" | "dynamic";
  adjustmentValue?: number;
  incrementType?: "increase" | "decrease";
  productIds?: number[];
}