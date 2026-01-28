/**
 * Zustand store for product state management
 * Global state for products that can be updated from API calls
 */
import { create } from "zustand";
import type { Product } from "@/app/api/products";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  setProducts: (products: Product[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  isError: false,
  error: null,
  setProducts: (products) => set({ products, isError: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isError: !!error }),
  clearProducts: () => set({ products: [], isError: false, error: null }),
}));