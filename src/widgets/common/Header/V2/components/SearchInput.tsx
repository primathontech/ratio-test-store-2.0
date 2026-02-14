"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { publishEvent, EventType } from "shopkit-analytics";
import { useTypewriter } from "../../hooks/useTypewriter";
import SearchDropdown from "@/widgets/common/Search/components/SearchDropdown";
import { useDebounce } from "@/widgets/common/Search/hooks/useDebounce";

interface SearchInputProps {
  searchPlaceholder?: string[] | string;
  className?: string;
  isMobile?: boolean;
  onSearch?: (query: string) => void;
  onClose?: () => void;
  onQueryChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: (event?: React.FocusEvent) => void;
  disableAutoDropdown?: boolean;
  forceDropdownOpen?: boolean;
  dropdownTopPosition?: string;
  preventOverlayOpen?: boolean;
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
  settings?: {
    closeText?: string;
  };
}

/**
 * SearchInput Component
 * Reusable search input with dropdown functionality and typewriter effect
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  searchPlaceholder = ["Search For Sunscreen"],
  className = "w-[250px] h-[35px] pl-[35px] pr-[60px] py-2 border border-black rounded-md border-0.5 focus:outline-none focus:border-black",
  isMobile = false,
  onSearch,
  onClose,
  onQueryChange,
  onFocus,
  onBlur,
  disableAutoDropdown = false,
  forceDropdownOpen = false,
  dropdownTopPosition = "100px",
  preventOverlayOpen = false,
  recommendedProductsSettings,
  trendingSearchesSettings,
  settings = {},
}) => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitializedFromUrl = useRef(false);

  // Initialize search query from URL
  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    hasInitializedFromUrl.current = true;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const decoded = decodeURIComponent(q).trim();
      if (decoded) {
        const displayQuery =
          decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
        setSearchQuery(displayQuery);
        setLastSearchQuery(displayQuery);
      }
    }
  }, []);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (onQueryChange) {
      onQueryChange(searchQuery);
    }
  }, [searchQuery, onQueryChange]);

  // Trigger search on debounced query change
  useEffect(() => {
    if (debouncedSearchQuery.trim() && debouncedSearchQuery.length >= 1) {
      const lowercaseQuery = debouncedSearchQuery.trim().toLowerCase();
      setLastSearchQuery(lowercaseQuery);
      router.push(`/pages/search?q=${encodeURIComponent(lowercaseQuery)}`);
      setIsSearchDropdownOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (debouncedSearchQuery.trim() === "") {
      setLastSearchQuery("");
      if (
        typeof window !== "undefined" &&
        window.location.pathname.includes("/pages/search")
      ) {
        router.push("/pages/search?q=");
      }
    }
  }, [debouncedSearchQuery, router]);

  useEffect(() => {
    if (forceDropdownOpen && !searchQuery.trim()) {
      setIsSearchDropdownOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else if (!forceDropdownOpen) {
      setIsSearchDropdownOpen(false);
    }
  }, [forceDropdownOpen, searchQuery]);

  const searchWords = Array.isArray(searchPlaceholder)
    ? searchPlaceholder
    : [searchPlaceholder];

  const animatedPlaceholder = useTypewriter({
    words: searchWords,
    typeSpeed: 80,
    deleteSpeed: 50,
    delayBetweenWords: 1000,
    loop: true,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (!value) {
      setSearchQuery("");
      setLastSearchQuery("");
      if (
        typeof window !== "undefined" &&
        window.location.pathname.includes("/pages/search")
      ) {
        router.push("/");
      }
      return;
    }

    const formattedValue =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setSearchQuery(formattedValue);
  };

  const handleSearchFocus = () => {
    if (forceDropdownOpen && !searchQuery.trim()) {
      setIsSearchDropdownOpen(true);
    } else if (
      !isMobile &&
      !disableAutoDropdown &&
      !searchQuery.trim() &&
      !preventOverlayOpen
    ) {
      setIsSearchDropdownOpen(true);
    }
    onFocus?.();
  };

  const handleSearchBlur = (event: React.FocusEvent) => {
    setTimeout(() => {
      setIsSearchDropdownOpen(false);
    }, 200);
    onBlur?.(event);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.trim().toLowerCase();
      setLastSearchQuery(lowercaseQuery);
      router.push(`/pages/search?q=${encodeURIComponent(lowercaseQuery)}`);
      setIsSearchDropdownOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const closeSearchDropdown = () => {
    setIsSearchDropdownOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLastSearchQuery("");
    if (window.location.pathname.includes("/pages/search")) {
      router.push("/");
    }
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit}>
        <input
          data-testid="header-search-input-container"
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchSubmit(e);
            }
          }}
          placeholder=" "
          aria-label="Search"
          autoComplete="off"
          className={`
              w-full outline-none transition-all duration-300 ease-in-out backdrop-blur-sm
              ${
                isMobile
                  ? "w-full text-black font-medium text-text-base py-3 pr-16 border  border-[#DDDDDD] rounded"
                  : "pt-[8px] pr-[60px] pb-[8px] h-[36px] border border-[#DDDDDD] rounded "
              }
              ${isSearchDropdownOpen ? "bg-white/20 " : "hover:bg-white/20"}
              placeholder:text-black text-xl
            `}
          style={{
            color: "#000000",
            paddingLeft: isMobile ? "42px" : "32px",
            paddingRight: searchQuery
              ? isMobile
                ? "80px"
                : "50px"
              : isMobile
                ? "50px"
                : "40px",
          }}
        />
        <button
          data-testid="header-search-button"
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          aria-label="Search"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
      {/* Custom placeholder overlay with formatting */}
      <div
        className={`
            absolute top-1/2 -translate-y-1/2 pointer-events-none text-sm text-gray-500
            ${isMobile ? "left-[54px]" : "left-[32px]"}
            ${searchQuery || isSearchDropdownOpen ? "opacity-0 invisible" : "opacity-100 visible"}
          `}
      >
        {lastSearchQuery ? (
          <span>{lastSearchQuery}</span>
        ) : (
          <span>{animatedPlaceholder}</span>
        )}
      </div>
      <SearchDropdown
        isOpen={isSearchDropdownOpen}
        onClose={closeSearchDropdown}
        searchQuery={searchQuery}
        topPosition={dropdownTopPosition}
        recommendedProductsSettings={recommendedProductsSettings}
        trendingSearchesSettings={trendingSearchesSettings}
      />
    </div>
  );
};
