"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchResultsProps, TransformedProduct } from "../types";
import { sortProducts, DEFAULT_SORT_OPTIONS } from "../utils";
import { searchProducts } from "@/utils/searchService";
import { formatINR } from "@/utils/apiTransforms";
import { useProductRatings, normalizeProductId } from "@/hooks";
import {
  SearchProductCard,
  type SearchCardProduct,
} from "../components/ProductCard";
import "../../ProductGrid/style.css";
import "../style.css";

function toCardProduct(p: TransformedProduct): SearchCardProduct {
  const discount =
    p.compareAtPrice && p.compareAtPrice > p.price
      ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      : 0;

  return {
    id: p.id,
    name: p.title,
    // Deep-link to the product's variant (?variant=<id>) — same convention as
    // ProductMain / ProductGrid so the PDP opens on the variant shown here.
    url: p.variantId
      ? `/products/${p.handle}?variant=${p.variantId}`
      : `/products/${p.handle}`,
    handle: p.handle,
    image: { src: p.imageUrl || "", alt: p.title, width: 720, height: 720 },
    price: {
      current: formatINR(p.price),
      original:
        p.compareAtPrice && p.compareAtPrice > p.price
          ? formatINR(p.compareAtPrice)
          : "",
      savePercent: discount > 0 ? `${discount}%` : undefined,
    },
    available: p.available,
    _variantId: p.variantId,
    _priceAmount: p.price,
  };
}

