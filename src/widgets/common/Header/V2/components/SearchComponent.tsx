"use client";

import React, { forwardRef, useState, useRef, Suspense } from "react";
import { Box, Flex, Text } from "@/ui/atomic";
import { useTypewriter } from "../../hooks/useTypewriter";
import { SearchIcon } from "./SearchIcon";
import { SearchDropdown } from "@/widgets/common/Search/components/SearchDropdown";
import { SearchInput } from "./SearchInput";

interface SearchComponentProps {
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  placeholder?: string;
  searchPlaceholder?: string[] | string;
  textColor: string;
  isMobile?: boolean;
  className?: string;
  searchTranslations?: any;
  accessibilityTranslations?: any;
  onCloseMobileSearch?: () => void;
}

export const SearchComponent = forwardRef<
  HTMLInputElement,
  SearchComponentProps
>(
  (
    {
      onFocus,
      onBlur,
      isFocused,
      placeholder,
      searchPlaceholder,
      textColor,
      isMobile = false,
      className = "",
      searchTranslations = {},
      accessibilityTranslations = {},
      onCloseMobileSearch,
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sample suggestions - in real app, these would come from API
    const suggestions = [
      "Search for Shampoo",
      "Search for Hair Care",
      "Search for Conditioner",
      "Search for Salon Treatment",
    ];

    // Use suggestions array for placeholder loop, or fallback to searchPlaceholder prop
    const searchWords: string[] = Array.isArray(searchPlaceholder)
      ? searchPlaceholder.filter(
          (word): word is string => typeof word === "string" && word.length > 0
        )
      : typeof searchPlaceholder === "string"
        ? [searchPlaceholder]
        : suggestions;

    const animatedPlaceholder = useTypewriter({
      words: searchWords,
      typeSpeed: 80,
      deleteSpeed: 50,
      delayBetweenWords: 1000,
      loop: true,
    });

    const handleInputFocus = () => {
      setIsInputFocused(true);
      setShowSearchDropdown(true);
      onFocus?.();
    };

    const handleSearchDropdownClose = () => {
      setShowSearchDropdown(false);
      setIsInputFocused(false);
      (ref as React.RefObject<HTMLInputElement>)?.current?.blur();
    };

    const clearSearch = () => {
      setSearchValue("");
      // Blur the input instead of focusing it
      (ref as React.RefObject<HTMLInputElement>)?.current?.blur();
      setIsInputFocused(false);
      // Close mobile search bar on mobile/iPad
      if (isMobile && onCloseMobileSearch) {
        onCloseMobileSearch();
      }
    };

    return (
      <Box
        data-testid="header-search-component"
        ref={containerRef}
        className={`search-component relative ${!isMobile ? "st-search-box hidden-mobile" : ""} ${className}`}
        style={{
          width: isMobile ? "100%" : "255px",
          maxWidth: isMobile ? "100%" : "400px",
        }}
      >
        <Box data-testid="header-search-input-wrapper" className="relative">
          <div className="px-8 py-6 lg:px-0 relative">
            <Suspense
              fallback={
                <input
                  type="text"
                  placeholder="Search for products..."
                  disabled
                  className="w-full outline-none transition-all duration-300 ease-in-out backdrop-blur-sm pt-[8px] pr-[60px] pb-[8px] h-[36px] border border-[#DDDDDD] rounded placeholder:text-black text-xl opacity-50"
                  style={{
                    color: "#000000",
                    paddingLeft: isMobile ? "42px" : "32px",
                  }}
                />
              }
            >
              <SearchInput
                searchPlaceholder={searchWords}
                isMobile={isMobile}
                onSearch={(query) => {
                  setSearchValue(query);
                }}
                onQueryChange={(query) => {
                  setSearchValue(query);
                }}
                onFocus={handleInputFocus}
                onClose={() => {
                  clearSearch();
                }}
                settings={{
                  closeText: searchTranslations.clear_search || "Close",
                }}
                className=""
                disableAutoDropdown={false}
                forceDropdownOpen={showSearchDropdown}
                dropdownTopPosition="100px"
                preventOverlayOpen={false}
              />
            </Suspense>
          </div>

          {/* Clear Button - Show when input is focused */}
          {isInputFocused && (
            <button
              data-testid="header-search-clear-button"
              onClick={clearSearch}
              aria-label={searchTranslations.clear_search || "Clear search"}
              className={`
                absolute top-1/2 -translate-y-1/2 bg-transparent border-none
                cursor-pointer px-2 py-1 rounded transition-all duration-200 ease-in-out
                flex items-center justify-center text-sm
                hover:bg-white/10
                ${isMobile ? "right-12" : "right-3"}
              `}
              style={{ color: "#1d1d1d" }}
            >
              Close
            </button>
          )}
        </Box>

        {/* Search Dropdown */}
        <SearchDropdown
          isOpen={showSearchDropdown && !searchValue.trim()}
          onClose={handleSearchDropdownClose}
          searchQuery={searchValue}
          className=""
        />
      </Box>
    );
  }
);

SearchComponent.displayName = "SearchComponent";
