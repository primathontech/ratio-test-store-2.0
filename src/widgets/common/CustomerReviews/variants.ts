import React from "react";
import { CustomerReviewsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CustomerReviews variants
 */
export const CustomerReviewsVariants: Record<
  string,
  React.FC<CustomerReviewsProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type CustomerReviewsVariantType = keyof typeof CustomerReviewsVariants;
