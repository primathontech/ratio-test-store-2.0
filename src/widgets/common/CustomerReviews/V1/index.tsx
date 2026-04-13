"use client";

import React, { memo, useState, useMemo, useCallback, useEffect } from "react";
import { CustomerReviewsProps, ReviewItem, ApiReviewAverage } from "../types";
import { ReviewSortBy } from "@/widgets/common/ProductDetail/types";
import {
  fetchReviewAverage,
  fetchReviewsList,
  transformApiReview,
  REVIEWS_PER_PAGE,
} from "@/utils/reviews-service";

/* ------------------------------------------------------------------ */
/*  Star icon (filled/empty)                                           */
/* ------------------------------------------------------------------ */

const StarIcon = ({
  filled,
  size = 12,
}: {
  filled: boolean;
  size?: number;
}) => (
  <span
    className="inline-block"
    style={{
      color: filled ? "#fbc210" : "#e0e0e0",
      fontSize: `${size}px`,
      lineHeight: 1,
      letterSpacing: "2px",
    }}
    aria-hidden="true"
  >
    &#9733;
  </span>
);

const StarRating = ({
  rating,
  size = 12,
}: {
  rating: number;
  size?: number;
}) => (
  <span
    className="inline-flex items-center"
    role="img"
    aria-label={`${rating} star rating`}
  >
    {[1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i} filled={i <= rating} size={size} />
    ))}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Verified buyer badge                                               */
/* ------------------------------------------------------------------ */

const VerifiedBadge = () => (
  <span
    className={[
      "inline-block",
      "px-[6px] py-[2px]",
      "bg-[#000000] text-[#ffffff]",
      "text-[10px] leading-[12px]",
      "font-[Gotham,sans-serif] font-[400]",
      "rounded-[2px]",
      "ml-[8px]",
      "align-middle",
    ].join(" ")}
  >
    Verified
  </span>
);

/* ------------------------------------------------------------------ */
/*  Author avatar circle                                               */
/* ------------------------------------------------------------------ */

const AuthorAvatar = ({ name }: { name: string }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "w-[36px] h-[36px]",
        "rounded-[9999px]",
        "bg-[rgba(224,224,224,0.5)]",
        "text-[12px] font-[500]",
        "text-[#333333]",
        "shrink-0",
        "mr-[8px]",
      ].join(" ")}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Single review card                                                 */
/* ------------------------------------------------------------------ */

