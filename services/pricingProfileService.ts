/**
 * Pricing Profile Service
 * Business logic for pricing profile operations
 * Separates API calls and business logic from UI components
 */

import {
  createPricingProfile,
  updatePricingProfile,
  deletePricingProfile,
  getPricingProfileById,
  getAllPricingProfiles,
  type PricingProfile,
  type CreatePricingProfileRequest,
  type UpdatePricingProfileRequest,
  type PricingTableItem,
} from "@/app/api/pricing-profiles";
import { validatePricingProfileForm, type PricingProfileFormData } from "@/utils/pricingProfileValidation";

export interface CreatePricingProfileResult {
  success: boolean;
  profile?: PricingProfile;
  pricingTable?: PricingTableItem[];
  error?: string;
}

export interface UpdatePricingProfileResult {
  success: boolean;
  profile?: PricingProfile;
  error?: string;
}

export interface DeletePricingProfileResult {
  success: boolean;
  error?: string;
}

/**
 * Create a new pricing profile
 * Validates data, calls API, and returns formatted result
 */
export async function createPricingProfileWithValidation(
  formData: PricingProfileFormData
): Promise<CreatePricingProfileResult> {
  try {
    // Validate form data
    const validation = validatePricingProfileForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return {
        success: false,
        error: firstError || "Validation failed",
      };
    }

    // Prepare API request
    const request: CreatePricingProfileRequest = {
      name: formData.name.trim(),
      adjustmentType: formData.adjustmentType,
      adjustmentValue: parseFloat(formData.adjustmentValue),
      incrementType: formData.incrementType,
      productIds: formData.productIds,
    };

    // Call API
    const profile = await createPricingProfile(request);

    return {
      success: true,
      profile,
      pricingTable: profile.pricingTable,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create pricing profile";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Update an existing pricing profile
 * Validates data, calls API, and returns formatted result
 */
export async function updatePricingProfileWithValidation(
  id: number,
  formData: Partial<PricingProfileFormData>
): Promise<UpdatePricingProfileResult> {
  try {
    // Validate form data if provided
    if (formData.name || formData.adjustmentValue) {
      const fullFormData: PricingProfileFormData = {
        name: formData.name || "",
        adjustmentType: formData.adjustmentType || "fixed",
        adjustmentValue: formData.adjustmentValue || "0",
        incrementType: formData.incrementType || "increase",
        productIds: formData.productIds || [],
      };

      const validation = validatePricingProfileForm(fullFormData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        return {
          success: false,
          error: firstError || "Validation failed",
        };
      }
    }

    // Prepare API request
    const request: UpdatePricingProfileRequest = {};
    if (formData.name !== undefined) {
      request.name = formData.name.trim();
    }
    if (formData.adjustmentType !== undefined) {
      request.adjustmentType = formData.adjustmentType;
    }
    if (formData.adjustmentValue !== undefined) {
      request.adjustmentValue = parseFloat(formData.adjustmentValue);
    }
    if (formData.incrementType !== undefined) {
      request.incrementType = formData.incrementType;
    }
    if (formData.productIds !== undefined) {
      request.productIds = formData.productIds;
    }

    // Call API
    const profile = await updatePricingProfile(id, request);

    return {
      success: true,
      profile,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update pricing profile";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Delete a pricing profile
 * Calls API and returns formatted result
 */
export async function deletePricingProfileWithValidation(
  id: number
): Promise<DeletePricingProfileResult> {
  try {
    if (!id || isNaN(id)) {
      return {
        success: false,
        error: "Invalid profile ID",
      };
    }

    await deletePricingProfile(id);

    return {
      success: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete pricing profile";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all pricing profiles
 * Wrapper for API call with error handling
 */
export async function getAllPricingProfilesWithErrorHandling(): Promise<{
  profiles: PricingProfile[];
  error?: string;
}> {
  try {
    const profiles = await getAllPricingProfiles();
    return { profiles };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch pricing profiles";
    return {
      profiles: [],
      error: errorMessage,
    };
  }
}

/**
 * Get pricing profile by ID
 * Wrapper for API call with error handling
 */
export async function getPricingProfileByIdWithErrorHandling(
  id: number
): Promise<{
  profile?: PricingProfile;
  error?: string;
}> {
  try {
    if (!id || isNaN(id)) {
      return {
        error: "Invalid profile ID",
      };
    }

    const profile = await getPricingProfileById(id);
    return { profile };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch pricing profile";
    return {
      error: errorMessage,
    };
  }
}