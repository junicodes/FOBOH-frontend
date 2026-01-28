/**
 * Hook for managing modal state
 * Handles error and success modal visibility
 */

import * as React from "react";

export function useModalState() {
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = React.useState<string | null>(null);

  return {
    modalError,
    setModalError,
    modalSuccess,
    setModalSuccess,
  };
}
