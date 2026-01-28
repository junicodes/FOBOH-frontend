/**
 * Pricing Profile Setup Page
 * Clean component - all logic extracted to component-functions
 */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Modal } from "@/components/ui/Modal";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopBar } from "@/components/layout/TopBar";
import { PricingTable } from "@/components/pricing/PricingTable";
import { ProductSearchFilters } from "@/components/pricing/ProductSearchFilters";
import { SearchResultsHeader } from "@/components/pricing/SearchResultsHeader";
import { ProductList } from "@/components/pricing/ProductList";
import { PricingControls } from "@/components/pricing/PricingControls";
import {
  usePricingForm,
  useProductFilters,
  useProductSelectionLogic,
  usePricingPreview,
  usePricingProfileSubmission,
  useModalState,
} from "../component-functions";

export default function PricingSetupPage() {
  const router = useRouter();

  // Modal state
  const { modalError, setModalError, modalSuccess, setModalSuccess } = useModalState();
  
  // Validation state for adjustment value
  const [adjustmentValueError, setAdjustmentValueError] = React.useState<string | null>(null);

  // Form state
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

  // Product selection logic
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
  } = useProductSelectionLogic(products);

  // Pricing preview
  const {
    previewPricingTable,
  } = usePricingPreview(selectedProductsList, adjustmentMode, adjustmentValue, incrementMode);

  // Form submission
  const {
    handleCreateProfile,
    isButtonEnabled,
    createProfileMutation,
  } = usePricingProfileSubmission({
    profileName,
    adjustmentMode,
    adjustmentValue,
    incrementMode,
    pricingScope,
    selectedProductIds,
    allProductIds,
    setModalError,
    setModalSuccess
  });

  // Wrap handlers to include setModalError
  const handleProductToggleWithError = React.useCallback(
    (productId: number) => handleProductToggle(productId, setModalError),
    [handleProductToggle, setModalError]
  );

  const handleSelectAllWithError = React.useCallback(
    () => handleSelectAll(setModalError),
    [handleSelectAll, setModalError]
  );

  return (
    <div className="min-h-screen bg-slate-white">
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        {/* Sidebar */}
        <SidebarNav />

        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col bg-white">
          {/* Top Bar */}
          <TopBar />

          {/* Page Content */}
          <main className="flex-1 p-7">
            <div className="mx-auto max-w-6xl p-7 bg-slate-100 rounded-lg">
              {/* Breadcrumb and Actions - Top Row */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <div>
                    <span className="text-slate-400">Pricing Profile</span>
                    <span className="mx-2 text-slate-300">&gt;</span>
                    <span className="font-medium text-slate-700">Setup a Profile</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-2">
                    Setup your pricing profile, select products and assign customers.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push("/pricing")}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white border-none cursor-pointer hover:text-black"
                    onClick={() => {}}
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>

              {/* Section 1: Basic Pricing Profile */}
              <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Basic Pricing Profile
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Cheeky title description goes in here.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-2 items-center justify-center rounded-full bg-[#147D64]">
                    
                    </div>
                    <span className="text-xs font-medium text-[#147D64]">Completed</span>
                  </div>
                </div>
                <div className="mt-4 space-y-4 pt-5">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-500">
                      Profile Name
                      <p className="mt-1 text-xs text-slate-500">
                        Enter profile name and pricing details
                      </p>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Tenure Discount, Volume Pricing"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </section>

              {/* Section 2: Select Product Pricing */}
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

                  {/* Results Header - Shows active filters */}
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

                  {/* Product List - Scrollable */}
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

                  {/* Pricing Table - Preview (updates as user changes selections/form) */}
                  {previewPricingTable.length > 0 && (
                    <PricingTable data={previewPricingTable} />
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-end justify-between">
                    <p className="text-xs text-slate-400">
                      Your entries are saved automatically
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/pricing")}
                      >
                        Back
                      </Button>
                      <Button
                        size="md"
                        onClick={handleCreateProfile}
                        disabled={!isButtonEnabled}
                        className="bg-[#147D64] text-white hover:bg-[#0F5F4B] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {createProfileMutation.isPending ? "Creating..." : "Next"}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Assign Customers */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Assign Customers to Pricing Profile
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose which customers this profile will be applied to
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-black" />
                    <span className="text-xs text-black">Not Started</span>
                  </div>
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
        title="Oops"
      >
        <p className="mb-4">{modalError}</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={!!modalSuccess}
        onClose={() => setModalSuccess(null)}
        title="Pricing Profile Created Successfully"
      >
        <p className="mb-4">{modalSuccess}</p>
        <p className="text-xs text-slate-500">
          Redirecting to pricing profiles list...
        </p>
      </Modal>
    </div>
  );
}
