/**
 * Hook for managing pricing profile submission
 * Handles form validation, submission, and button enabled state
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCreatePricingProfile } from "@/hooks";
import { type PricingProfileFormData } from "@/utils/pricingProfileValidation";

interface UsePricingProfileSubmissionParams {
  profileName: string;
  adjustmentMode: "fixed" | "dynamic";
  adjustmentValue: string;
  incrementMode: "increase" | "decrease";
  pricingScope: "one" | "multiple" | "all";
  selectedProductIds: number[];
  allProductIds: number[];
  setModalError: (error: string | null) => void;
  setModalSuccess: (success: string | null) => void;
}

export function usePricingProfileSubmission({
  profileName,
  adjustmentMode,
  adjustmentValue,
  incrementMode,
  pricingScope,
  selectedProductIds,
  allProductIds,
  setModalError,
  setModalSuccess,
}: UsePricingProfileSubmissionParams) {
  const router = useRouter();
  const createProfileMutation = useCreatePricingProfile();

  // Determine if button should be enabled
  // Button is enabled when:
  // 1. At least one product is selected (either manually or via "all" mode)
  // 2. Profile name is entered
  // 3. Not currently creating
  const isButtonEnabled = React.useMemo(() => {
    // Check if products are selected - handle "all" scope case
    let hasSelectedProducts = false;
    
    if (pricingScope === "all") {
      // In "all" mode, check if there are products available
      hasSelectedProducts = allProductIds.length > 0;
    } else {
      // In other modes, check if products are actually selected
      hasSelectedProducts = selectedProductIds.length > 0;
    }
    
    const hasProfileName = profileName.trim().length > 0;
    const isNotPending = !createProfileMutation.isPending;
    
    const enabled = hasSelectedProducts && hasProfileName && isNotPending;
    
    return enabled;
  }, [selectedProductIds.length, pricingScope, allProductIds.length, profileName, createProfileMutation.isPending]);

  // Handle create pricing profile
  const handleCreateProfile = React.useCallback(async () => {
    setModalError(null);
    setModalSuccess(null);

    // Determine which product IDs to use based on scope
    let productIdsToUse: number[];
    if (pricingScope === "all") {
      // Use all product IDs from the current products list
      productIdsToUse = allProductIds;
    } else {
      // Use selected product IDs
      productIdsToUse = selectedProductIds;
    }

    if (productIdsToUse.length === 0) {
      setModalError("Please select at least one product");
      return;
    }

    if (!profileName.trim()) {
      setModalError("Please enter a profile name");
      return;
    }

    const adjustmentValueNum = parseFloat(adjustmentValue) || 0;
    if (isNaN(adjustmentValueNum) || adjustmentValueNum <= 0) {
      setModalError("Please enter a valid adjustment value greater than 0");
      return;
    }

    const formData: PricingProfileFormData = {
      name: profileName.trim(),
      adjustmentType: adjustmentMode,
      adjustmentValue: adjustmentValueNum.toString(),
      incrementType: incrementMode,
      productIds: productIdsToUse,
    };

    try {
      const result = await createProfileMutation.mutateAsync(formData);

      if (result.success && result.profile) {
        setModalSuccess(`Pricing profile "${result.profile.name}" created successfully!`);
        
        // Redirect to profiles list after 2 seconds
        setTimeout(() => {
          router.push("/pricing");
        }, 2000);
      } else {
        setModalError(result.error || "Failed to create pricing profile");
      }
    } catch (error) {
      setModalError(
        error instanceof Error ? error.message : "Failed to create pricing profile"
      );
    }
  }, [
    selectedProductIds,
    allProductIds,
    pricingScope,
    profileName,
    adjustmentMode,
    adjustmentValue,
    incrementMode,
    createProfileMutation,
    router,
    setModalError,
    setModalSuccess
  ]);

  return {
    handleCreateProfile,
    isButtonEnabled,
    createProfileMutation,
  };
}
