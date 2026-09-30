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
  reasons?: string[];
}

const isOtherLikeReason = (reason: string): boolean => /^other/i.test(reason);

export const ReasonSelectionStep: React.FC<ReasonSelectionStepProps> = ({
  selectedReason,
  onReasonSelect,
  onConfirm,
  isLoading,
  customReason = "",
  onCustomReasonChange,
  reasons,
}) => {
  const cancellationReasons = reasons && reasons.length > 0 ? reasons : [];
  const isOtherSelected = isOtherLikeReason(selectedReason);

  const isConfirmDisabled = isOtherSelected
    ? !customReason.trim() || isLoading
    : !selectedReason || isLoading;

  // Error states
  const hasSelectError = !selectedReason;
  const hasTextareaError = isOtherSelected && !customReason.trim();

  return (
    <>
      {/* Modal Header */}
      <div className="text-center">
        <h2 className="text-[22px] md:text-[28px] text-[#1D1D1D] font-semibold tracking-tight">
          Cancel confirmation
        </h2>
        <p className="text-lg mt-[15px] text-neutral-600">
          Reason for cancellation.
        </p>

        <div className="relative my-5">
          <select
            value={selectedReason}
            onChange={(e) => onReasonSelect(e.target.value)}
            className="w-full text-sm p-2.5 border border-neutral-200 rounded-xl bg-white text-[#1D1D1D] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 appearance-none text-left"
          >
            <option value="">Select reason</option>
            {cancellationReasons.map((reason) => (
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

        {isOtherSelected && (
          <div>
            <textarea
              value={customReason}
              onChange={(e) => onCustomReasonChange?.(e.target.value)}
              placeholder="Type a reason why you want to cancel order?"
              className="w-full text-sm text-[#1D1D1D] p-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-400 text-left"
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
          className={`px-12 py-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center ${
            isConfirmDisabled
              ? "opacity-50 cursor-not-allowed bg-neutral-300 text-white"
              : "bg-black text-white hover:bg-neutral-800"
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
