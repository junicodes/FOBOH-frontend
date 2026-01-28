/**
 * Simple modal component for displaying messages.
 * Keeps UI logic separate from business logic.
 */
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, title, children, className, hideCloseButton = false }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
        )}
        <div className="text-sm text-slate-700">{children}</div>
        {
          hideCloseButton ? null : (
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-[#51b39c] px-4 py-2 text-sm font-medium text-white hover:bg-[#147D64] transition-colors"
            >
              OK
            </button>
          )
        }
      </div>
    </div>
  );
}
