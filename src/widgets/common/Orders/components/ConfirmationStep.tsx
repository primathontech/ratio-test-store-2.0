"use client";

import React from "react";

interface ConfirmationStepProps {
  orderNumber: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  orderNumber,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <>
      {/* Modal Header */}
      <div className="text-center">
        <h2 className="text-[22px] md:text-[28px] text-[#1D1D1D] font-semibold tracking-tight">
          ARE YOU SURE?
        </h2>
        <p className="text-lg my-[15px] max-w-[335px] md:max-w-max text-neutral-600">
          Your complete order will be cancelled.
        </p>
      </div>

      {/* Modal Actions */}
      <div className="flex gap-8 justify-center">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-12 py-3 rounded-full text-sm bg-black text-white font-semibold transition-colors flex items-center justify-center hover:bg-neutral-800 ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>YES</span>
            </div>
          ) : (
            "YES"
          )}
        </button>

        <button
          onClick={onClose}
          disabled={isLoading}
          className={`px-12 py-3 rounded-full text-sm bg-white ring-1 ring-black/10 text-[#1D1D1D] font-semibold transition-colors flex items-center justify-center hover:bg-neutral-50 ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          NO
        </button>
      </div>
    </>
  );
};
