"use client";

import React, { Suspense } from "react";
import type { SearchProps } from "../types";
import { Box, Flex } from "@/ui/atomic";
import SearchPageWrapper from "../components/SearchPageWrapper";
import ShimmerFilterSideBar from "../components/ShimmerFilterSideBar";
import { ShimmerProductCard } from "../components/ShimmerProductCard";

/** Fallback while the search params hook is suspended. */
const SearchFallback = () => (
  <Box className="min-h-screen bg-white px-0">
    <div className="mx-auto">
      <div className="w-full bg-white">
        <div className="w-full h-4 bg-gray-200 rounded animate-pulse mt-6 mb-8" />

        <Flex className="gap-8">
          <div className="hidden lg:block w-[260px] flex-shrink-0">
            <ShimmerFilterSideBar />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <ShimmerProductCard
                  key={`shimmer-${index}`}
                  className="h-full"
                  settings={{
                    cardLayoutSettings: {
                      backgroundColor: "white",
                      borderRadius: "16px",
                      padding: "16px",
                      border: "1px solid #e5e7eb",
                    },
                  }}
                />
              ))}
            </div>
          </div>
        </Flex>
      </div>
    </div>
  </Box>
);

const SearchV1: React.FC<SearchProps> = ({ settings }) => {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageWrapper settings={settings} />
    </Suspense>
  );
};

export default SearchV1;
