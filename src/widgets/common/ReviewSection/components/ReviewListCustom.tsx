"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/useResponsive";
import { getProductReviews } from "../get-review-api";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  title: string;
  date: string;
  verifiedBuyer: boolean;
  images: string[];
  productTitle: string;
  productUrl: string;
}

interface ReviewsListCustomProps {
  productId?: string | number | null;
  maxReviewsPerPage?: number;
  totalReviews?: number | null;
}

const ReviewsListCustom: React.FC<ReviewsListCustomProps> = ({
  productId,
  maxReviewsPerPage = 3,
  totalReviews: initialTotalReviews = null,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualTotalReviews, setActualTotalReviews] = useState<number>(
    initialTotalReviews || 0,
  );
  const [mobileReviewsToShow, setMobileReviewsToShow] = useState(3);
  const [mobileCurrentPage, setMobileCurrentPage] = useState(1);
  const { isMobile } = useResponsive();

  // Calculate total pages based on actual total reviews from API
  const totalPages = Math.max(
    1,
    Math.ceil(actualTotalReviews / maxReviewsPerPage),
  );

  // Format date to readable format (MM/DD/YYYY)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      return "";
    }
  };

  // Get user initial for avatar
  const getUserInitial = (name: string | undefined) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Format date as "X days ago" or "X months ago"
  const formatDateRelative = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      let date: Date;

      // Check if dateString is in DD/MM/YYYY format (e.g., "31/12/2025")
      if (dateString.includes("/") && dateString.split("/").length === 3) {
        const parts = dateString.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
        const year = parseInt(parts[2], 10);
        date = new Date(year, month, day);
      } else {
        // ISO date string or other format
        date = new Date(dateString);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "";
      }

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 30) return `${diffDays} days ago`;

      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return "1 month ago";
      if (diffMonths < 12) return `${diffMonths} months ago`;

      const diffYears = Math.floor(diffDays / 365);
      if (diffYears === 1) return "1 year ago";
      return `${diffYears} years ago`;
    } catch (error) {
      return "";
    }
  };

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert productId to number if it's a string
      const numericProductId =
        typeof productId === "string" ? Number(productId) : productId;

      if (!numericProductId || isNaN(numericProductId)) {
        setError("Invalid product ID");
        setIsLoading(false);
        return;
      }

      // Fetch reviews from API
      const response = await getProductReviews(
        numericProductId,
        currentPage,
        maxReviewsPerPage,
      );

      if (!response) {
        setError("Failed to fetch reviews");
        setIsLoading(false);
        return;
      }

      // Map the API response format to the component's expected format
      const mappedReviews = response.reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.description || "",
        title: review.title || "",
        date: review.date,
        verifiedBuyer: false, // API doesn't provide order_id, set to false
        images: review.image ? [review.image] : [],
        productTitle: "",
        productUrl: "",
      }));

      // For mobile: store reviews (will be accumulated on load more)
      if (isMobile) {
        // On initial load (currentPage is 1), just set the reviews
        if (currentPage === 1) {
          setAllReviews(mappedReviews);
        }
      } else {
        // For desktop: only store current page reviews
        setAllReviews(mappedReviews);
      }

      // For desktop: ensure exactly maxReviewsPerPage reviews per page
      // Slice as safeguard in case API returns more than requested
      const paginatedReviews = mappedReviews.slice(0, maxReviewsPerPage);
      setReviews(paginatedReviews);

      // Update actual total reviews count from API
      setActualTotalReviews(response.count || 0);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [productId, currentPage, maxReviewsPerPage, isMobile]);

  // Fetch reviews when productId or page changes (for desktop)
  useEffect(() => {
    if (productId && !isMobile) {
      fetchReviews();
    }
  }, [productId, currentPage, fetchReviews, isMobile]);

  // Fetch initial reviews for mobile
  useEffect(() => {
    if (productId && isMobile && allReviews.length === 0) {
      fetchReviews();
    }
  }, [productId, isMobile]);

  // For mobile: show first N reviews, for desktop: show paginated reviews
  const reviewsToDisplay = isMobile
    ? allReviews.slice(0, mobileReviewsToShow)
    : reviews;

  const handleLoadMore = async () => {
    if (!productId || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      // Calculate which page we need to fetch next
      const nextPage = mobileCurrentPage + 1;
      const numericProductId =
        typeof productId === "string" ? Number(productId) : productId;

      if (!numericProductId || isNaN(numericProductId)) {
        return;
      }

      // Fetch the next page of reviews
      const response = await getProductReviews(
        numericProductId,
        nextPage,
        maxReviewsPerPage,
      );

      if (!response) {
        return;
      }

      // Map the API response format to the component's expected format
      const mappedReviews = response.reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.description || "",
        title: review.title || "",
        date: review.date,
        verifiedBuyer: false,
        images: review.image ? [review.image] : [],
        productTitle: "",
        productUrl: "",
      }));

      // Append new reviews to existing ones (avoid duplicates)
      setAllReviews((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newReviews = mappedReviews.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newReviews];
      });

      // Update the current page for mobile
      setMobileCurrentPage(nextPage);

      // Increase the number of reviews to show
      setMobileReviewsToShow((prev) => prev + 3);
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMoreReviews = isMobile
    ? allReviews.length > mobileReviewsToShow ||
      (actualTotalReviews > 0 && allReviews.length < actualTotalReviews)
    : currentPage < totalPages;

  return (
    <div
      data-testid="review-list-container"
      className="w-full mx-auto px-8 xl:px-[80px] py-16 rounded-3xl"
      style={{ backgroundColor: "#ffffff" }}
    >
      {isLoading ? (
        <div
          data-testid="review-list-loading"
          className="relative text-center py-12"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4">Loading reviews...</p>
        </div>
      ) : error ? (
        <div
          data-testid="review-list-error"
          className="text-red-500 text-center py-4"
        >
          {error}
        </div>
      ) : reviewsToDisplay.length === 0 ? (
        <div
          data-testid="review-list-empty"
          className="text-gray-500 text-center py-4"
        >
          No reviews found
        </div>
      ) : (
        <>
          {/* Reviews List */}
          <div data-testid="review-list-wrapper">
            <p className="font-medium text-[14px] mb-6 lg:text-[16px]">
              {`Most relevant reviews (${actualTotalReviews})`}{" "}
            </p>
            {reviewsToDisplay.map((review, index) => (
              <div
                key={`review-${review.id || ""}-${index}`}
                data-testid={`review-item-${review.id || index}`}
              >
                <div
                  data-testid={`review-item-wrapper-${review.id}`}
                  className="relative w-full"
                  style={{ minHeight: "134.57px" }}
                >
                  {/* Date - positioned on the right */}
                  <div
                    data-testid={`review-date-${review.id}`}
                    className="absolute top-0 right-0 font-medium"
                    style={{
                      fontFamily: "Gotham",
                      fontSize: isMobile ? "12px" : "16.42px",
                      lineHeight: "2.08em",
                      color: "#A8A7A7",
                      textAlign: "right",
                      width: isMobile ? "auto" : "90px",
                      height: "35px",
                    }}
                  >
                    {formatDateRelative(review.date)}
                  </div>

                  {/* Main content area */}
                  <div
                    data-testid={`review-content-${review.id}`}
                    className="flex flex-col w-full md:max-w-[535px]"
                  >
                    {/* User info and star rating section */}
                    <div
                      data-testid={`review-user-info-${review.id}`}
                      className="flex items-start mb-4"
                      style={{ height: "58.26px" }}
                    >
                      {/* Avatar with initial */}
                      <div
                        data-testid={`review-avatar-${review.id}`}
                        className="rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                          width: "46.52px",
                          height: "46.52px",
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
                              fontFamily: "Gotham, sans-serif",
                              fontWeight: 500,
                              fontSize: "21.89px",
                              lineHeight: "1",
                              color: "#FFFFFF",
                            }}
                          >
                            {getUserInitial(review.name)}
                          </span>
                        )}
                      </div>

                      {/* User name and verified badge */}
                      <div
                        data-testid={`review-user-details-${review.id}`}
                        className="ml-4  flex flex-col mt-4"
                        style={{ width: "112.89px", height: "58.26px" }}
                      >
                        {/* User name */}
                        <div
                          data-testid={`review-user-name-${review.id}`}
                          style={{
                            fontFamily: "Gotham, sans-serif",
                            fontWeight: 500,
                            fontSize: "16px",
                            lineHeight: "2.14em",
                            color: "#222222",
                            height: "35px",
                          }}
                        >
                          {review.name}
                        </div>

                        {/* Verified User badge */}
                        {review.verifiedBuyer && (
                          <div
                            data-testid={`review-verified-badge-${review.id}`}
                            className="flex items-center"
                            style={{
                              height: "35px",
                            }}
                          >
                            {/* Verified icon */}
                            <Image
                              src="/dawn/svg/selected_variant.svg"
                              alt="Selected variant"
                              width={24}
                              height={24}
                              className="w-8 h-8"
                              unoptimized={true}
                            />
                            <span
                              className=""
                              style={{
                                fontFamily: "Gotham, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: "2.44em",
                                color: "#1D1D1D",
                              }}
                            >
                              Verified User
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Star rating */}
                    <div
                      data-testid={`review-star-rating-${review.id}`}
                      className="flex items-center mb-4"
                      style={{ width: "95.78px", height: "24.63px" }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          data-testid={`review-star-${review.id || index}-${star}`}
                          style={{
                            width: "24.63px",
                            height: "24.63px",
                          }}
                        >
                          {star <= review.rating ? (
                            // Filled star
                            <svg
                              width="24.63"
                              height="24.63"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                                fill="#FFC022"
                              />
                            </svg>
                          ) : (
                            // Outlined star
                            <svg
                              width="24.63"
                              height="24.63"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                                fill="none"
                                stroke="#FFC022"
                                strokeWidth="0.68"
                              />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Review text */}
                    <div
                      data-testid={`review-text-${review.id}`}
                      style={{
                        fontFamily: "Gotham, sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "2.14em",
                        color: "#222222",
                        width: "100%",
                        minHeight: "35px",
                      }}
                    >
                      {review.comment || "No comment provided"}
                    </div>
                  </div>
                </div>

                {/* Line separator 32px below each review */}
                {index < reviewsToDisplay.length - 1 && (
                  <div
                    data-testid={`review-separator-${review.id}`}
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
          </div>

          {/* Mobile: Load More Button */}
          {isMobile && hasMoreReviews && (
            <div
              data-testid="review-list-load-more-wrapper"
              className="flex justify-center mt-8"
            >
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 border-2 border-black bg-black text-white rounded-lg font-bold 
             hover:bg-white hover:text-black transition-colors 
             disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "Gotham, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                {isLoadingMore ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}

          {/* Desktop: Pagination */}
          {/* Show pagination if there are reviews and more than 1 page (desktop only) */}
          {!isMobile && reviews.length > 0 && totalPages > 1 && (
            <div
              data-testid="review-list-pagination"
              className="flex justify-center mt-8"
            >
              <nav
                className="flex"
                style={{
                  minWidth: "144.5px",
                  height: "22px",
                }}
              >
                {/* Go to first page - Show if not on first page */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="mr-6"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                    aria-label="Go to first page"
                  >
                    <svg
                      width="19"
                      height="12"
                      viewBox="0 0 19 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Vertical bar */}
                      <line
                        x1="1"
                        y1="1"
                        x2="1"
                        y2="11"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Arrow */}
                      <path
                        d="M13 1L5 6L13 11"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {/* Previous arrow - Show if not on first page */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="mr-6"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                    aria-label="Previous page"
                  >
                    <svg
                      width="9.5"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L1 6L9 11"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {/* Dynamic page numbers - show up to 4 pages, shifting based on current page */}
                {(() => {
                  // Calculate which pages to show (always show 4 pages or less if total pages < 4)
                  let startPage = 1;
                  let endPage = Math.min(totalPages, 4);

                  // If current page is beyond the first 4 pages, shift the visible range
                  if (currentPage > 4) {
                    // Show pages around current page (current page should be in the last 2 positions)
                    endPage = Math.min(currentPage, totalPages);
                    startPage = Math.max(1, endPage - 3);
                  }

                  const pagesToShow = endPage - startPage + 1;

                  return Array.from({ length: pagesToShow }, (_, i) => {
                    const pageNum = startPage + i;
                    const isActive = currentPage === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          fontFamily: "Gotham, sans-serif",
                          fontWeight: isActive ? 700 : 500,
                          fontSize: isActive ? "32px" : "16px",
                          lineHeight: isActive ? "1.07em" : "2.14em",
                          color: isActive ? "#000000" : "#727272",
                          width: isActive
                            ? "14px"
                            : pageNum === endPage
                              ? "11px"
                              : "10px",
                          height: isActive ? "22px" : "11px",
                          textAlign: "right",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          marginRight:
                            pageNum < endPage
                              ? "21px"
                              : totalPages > 4
                                ? "17px"
                                : "0px",
                        }}
                        aria-label={`Page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}

                {/* Next arrow - Show if there are more pages */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="ml-6"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                    aria-label="Next page"
                  >
                    <svg
                      width="9.5"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L9 6L1 11"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {/* Go to last page - Show if not on last page and there are more than 4 pages */}
                {currentPage < totalPages && totalPages > 4 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="ml-6"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                    aria-label="Go to last page"
                  >
                    <svg
                      width="19"
                      height="12"
                      viewBox="0 0 19 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Arrow */}
                      <path
                        d="M1 1L9 6L1 11"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Vertical bar */}
                      <line
                        x1="15"
                        y1="1"
                        x2="15"
                        y2="11"
                        stroke="#000000"
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
