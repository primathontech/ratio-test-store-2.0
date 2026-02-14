"use client";

import React from "react";
import { Box, Text } from "@/ui/atomic";

export interface SearchDropdownProps {
  searchQuery: string;
  onSearchChange?: (value: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onSelectResult?: (result: any) => void;
  className?: string;
  topPosition?: string;
  recommendedProductsSettings?: {
    title?: string;
    errorMessages?: {
      failedToLoad?: string;
      failedToLoadProducts?: string;
    };
    accessibility?: {
      scrollLeft?: string;
      scrollRight?: string;
    };
  };
  trendingSearchesSettings?: {
    title?: string;
  };
}

/**
 * SearchDropdown Component
 * Displays search results in a dropdown
 */
export function SearchDropdown({
  searchQuery,
  isOpen = false,
  onClose,
  className = "",
  topPosition = "100%",
  recommendedProductsSettings,
  trendingSearchesSettings,
}: SearchDropdownProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Box
      className={`absolute left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 ${className}`}
      style={{ top: topPosition }}
    >
      <Box className="p-4">
        {searchQuery ? (
          <Text className="text-gray-500 text-sm">
            Search results for "{searchQuery}"
          </Text>
        ) : (
          <>
            {trendingSearchesSettings?.title && (
              <Text className="text-gray-700 font-medium mb-2">
                {trendingSearchesSettings.title}
              </Text>
            )}
            {recommendedProductsSettings?.title && (
              <Text className="text-gray-700 font-medium mb-2 mt-4">
                {recommendedProductsSettings.title}
              </Text>
            )}
          </>
        )}
        {/* Add actual search results here */}
      </Box>
    </Box>
  );
}

export default SearchDropdown;
