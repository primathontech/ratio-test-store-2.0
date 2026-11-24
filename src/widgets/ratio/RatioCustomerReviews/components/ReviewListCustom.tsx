"use client";

import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { getProductReviews } from "@/widgets/common/CustomerReviews/utils/get-review-api";

/** Max characters before truncating review body with "Read more" */
const REVIEW_BODY_TRUNCATE_LENGTH = 180;

const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i.test(url);

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

/** 24x24 user silhouette - dark grey #707070, head and shoulders */
function UserIcon24() {
  return (
    <svg
      width={34}
      height={34}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="12" cy="8" r="3.5" stroke="#707070" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.5 3.5-6 7-6s7 2.5 7 6"
        stroke="#707070"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 12×12 black circle with white checkmark for verified badge */
function VerifiedBadge12() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 right-0 shrink-0"
      aria-hidden
    >
      <circle cx="6" cy="6" r="6" fill="#000000" />
      <path
        d="M3 6l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Avatar container: 40x40, bg #F0F0F0, rounded 4px; inner 24x24; optional 12x12 verified badge */
function ReviewAvatar({
  reviewId,
  imageUrl,
  displayName,
  verified,
}: {
  reviewId: string;
  imageUrl: string | null;
  displayName: string;
  verified: boolean;
}) {
  return (
    <div
      data-testid={`review-avatar-${reviewId}`}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#F0F0F0]"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={displayName}
          width={24}
          height={24}
          className="h-6 w-6 object-cover"
          unoptimized
        />
      ) : (
        <UserIcon24 />
      )}
      {verified && <VerifiedBadge12 />}
    </div>
  );
}

interface ReviewsListCustomProps {
  productId?: string | number | null;
  maxReviewsPerPage?: number;
  totalReviews?: number | null;
  /** Sort key from dropdown (e.g. mostRecent, highestRating). Pass to API when backend supports it. */
  sortKey?: string;
}

