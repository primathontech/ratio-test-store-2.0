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
      <div className="text-center">
        <h2 className="text-[22px] md:text-[28px] text-black font-normal">
          ARE YOU SURE?
        </h2>
        <p className="text-[18px] my-[15px] max-w-[335px] md:max-w-max text-black">
          Your complete order will be cancelled.
        </p>
      </div>

      <div className="flex gap-8 justify-center">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-14 py-4 rounded-md text-[14px] border border-black text-black font-semibold transition-colors flex items-center justify-center ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>YES</span>
            </div>
          ) : (
            "YES"
          )}
        </button>

        <button
          onClick={onClose}
          disabled={isLoading}
          className={`px-14 py-4 rounded-md text-[14px] border border-black hover:border-[#0089dd] text-black hover:text-[#0089dd] font-semibold transition-colors flex items-center justify-center ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          NO
        </button>
      </div>
    </>
  );
};
