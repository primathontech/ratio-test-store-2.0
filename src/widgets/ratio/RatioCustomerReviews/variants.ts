import React from "react";
import { RatioCustomerReviewsProps } from "./types";
import { V1 } from "./V1";

export const RatioCustomerReviewsVariants: Record<
  string,
  React.FC<RatioCustomerReviewsProps>
> = {
  v1: V1,
  default: V1,
};

export type RatioCustomerReviewsVariantType =
  keyof typeof RatioCustomerReviewsVariants;
