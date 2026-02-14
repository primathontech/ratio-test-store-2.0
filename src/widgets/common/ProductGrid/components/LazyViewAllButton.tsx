"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { OverlappingProductImages } from "../common/OverlappingProductImages";
import { useCollectionData } from "../hooks/useCollectionData";

interface LazyViewAllButtonProps {
  serverCollectionHandle: string;
  configCollectionHandle?: string;
  serverTotalProductCount: number;
  viewAllButtonText: string;
  productsToDisplay: any[];
  sectionTextStyle: React.CSSProperties;
  isBackgroundImage: boolean;
}

/**
 * Lazy View All Button Component
 * Implements conditional redirect logic with lazy client-side fetching
 */
function LazyViewAllButtonContent({
  serverCollectionHandle,
  configCollectionHandle,
  serverTotalProductCount,
  viewAllButtonText,
  productsToDisplay,
  sectionTextStyle,
  isBackgroundImage,
}: LazyViewAllButtonProps) {
  const { collectionData, isLoading, fetchCollectionData } =
    useCollectionData();
  const [shouldFetch, setShouldFetch] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Determine if handles match
  const handlesMatch = serverCollectionHandle === configCollectionHandle;

  // Determine redirect URL and total products
  const redirectUrl = handlesMatch
    ? `/collections/${serverCollectionHandle}`
    : `/collections/${configCollectionHandle}`;

  const totalProducts = handlesMatch
    ? serverTotalProductCount
    : collectionData?.meta?.total || 0;

  const displayProducts = handlesMatch
    ? productsToDisplay
    : collectionData?.products?.slice(0, 3) || [];

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!observerRef.current || handlesMatch) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !shouldFetch) {
          setShouldFetch(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handlesMatch, shouldFetch]);

  // Fetch collection data when needed
  useEffect(() => {
    if (shouldFetch && !handlesMatch && configCollectionHandle) {
      fetchCollectionData(configCollectionHandle);
    }
  }, [shouldFetch, handlesMatch, configCollectionHandle, fetchCollectionData]);

  return (
    <div ref={observerRef}>
      <Link
        href={redirectUrl}
        data-testid="product-grid-v2-view-all-button"
        className={`max-w-[328px] md:w-fit mx-auto flex items-center gap-[1.6rem] justify-center mt-[24px] text-text-base font-medium py-2 md:px-[5.6rem] md:py-[0.7rem] rounded-[4px] backdrop-blur-2xl ${
          isBackgroundImage ? "bg-[#1D1D1D]" : "bg-[#F4F6F8]"
        }`}
        style={sectionTextStyle}
      >
        {/* Show loading state for overlapping images when fetching */}
        {!handlesMatch && isLoading ? (
          <div className="flex-shrink-0 w-[60px] h-[24px] bg-gray-200 animate-pulse rounded" />
        ) : (
          <OverlappingProductImages
            products={displayProducts}
            className="flex-shrink-0"
          />
        )}

        <span
          data-testid="product-grid-v2-view-all-text"
          className="inline-flex gap-1 items-baseline font-medium"
        >
          <span className="whitespace-nowrap">
            {viewAllButtonText}{" "}
            {!handlesMatch && isLoading ? (
              <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded" />
            ) : (
              totalProducts > 0 && `${totalProducts} products`
            )}
          </span>
          <span className="size-[12px]" style={sectionTextStyle}>
            <ChevronRightIcon stroke={sectionTextStyle.color as string} />
          </span>
        </span>
      </Link>
    </div>
  );
}

/**
 * Suspense wrapper for the lazy view all button
 */
function LazyViewAllButtonFallback({
  sectionTextStyle,
  isBackgroundImage,
  viewAllButtonText,
}: {
  sectionTextStyle: React.CSSProperties;
  isBackgroundImage: boolean;
  viewAllButtonText: string;
}) {
  return (
    <div
      className={`max-w-[328px] md:w-fit mx-auto flex items-center gap-[1.6rem] justify-center mt-[24px] text-text-base font-medium py-2 md:px-[5.6rem] md:py-[0.7rem] rounded-[4px] backdrop-blur-2xl ${
        isBackgroundImage ? "bg-[#1D1D1D]" : "bg-[#F4F6F8]"
      }`}
      style={sectionTextStyle}
    >
      <div className="flex-shrink-0 w-[60px] h-[24px] bg-gray-200 animate-pulse rounded" />
      <span className="inline-flex gap-1 items-baseline font-medium">
        <span className="whitespace-nowrap">
          {viewAllButtonText}{" "}
          <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded" />
        </span>
        <span className="size-[12px]" style={sectionTextStyle}>
          <ChevronRightIcon stroke={sectionTextStyle.color as string} />
        </span>
      </span>
    </div>
  );
}

export function LazyViewAllButton(props: LazyViewAllButtonProps) {
  return (
    <Suspense
      fallback={
        <LazyViewAllButtonFallback
          sectionTextStyle={props.sectionTextStyle}
          isBackgroundImage={props.isBackgroundImage}
          viewAllButtonText={props.viewAllButtonText}
        />
      }
    >
      <LazyViewAllButtonContent {...props} />
    </Suspense>
  );
}
