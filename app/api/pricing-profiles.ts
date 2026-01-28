/**
 * Pricing Profile API service layer.
 * Separates API calls from UI components and business logic.
 */
import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import { PricingProfile, CreatePricingProfileRequest, UpdatePricingProfileRequest } from "./interfaces";

/**
 * Fetches all pricing profiles from the API.
 */
export async function getAllPricingProfiles(): Promise<PricingProfile[]> {
  try {
    const response = await apiClient.get<PricingProfile[]>(endpoints.pricingProfiles.getAll);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch pricing profiles: ${error.message}`);
    }
    throw new Error("Failed to fetch pricing profiles");
  }
}

/**
 * Fetches a pricing profile by ID from the API.
 */
export async function getPricingProfileById(id: number): Promise<PricingProfile> {
  try {
    const response = await apiClient.get<PricingProfile>(endpoints.pricingProfiles.getById(id));
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch pricing profile: ${error.message}`);
    }
    throw new Error("Failed to fetch pricing profile");
  }
}

/**
 * Creates a new pricing profile.
 */
export async function createPricingProfile(data: CreatePricingProfileRequest): Promise<PricingProfile> {
  try {
    const response = await apiClient.post<PricingProfile>(endpoints.pricingProfiles.create, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create pricing profile: ${error.message}`);
    }
    throw new Error("Failed to create pricing profile");
  }
}

/**
 * Updates a pricing profile.
 */
export async function updatePricingProfile(id: number, data: UpdatePricingProfileRequest): Promise<PricingProfile> {
  try {
    const response = await apiClient.put<PricingProfile>(endpoints.pricingProfiles.update(id), data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update pricing profile: ${error.message}`);
    }
    throw new Error("Failed to update pricing profile");
  }
}

/**
 * Deletes a pricing profile.
 */
export async function deletePricingProfile(id: number): Promise<void> {
  try {
    await apiClient.delete(endpoints.pricingProfiles.delete(id));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete pricing profile: ${error.message}`);
    }
    throw new Error("Failed to delete pricing profile");
  }
}
