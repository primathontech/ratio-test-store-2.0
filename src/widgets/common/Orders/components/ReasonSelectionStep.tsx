"use client";

import React from "react";

interface ReasonSelectionStepProps {
  selectedReason: string;
  onReasonSelect: (reason: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
  customReason?: string;
  onCustomReasonChange?: (reason: string) => void;
  showValidationError?: boolean;
}

const CANCELLATION_REASONS = [
  "Change of mind",
  "Found better price elsewhere",
  "Ordered by mistake",
  "Delivery time too long",
  "Product not needed anymore",
  "Others",
];

export const ReasonSelectionStep: React.FC<ReasonSelectionStepProps> = ({
  selectedReason,
  onReasonSelect,
  onConfirm,
  isLoading,
  customReason = "",
  onCustomReasonChange,
}) => {
  const isConfirmDisabled =
    selectedReason === "Others"
      ? !customReason.trim() || isLoading
      : !selectedReason || isLoading;

  // Error states
  const hasSelectError = !selectedReason;
  const hasTextareaError = selectedReason === "Others" && !customReason.trim();

  return (
    <>
      {/* Modal Header */}
      <div className="text-center">
        <h2 className="text-[22px] md:text-[28px] text-primary font-normal">
          Cancel confirmation
        </h2>
        <p className="text-lg mt-[15px] text-primary">
          Reason for cancellation.
        </p>

        <div className="relative my-5">
          <select
            value={selectedReason}
            onChange={(e) => onReasonSelect(e.target.value)}
            className="w-full text-sm p-2.5 border border-[#ccc] rounded-[10px] bg-white text-primary focus:outline-none appearance-none text-left"
          >
            <option value="">Select reason</option>
            {CANCELLATION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {hasSelectError && (
            <p className="text-red-500 text-sm text-left mt-1">
              Please select a reason
            </p>
          )}
        </div>

        {selectedReason === "Others" && (
          <div>
            <textarea
              value={customReason}
              onChange={(e) => onCustomReasonChange?.(e.target.value)}
              placeholder="Type a reason why you want to cancel order?"
              className="w-full text-sm text-primary p-2.5 border border-[#ccc] rounded-[10px] focus:outline-none text-left"
              rows={6}
            />
            {hasTextareaError && (
              <p className="text-red-500 text-sm text-left mt-1 mb-5">
                Please type a reason
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="flex justify-center">
        <button
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          className={`px-14 py-4 rounded-md text-sm border border-black font-semibold transition-colors flex items-center justify-center ${
            isConfirmDisabled
              ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300"
              : "text-black hover:border-[#0089dd] hover:text-[#0089dd]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600">
              <div className="size-5 border-2 border-[#ccc] border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            "CONFIRM"
          )}
        </button>
      </div>
    </>
  );
};
