"use client";

import React from "react";

interface ShimmerProductCardProps {
  className?: string;
  settings?: {
    cardLayoutSettings?: {
      borderRadius?: string;
      padding?: string;
      backgroundColor?: string;
      border?: string;
    };
  };
}

/**
 * Shimmer effect component for ProductCard loading state
 */
export function ShimmerProductCard({
  className,
  settings,
}: ShimmerProductCardProps) {
  return (
    <div
      className={`h-full rounded-none md:rounded-[16px] bg-white overflow-hidden relative flex flex-col p-4 border border-gray-200 ${className || ""}`}
      style={{
        border: settings?.cardLayoutSettings?.border || "1px solid #e5e7eb",
        borderRadius: settings?.cardLayoutSettings?.borderRadius || "16px",
        backgroundColor:
          settings?.cardLayoutSettings?.backgroundColor || "white",
        padding: settings?.cardLayoutSettings?.padding || "16px",
      }}
    >
      <div className="w-full h-[150px] md:h-[200px] bg-gray-200 rounded animate-pulse mb-4" />

      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5" />
      </div>
    </div>
  );
}

export default ShimmerProductCard;