const ReviewsListCustom: React.FC<ReviewsListCustomProps> = ({
  productId,
  maxReviewsPerPage: maxReviewsPerPageProp = 6,
  totalReviews: initialTotalReviews = null,
  sortKey,
}) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const check = () => setIsLargeScreen(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const isDesktopLayout = isLargeScreen;
  const maxReviewsPerPage = isDesktopLayout ? 5 : maxReviewsPerPageProp;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualTotalReviews, setActualTotalReviews] = useState<number>(
    initialTotalReviews || 0
  );
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Calculate total pages based on actual total reviews from API
  const totalPages = Math.max(
    1,
    Math.ceil(actualTotalReviews / maxReviewsPerPage)
  );

  // Format date to readable format (MM/DD/YYYY)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "";
    }
    try {
      let date: Date;
      if (dateString.includes("/") && dateString.split("/").length === 3) {
        const [d, m, y] = dateString.split("/").map(Number);
        date = new Date(y, m - 1, d);
      } else {
        date = new Date(dateString);
      }
      if (isNaN(date.getTime())) {
        return "";
      }
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
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

      const numericProductId =
        typeof productId === "string" ? Number(productId) : productId;

      if (!numericProductId || isNaN(numericProductId)) {
        setError("Invalid product ID");
        setIsLoading(false);
        return;
      }

      const response = await getProductReviews(
        numericProductId,
        currentPage,
        maxReviewsPerPage,
        sortKey
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
        productTitle: "",
        productUrl: "",
      }));

      const paginatedReviews = mappedReviews.slice(0, maxReviewsPerPage);
      setReviews(paginatedReviews);
      setActualTotalReviews(response.count || 0);
    } catch {
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [productId, currentPage, maxReviewsPerPage, sortKey]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey]);

  // Fetch reviews when productId, page, or sortKey changes
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, currentPage, fetchReviews]);

  const reviewsToDisplay = reviews;

  if (!isLoading && !error && reviewsToDisplay.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="review-list-container"
      className="w-full mx-auto pt-4 pb-10 md:pb-16 md:pt-4 rounded-3xl bg-white"
    >
      {isLoading ? (
        <div
          data-testid="review-list-loading"
          className="relative text-center py-12"
        >
          <div className="inline-block animate-spin rounded-[50%] h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4">Loading reviews...</p>
        </div>
      ) : error ? (
        <div
          data-testid="review-list-error"
          className="text-red-500 text-center py-4"
        >
          {error}
        </div>
      ) : (
        <>
          <div
            data-testid="review-list-wrapper"
            className={`space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 ${isDesktopLayout ? "lg:grid-cols-3 lg:gap-8" : ""}`}
          >
            {reviewsToDisplay.map((review, index) => {
              const comment = review.comment || "No comment provided";
              const isLong = comment.length > REVIEW_BODY_TRUNCATE_LENGTH;
              const isExpanded = expandedReviewId === review.id;
              const displayName =
                review.name?.trim() === "" || !review.name
                  ? "Anonymous"
                  : review.name;

              return (
                <div
                  key={`review-${review.id || ""}-${index}`}
                  data-testid={`review-item-${review.id || index}`}
                  className="rounded-2xl p-6 w-full bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.1)] md:max-w-[377px] xl:max-w-none"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div
                      data-testid={`review-star-rating-${review.id}`}
                      className="flex items-center shrink-0"
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= review.rating;
                        const jdgmStarStyle: React.CSSProperties = {
                          display: "inline",
                          padding: "0 1.5px 0 0",
                          margin: 0,
                          fontWeight: "bold",
                          opacity: 1,
                          WebkitFontSmoothing: "antialiased",
                          lineHeight: 1.4,
                          boxSizing: "border-box",
                          fontSize: "12px",
                          fontFamily: "'JudgemeStar', sans-serif",
                          textDecoration: "none",
                          color: "#FBC210",
                        };
                        return (
                          <span
                            key={star}
                            data-testid={`review-star-${review.id || index}-${star}`}
                            className={`jdgm-star shrink-0 inline-block ${isFilled ? "jdgm--on" : ""} w-[18px] h-[16px]`}
                            style={{
                              ...jdgmStarStyle,
                            }}
                          >
                            {isFilled ? (
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 25 25"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                                style={{ shapeRendering: "geometricPrecision" }}
                              >
                                <path
                                  d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                                  fill="currentColor"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                                style={{ shapeRendering: "geometricPrecision" }}
                              >
                                <path
                                  d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="0.68"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <span
                      data-testid={`review-date-${review.id}`}
                      className="text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#7b7b7b] shrink-0"
                    >
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <ReviewAvatar
                      reviewId={review.id}
                      imageUrl={null}
                      displayName={displayName}
                      verified={!!review.verifiedBuyer}
                    />
                    <span
                      data-testid={`review-user-name-${review.id}`}
                      className="font-normal text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#000000]"
                    >
                      {displayName}
                    </span>
                    {review.verifiedBuyer && (
                      <span
                        data-testid={`review-verified-badge-${review.id}`}
                        className="inline-flex items-center justify-center gap-1 w-[58px] h-4 rounded bg-[#333333] text-white text-xs font-medium"
                      >
                        Verified
                      </span>
                    )}
                  </div>
                  {(review.title ?? "").trim() !== "" && (
                    <h3
                      data-testid={`review-title-${review.id}`}
                      className="font-bold text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] mb-2"
                    >
                      {review.title}
                    </h3>
                  )}
                  <div
                    data-testid={`review-text-${review.id}`}
                    className={`text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#333333] ${
                      isLong && !isExpanded ? "line-clamp-4" : ""
                    }`}
                  >
                    {comment}
                  </div>
                  {isLong && !isExpanded && (
                    <button
                      type="button"
                      onClick={() => setExpandedReviewId(review.id)}
                      className="text-[12px] min-[375px]:text-[14px] leading-[16.8px] min-[375px]:leading-[19.6px] text-[#636E6E] underline font-normal mt-1"
                    >
                      Read more
                    </button>
                  )}
                  {review.images.length > 0 && (
                    <div
                      data-testid={`review-photos-${review.id}`}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {review.images.map((img, i) =>
                        isVideoUrl(img) ? (
                          // eslint-disable-next-line no-restricted-syntax
                          <video
                            key={i}
                            src={img}
                            width={80}
                            height={80}
                            controls
                            playsInline
                            className="h-20 w-20 rounded-lg border border-[#E0E0E0] object-cover"
                          />
                        ) : (
                          <a
                            key={i}
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Image
                              src={img}
                              alt={`Review photo ${i + 1}`}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-lg border border-[#E0E0E0] object-cover"
                              unoptimized
                            />
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {reviews.length > 0 && totalPages > 1 && (
            <div
              data-testid="review-list-pagination"
              className="flex justify-center mt-8"
            >
              <nav
                className="flex items-center"
                style={{ minWidth: "144.5px", height: "12px" }}
              >
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="mr-3"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "12px",
                      marginTop: "1px",
                    }}
                    aria-label="Go to first page"
                  >
                    <svg
                      width="9"
                      height="9"
                      className="mt-2"
                      viewBox="0 0 19 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="1"
                        y1="1"
                        x2="1"
                        y2="11"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
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

                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="mr-6"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "12px",
                      marginTop: "1px",
                    }}
                    aria-label="Previous page"
                  >
                    <svg
                      width="9"
                      height="9"
                      className="mt-2"
                      viewBox="0 0 19 12"
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

                {(() => {
                  let startPage = 1;
                  let endPage = Math.min(totalPages, 4);

                  if (currentPage > 4) {
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
                          fontWeight: isActive ? 700 : 500,
                          fontSize: "12px",
                          lineHeight: "1.5",
                          color: isActive ? "#000000" : "#727272",
                          minWidth: "12px",
                          height: "12px",
                          textAlign: "center",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          marginRight:
                            pageNum < endPage || totalPages > 4
                              ? "14px"
                              : "0px",
                        }}
                        aria-label={`Page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="ml-6"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "12px",
                      marginTop: "1px",
                    }}
                    aria-label="Next page"
                  >
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 19 12"
                      className="mt-2"
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

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="ml-5"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "12px",
                      marginTop: "1px",
                    }}
                    aria-label="Go to last page"
                  >
                    <svg
                      width="9"
                      height="9"
                      className="mt-2"
                      viewBox="0 0 19 12"
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
