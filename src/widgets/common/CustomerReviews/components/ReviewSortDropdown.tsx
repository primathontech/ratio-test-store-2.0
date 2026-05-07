"use client";

import type React from "react";

export interface ReviewSortOption {
  label: string;
  key: string;
}

interface ReviewSortDropdownProps {
  options: ReviewSortOption[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export const ReviewSortDropdown: React.FC<ReviewSortDropdownProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => (
  <div
    className={`relative w-full max-w-[200px] ${className}`}
    data-testid="review-sort-dropdown"
  >
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort reviews"
      className="w-full rounded-md bg-white py-2 text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-black/40 cursor-pointer max-w-[123px]"
    >
      {options.map((opt) => (
        <option key={opt.key} value={opt.key}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
