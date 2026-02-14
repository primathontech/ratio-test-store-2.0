"use client";

import React from "react";
import { ReviewSectionVariants } from "./variants";
import { ReviewSectionProps } from "./types";

/**
 * Main ReviewSection Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  title: "Customer Reviews",
  showReviewForm: true,
  showRatingDistribution: true,
  showRatingSummary: true,
  showReviewList: false,
  initialReviewCount: 10,
  enablePagination: false,
  reviewsPerPage: 10,
  allowWriteReview: true,
  requireLoginToReview: true,
  writeReviewButtonText: "Write a review",
  emptyStateMessage: "Be the first to write a review",
};

export function ReviewSection({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ReviewSectionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ReviewSectionVariants[variant as keyof typeof ReviewSectionVariants];

  if (!VariantComponent) {
    console.warn(`ReviewSection variant "${variant}" not found, using default`);
    const DefaultComponent = ReviewSectionVariants.default;
    return (
      <DefaultComponent
        data={data}
        settings={settings}
        className={className}
        locale={locale}
      />
    );
  }

  return (
    <VariantComponent
      data={data}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
}

export default ReviewSection;
