"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  CustomerReviewsProps,
  HistogramEntry,
  SortOption,
  DEFAULT_HEADING,
  DEFAULT_SORT_OPTIONS,
} from "../types";
import {
  getProductAverageRating,
  resolveProductIdFromHandle,
  transformRatingBreakdown,
} from "@/utils/get-review-api";
import { useAuth } from "@shopkit/core/context";
import { handleKwikpassLogin } from "@/integrations/kwikpass-custom";
import { ReviewFormCustom } from "../components/ReviewFormCustom";
import ReviewsListCustom from "../components/ReviewListCustom";
import "../style.css";

/**
 * Render filled/half/empty star SVGs for a given rating
 */
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="nintara-cr__star nintara-cr__star--on"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="nintara-cr__star nintara-cr__star--half"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={"halfGrad-" + i}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e0e0e0" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={"url(#halfGrad-" + i + ")"}
          />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="nintara-cr__star nintara-cr__star--off"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
  }
  return (
    <span
      className="nintara-cr__stars"
      role="img"
      aria-label={rating + " out of 5 stars"}
    >
      {stars}
    </span>
  );
}

/**
 * Histogram bar row component
 */
function HistogramRow({
  entry,
  animated,
}: {
  entry: HistogramEntry;
  animated: boolean;
}) {
  return (
    <div
      className="nintara-cr__histogram-row"
      role="button"
      tabIndex={entry.count > 0 ? 0 : -1}
      aria-label={entry.stars + " stars, " + entry.count + " reviews"}
    >
      <span className="nintara-cr__histogram-label">
        {entry.stars}{" "}
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="nintara-cr__star nintara-cr__star--on"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </span>
      <div className="nintara-cr__histogram-bar" aria-hidden="true">
        <div
          className="nintara-cr__histogram-fill"
          style={{
            width: animated ? entry.percentage + "%" : "0%",
          }}
        />
      </div>
      <span className="nintara-cr__histogram-count">{entry.count}</span>
    </div>
  );
}

/**
 * CustomerReviews V1 — API-driven version
 *
 * Fetches live reviews and rating data from the GoKwik custom backend.
 * Falls back to static defaults if the API is unavailable.
 * Keeps the original nintarababy Judge.me design with summary + histogram + review list.
 */
