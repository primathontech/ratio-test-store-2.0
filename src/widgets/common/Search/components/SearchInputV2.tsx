"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTypewriter } from "../hooks/useTypewriter";
import SearchDropdown from "./SearchDropdown";

/**
 * SearchInputV2
 *
 * Ported from the BBLUNT V2 reference Header (docs/V2/components/SearchInput.tsx).
 * Used inside the mobile fullscreen search overlay rendered by the Header.
 * Handles its own typewriter placeholder, URL initialisation, debounced submit
 * (→ /pages/searchtap-search?q=…), and cross-page sessionStorage handshake.
 */

interface SearchInputV2Props {
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
  renderDropdown?: boolean;
}

const SEARCH_RESULTS_ROUTE = "/pages/searchtap-search";

export const SearchInputV2: React.FC<SearchInputV2Props> = ({
  searchPlaceholder = ["Search For Sunscreen"],
  className = "",
  isMobile = false,
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
  renderDropdown = true,
}) => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedFromUrl = useRef(false);

  // Initialise from URL: `?q=...` populates the input + parks caret at end;
  // `?openSearch=true` opens the dropdown.
  useEffect(() => {
    if (hasInitializedFromUrl.current) {
      return;
    }
    hasInitializedFromUrl.current = true;
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const openSearch = params.get("openSearch");

    if (q) {
      const decoded = decodeURIComponent(q).trim();
      if (decoded) {
        const displayQuery =
          decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
        setSearchQuery(displayQuery);
        setLastSearchQuery(displayQuery);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else if (openSearch === "true") {
      setIsSearchDropdownOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("openSearch");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, []);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (onQueryChange) {
      onQueryChange(searchQuery);
    }
  }, [searchQuery, onQueryChange]);

  const storeReferrer = () => {
    if (typeof window === "undefined") {
      return;
    }
    const currentPath = window.location.pathname;
    if (currentPath.includes(SEARCH_RESULTS_ROUTE)) {
      return;
    }
    try {
      sessionStorage.setItem("search:referrer", currentPath);
    } catch {
      // Session storage not available — silently skip.
    }
  };

  // Debounced auto-submit on typing.
  useEffect(() => {
    if (debouncedSearchQuery.trim() && debouncedSearchQuery.length >= 1) {
      const lowercaseQuery = debouncedSearchQuery.trim().toLowerCase();
      setLastSearchQuery(lowercaseQuery);
      storeReferrer();
      router.push(
        `${SEARCH_RESULTS_ROUTE}?q=${encodeURIComponent(lowercaseQuery)}`
      );
      setIsSearchDropdownOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, router, isMobile]);

  // Honour `forceDropdownOpen` when query is empty.
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
    const prevValue = searchQuery;

    let nextValue = value;
    if (nextValue.trim()) {
      nextValue = nextValue.charAt(0).toUpperCase() + nextValue.slice(1);
    }

    setSearchQuery(nextValue);

    if (onQueryChange) {
      onQueryChange(nextValue);
    }

    // User cleared the input — bounce back to the referrer page.
    if (
      prevValue.trim().length > 0 &&
      nextValue.length === 0 &&
      typeof window !== "undefined"
    ) {
      const currentPath = window.location.pathname;
      const referrerPage = sessionStorage.getItem("search:referrer") || "/";
      const doRedirect = () => {
        if (currentPath.includes(SEARCH_RESULTS_ROUTE)) {
          sessionStorage.removeItem("search:referrer");
          if (isMobile) {
            try {
              sessionStorage.setItem("openMobileSearchOverlay", "true");
            } catch {
              /* ignore */
            }
            router.push(referrerPage);
          } else {
            router.push(`${referrerPage}?openSearch=true`);
            setIsSearchDropdownOpen(true);
          }
        } else {
          if (isMobile) {
            try {
              sessionStorage.setItem("openMobileSearchOverlay", "true");
            } catch {
              /* ignore */
            }
            router.push(currentPath);
          } else {
            router.push(`${currentPath}?openSearch=true`);
            setIsSearchDropdownOpen(true);
          }
        }
      };
      setTimeout(doRedirect, 0);
      return;
    }
    if (nextValue.trim() && isSearchDropdownOpen) {
      setIsSearchDropdownOpen(false);
    }

    if (forceDropdownOpen && !nextValue.trim() && prevValue.trim()) {
      setIsSearchDropdownOpen(true);
    }
    if (
      !isMobile &&
      !disableAutoDropdown &&
      !nextValue.trim() &&
      !prevValue.trim() &&
      !isSearchDropdownOpen &&
      !forceDropdownOpen
    ) {
      setIsSearchDropdownOpen(true);
    }
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
      router.push(
        `${SEARCH_RESULTS_ROUTE}?q=${encodeURIComponent(lowercaseQuery)}`
      );
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

  return (
    <div
      className="relative"
      ref={searchContainerRef}
      data-testid="header-search-component"
    >
      <form
        onSubmit={handleSearchSubmit}
        data-testid="header-search-input-wrapper"
      >
        <input
          data-testid="header-search-input-container"
          ref={inputRef}
          type="search"
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
          placeholder={isMobile ? " " : animatedPlaceholder}
          aria-label="Search"
          autoComplete="off"
          autoFocus={isMobile}
          className={`
            w-full outline-none transition-all duration-300 ease-in-out
            [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden
            ${
              isMobile
                ? "h-10 rounded-[4px] text-[16px] font-bold pl-12 pr-14 placeholder:text-lightest-gray placeholder:font-normal"
                : "h-[35px] min-h-[35px] rounded text-sm font-bold pt-2 pb-2 pl-[33px] pr-[60px] text-[#727272] placeholder:text-surface placeholder:font-medium border border-[#dddddd]"
            }
            ${isSearchDropdownOpen ? "bg-white/20" : "!bg-transparent hover:!bg-white/20"}
            ${className}
          `.trim()}
          style={
            isMobile
              ? {
                  color: "#727272",
                  borderColor: "#DDDDDD",
                }
              : undefined
          }
        />
        <button
          data-testid="header-search-button"
          type="submit"
          className={`absolute top-1/2 transform -translate-y-1/2 text-black ${isMobile ? "left-4" : "left-[12px]"}`}
          aria-label="Search"
        >
          {isMobile ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-[20px] w-[20px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12.1012 12.2113L14.9997 15.0189M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
                stroke="#000000"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </form>

      {/* Custom placeholder overlay (mobile only) — shows the typewriter words
          OR the last submitted query as a hint when the input is empty. The
          desktop variant uses the native `placeholder` attribute instead. */}
      {isMobile && (
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 pointer-events-none text-[16px]
            left-12
            ${searchQuery ? "opacity-0 invisible" : "opacity-100 visible"}
          `.trim()}
          style={{ color: "#727272" }}
        >
          {lastSearchQuery ? (
            <span className="font-normal">"{lastSearchQuery}"</span>
          ) : animatedPlaceholder ? (
            (() => {
              const match = animatedPlaceholder.match(/Search for (.+)/);
              if (match) {
                return (
                  <>
                    Search for <span className="font-normal">"{match[1]}"</span>
                  </>
                );
              }
              return animatedPlaceholder;
            })()
          ) : null}
        </div>
      )}

      {renderDropdown && (
        <SearchDropdown
          isOpen={isSearchDropdownOpen}
          onClose={closeSearchDropdown}
          searchQuery={searchQuery}
          topPosition={dropdownTopPosition}
          recommendedProductsSettings={recommendedProductsSettings}
          trendingSearchesSettings={trendingSearchesSettings}
          triggerRef={searchContainerRef}
        />
      )}
    </div>
  );
};

export default SearchInputV2;