const ReviewCard = memo(function ReviewCard({
  review,
}: {
  review: ReviewItem;
}) {
  return (
    <div
      className={[
        "bg-[#ffffff]",
        "p-[16px]",
        "text-[12px] leading-[17px]",
        "font-[Gotham,sans-serif]",
        "text-[#333333]",
        "border-t border-[rgba(29,29,29,0.12)]",
      ].join(" ")}
    >
      {/* Rating row + date */}
      <div className="flex items-center justify-between mb-[8px]">
        <StarRating rating={review.rating} size={12} />
        <span className="text-[12px] text-[#7b7b7b]">{review.date}</span>
      </div>

      {/* Author row */}
      <div className="flex items-center mb-[10px]">
        <AuthorAvatar name={review.author} />
        <span className="text-[12px] text-[#000000]">{review.author}</span>
        {review.verifiedBuyer && <VerifiedBadge />}
      </div>

      {/* Title */}
      {review.title && (
        <b className="block text-[12px] font-[700] text-[#333333] mb-[8px]">
          {review.title}
        </b>
      )}

      {/* Body */}
      <p className="text-[12px] text-[#333333] leading-[17px] m-0">
        {review.body}
      </p>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Chevron icon for pagination                                        */
/* ------------------------------------------------------------------ */

const ChevronRight = () => (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    fill="none"
    className="inline-block"
  >
    <path
      d="M1.5 1L6.5 6L1.5 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDoubleRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className="inline-block"
  >
    <path
      d="M1 1L6 6L1 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 1L11 6L6 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Sort dropdown arrow                                                */
/* ------------------------------------------------------------------ */

const SortDropdownArrow = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    className="ml-[4px] inline-block"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

const ReviewSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-[#f4f6f8] rounded-[8px] p-[16px]">
          <div className="h-[12px] bg-[#e0e0e0] rounded w-[60%] mb-[12px]" />
          <div className="h-[12px] bg-[#e0e0e0] rounded w-[40%] mb-[8px]" />
          <div className="h-[12px] bg-[#e0e0e0] rounded w-[80%]" />
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: CustomerReviewsProps) {
  const product = data?.success ? data.data : null;
  const productId = product?.id;

  const title = settings?.title ?? "Customer Reviews";
  const perPage = settings?.perPage ?? REVIEWS_PER_PAGE;
  const sortOptions = settings?.sortOptions ?? [
    { label: "Most Recent", value: ReviewSortBy.NEWEST },
    { label: "Highest Rating", value: ReviewSortBy.HIGHEST },
    { label: "Lowest Rating", value: ReviewSortBy.LOWEST },
  ];
  const defaultSort = settings?.defaultSort ?? ReviewSortBy.NEWEST;

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [isLoading, setIsLoading] = useState(false);

  // API state
  const [apiAverage, setApiAverage] = useState<ApiReviewAverage | null>(null);
  const [apiReviews, setApiReviews] = useState<ReviewItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch review average when product ID is available
  useEffect(() => {
    if (!productId) {
      return;
    }
    let cancelled = false;

    fetchReviewAverage(productId).then((avg) => {
      if (cancelled) {
        return;
      }
      if (avg) {
        setApiAverage(avg);
        setTotalReviewCount(avg.total_reviews || 0);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Fetch reviews list when product ID, page, or sort changes
  useEffect(() => {
    if (!productId) {
      return;
    }
    let cancelled = false;

    setIsLoading(true);
    fetchReviewsList(productId, currentPage, perPage, sortBy).then((res) => {
      if (cancelled) {
        return;
      }
      setIsLoading(false);
      setHasFetched(true);
      if (res?.success && res.data) {
        setApiReviews(res.data.reviews.map(transformApiReview));
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalReviewCount((prev) => res.data.pagination?.total ?? prev);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [productId, currentPage, perPage, sortBy]);

  // Determine display values
  const averageRating =
    apiAverage?.average_rating ?? settings?.averageRating ?? 0;
  const totalReviews = totalReviewCount || settings?.totalReviews || 0;

  // Use API reviews if available, else settings fallback
  const settingsReviews = settings?.reviews ?? [];
  const reviews = hasFetched ? apiReviews : settingsReviews;

  // For static reviews (no API), do client-side pagination
  const staticSorted = useMemo(() => {
    if (hasFetched) {
      return reviews;
    }
    const arr = [...reviews];
    switch (sortBy) {
      case ReviewSortBy.HIGHEST:
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case ReviewSortBy.LOWEST:
        arr.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    return arr;
  }, [reviews, sortBy, hasFetched]);

  const staticTotalPages = hasFetched
    ? totalPages
    : Math.max(1, Math.ceil(staticSorted.length / perPage));

  const displayReviews = hasFetched
    ? reviews
    : staticSorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const displayTotalPages = hasFetched ? totalPages : staticTotalPages;

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= displayTotalPages) {
        setCurrentPage(page);
      }
    },
    [displayTotalPages]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  // Hide widget when no product ID and no static reviews
  if (!productId && !settingsReviews.length) {
    return null;
  }

  return (
    <section
      className={[
        "w-full",
        "px-[15px] md:px-[30px] lg:px-[50px]",
        "py-0",
        "font-[Gotham,sans-serif]",
        "text-[#1d1d1d]",
      ].join(" ")}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* ----- Header card with summary + write a review ----- */}
        <div
          className={[
            "bg-[#ffffff]",
            "rounded-[10px]",
            "shadow-[0px_4px_16px_rgba(0,0,0,0.1)]",
            "pt-[24px] pb-[16px] px-[16px]",
            "text-center",
            "mb-0",
          ].join(" ")}
        >
          {/* Title */}
          <h2
            className={[
              "text-[12px] leading-[17px]",
              "font-[400]",
              "text-[#333333]",
              "mb-[24px]",
              "m-0",
            ].join(" ")}
          >
            {title}
          </h2>

          {/* Stars + summary row + Write a review */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-[12px] md:gap-0 pb-[24px]">
            {/* Star summary */}
            <div className="flex flex-col md:flex-row items-center md:mr-[16px]">
              <div className="flex items-center">
                <StarRating rating={Math.round(averageRating)} size={14} />
                <span className="text-[12px] text-[#333333] ml-[8px]">
                  {Number(averageRating).toFixed(2)} out of 5
                </span>
              </div>
              <span className="text-[12px] text-[#333333] md:ml-[8px] mt-[4px] md:mt-0">
                Based on {totalReviews} reviews
              </span>
            </div>

            {/* Write a review button */}
            <button
              type="button"
              className={[
                "bg-[#000000] text-[#ffffff]",
                "text-[12px] font-[700] leading-[16px]",
                "py-[10px] px-[20px]",
                "rounded-[25px]",
                "border-0 cursor-pointer",
                "mx-[50px]",
                "hover:bg-[#333333]",
                "transition-colors duration-200",
              ].join(" ")}
              aria-label="Write a review"
            >
              Write a review
            </button>
          </div>
        </div>

        {/* ----- Sort bar ----- */}
        <div
          className={[
            "bg-[#ffffff]",
            "rounded-[10px]",
            "shadow-[0px_4px_16px_rgba(0,0,0,0.1)]",
            "mt-[24px] mb-[24px]",
            "px-[16px] py-[8px]",
          ].join(" ")}
        >
          <div className="flex items-center">
            <div className="inline-flex items-center relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className={[
                  "appearance-none",
                  "bg-transparent border-0",
                  "text-[12px] text-[#636e6e]",
                  "font-[Gotham,sans-serif]",
                  "pr-[20px] py-[10px]",
                  "cursor-pointer",
                  "outline-none",
                ].join(" ")}
                aria-label="Sort reviews"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#636e6e]">
                <SortDropdownArrow />
              </span>
            </div>
          </div>
        </div>

        {/* ----- Reviews grid ----- */}
        {isLoading ? (
          <ReviewSkeleton />
        ) : (
          <div
            className={[
              "grid",
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              "gap-[16px]",
            ].join(" ")}
          >
            {displayReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* ----- Pagination ----- */}
        {displayTotalPages > 1 && (
          <div className="flex items-center justify-center pt-[16px] pb-[16px] gap-[4px]">
            {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  className={[
                    "inline-flex items-center justify-center",
                    "min-w-[32px] h-[20px]",
                    "px-[8px] py-[4px]",
                    "text-[12px]",
                    "border-0 bg-transparent cursor-pointer",
                    "font-[Gotham,sans-serif]",
                    currentPage === page
                      ? "text-[#000000] font-[700]"
                      : "text-[#636e6e] font-[400]",
                    "hover:text-[#000000]",
                    "transition-colors duration-150",
                  ].join(" ")}
                >
                  {page}
                </button>
              )
            )}
            {currentPage < displayTotalPages && (
              <>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-label={`Page ${currentPage + 1}`}
                  className={[
                    "inline-flex items-center justify-center",
                    "w-[20px] h-[20px]",
                    "px-[4px] py-[4px]",
                    "border-0 bg-transparent cursor-pointer",
                    "text-[#636e6e]",
                    "hover:text-[#000000]",
                    "transition-colors duration-150",
                  ].join(" ")}
                >
                  <ChevronRight />
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(displayTotalPages)}
                  aria-label={`Page ${displayTotalPages}`}
                  className={[
                    "inline-flex items-center justify-center",
                    "w-[20px] h-[20px]",
                    "px-[4px] py-[4px]",
                    "border-0 bg-transparent cursor-pointer",
                    "text-[#636e6e]",
                    "hover:text-[#000000]",
                    "transition-colors duration-150",
                  ].join(" ")}
                >
                  <ChevronDoubleRight />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
});
