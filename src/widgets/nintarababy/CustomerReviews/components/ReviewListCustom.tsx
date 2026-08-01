"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/useResponsive";
import { getProductReviews } from "@/utils/get-review-api";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  title: string;
  date: string;
  verifiedBuyer: boolean;
  images: string[];
}

interface ReviewsListCustomProps {
  productId?: string | number | null;
  maxReviewsPerPage?: number;
  sortBy?: string;
  refreshKey?: number;
}

/**
 * Format date as "X days ago" or "X months ago"
 */
const formatDateRelative = (dateString: string | undefined) => {
  if (!dateString) {
    return "";
  }
  try {
    let date: Date;
    if (dateString.includes("/") && dateString.split("/").length === 3) {
      const parts = dateString.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();
    const diffDays = Math.floor(
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return "Today";
    }
    if (diffDays === 1) {
      return "1 day ago";
    }
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    }
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) {
      return "1 month ago";
    }
    if (diffMonths < 12) {
      return `${diffMonths} months ago`;
    }
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) {
      return "1 year ago";
    }
    return `${diffYears} years ago`;
  } catch {
    return "";
  }
};

const getUserInitial = (name: string | undefined) => {
  if (!name) {
    return "?";
  }
  return name.charAt(0).toUpperCase();
};

// Map UI sort values to API sort_by params
const mapSortToApi = (
  sort: string
): "rating_asc" | "rating_desc" | "newest" | undefined => {
  switch (sort) {
    case "highest-rating":
      return "rating_desc";
    case "lowest-rating":
      return "rating_asc";
    case "most-recent":
      return "newest";
    default:
      return "newest";
  }
};