export function V1({ settings, className }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("q") || "";

  const {
    showSorting = true,
    showResultsCount = true,
    sortOptions = DEFAULT_SORT_OPTIONS,
  } = settings || {};

  const [apiProducts, setApiProducts] = useState<TransformedProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const sortedProducts = useMemo(
    () => sortProducts(apiProducts, selectedSort),
    [apiProducts, selectedSort]
  );

  const productIds = useMemo(
    () => sortedProducts.map((p) => String(p.id)).filter(Boolean),
    [sortedProducts]
  );
  const { ratings } = useProductRatings(productIds);

  useEffect(() => {
    if (!urlSearchQuery || urlSearchQuery.trim() === "") {
      setApiProducts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await searchProducts(urlSearchQuery, 50, 1);
        setApiProducts(result.products);
      } catch (err) {
        setApiProducts([]);
        const msg =
          err instanceof Error ? err.message : "Failed to fetch search results";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [urlSearchQuery]);

  useEffect(() => {
    if (isSortModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSortModalOpen]);

  return (
    <div
      className={`search-results py-6 px-4 lg:px-12 xl:px-20 2xl:px-32 ${className || ""}`}
    >
      {/* ── Loading: skeleton grid ── */}
      {isLoading && <SkeletonGrid />}

      {/* ── Error ── */}
      {!isLoading && error && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#092a33"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
          </svg>
          <p className="text-[#092a33] font-medium">Something went wrong</p>
          <p className="text-gray-500 text-sm max-w-xs">
            We couldn&apos;t load results for &ldquo;{urlSearchQuery}&rdquo;.
            Please try again.
          </p>
        </div>
      )}

      {/* ── No query entered ── */}
      {!isLoading && !error && !urlSearchQuery && <EmptyQueryState />}

      {/* ── Results ── */}
      {!isLoading && !error && urlSearchQuery && (
        <>
          {/* Results bar */}
          <div className="flex items-center justify-between mb-5">
            {showResultsCount && (
              <p className="text-sm text-gray-500">
                {sortedProducts.length > 0 ? (
                  <>
                    <span className="font-semibold text-[#092a33]">
                      {sortedProducts.length}
                    </span>{" "}
                    result{sortedProducts.length !== 1 ? "s" : ""} for{" "}
                    <span className="font-semibold text-[#092a33]">
                      &ldquo;{urlSearchQuery}&rdquo;
                    </span>
                  </>
                ) : null}
              </p>
            )}

            {/* Sort */}
            {showSorting && sortedProducts.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500">Sort by</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-sm text-[#092a33] font-medium focus:outline-none focus:ring-2 focus:ring-[#092a33]/20 focus:border-[#092a33] transition-colors"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Product grid — same card style as collections page */}
          {sortedProducts.length > 0 && (
            <div className="mb-24 lg:mb-8">
              <div className="nintara-pg" style={{ marginBottom: 0 }}>
                <div className="nintara-pg__grid" style={{ margin: 0 }}>
                  {sortedProducts.map((product) => {
                    const card = toCardProduct(product);
                    const live =
                      ratings[normalizeProductId(String(product.id))];
                    if (live) {
                      card.rating = {
                        score: live.score,
                        reviewCount: live.reviewCount,
                      };
                    }
                    return (
                      <SearchProductCard key={product.id} product={card} />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {sortedProducts.length === 0 && (
            <NoResultsState query={urlSearchQuery} />
          )}
        </>
      )}

      {/* Mobile sort trigger */}
      {showSorting && sortedProducts.length > 0 && (
        <div className="hidden fixed bottom-20 left-0 right-0 z-30 px-4 pb-2">
          <button
            onClick={() => setIsSortModalOpen(true)}
            className="w-full py-3 px-4 bg-[#092a33] text-white font-medium flex items-center justify-center gap-2 text-sm rounded-xl shadow-lg"
          >
            <SortIcon />
            Sort by:{" "}
            {sortOptions.find((o) => o.value === selectedSort)?.label ??
              "Relevance"}
          </button>
        </div>
      )}

      {/* Mobile sort sheet */}
      {showSorting && isSortModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <button
            onClick={() => setIsSortModalOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close sort modal"
          />
          <div className="relative w-full bg-white rounded-t-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-[#092a33]">
                Sort by
              </h3>
              <button
                onClick={() => setIsSortModalOpen(false)}
                aria-label="Close"
                className="p-1"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13 1L1 13M1 1L13 13"
                    stroke="#092a33"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="py-2 pb-8">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedSort(option.value);
                    setIsSortModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm transition-colors ${
                    selectedSort === option.value
                      ? "text-[#092a33] font-semibold bg-[#092a33]/5"
                      : "text-gray-600"
                  }`}
                >
                  {option.label}
                  {selectedSort === option.value && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="#092a33"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Skeleton loading grid ── */
function SkeletonGrid() {
  return (
    <div className="grid gap-3 lg:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden"
        >
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4 mx-auto" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2 mx-auto mt-1" />
            <div className="h-9 bg-gray-100 rounded-lg animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Empty query state ── */
function EmptyQueryState() {
  return (
    <div className="flex flex-col items-center py-20 gap-4 text-center">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#092a33]/8 flex items-center justify-center">
        <svg
          className="w-14 h-14 md:w-16 md:h-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#092a33"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </div>
      <div className="space-y-2">
        <p className="text-[#092a33] font-semibold text-3xl md:text-3xl">
          Search our products
        </p>
        <p className="text-gray-500 text-lg md:text-lg max-w-sm md:max-w-md mx-auto">
          Type a product name in the search bar above
        </p>
      </div>
    </div>
  );
}

/* ── No results state ── */
function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center py-16 md:py-32 gap-7 text-center">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#092a33]/8 flex items-center justify-center">
        <svg
          className="w-14 h-14 md:w-16 md:h-16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#092a33"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          <path d="M8 11h6M11 8v6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="space-y-3">
        <p className="text-[#092a33] font-bold text-3xl md:text-3xl">
          No results found
        </p>
        <p className="text-gray-500 text-lg md:text-lg max-w-[85vw] md:max-w-md mx-auto leading-relaxed">
          We couldn&apos;t find anything for{" "}
          <span className="font-semibold text-[#092a33]">
            &ldquo;{query}&rdquo;
          </span>
          .
          <br />
          Try different keywords or browse our categories.
        </p>
      </div>
      <Link
        href="/collections/shop-all"
        className="mt-1 max-[650px]:w-[85vw] min-[651px]:w-auto px-10 py-4 min-[651px]:px-20 bg-[#092a33] text-white text-lg md:text-xl font-semibold rounded-xl hover:bg-[#0b3640] transition-colors"
      >
        Browse all products
      </Link>
    </div>
  );
}

/* ── Sort icon ── */
function SortIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 7H5l3-4zM5 9h6l-3 4z" />
    </svg>
  );
}
