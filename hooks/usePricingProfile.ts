/**
 * Custom hook for pricing profile operations
 * Uses TanStack Query for data fetching and mutations
 * Separates business logic from UI components
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPricingProfileWithValidation,
  updatePricingProfileWithValidation,
  deletePricingProfileWithValidation,
  getAllPricingProfilesWithErrorHandling,
  getPricingProfileByIdWithErrorHandling,
} from "@/services/pricingProfileService";
import { type PricingProfileFormData } from "@/utils/pricingProfileValidation";

/**
 * Hook for creating a pricing profile
 */
export function useCreatePricingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: PricingProfileFormData) =>
      createPricingProfileWithValidation(formData),
    onSuccess: () => {
      // Invalidate and refetch pricing profiles list
      queryClient.invalidateQueries({ queryKey: ["pricingProfiles"] });
    },
  });
}

/**
 * Hook for updating a pricing profile
 */
export function useUpdatePricingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: number;
      formData: Partial<PricingProfileFormData>;
    }) => updatePricingProfileWithValidation(id, formData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch pricing profiles list and specific profile
      queryClient.invalidateQueries({ queryKey: ["pricingProfiles"] });
      queryClient.invalidateQueries({ queryKey: ["pricingProfile", variables.id] });
    },
  });
}

/**
 * Hook for deleting a pricing profile
 */
export function useDeletePricingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePricingProfileWithValidation(id),
    onSuccess: () => {
      // Invalidate and refetch pricing profiles list
      queryClient.invalidateQueries({ queryKey: ["pricingProfiles"] });
    },
  });
}

/**
 * Hook for fetching all pricing profiles
 */
export function usePricingProfiles() {
  return useQuery({
    queryKey: ["pricingProfiles"],
    queryFn: getAllPricingProfilesWithErrorHandling,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

/**
 * Hook for fetching a single pricing profile by ID
 */
export function usePricingProfile(id: number | null) {
  return useQuery({
    queryKey: ["pricingProfile", id],
    queryFn: () => (id ? getPricingProfileByIdWithErrorHandling(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}