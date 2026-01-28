/**
 * Product API service layer.
 * Separates API calls from UI components and business logic.
 */
import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import { ProductFilters, ProductsResponse, Brand, Category, SubCategory, Segment, Sku } from "./interfaces";

/**
 * Fetches all products from the API with optional filters and search.
 */
export async function getAllProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.subCategory) params.append("subCategory", filters.subCategory);
    if (filters?.segment) params.append("segment", filters.segment);
    if (filters?.brand) params.append("brand", filters.brand);
    if (filters?.sku) params.append("sku", filters.sku);

    const queryString = params.toString();
    const url = queryString
      ? `${endpoints.products.getAll}?${queryString}`
      : endpoints.products.getAll;

    const response = await apiClient.get<ProductsResponse>(url);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    throw new Error("Failed to fetch products");
  }
}

/**
 * Fetches all brands from the API.
 */
export async function getAllBrands(): Promise<Brand[]> {
  try {
    const response = await apiClient.get<Brand[]>(endpoints.products.brands);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }
    throw new Error("Failed to fetch brands");
  }
}

/**
 * Fetches all categories from the API.
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>(endpoints.products.categories);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    throw new Error("Failed to fetch categories");
  }
}

/**
 * Fetches all sub-categories from the API.
 */
export async function getAllSubCategories(): Promise<SubCategory[]> {
  try {
    const response = await apiClient.get<SubCategory[]>(endpoints.products.subCategories);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch sub-categories: ${error.message}`);
    }
    throw new Error("Failed to fetch sub-categories");
  }
}

/**
 * Fetches all segments from the API.
 */
export async function getAllSegments(): Promise<Segment[]> {
  try {
    const response = await apiClient.get<Segment[]>(endpoints.products.segments);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch segments: ${error.message}`);
    }
    throw new Error("Failed to fetch segments");
  }
}

/**
 * Fetches all SKUs from the API.
 */
export async function getAllSkus(): Promise<Sku[]> {
  try {
    const response = await apiClient.get<Sku[]>(endpoints.products.skus);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch SKUs: ${error.message}`);
    }
    throw new Error("Failed to fetch SKUs");
  }
}