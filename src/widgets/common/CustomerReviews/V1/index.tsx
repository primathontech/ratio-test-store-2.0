"use client";

import { useAuth } from "@shopkit/core/context";
import KwikPassScriptCustom from "@/integrations/kwikpass-custom/KwikPassScriptCustom";
import type React from "react";
import { useEffect, useState } from "react";
import { ReviewFormCustom } from "../components/ReviewFormCustom";
import ReviewsListCustom from "../components/ReviewListCustom";
import {
  ReviewSortDropdown,
  type ReviewSortOption,
} from "../components/ReviewSortDropdown";
import { STAR_PATH } from "../constants";
import { getProductAverageRating } from "../utils/get-review-api";
import { CustomerReviewsProps } from "../types";

declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
    __KP_LOGIN_SDK_INSTANCE__?: { handleKpLogin: () => void };
  }
}

/** Sort options for review list (label/key for API). */
const REVIEW_SORT_OPTIONS: ReviewSortOption[] = [
  { label: "Most Recent", key: "newest" },
  { label: "Highest Rating", key: "rating_desc" },
  { label: "Lowest Rating", key: "rating_asc" },
  { label: "Most Helpful", key: "" },
];

const ReviewSummaryCustom: React.FC<CustomerReviewsProps> = ({
  data,
  settings,
}) => {
  // Extract product data — supports DATA_SOURCE_TYPES.PRODUCT envelope { success, data }
  const product = data?.success ? data.data : null;
  const productLoose = product as
    | (typeof product & {
        averageRating?: number;
        totalReviews?: number;
      })
    | null;

  const {
    title = "Customer Reviews",
    writeReviewButtonText = "Write a review",
    cancelReviewButtonText = "Cancel review",
  } = settings || {};

  // Derive productId / externalId from various inputs
  let productId: string | undefined = undefined;
  let externalId: number | null = null;
  if (product?.id) {
    if (typeof product.id === "string") {
      if (product.id.includes("/")) {
        const idPart = product.id.split("/").pop();
        productId = idPart;
        externalId = idPart ? Number(idPart) : null;
      } else {
        productId = product.id;
        externalId = Number(product.id) || null;
      }
    } else {
      productId = String(product.id);
      externalId = Number(product.id);
    }
  }

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

  // Pre-injected review data fallbacks
  const averageRating =
    data?.averageRating || productLoose?.averageRating || null;
  const totalReviews = data?.totalReviews || productLoose?.totalReviews || null;
  const ratingCounts = data?.ratingCounts || {
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0,
  };

  const onReviewSubmitted = data?.onReviewSubmitted;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [, setRatingCountsState] = useState(ratingCounts);
  const [calculatedTotalReviews, setCalculatedTotalReviews] = useState<
    number | null
  >(totalReviews || null);
  const [calculatedAverageRating, setCalculatedAverageRating] = useState<
    number | null
  >(averageRating || null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [openKwikPass] = useState(false);
  const [selectedSortKey, setSelectedSortKey] = useState<string>("newest");
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchRatingCounts = async () => {
      if (!productId) {
        return;
      }
      try {
        setIsLoadingCounts(true);
        setError(null);

        const reviewCounts = await getProductAverageRating(Number(productId));
        const totalRatings = reviewCounts?.total_ratings;
        const fetchedAverage = reviewCounts?.average_rating;

        if (!reviewCounts) {
          setError("Could not fetch rating counts");
          return;
        }

        const updatedCounts = {
          fiveStarCount: reviewCounts.ratings[5]?.count || 0,
          fourStarCount: reviewCounts.ratings[4]?.count || 0,
          threeStarCount: reviewCounts.ratings[3]?.count || 0,
          twoStarCount: reviewCounts.ratings[2]?.count || 0,
          oneStarCount: reviewCounts.ratings[1]?.count || 0,
        };

        setRatingCountsState(updatedCounts);
        setCalculatedTotalReviews(totalRatings ?? null);
        setCalculatedAverageRating(fetchedAverage ?? null);
      } catch {
        setError("Failed to load rating counts");
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchRatingCounts();
  }, [productId]);

  // Login before writing reviews
  const handleKwikPassLogin = () => {
    try {
      if (typeof window !== "undefined") {
        if (window.__KP_LOGIN_SDK_INSTANCE__) {
          window.__KP_LOGIN_SDK_INSTANCE__.handleKpLogin();
        } else if (window.handleCustomLogin) {
          window.handleCustomLogin(false);
        }
      }
    } catch {
      // Login failed silently
    }
  };

  const rating = calculatedAverageRating ?? 0;
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;

  const toggleReviewForm = () => {
    if (reviewSubmitted) {
      window.scrollTo(0, 0);
      window.location.reload();
    }
    if (!accessToken) {
      handleKwikPassLogin();
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const starPath = STAR_PATH;

  return (
    <div
      data-testid="review-section-container"
      className="w-full mx-auto px-[15px] md:px-[45px] lg:px-[31px]xl:px-0 max-w-[1168px]"
    >
      <div
        data-testid="review-section-inner-container"
        className="mx-auto py-8 md:py-10"
      >
        <div
          data-testid="review-section-summary-card"
          className="rounded-2xl bg-white px-4 pt-6 pb-4 w-full max-w-full shadow-[0px_4px_16px_rgba(0,0,0,0.1)]"
        >
          <h2 className="text-center text-sm font-normal text-[#333333] mb-4 md:mb-6">
            {title}
          </h2>

          {isLoadingCounts ? (
            <div
              data-testid="review-section-loading"
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="inline-block animate-spin rounded-[50%] h-10 w-10 border-2 border-[#222222] border-t-transparent" />
              <p className="mt-3 text-sm text-[#666666]">Loading reviews...</p>
            </div>
          ) : error ? (
            <div
              data-testid="review-section-error"
              className="text-center py-8"
            >
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:items-center lg:gap-24 lg:pl-16">
                <div className="flex flex-col items-center lg:items-start">
                  {calculatedTotalReviews !== null &&
                  calculatedTotalReviews > 0 ? (
                    <>
                      <div className="flex items-center justify-center flex-wrap">
                        {[1, 2, 3, 4, 5].map((i) => {
                          if (i <= fullStars) {
                            return (
                              <svg
                                key={i}
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0 w-[18px] h-[16px]"
                              >
                                <path d={starPath} fill="#FBC210" />
                              </svg>
                            );
                          }
                          if (i === fullStars + 1 && partial > 0) {
                            return (
                              <div
                                key={i}
                                className="relative shrink-0 w-[18px] h-[16px]"
                              >
                                <svg
                                  viewBox="0 0 25 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="absolute inset-0 w-[18px] h-[16px]"
                                >
                                  <path d={starPath} fill="#E5E5E5" />
                                </svg>
                                <svg
                                  viewBox="0 0 25 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="absolute inset-0 overflow-visible w-[18px] h-[16px]"
                                  style={{
                                    clipPath: `inset(0 ${100 - partial * 100}% 0 0)`,
                                  }}
                                >
                                  <path d={starPath} fill="#FBC210" />
                                </svg>
                              </div>
                            );
                          }
                          return (
                            <svg
                              key={i}
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0 w-[18px] h-[16px]"
                            >
                              <path d={starPath} fill="#E5E5E5" />
                            </svg>
                          );
                        })}
                        <span className="ml-2 text-sm text-[#333333] whitespace-nowrap">
                          {rating.toFixed(2)} out of 5
                        </span>
                      </div>
                      <p className="text-text-sm text-[#333333]">
                        Based on {calculatedTotalReviews} reviews
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-[#333333] text-center">
                      Be the first to write a review
                    </p>
                  )}
                </div>

                <div
                  className="hidden lg:block w-px self-stretch bg-[#E0E0E0]"
                  aria-hidden
                />

                <div className="flex justify-center mt-6 md:mt-10 mb-6 md:mb-4 lg:mt-0 lg:mb-0 w-full lg:w-auto">
                  <button
                    id="write-review"
                    aria-label="Write a review"
                    onClick={toggleReviewForm}
                    className="w-full lg:w-60 py-2.5 px-5 rounded-[30px] bg-black text-white text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap leading-[14px]"
                  >
                    {reviewSubmitted
                      ? "Refresh page"
                      : showReviewForm
                        ? cancelReviewButtonText
                        : writeReviewButtonText}
                  </button>
                </div>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                  !showReviewForm
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              ></div>
            </>
          )}

          <div
            className={`mt-6 md:mt-8 border-t border-[#E0E0E0] transition-opacity duration-300 ${
              showReviewForm
                ? "opacity-100"
                : "opacity-0 h-0 mt-0 md:mt-0 overflow-hidden"
            }`}
            aria-hidden
          />

          <ReviewFormCustom
            embedInCard
            isOpen={showReviewForm}
            onClose={() => setShowReviewForm(false)}
            productId={productId}
            externalId={externalId}
            setReviewSubmitted={setReviewSubmitted}
            onSubmit={async () => {
              setReviewSubmitted(true);
              if (onReviewSubmitted) {
                onReviewSubmitted();
              }
            }}
          />

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
              showReviewForm
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            {/* <div className="overflow-hidden">
              <div
                className="border-t border-[#E0E0E0] mx-2 mt-8 md:mt-10"
                aria-hidden
              />
            </div> */}
          </div>
        </div>
      </div>

      {openKwikPass && <KwikPassScriptCustom />}

      {calculatedTotalReviews !== null && calculatedTotalReviews > 0 && (
        <div className="mx-auto pb-6 md:pb-8">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
            <ReviewSortDropdown
              options={REVIEW_SORT_OPTIONS}
              value={selectedSortKey}
              onChange={setSelectedSortKey}
            />
          </div>
        </div>
      )}

      <ReviewsListCustom productId={productId} sortKey={selectedSortKey} />
    </div>
  );
};

export const V1 = ReviewSummaryCustom;
export default ReviewSummaryCustom;
