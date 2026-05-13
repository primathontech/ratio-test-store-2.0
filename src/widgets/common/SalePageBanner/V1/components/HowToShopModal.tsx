"use client";

import React, { useEffect } from "react";
import type { IHowToShopStep, ITermsAndConditions } from "../../types";
import { useMobileDropdown } from "@/widgets/common/CollectionPage/compounds/useMobileDropdown";
import { useBodyScrollLock } from "@/widgets/common/CollectionPage/hooks/useBodyScrollLock";
import { HowToShopModalContent } from "./HowToShopModalContent";
import "@/widgets/common/CollectionPage/style.css";

interface HowToShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: IHowToShopStep[];
  termsAndConditions: ITermsAndConditions;
  primaryButtonText: string;
  className?: string;
}

export const HowToShopModal: React.FC<HowToShopModalProps> = ({
  isOpen,
  onClose,
  title,
  steps,
  termsAndConditions,
  primaryButtonText,
  className = "",
}) => {
  const { showContent, isTextClosing, isDropdownClosing, handleClose } =
    useMobileDropdown(isOpen, onClose);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Desktop Modal */}
      <div
        className={`fixed inset-0 z-3000 hidden md:flex items-center justify-center bg-[#000000]/50 p-4 ${className}`}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          data-testid="how-to-shop-modal-desktop-content"
          className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <div
            data-testid="how-to-shop-modal-desktop-scrollable-content"
            className="max-h-[68vh] overflow-y-auto bg-white pt-8 rounded-lg"
          >
            <HowToShopModalContent
              title={title}
              steps={steps}
              termsAndConditions={termsAndConditions}
              primaryButtonText={primaryButtonText}
              onClose={onClose}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        data-testid="how-to-shop-modal-mobile-container"
        className="md:hidden"
      >
        <div
          data-testid="how-to-shop-modal-mobile-backdrop"
          className="fixed inset-0 transition-opacity duration-300 bg-[#000000]/80 z-2000"
          onClick={handleClose}
        />

        <div
          data-testid="how-to-shop-modal-mobile-bottom-sheet"
          className={`fixed bottom-0 left-0 right-0 rounded-t-lg z-3000 ${
            isDropdownClosing
              ? "animate-slide-down-slow"
              : "animate-slide-up-slow"
          }`}
        >
          <div className="max-h-[68vh] overflow-y-auto bg-white pt-8 rounded-t-lg">
            <div
              className={`${
                showContent
                  ? "animate-fade-in-delayed opacity-100"
                  : isTextClosing
                    ? "animate-fade-out-quick opacity-0"
                    : "opacity-0"
              }`}
            >
              <HowToShopModalContent
                title={title}
                steps={steps}
                termsAndConditions={termsAndConditions}
                primaryButtonText={primaryButtonText}
                onClose={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
