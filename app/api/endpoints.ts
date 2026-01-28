/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for API versioning and maintainability
 */

const API_VERSION = "v1";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001";

/**
 * API endpoint paths
 */
export const endpoints = {
  // Products
  products: {
    getAll: `/api/${API_VERSION}/products`,
    search: `/api/${API_VERSION}/products/search`,
    brands: `/api/${API_VERSION}/products/brands`,
    categories: `/api/${API_VERSION}/products/categories`,
    subCategories: `/api/${API_VERSION}/products/sub-categories`,
    segments: `/api/${API_VERSION}/products/segments`,
    skus: `/api/${API_VERSION}/products/skus`,
  },
  
  // Pricing Profiles
  pricingProfiles: {
    getAll: `/api/${API_VERSION}/pricing-profiles`,
    getById: (id: number) => `/api/${API_VERSION}/pricing-profiles/${id}`,
    create: `/api/${API_VERSION}/pricing-profiles`,
    update: (id: number) => `/api/${API_VERSION}/pricing-profiles/${id}`,
    delete: (id: number) => `/api/${API_VERSION}/pricing-profiles/${id}`,
  },
  
  // Health
  health: "/health",
} as const;

/**
 * Get full URL for an endpoint
 */
export function getEndpointUrl(endpoint: string): string {
  return `${BASE_URL}${endpoint}`;
}

/**
 * API version constant
 */
export const API_VERSION_NUMBER = API_VERSION;