"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getProductAverageRating } from "../get-review-api";
import { ReviewFormCustom } from "../components/ReviewFormCustom";
import { useResponsive } from "@/hooks/useResponsive";
import ReviewsListCustom from "../components//ReviewListCustom";

declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
  }
}

import { ReviewSectionProps } from "../types";
import { useAuth } from "@shopkit/core/context";
import { KwikPassScriptCustom } from "@/integrations/kwikpass-custom";

const ReviewSummaryCustom: React.FC<ReviewSectionProps> = ({
  data,
  settings,
  className,
  locale,
}) => {
  // Extract product data from widget system
  const product = data?.data;

  // Extract productId from product data
  // Handle both GID format (gid://shopify/Product/123456) and numeric IDs
  let productId: string | undefined = undefined;
  let externalId: number | null = null;
  const AUTH_KEY = "customerAccessToken";

  if (product?.id) {
    if (typeof product.id === "string") {
      // Handle GID format: "gid://shopify/Product/123456"
      if (product.id.includes("/")) {
        const idPart = product.id.split("/").pop();
        productId = idPart;
        externalId = idPart ? Number(idPart) : null;
      } else {
        // Direct string ID
        productId = product.id;
        externalId = Number(product.id) || null;
      }
    } else {
      // Numeric ID
      productId = String(product.id);
      externalId = Number(product.id);
    }
  }

  // Also check if productId is directly in data
  if (!productId && data?.productId) {
    productId =
      typeof data.productId === "string"
        ? data.productId
        : String(data.productId);
  }

  if (!externalId && data?.externalId) {
    externalId =
      typeof data.externalId === "number"
        ? data.externalId
        : Number(data.externalId) || null;
  }

  // Debug logging
  if (!productId) {
    console.warn(
      "[ReviewSection] productId is undefined. Product data:",
      product,
    );
  }

  // Extract review data from product or data prop
  const averageRating = data?.averageRating || product?.averageRating || null;
  const totalReviews = data?.totalReviews || product?.totalReviews || null;
  const ratingCounts = data?.ratingCounts || {
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0,
  };

  const onReviewSubmitted = data?.onReviewSubmitted;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingCountsState, setRatingCountsState] = useState(ratingCounts);
  const [calculatedTotalReviews, setCalculatedTotalReviews] = useState<
    number | null
  >(totalReviews || null);
  const [calculatedAverageRating, setCalculatedAverageRating] = useState<
    number | null
  >(averageRating || null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  // const [showKwikPass, setShowKwikPass] = useState(false);
  const [openKwikPass, setOpenKwikPass] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { accessToken } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    const fetchRatingCounts = async () => {
      if (!productId) return;
      try {
        setIsLoadingCounts(true);
        setError(null);
        // Get JudgeMe product ID

        // Get rating counts
        const reviewCounts = await getProductAverageRating(Number(productId));
        const totalRatings = reviewCounts?.total_ratings;
        const averageRating = reviewCounts?.average_rating;

        if (!reviewCounts) {
          setError("Could not fetch rating counts");
          return;
        }

        // Update state with the counts
        const updatedCounts = {
          fiveStarCount: reviewCounts.ratings[5]?.count || 0,
          fourStarCount: reviewCounts.ratings[4]?.count || 0,
          threeStarCount: reviewCounts.ratings[3]?.count || 0,
          twoStarCount: reviewCounts.ratings[2]?.count || 0,
          oneStarCount: reviewCounts.ratings[1]?.count || 0,
        };

        setRatingCountsState(updatedCounts);

        // Calculate total reviews from the sum of individual counts
        const sumOfCounts =
          updatedCounts.fiveStarCount +
          updatedCounts.fourStarCount +
          updatedCounts.threeStarCount +
          updatedCounts.twoStarCount +
          updatedCounts.oneStarCount;

        // Calculate weighted average rating
        let weightedSum = 0;
        if (sumOfCounts > 0) {
          weightedSum =
            5 * updatedCounts.fiveStarCount +
            4 * updatedCounts.fourStarCount +
            3 * updatedCounts.threeStarCount +
            2 * updatedCounts.twoStarCount +
            1 * updatedCounts.oneStarCount;
        }

        const avgRating = sumOfCounts > 0 ? weightedSum / sumOfCounts : 0;
        setCalculatedTotalReviews(totalRatings ?? null);
        setCalculatedAverageRating(averageRating ?? null);
      } catch (error) {
        console.error("Error fetching rating counts:", error);
        setError("Failed to load rating counts");
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchRatingCounts();
  }, [productId]);
  const numberToWord: { [key: number]: string } = {
    5: "five",
    4: "four",
    3: "three",
    2: "two",
    1: "one",
  };

  const onLoaded = useCallback(() => {
    setScriptLoaded(true);
    console.log("KwikPass script loaded");
  }, []);

  function openKwikPassLogin() {
    setOpenKwikPass(true);
  }

  // Login before writing reviews
  const handleKwikPassLogin = () => {
    try {
      if (typeof window !== "undefined") {
        // Try the KwikPass SDK first (same as KwikpassLogin component)
        if (window.__KP_LOGIN_SDK_INSTANCE__) {
          window.__KP_LOGIN_SDK_INSTANCE__.handleKpLogin();
        }
        // Fallback to custom login if SDK not available
        else if (window.handleCustomLogin) {
          window.handleCustomLogin(false);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  function handleReviewWrite() {
    if (!accessToken) {
      //  openKwikPassLogin()
      setShowReviewForm(!showReviewForm);
    } else {
      setShowReviewForm(!showReviewForm);
    }
  }
  const toggleReviewForm = () => {
    // Publish analytics event for review CTA click
    // publishEvent({
    //   type: EventType.BUTTON_CLICK,
    //   buttonId: "review-cta-click",
    //   buttonText: "review_cta_click",
    //   location: "customer-stories",
    // });
    if (reviewSubmitted) {
      window.scrollTo(0, 0);
      window.location.reload();
    }
    if (!accessToken) {
      // Trigger KwikPass login if not authenticated
      handleKwikPassLogin();
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  return (
    <div data-testid="review-section-container" className="bg-[#F4F6F8]">
      <div
        data-testid="review-section-inner-container"
        className="py-4 px-2 md:px-2 lg:pl-0 lg:pr-6 xl:px-6 rounded-3xl bg-white"
      >
        <div
          data-testid="review-section-content-wrapper"
          className="mx-auto px-4 xl:px-[80px] py-8 bg-[#ffffff] relative"
        >
          {(isDesktop || isTablet) && (
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#222222] mb-6 md:mb-8 relative z-10">
              Customer Reviews
            </h2>
          )}
          {isMobile && (
            <div
              data-testid="review-section-mobile-header"
              className="flex justify-between items-center mb-6 md:mb-8"
            >
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#222222] px-0 md:px-8 relative z-10">
                Customer Reviews
              </h2>
              <div
                data-testid="review-section-mobile-button-wrapper"
                className="flex justify-center items-center order-3 md:order-none"
              >
                <button
                  id="write-review"
                  aria-label="write-review"
                  onClick={toggleReviewForm}
                  className="font-size-xl px-6 py-3 text-black rounded-[4px] transition-colors w-full md:w-[256px] md:h-[53px] text-[12px] md:text-[20px] font-bold border border-[#1D1D1D] relative z-0"
                >
                  {reviewSubmitted
                    ? "Refresh page"
                    : showReviewForm
                      ? "Cancel review"
                      : "Write a review"}
                </button>
              </div>
            </div>
          )}

          <div
            data-testid="review-section-main-grid"
            className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 relative z-0 border-b pb-12"
          >
            {/* Overall Rating - Mobile: Full width, Desktop: First column */}
            {/* <div className="flex  items-center md:items-center order-1 md:order-none">
            <div className="flex  items-center w-full md:w-auto">
              <div className="flex mb-2">
                <Image
                  src="/dawn/svg/logo_icon_reviews.svg"
                  alt="Reviews"
                  width={81}
                  height={81}
                  className="w-[38px] h-[38px] md:w-[81px] md:h-[81px]"
                  unoptimized
                />
              </div>
              <div className="flex flex-col items-center">
                {calculatedTotalReviews && calculatedTotalReviews > 0 ? (
                  <>
                    <p className="text-text-lg font-bold text-[#1C1D1D]">
                      {!isMobile && (
                        <span>
                          {calculatedAverageRating?.toFixed(1)} out of 5
                        </span>
                      )}
                    </p>
                    <p className="text-text-lg  text-[#1C1D1D]">
                      Based on {calculatedTotalReviews} reviewsssss
                    </p>
                  </>
                ) : (
                  <p className="text-[17px] text-[#1C1D1D]">
                    Be the first to write a review
                  </p>
                )}
              </div>
            </div>
          </div> */}
            <div
              data-testid="review-section-overall-rating"
              className="flex items-center order-1 md:order-none"
            >
              <div
                data-testid="review-section-rating-content"
                className="flex items-center gap-4 md:gap-8 w-full md:w-auto"
              >
                {/* Logo */}
                <div
                  data-testid="review-section-logo-wrapper"
                  className="flex mb-2"
                >
                  <Image
                    src="/dawn/svg/logo_icon_reviews.svg"
                    alt="Reviews"
                    width={81}
                    height={81}
                    className="w-[38px] h-[38px] md:w-[81px] md:h-[81px]"
                    unoptimized
                  />
                </div>

                <div
                  data-testid="review-section-rating-text-wrapper"
                  className="flex flex-col md:items-center ml-2"
                >
                  {calculatedTotalReviews && calculatedTotalReviews > 0 ? (
                    <>
                      {/* ===== DESKTOP ===== */}
                      <div
                        data-testid="review-section-desktop-rating"
                        className="hidden md:flex flex-col items-start text-center"
                      >
                        {/* Rating row */}
                        <div
                          data-testid="review-section-rating-row"
                          className="flex items-center gap-2"
                        >
                          {/* Star */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                              fill="#FFC022"
                            />
                          </svg>

                          {/* Rating text */}
                          <p className="text-text-lg font-bold text-[#1C1D1D]">
                            {calculatedAverageRating?.toFixed(1)}{" "}
                            <span className="font-normal">out of 5</span>
                          </p>
                        </div>

                        {/* Review count */}
                        <p className="text-text-lg text-[#1C1D1D] mt-1">
                          Based on {calculatedTotalReviews} reviews
                        </p>
                      </div>

                      {/* ===== MOBILE ONLY ===== */}
                      <div
                        data-testid="review-section-mobile-rating"
                        className="flex items-center md:hidden"
                      >
                        {/* Rating number */}
                        <span className="text-text-lg font-bold text-[#1C1D1D]">
                          {calculatedAverageRating?.toFixed(1)}
                        </span>

                        {/* Star */}
                        <svg
                          className="mx-1"
                          width="16"
                          height="16"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5 0L15.3721 8.6379L24.5 9.5L17.5 15.6121L19.7442 24.5L12.5 19.5L5.25577 24.5L7.5 15.6121L0.5 9.5L9.62793 8.6379L12.5 0Z"
                            fill="#FFC022"
                          />
                        </svg>

                        {/* Divider */}
                        <span
                          className="text-[16px] mx-1 font-roboto"
                          style={{ color: "#DDDDDD" }}
                        >
                          |
                        </span>

                        {/* Based on reviews */}
                        <span className="text-text-lg text-[#1C1D1D]">
                          Based on {calculatedTotalReviews} reviews
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-text-lg text-[#1C1D1D]">
                      Be the first to write a review
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Distribution - Mobile: Full width, Desktop: Second column */}
            <div
              data-testid="review-section-rating-distribution"
              className="space-y-2 w-full md:w-auto order-2 md:order-none"
            >
              {/* <h3 className="text-[17px] text-[#1C1D1D] mb-3 font-normal hidden md:block">
              Rating Distribution
            </h3> */}
              {isLoadingCounts ? (
                <div
                  data-testid="review-section-loading"
                  className="relative text-center py-12"
                >
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  <p className="mt-4">Loading reviews...</p>
                </div>
              ) : error ? (
                <div
                  data-testid="review-section-error"
                  className="flex justify-center items-center h-32"
                >
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : (
                <div
                  data-testid="review-section-rating-bars"
                  className="space-y-2.5"
                >
                  {[5, 4, 3, 2, 1].map((star) => {
                    const word = numberToWord[star];
                    const countKey =
                      `${word}StarCount` as keyof typeof ratingCountsState;
                    const count = ratingCountsState[countKey] || 0;

                    const percentage =
                      calculatedTotalReviews && calculatedTotalReviews > 0
                        ? (count / calculatedTotalReviews) * 100
                        : 0;

                    return (
                      <div
                        key={star}
                        data-testid={`review-section-rating-bar-${star}`}
                        className="flex items-center mb-2.5"
                      >
                        <div
                          data-testid={`review-section-star-number-${star}`}
                          className="flex items-center mr-1"
                        >
                          <span className="text-[16px] text-[#1D1D1D] leading-[32px] font-normal w-[14px]">
                            {star}
                          </span>
                        </div>
                        <div
                          data-testid={`review-section-progress-bar-container-${star}`}
                          className="flex-1 h-[3px] mx-2 bg-[#D9D9D9] rounded-[10px] relative overflow-hidden"
                        >
                          <div
                            data-testid={`review-section-progress-bar-fill-${star}`}
                            className="h-full bg-[#1D1D1D] absolute left-0 top-0 transition-width duration-300 ease-in-out rounded-[10px]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-[#1D1D1D] w-[33px] text-left font-medium leading-[25px]">
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Write a Review Button - Mobile: Full width, Desktop: Third column */}
            {(isDesktop || isTablet) && (
              <div
                data-testid="review-section-desktop-button-wrapper"
                className="flex justify-center items-center w-full md:w-auto order-3 md:order-none"
              >
                <button
                  id="write-review"
                  aria-label="write-review"
                  onClick={toggleReviewForm}
                  className="font-size-xl px-6 py-3 text-black rounded-[4px] transition-colors w-full md:w-[256px] md:h-[53px] text-[12px] md:text-[20px] font-bold border border-[#1D1D1D] relative z-0"
                >
                  {reviewSubmitted
                    ? "Refresh page"
                    : showReviewForm
                      ? "Cancel review"
                      : "Write a review"}
                </button>
              </div>
            )}
          </div>
        </div>
        {openKwikPass && <KwikPassScriptCustom />}

        {/* Review Form */}
        <ReviewFormCustom
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          productId={productId}
          externalId={externalId}
          setReviewSubmitted={setReviewSubmitted}
          onSubmit={async () => {
            // Don't close the form here - let the success message show
            // The form will be closed when user clicks the close button
            setReviewSubmitted(true);
            if (onReviewSubmitted) {
              onReviewSubmitted();
            }
          }}
        />
        <ReviewsListCustom productId={productId} />
      </div>
    </div>
  );
};

// Export as named V1 for variant registry compatibility
export const V1 = ReviewSummaryCustom;
export default ReviewSummaryCustom;