const ReviewsListCustom: React.FC<ReviewsListCustomProps> = ({
  productId,
  maxReviewsPerPage = 3,
  sortBy = "most-recent",
  refreshKey = 0,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualTotalReviews, setActualTotalReviews] = useState(0);
  const [mobileReviewsToShow, setMobileReviewsToShow] = useState(3);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const { isMobile } = useResponsive();

  const totalPages = Math.max(
    1,
    Math.ceil(actualTotalReviews / maxReviewsPerPage)
  );

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProductReviews(
        productId,
        currentPage,
        maxReviewsPerPage,
        mapSortToApi(sortBy)
      );
      if (!response) {
        setError("Failed to fetch reviews");
        setIsLoading(false);
        return;
      }

      const mappedReviews = response.reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.description || "",
        title: review.title || "",
        date: review.date,
        verifiedBuyer: false,
        images: review.image ? [review.image] : [],
      }));

      if (isMobile) {
        if (currentPage === 1) {
          setAllReviews(mappedReviews);
        }
      } else {
        setAllReviews(mappedReviews);
      }

      setReviews(mappedReviews.slice(0, maxReviewsPerPage));
      setActualTotalReviews(response.count || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [productId, currentPage, maxReviewsPerPage, isMobile, sortBy, refreshKey]);

  // Desktop: fetch on page change, sort change, or after new review
  useEffect(() => {
    if (productId && !isMobile) {
      fetchReviews();
    }
  }, [productId, currentPage, sortBy, refreshKey, fetchReviews, isMobile]);

  // Mobile: initial fetch + re-fetch on sort change or after new review
  useEffect(() => {
    if (productId && isMobile) {
      setAllReviews([]);
      setMobileCurrentPage(1);
      setMobileReviewsToShow(3);
      fetchReviews();
    }
  }, [productId, isMobile, sortBy, refreshKey]);

  const reviewsToDisplay = isMobile
    ? allReviews.slice(0, mobileReviewsToShow)
    : reviews;

  const handleLoadMore = async () => {
    if (!productId || isLoadingMore) {
      return;
    }
    try {
      setIsLoadingMore(true);
      const nextPage = mobileCurrentPage + 1;

      const response = await getProductReviews(
        productId,
        nextPage,
        maxReviewsPerPage,
        mapSortToApi(sortBy)
      );
      if (!response) {
        return;
      }

      const mappedReviews = response.reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.description || "",
        title: review.title || "",
        date: review.date,
        verifiedBuyer: false,
        images: review.image ? [review.image] : [],
      }));

      setAllReviews((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newReviews = mappedReviews.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newReviews];
      });
      setMobileCurrentPage(nextPage);
      setMobileReviewsToShow((prev) => prev + 3);
    } catch (err) {
      console.error("Error loading more reviews:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMoreReviews = isMobile
    ? allReviews.length > mobileReviewsToShow ||
      (actualTotalReviews > 0 && allReviews.length < actualTotalReviews)
    : currentPage < totalPages;

  return (
    <div className="w-full mx-auto px-4 md:px-8 xl:px-[80px] py-8 md:py-16 bg-white rounded-3xl">
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#076CD9]" />
          <p className="mt-4">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : reviewsToDisplay.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No reviews yet</div>
      ) : (
        <>
          <p className="font-medium text-[14px] mb-6 lg:text-[16px]">
            Most relevant reviews ({actualTotalReviews})
          </p>

          {reviewsToDisplay.map((review, index) => (
            <div key={`review-${review.id || index}`}>
              <div className="relative w-full" style={{ minHeight: "134px" }}>
                {/* Date */}
                <div
                  className="absolute top-0 right-0 font-medium"
                  style={{
                    fontSize: isMobile ? "12px" : "16px",
                    lineHeight: "2em",
                    color: "#A8A7A7",
                  }}
                >
                  {formatDateRelative(review.date)}
                </div>

                <div className="flex flex-col w-full md:max-w-[535px]">
                  {/* User info */}
                  <div
                    className="flex items-start mb-4"
                    style={{ height: "58px" }}
                  >
                    {/* Avatar */}
                    <div
                      className="rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: "46px",
                        height: "46px",
                        marginTop: "6px",
                        backgroundColor: "#D9D9D9",
                      }}
                    >
                      {review.images && review.images.length > 0 ? (
                        <Image
                          src={review.images[0]}
                          alt={review.name || "User"}
                          width={47}
                          height={47}
                          className="w-full h-full object-cover rounded-full"
                          unoptimized
                        />
                      ) : (
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "22px",
                            color: "#FFFFFF",
                          }}
                        >
                          {getUserInitial(review.name)}
                        </span>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col mt-4">
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: "2em",
                          color: "#222222",
                        }}
                      >
                        {review.name}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        width="24"
                        height="24"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                          fill={star <= review.rating ? "#076CD9" : "none"}
                          stroke={star <= review.rating ? undefined : "#076CD9"}
                          strokeWidth={
                            star <= review.rating ? undefined : "0.68"
                          }
                        />
                      </svg>
                    ))}
                  </div>

                  {/* Review text */}
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "2em",
                      color: "#222222",
                    }}
                  >
                    {review.comment || "No comment provided"}
                  </div>
                </div>
              </div>

              {index < reviewsToDisplay.length - 1 && (
                <div
                  style={{
                    marginTop: "32px",
                    marginBottom: "32px",
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#E5E5E5",
                  }}
                />
              )}
            </div>
          ))}

          {/* Mobile: Load More */}
          {isMobile && hasMoreReviews && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 border-2 border-[#076CD9] bg-[#076CD9] text-white rounded-full font-bold hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}

          {/* Desktop: Pagination */}
          {!isMobile && reviews.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-4">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    aria-label="Go to first page"
                    className="flex items-center"
                  >
                    <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
                      <line
                        x1="1"
                        y1="1"
                        x2="1"
                        y2="11"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M13 1L5 6L13 11"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    aria-label="Previous page"
                    className="flex items-center"
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path
                        d="M9 1L1 6L9 11"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {(() => {
                  let startPage = 1;
                  let endPage = Math.min(totalPages, 4);
                  if (currentPage > 4) {
                    endPage = Math.min(currentPage, totalPages);
                    startPage = Math.max(1, endPage - 3);
                  }
                  return Array.from(
                    { length: endPage - startPage + 1 },
                    (_, i) => {
                      const pageNum = startPage + i;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            fontWeight: isActive ? 700 : 500,
                            fontSize: isActive ? "32px" : "16px",
                            color: isActive ? "#000" : "#727272",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                          aria-label={`Page ${pageNum}`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  );
                })()}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    aria-label="Next page"
                    className="flex items-center"
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path
                        d="M1 1L9 6L1 11"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                {currentPage < totalPages && totalPages > 4 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    aria-label="Go to last page"
                    className="flex items-center"
                  >
                    <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
                      <path
                        d="M1 1L9 6L1 11"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="15"
                        y1="1"
                        x2="15"
                        y2="11"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsListCustom;
