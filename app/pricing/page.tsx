/**
 * Pricing Profiles List Page
 * Displays all pricing profiles with ability to view, edit, and delete
 */
"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  getAllPricingProfiles,
  deletePricingProfile,
} from "@/app/api/pricing-profiles";
import { PricingProfile } from "@/app/api/interfaces";
import { useRouter } from "next/navigation";
import Spinner from "@/components/layout/Spinner";

export default function PricingProfilesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [profileToDelete, setProfileToDelete] = React.useState<PricingProfile | null>(null);

  // Fetch all pricing profiles
  const {
    data: profiles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pricingProfiles"],
    queryFn: getAllPricingProfiles,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePricingProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricingProfiles"] });
      setDeleteModalOpen(false);
      setProfileToDelete(null);
    },
  });

  const handleDeleteClick = (profile: PricingProfile) => {
    setProfileToDelete(profile);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      deleteMutation.mutate(profileToDelete.id);
    }
  };

  const formatAdjustment = (profile: PricingProfile): string => {
    const sign = profile.incrementType === "increase" ? "+" : "-";
    if (profile.adjustmentType === "fixed") {
      return `${sign}  $${profile.adjustmentValue.toFixed(2)}`;
    }
    return `${sign}  ${profile.adjustmentValue}%`;
  };

  return (
    <div className="min-h-screen bg-slate-white">
      <div className="mx-auto flex min-h-screen w-full 2xl:max-w-[2250px]">
        {/* Sidebar */}
        <SidebarNav />

        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col bg-white">
          {/* Top Bar */}
          <TopBar />

          {/* Page Content */}
          <main className="flex-1 p-7">
            <div className="mx-auto max-w-6xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Pricing Profiles</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage your pricing profiles and adjust product prices
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => router.push("/pricing/setup")}
                  className="bg-[#147D64] text-white hover:bg-[#0F5F4B]"
                >
                  Setup a Profile
                </Button>
              </div>

              {/* Profiles List */}
              {isLoading ? (
               <Spinner />
              ) : isError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    Error loading pricing profiles: {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              ) : !profiles || profiles.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-sm font-medium text-slate-900">No pricing profiles</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Get started by creating a new pricing profile.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => router.push("/pricing/setup")}
                      className="bg-[#147D64] text-white hover:bg-[#0F5F4B]"
                    >
                      Create New Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">{profile.name}</h3>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                              {profile.adjustmentType === "fixed" ? "Fixed" : "Dynamic"}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-slate-600">
                            <p>
                              <span className="font-medium">Adjustment:</span> {formatAdjustment(profile)}
                            </p>
                            <p>
                              <span className="font-medium">Type:</span>{" "}
                              {profile.incrementType === "increase" ? "Increase" : "Decrease"}
                            </p>
                            {profile.pricingTable && (
                              <p>
                                <span className="font-medium">Products:</span> {profile.pricingTable.length}
                              </p>
                            )}
                            <p className="text-xs text-slate-400">
                              Created: {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/pricing/profiles/${profile.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteClick(profile)}
                            className=" text-red-500 hover:text-red-500 cursor-pointer"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProfileToDelete(null);
        }}
        title="Delete Pricing Profile"
        hideCloseButton={true}
      >
        <p className="mb-4 text-sm text-slate-600">
          Are you sure you want to delete &quot;{profileToDelete?.name}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setDeleteModalOpen(false);
              setProfileToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}