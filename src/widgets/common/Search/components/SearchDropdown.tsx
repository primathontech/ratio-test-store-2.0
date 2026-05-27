"use client";

import React, { useEffect, useRef, useState } from "react";
import { RecommendedProducts } from "./RecommendedProducts";
import { TrendingSearches, type TrendingSearch } from "./TrendingSearches";

export interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
  trendingSearches?: TrendingSearch[];
  className?: string;
  /** Top offset for the mobile fixed dropdown (defaults to 60px — header height). */
  topPosition?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
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
}

/**
 * Pre-search dropdown: opens when the user focuses the header search input and
 * the query is empty. Shows popular collections + bestseller products.
 *
 * - Mobile (<768px): slides in from the left, max-height 70vh.
 * - Desktop (≥768px): absolute panel anchored to the trigger.
 */
export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  onClose,
  searchQuery = "",
  trendingSearches = [],
  className = "",
  topPosition = "60px",
  triggerRef,
  recommendedProductsSettings,
  trendingSearchesSettings,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hasSlid, setHasSlid] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef?.current?.contains(target)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isSearching = !!searchQuery.trim();

  return (
    <div ref={dropdownRef}>
      <style>{`
        @keyframes searchSlideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @media (max-width: 767px) {
          .search-mobile-slide {
            animation: searchSlideInFromLeft 0.3s ease-in-out forwards;
          }
        }
      `}</style>

      {/* Mobile (full-width, fixed below header) */}
      <div
        className={`md:hidden fixed left-0 right-0 bg-white border border-gray-200 shadow-[0_0_8px_rgba(0,0,0,0.15)] overflow-y-auto z-[22300] py-4 px-3 ${!hasSlid ? "search-mobile-slide" : ""} ${className}`}
        style={{
          top: topPosition,
          maxHeight: "70vh",
          width: "100vw",
          visibility: isSearching ? "hidden" : "visible",
        }}
        onAnimationEnd={() => setHasSlid(true)}
      >
        <TrendingSearches
          trendingSearches={trendingSearches}
          onClose={onClose}
          settings={trendingSearchesSettings}
        />
        <RecommendedProducts settings={recommendedProductsSettings} />
      </div>

      {/* Desktop (anchored to trigger, right-aligned) */}
      {!isSearching && (
        <div className="hidden md:block absolute bg-white overflow-hidden min-w-[580px] xl:min-w-[920px] z-[200] top-[calc(100%+2px)] max-h-[560px] min-h-[440px] shadow-[0_5px_20px_#8f959a99] right-[calc(10%-41px)]">
          <div className="py-4 px-3 max-h-[560px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[461px] max-w-full lg:max-w-[920px]">
            <TrendingSearches
              trendingSearches={trendingSearches}
              onClose={onClose}
              settings={trendingSearchesSettings}
            />
            <RecommendedProducts settings={recommendedProductsSettings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
