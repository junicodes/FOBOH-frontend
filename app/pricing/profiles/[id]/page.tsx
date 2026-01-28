/**
 * Pricing Profile View/Edit Page
 * Displays pricing profile in view or edit mode
 */
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Modal } from "@/components/ui/Modal";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopBar } from "@/components/layout/TopBar";
import { PricingTable } from "@/components/pricing/PricingTable";
import { ProductSearchFilters } from "@/components/pricing/ProductSearchFilters";
import { SearchResultsHeader } from "@/components/pricing/SearchResultsHeader";
import { ProductList } from "@/components/pricing/ProductList";
import { PricingControls } from "@/components/pricing/PricingControls";
import { validateCalculationParams } from "@/utils/calculatePricePreview";
import { usePricingProfile, useUpdatePricingProfile } from "@/hooks/usePricingProfile";
import {
  usePricingForm,
  useProductFilters,
  useProductSelectionLogic,
  usePricingPreview,
  useModalState,
} from "../../component-functions";
import { useCallback, useEffect } from "react";
import Spinner from "@/components/layout/Spinner";

export default function PricingProfileViewEditPage() {

  // Validation state for adjustment value
  const [adjustmentValueError, setAdjustmentValueError] = React.useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const profileId = params.id ? parseInt(params.id as string) : null;

  const { modalError, setModalError, modalSuccess, setModalSuccess } = useModalState();

  // Fetch profile data
  const { data: profileResult, isLoading: isLoadingProfile, error: profileError } = usePricingProfile(profileId);

  const profile = profileResult?.profile || null;
  const profileErrorMsg = profileResult?.error || (profileError instanceof Error ? profileError.message : null);
  const updateMutation = useUpdatePricingProfile();

  // Form state - initialize from profile data
  const {
    profileName,
    setProfileName,
    adjustmentValue,
    setAdjustmentValue,
    adjustmentMode,
    setAdjustmentMode,
    incrementMode,
    setIncrementMode,
  } = usePricingForm();

  // Initialize form from profile data
  useEffect(() => {
    if (profile) {
      setProfileName(profile.name);
      setAdjustmentValue(profile.adjustmentValue.toString());
      setAdjustmentMode(profile.adjustmentType);
      setIncrementMode(profile.incrementType);
    }
  }, [profile, setProfileName, setAdjustmentValue, setAdjustmentMode, setIncrementMode]);

  // Product filters and data
  const {
    searchInput,
    setSearchInput,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSegment,
    setSelectedSegment,
    selectedBrand,
    setSelectedBrand,
    selectedSku,
    setSelectedSku,
    products,
    isLoadingProducts,
    brands,
    categories,
    subCategories,
    segments,
    skus,
    isLoadingDropdowns,
  } = useProductFilters();

  // Product selection - initialize from profile
  const {
    pricingScope,
    setPricingScope,
    selectedProducts,
    selectedProductIds,
    allProductIds,
    selectedProductsList,
    isProductSelected,
    handleProductToggle,
    handleSelectAll,
    handleDeselectAll,
    selectAllState,
    initializeSelectedProducts,
  } = useProductSelectionLogic(products);

  // Initialize selected products from profile
  useEffect(() => {
    if (profile && profile.pricingTable && products.length > 0 && selectedProducts.size === 0) {
      const productIds = profile.pricingTable.map((item: { id: any; }) => item.id);
      if (productIds.length > 0) {
        initializeSelectedProducts(productIds);
      }
    }
  }, [profile, products, selectedProducts.size, initializeSelectedProducts]);

  // Wrap handlers to include setModalError
  const handleProductToggleWithError = useCallback(
    (productId: number) => handleProductToggle(productId, setModalError),
    [handleProductToggle, setModalError]
  );

  const handleSelectAllWithError = useCallback(
    () => handleSelectAll(setModalError),
    [handleSelectAll, setModalError]
  );


  // Validate adjustment value on change
  useEffect(() => {
    if (!adjustmentValue || adjustmentValue.trim() === "") {
      setAdjustmentValueError(null);
      return;
    }

    const adjustmentValueNum = parseFloat(adjustmentValue);
    
    // Get a sample product price for validation (use first selected product or 0)
    const sampleBasePrice = selectedProductsList.length > 0 
      ? selectedProductsList[0].globalWholesalePrice 
      : 0;

    const validationError = validateCalculationParams({
      basePrice: sampleBasePrice || 100, // Use 100 as default if no products selected
      adjustmentType: adjustmentMode,
      adjustmentValue: adjustmentValueNum,
      incrementType: incrementMode,
    });

    setAdjustmentValueError(validationError);
  }, [adjustmentValue, adjustmentMode, incrementMode, selectedProductsList]);

  // Pricing preview
  const { previewPricingTable } = usePricingPreview(
    selectedProductsList,
    adjustmentMode,
    adjustmentValue,
    incrementMode
  );

  // Handle save
  const handleSave = async () => {
    if (!profileId) {
      setModalError("Invalid profile ID");
      return;
    }
    try {
      const result = await updateMutation.mutateAsync({
        id: profileId,
        formData: {
          name: profileName,
          adjustmentType: adjustmentMode,
          adjustmentValue: adjustmentValue.toString(),
          incrementType: incrementMode,
          productIds: selectedProductIds,
        },
      });
      if (result.success) {
        setModalSuccess("Profile updated successfully!");
      } else {
        setModalError(result.error || "Failed to update profile");
      }
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Failed to update profile");
    }
  };


  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 p-8">
            <div className="container mx-auto">
              <Spinner />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (profileErrorMsg || (!profile && !isLoadingProfile)) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 p-8">
            <div className="container mx-auto">
              <p className="text-red-600">
                Error loading profile: {profileErrorMsg || "Profile not found"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/pricing")}
                className="mt-4"
              >
                Back to Pricing Profiles
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Always show preview table when editing, or show saved table if no changes
  const displayPricingTable = previewPricingTable.length > 0 ? previewPricingTable : (profile?.pricingTable || []);

  return (
    <div className="min-h-screen bg-slate-white">
      <div className="mx-auto flex min-h-screen w-full 2xl:max-w-[2250px]">
        <SidebarNav />
        <div className="flex min-h-screen flex-1 flex-col bg-white">
          <TopBar />
          <main className="flex-1 p-7">
            <div className="mx-auto max-w-6xl p-7 bg-slate-100 rounded-lg">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <div>
                    <span className="text-slate-400">Pricing Profile</span>
                    <span className="mx-2 text-slate-300">&gt;</span>
                    <span className="font-medium text-slate-700">Edit Profile</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push("/pricing")}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="bg-[#147D64] text-white hover:bg-[#0F5F4B]"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Profile Form - Same as setup page but read-only in view mode */}
              <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-500">
                      Profile Name
                    </label>
                    <Input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </section>

              {/* Product Selection - Same as setup page */}
              <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Select Product Pricing
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">Set details</p>
                </div>

                <div className="space-y-6">
                  {/* Product Selection Type */}
                  <div>
                    <p className="mb-3 text-xs font-medium text-slate-500">
                      You are creating a pricing profile for
                    </p>
                    <RadioGroup className="flex gap-6">
                      <RadioGroupItem
                        name="pricing-scope"
                        value="one"
                        label="One Product"
                        checked={pricingScope === "one"}
                        onChange={() => setPricingScope("one")}
                      />
                      <RadioGroupItem
                        name="pricing-scope"
                        value="multiple"
                        label="Multiple Products"
                        checked={pricingScope === "multiple"}
                        onChange={() => setPricingScope("multiple")}
                      />
                      <RadioGroupItem
                        name="pricing-scope"
                        value="all"
                        label="All Products"
                        checked={pricingScope === "all"}
                        onChange={() => setPricingScope("all")}
                      />
                    </RadioGroup>
                  </div>

                  {/* Search for Products */}
                  <ProductSearchFilters
                    searchInput={searchInput}
                    onSearchChange={setSearchInput}
                    selectedSku={selectedSku}
                    onSkuChange={setSelectedSku}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedSegment={selectedSegment}
                    onSegmentChange={setSelectedSegment}
                    selectedBrand={selectedBrand}
                    onBrandChange={setSelectedBrand}
                    skus={skus}
                    categories={categories}
                    segments={segments}
                    brands={brands}
                    isLoadingDropdowns={isLoadingDropdowns}
                  />

                  {/* Results Header */}
                  <SearchResultsHeader
                    productCount={products.length}
                    searchQuery={searchQuery}
                    selectedSku={selectedSku}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    selectedSegment={selectedSegment}
                    selectedBrand={selectedBrand}
                    selectAllState={selectAllState as "all" | "none" | "partial" | null}
                    onSelectAll={handleSelectAllWithError}
                    onDeselectAll={handleDeselectAll}
                  />

                  {/* Product List */}
                  <ProductList
                    products={products}
                    isLoading={isLoadingProducts}
                    isProductSelected={isProductSelected}
                    onProductToggle={handleProductToggleWithError}
                    selectedCount={selectedProducts.size}
                    profileName={profileName}
                  />

                  {/* Pricing Controls */}
                  <PricingControls
                    adjustmentMode={adjustmentMode}
                    onAdjustmentModeChange={setAdjustmentMode}
                    adjustmentValue={adjustmentValue}
                    onAdjustmentValueChange={setAdjustmentValue}
                    adjustmentValueError={adjustmentValueError}
                    incrementMode={incrementMode}
                    onIncrementModeChange={setIncrementMode}
                  />

                  {/* Info Message */}
                  <div className="flex items-center gap-2 text-xs text-amber-500">
                    <span className="text-amber-500">★</span>
                    <span>
                      The adjusted price will be calculated from{" "}
                      <span className="font-medium text-black">Global Wholesale Price</span> selected above
                    </span>
                  </div>

                  {/* Pricing Table - Preview */}
                  {displayPricingTable.length > 0 && (
                    <PricingTable data={displayPricingTable} />
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>


      {/* Error Modal */}
      <Modal
        isOpen={!!modalError}
        onClose={() => setModalError(null)}
        title="Error"
      >
        <p className="mb-4">{modalError}</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={!!modalSuccess}
        onClose={() => setModalSuccess(null)}
        title="Success"
      >
        <p className="mb-4">{modalSuccess}</p>
      </Modal>
    </div>
  );
}
