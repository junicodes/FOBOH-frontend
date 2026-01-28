// Global UI state store for layout toggles and view preferences.
import { create } from "zustand";

type UiState = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

type UiStateSetter = (
  next:
    | Partial<UiState>
    | ((state: UiState) => Partial<UiState>)
) => void;

export const useUiStore = create<UiState>((set: UiStateSetter) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (sidebarCollapsed: boolean) =>
    set({ sidebarCollapsed }),
}));
