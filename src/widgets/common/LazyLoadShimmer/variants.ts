import React from "react";
import { LazyLoadShimmerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all LazyLoadShimmer variants
 */
export const LazyLoadShimmerVariants: Record<
  string,
  React.FC<LazyLoadShimmerProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type LazyLoadShimmerVariantType = keyof typeof LazyLoadShimmerVariants;
