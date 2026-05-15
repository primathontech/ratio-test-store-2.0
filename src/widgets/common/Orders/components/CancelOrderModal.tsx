"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ModalStep } from "../enums";
import { ConfirmationStep } from "./ConfirmationStep";
import { ReasonSelectionStep } from "./ReasonSelectionStep";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, customText?: string) => void;
  orderNumber: string;
  isLoading?: boolean;
  reasons?: string[];
}

const isOtherLikeReason = (reason: string): boolean => /^other/i.test(reason);

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading = false,
  reasons,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>(
    ModalStep.CONFIRMATION
  );
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setCurrentStep(ModalStep.CONFIRMATION);
      setSelectedReason("");
      setCustomReason("");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) {
      return;
    } // Prevent closing while loading
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleConfirm = () => {
    if (isLoading) {
      return;
    } // Prevent multiple clicks while loading

    if (currentStep === ModalStep.CONFIRMATION) {
      setCurrentStep(ModalStep.REASON_SELECTION);
    } else if (currentStep === ModalStep.REASON_SELECTION) {
      // Validate selection
      if (!selectedReason) {
        return;
      }

      if (isOtherLikeReason(selectedReason)) {
        if (!customReason.trim()) {
          return;
        }
        onConfirm(selectedReason, customReason.trim());
      } else {
        onConfirm(selectedReason);
      }
    }
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleCustomReasonChange = (reason: string) => {
    setCustomReason(reason);
  };

  const renderModalContent = () => {
    switch (currentStep) {
      case ModalStep.CONFIRMATION:
        return (
          <ConfirmationStep
            orderNumber={orderNumber}
            onClose={handleClose}
            onConfirm={handleConfirm}
            isLoading={isLoading}
          />
        );
      case ModalStep.REASON_SELECTION:
        return (
          <ReasonSelectionStep
            selectedReason={selectedReason}
            onReasonSelect={handleReasonSelect}
            onConfirm={handleConfirm}
            isLoading={isLoading}
            customReason={customReason}
            onCustomReasonChange={handleCustomReasonChange}
            reasons={reasons}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center">
      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.4)] p-[30px] transform transition-all duration-500 ease-linear mx-auto ${currentStep === ModalStep.REASON_SELECTION ? "max-w-[420px] w-full" : ""} ${
          isAnimating ? "translate-y-0" : "-translate-y-[400px]"
        }`}
      >
        <div
          onClick={handleClose}
          className="absolute top-0 right-[3%] text-xl cursor-pointer"
        >
          ×
        </div>

        {renderModalContent()}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};
