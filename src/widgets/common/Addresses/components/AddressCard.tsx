"use client";

import React from "react";
import { AddressCardProps } from "../types";
import { INDIAN_STATE_CODES } from "../constants/indianStates";

const DEFAULT_CARD_LABELS = {
  default_label: "Default",
  edit_button: "Edit",
  delete_button: "Delete",
  deleting_button: "Deleting...",
} as const;

/** Treat empty or backend placeholder "string" as falsy */
const hasValue = (v: string | undefined | null) =>
  v && v.trim() !== "" && v.toLowerCase() !== "string";

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isDeleting,
  onEdit,
  onDelete,
  cardLabels,
}) => {
  const labels = { ...DEFAULT_CARD_LABELS, ...cardLabels };

  return (
    <div className="text-center space-y-2">
      {/* Default label for default address */}
      {address.isDefault && (
        <div className="text-2xl font-semibold tracking-tight text-[#1D1D1D] my-[22px] leading-tight">
          {labels.default_label}
        </div>
      )}
      {/* Name */}
      <div className="text-primary text-sm !mt-0 leading-[22px]">
        {address.first_name} {address.last_name}
      </div>

      {/* Company (if exists) */}
      {hasValue(address.company) && (
        <div className="text-primary text-sm !mt-0 leading-[22px]">
          {address.company}
        </div>
      )}

      {/* Address 1 */}
      <div className="text-primary text-sm !mt-0 leading-[22px]">
        {address.address}
      </div>

      {/* Address 2 (if exists) */}
      {hasValue(address.address2) && (
        <div className="text-primary text-sm !mt-0 leading-[22px]">
          {address.address2}
        </div>
      )}

      <div className="text-primary text-sm !mt-0 leading-[22px]">
        {address.zip} {address.city}{" "}
        {(INDIAN_STATE_CODES as Record<string, string>)[address.state] ??
          address.state}
      </div>

      <div className="text-primary text-sm !mt-0 leading-[22px]">
        {address.country}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 !mt-0">
        <button
          type="button"
          onClick={() => onEdit(address)}
          disabled={isDeleting}
          className="bg-black text-white px-[25px] md:px-[31px] my-10 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[38.8px] md:min-h-[46.8px] shine-link-button"
        >
          {labels.edit_button}
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm("Are you sure you wish to delete this address?")
            ) {
              onDelete(address.address_id);
            }
          }}
          disabled={isDeleting}
          className="bg-white text-black ring-1 ring-black/10 px-6 md:px-[30px] rounded-full text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed my-10 ml-5 min-h-[38.8px] md:min-h-[46.8px]"
        >
          {isDeleting ? labels.deleting_button : labels.delete_button}
        </button>
      </div>
    </div>
  );
};
