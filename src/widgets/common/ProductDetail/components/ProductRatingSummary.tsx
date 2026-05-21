"use client";

import React, { useEffect, useState } from "react";

import { getProductAverageRating } from "@/widgets/common/CustomerReviews/utils/get-review-api";

interface ProductRatingSummaryProps {
  productId: string | number;
  reviewsText?: string;
  onScrollToReviews?: () => void;
}

/**
 * Small client subcomponent that fetches the product's average rating
 * (same `/api/v1/review/:productId/average` endpoint that CustomerReviews
 * uses) and renders the compact "★ 4.5 ┃ 120 reviews" block on the PDP.
 *
 * Kept separate so the parent can drop it behind <Suspense> and so the
 * rating API call doesn't block the rest of the product info.
 */
export const ProductRatingSummary: React.FC<ProductRatingSummaryProps> = ({
  productId,
  reviewsText = "reviews",
  onScrollToReviews,
}) => {
  const [average, setAverage] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!productId) {
      return;
    }
    (async () => {
      try {
        const data = await getProductAverageRating(productId);
        if (cancelled || !data) {
          return;
        }
        setAverage(
          typeof data.average_rating === "number" ? data.average_rating : null
        );
        setTotal(
          typeof data.total_ratings === "number" ? data.total_ratings : null
        );
      } catch {
        // Silent — keep whatever fallback values are already set.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleClick = () => {
    onScrollToReviews?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onScrollToReviews?.();
    }
  };

  return (
    <div
      className="flex items-center gap-0.5 lg:justify-start !mt-0 mb-3 md:!mb-6"
      data-testid="bblunt-product-all-details-rating-section"
    >
      <svg
        className="w-[20px] h-[20px] flex-shrink-0 pr-0.5"
        fill="#FBC210"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 1.33L9.87 5.67L14.67 6.33L11.33 9.67L12 14.67L8 12L4 14.67L4.67 9.67L1.33 6.33L6.13 5.67L8 1.33Z" />
      </svg>
      <span
        className="font-medium text-sm md:text-base leading-[1.4em] cursor-pointer hover:opacity-70 transition-opacity text-primary"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Scroll to reviews section"
      >
        {average ?? "—"}
      </span>
      <span className="text-sm md:text-base font-medium mx-[2px] text-primary">
        ┃
      </span>
      <span
        className="text-[#3C4CFF] font-medium text-sm md:text-base leading-[1.4em] cursor-pointer hover:opacity-70 transition-opacity"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Scroll to reviews section"
      >
        {total ?? 0} {reviewsText}
      </span>
    </div>
  );
};

export const ProductRatingSummaryFallback: React.FC = () => (
  <div
    className="flex items-center gap-0.5 lg:justify-start !mt-0 mb-3 md:!mb-6 opacity-60"
    data-testid="bblunt-product-all-details-rating-section-fallback"
    aria-hidden="true"
  >
    <svg
      className="w-[20px] h-[20px] flex-shrink-0 pr-0.5"
      fill="#FBC210"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 1.33L9.87 5.67L14.67 6.33L11.33 9.67L12 14.67L8 12L4 14.67L4.67 9.67L1.33 6.33L6.13 5.67L8 1.33Z" />
    </svg>
    <span className="font-medium text-sm md:text-base leading-[1.4em] text-primary">
      —
    </span>
  </div>
);
