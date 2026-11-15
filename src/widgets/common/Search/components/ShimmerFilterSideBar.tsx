"use client";

import React from "react";
import { Box } from "@/ui/atomic";

interface ShimmerFilterSideBarProps {
  className?: string;
}

const ShimmerFilterSideBar: React.FC<ShimmerFilterSideBarProps> = ({
  className = "",
}) => {
  return (
    <Box
      className={`w-[260px] min-w-[260px] bg-white h-full pr-[30px] ${className}`}
    >
      {Array.from({ length: 3 }).map((_, boxIndex) => (
        <Box
          key={`filter-box-${boxIndex}`}
          className="mb-8 p-6 border border-gray-300 rounded bg-white min-h-[120px]"
        >
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default ShimmerFilterSideBar;