export function V1({ data, settings, className }: CustomerReviewsProps) {
  const heading = data?.heading ?? settings?.heading ?? DEFAULT_HEADING;
  const sortOptions =
    (Array.isArray(data?.sortOptions) && data!.sortOptions!.length > 0
      ? data!.sortOptions!
      : null) ??
    settings?.sortOptions ??
    DEFAULT_SORT_OPTIONS;

  // Extract productId from widget data or resolve from URL handle via BFF
  const dataProductId = useMemo(() => {
    const raw = data as Record<string, unknown> | undefined;
    if (!raw) {
      return undefined;
    }

    const extractId = (id: unknown): string | undefined => {
      if (!id) {
        return undefined;
      }
      const s = String(id);
      return s.includes("/") ? s.split("/").pop() : s;
    };

    const inner = raw.data as Record<string, unknown> | undefined;
    if (inner?.id) {
      return extractId(inner.id);
    }
    if (raw.productId) {
      return extractId(raw.productId);
    }
    if (raw.id) {
      return extractId(raw.id);
    }
    if (raw.success && inner) {
      return extractId(inner.id);
    }
    return undefined;
  }, [data]);

  const [resolvedProductId, setResolvedProductId] = useState<
    string | undefined
  >(dataProductId);

  useEffect(() => {
    if (dataProductId) {
      setResolvedProductId(dataProductId);
      return;
    }
    // Fallback: resolve product ID from URL handle via local BFF route
    const pathParts = window.location.pathname.split("/");
    const productsIndex = pathParts.indexOf("products");
    const handle =
      productsIndex >= 0 ? pathParts[productsIndex + 1] : undefined;
    if (!handle) {
      return;
    }

    resolveProductIdFromHandle(handle).then((id) => {
      if (id) {
        setResolvedProductId(id);
      }
    });
  }, [dataProductId]);

  // State
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [histogram, setHistogram] = useState<HistogramEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedBars, setAnimatedBars] = useState(false);
  const [sortValue, setSortValue] = useState("most-recent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { accessToken } = useAuth();

  // Fetch average rating and histogram from API
  useEffect(() => {
    const fetchRatingData = async () => {
      if (!resolvedProductId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const ratingData = await getProductAverageRating(resolvedProductId);
        if (ratingData) {
          setAverageRating(ratingData.average_rating);
          setTotalReviews(ratingData.total_ratings);
          const breakdown = transformRatingBreakdown(ratingData);
          setHistogram(breakdown);
        } else {
          setError("Could not fetch rating data");
        }
      } catch (err) {
        console.error("Error fetching rating data:", err);
        setError("Failed to load rating data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatingData();
  }, [resolvedProductId, refreshKey]);

  // Animate histogram bars on scroll into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setAnimatedBars(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedBars(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value);
  };

  const toggleReviewForm = () => {
    if (!showReviewForm && !accessToken) {
      handleKwikpassLogin();
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  return (
    <section
      ref={sectionRef}
      className={"nintara-cr" + (className ? " " + className : "")}
      aria-label="Customer Reviews"
    >
      <div className="nintara-cr__container">
        {/* Section heading */}
        <h2 className="nintara-cr__title">{heading}</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#076CD9]" />
            <p className="mt-2 text-sm text-gray-500">Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Summary row: score | histogram | write-review */}
            <div className="nintara-cr__summary">
              {/* Left: Overall score + stars + count */}
              <div className="nintara-cr__score-wrap">
                {totalReviews && totalReviews > 0 ? (
                  <>
                    <span className="nintara-cr__score">
                      {averageRating?.toFixed(2)}
                    </span>
                    <span className="nintara-cr__score-sub">out of 5</span>
                    <div className="nintara-cr__score-stars">
                      <StarRating rating={averageRating || 0} size={18} />
                    </div>
                    <p className="nintara-cr__review-count">
                      Based on {totalReviews} reviews
                    </p>
                  </>
                ) : (
                  <p className="nintara-cr__review-count">
                    Be the first to write a review
                  </p>
                )}
              </div>

              {/* Center: Histogram bars */}
              {histogram.length > 0 && (
                <div
                  className="nintara-cr__histogram"
                  role="presentation"
                  aria-label="Rating distribution"
                >
                  {histogram.map((entry) => (
                    <HistogramRow
                      key={entry.stars}
                      entry={entry}
                      animated={animatedBars}
                    />
                  ))}
                </div>
              )}

              {/* Right: Write a Review button */}
              <div className="nintara-cr__write-wrap">
                <button
                  type="button"
                  className="nintara-cr__write-review-btn"
                  aria-label="Write a Review"
                  onClick={toggleReviewForm}
                >
                  {showReviewForm ? "CANCEL REVIEW" : "WRITE A REVIEW"}
                </button>
              </div>
            </div>

            {/* Review Form */}
            <ReviewFormCustom
              isOpen={showReviewForm}
              onClose={() => setShowReviewForm(false)}
              productId={resolvedProductId}
              setReviewSubmitted={() => {}}
              onSubmit={async () => {
                setShowReviewForm(false);
                setRefreshKey((k) => k + 1);
              }}
            />

            {/* Sort dropdown */}
            <div className="nintara-cr__sort-wrap">
              <label
                htmlFor="nintara-cr-sort"
                className="nintara-cr__sort-label"
              >
                Sort By:
              </label>
              <select
                id="nintara-cr-sort"
                className="nintara-cr__sort-dropdown"
                value={sortValue}
                onChange={handleSortChange}
                aria-label="Sort reviews by"
              >
                {sortOptions.map((opt: SortOption) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Review list — fetched from API */}
            <ReviewsListCustom
              productId={resolvedProductId}
              sortBy={sortValue}
              refreshKey={refreshKey}
            />
          </>
        )}
      </div>
    </section>
  );
}
