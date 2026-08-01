"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ConfirmationStep } from "./ConfirmationStep";
import { ReasonSelectionStep } from "./ReasonSelectionStep";

type ModalStep = "confirmation" | "reason-selection";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, customText?: string) => void;
  orderNumber: string;
  isLoading?: boolean;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>("confirmation");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setCurrentStep("confirmation");
      setSelectedReason("");
      setCustomReason("");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (isLoading) {
      return;
    }

    if (currentStep === "confirmation") {
      setCurrentStep("reason-selection");
    } else if (currentStep === "reason-selection") {
      if (!selectedReason) {
        return;
      }

      if (selectedReason === "Others") {
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
      case "confirmation":
        return (
          <ConfirmationStep
            orderNumber={orderNumber}
            onClose={handleClose}
            onConfirm={handleConfirm}
            isLoading={isLoading}
          />
        );
      case "reason-selection":
        return (
          <ReasonSelectionStep
            selectedReason={selectedReason}
            onReasonSelect={handleReasonSelect}
            onConfirm={handleConfirm}
            isLoading={isLoading}
            customReason={customReason}
            onCustomReasonChange={handleCustomReasonChange}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`relative bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.4)] p-[30px] transform transition-all duration-500 ease-linear mx-auto ${currentStep === "reason-selection" ? "max-w-[420px] w-full" : ""} ${
          isAnimating ? "translate-y-0" : "-translate-y-[400px]"
        }`}
      >
        <div
          onClick={handleClose}
          className="absolute top-0 right-[3%] text-[20px] cursor-pointer"
        >
          &times;
        </div>

        {renderModalContent()}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};
