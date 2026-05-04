"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { POPULAR_PRODUCTS } from "../constants/search-constants";

export interface TrendingSearch {
  id: string;
  label: string;
  href: string;
}

export interface TrendingSearchesProps {
  trendingSearches?: TrendingSearch[];
  onClose: () => void;
  className?: string;
  settings?: {
    title?: string;
  };
}

/**
 * Renders a row of "popular choices" buttons. Sources from POPULAR_PRODUCTS
 * constant — no API. Buttons navigate to /collections/{handle} and close the
 * parent dropdown/overlay.
 */
export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  trendingSearches,
  onClose,
  settings = {},
  className = "",
}) => {
  const router = useRouter();

  const display = useMemo<TrendingSearch[]>(() => {
    if (trendingSearches && trendingSearches.length > 0) {
      return trendingSearches;
    }
    return POPULAR_PRODUCTS.map((p, i) => ({
      id: `trending-${i + 1}`,
      label: p.label,
      href: `/collections/${p.collectionHandle}`,
    }));
  }, [trendingSearches]);

  if (display.length === 0) {
    return null;
  }

  return (
    <div className={`mb-[5px] ${className}`}>
      <p className="text-[14px] font-[700] text-black mb-[8px] flex items-center tracking-[0.6px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[18px] mr-[7px]"
          viewBox="0 0 48 48"
          fill="#4F1136"
          aria-hidden="true"
        >
          <path d="M32 12l4.59 4.59-9.76 9.75-8-8-14.83 14.83 2.83 2.83 12-12 8 8 12.58-12.59 4.59 4.59v-12z" />
          <path d="M0 0h48v48h-48z" fill="none" />
        </svg>
        {settings.title || "POPULAR CHOICES"}
      </p>
      <div className="flex flex-wrap ml-[6px]">
        {display.map((search) => (
          <button
            key={search.id}
            type="button"
            onClick={() => {
              onClose();
              router.push(search.href);
            }}
            className="px-[10px] pt-[6px] pb-[4px] text-[14px] text-white bg-[#000000] transition-colors duration-200 text-center rounded-[4px] font-[500] whitespace-nowrap flex items-center mx-[5px] mb-[10px] leading-9"
          >
            {search.label}
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="white"
              className="ml-[10px]"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3.75 11.25h14.695l-6.977-6.976a.748.748 0 010-1.056.749.749 0 011.056 0l8.214 8.212A.745.745 0 0121 12a.745.745 0 01-.262.57l-8.214 8.212a.75.75 0 01-1.056 0 .748.748 0 010-1.056l6.977-6.976H3.75a.75.75 0 010-1.5"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;
