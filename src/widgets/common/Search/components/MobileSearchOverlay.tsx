"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { RecommendedProducts } from "./RecommendedProducts";
import { TrendingSearches } from "./TrendingSearches";
import { useDebounce } from "@/hooks/useDebounce";

export interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  /** Route pattern for typed queries. {q} is replaced with the encoded query. */
  searchRoutePattern?: string;
}

/**
 * Full-screen mobile search overlay. Mounted at the bottom of the Header tree.
 * Contains its own search input + close button, plus the pre-search sections
 * (popular choices + recommended products).
 *
 * Hidden on desktop — the desktop flow uses SearchDropdown anchored to the
 * header input instead.
 */
export const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen,
  onClose,
  placeholder = "Search",
  searchRoutePattern = "/search?q={q}",
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Autofocus the input when the overlay opens + lock body scroll.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Reset the query whenever the overlay closes.
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const submitQuery = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    onClose();
    router.push(searchRoutePattern.replace("{q}", encodeURIComponent(trimmed)));
  };

  // Auto-fire after the user pauses typing. Pressing Enter still calls
  // `submitQuery` immediately and skips this wait.
  const SEARCH_DEBOUNCE_MS = 300;
  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);
  const lastNavigatedQueryRef = useRef<string>("");

  useEffect(() => {
    if (!isOpen) {
      lastNavigatedQueryRef.current = "";
      return;
    }
    if (!debouncedQuery) {
      return;
    }
    if (debouncedQuery === lastNavigatedQueryRef.current) {
      return;
    }
    lastNavigatedQueryRef.current = debouncedQuery;
    onClose();
    router.push(
      searchRoutePattern.replace("{q}", encodeURIComponent(debouncedQuery))
    );
  }, [debouncedQuery, isOpen, onClose, router, searchRoutePattern]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-white z-[22400] flex flex-col min-[1100px]:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Search bar */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#E5E5E5]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <path
            d="M12.1012 12.2113L14.9997 15.0189M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
            stroke="#000000"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitQuery();
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-w-0 h-9 text-base text-primary placeholder:text-surface bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-black"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* While the user is typing we hide the default sections — the typed
            flow belongs to the results page. */}
        {query.trim() ? null : (
          <>
            <TrendingSearches onClose={onClose} />
            <RecommendedProducts />
          </>
        )}
      </div>
    </div>
  );
};

export default MobileSearchOverlay;
