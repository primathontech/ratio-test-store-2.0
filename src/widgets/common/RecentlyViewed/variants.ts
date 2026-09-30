import React from "react";
import { RecentlyViewedProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all RecentlyViewed variants
 */
export const RecentlyViewedVariants: Record<
  string,
  React.FC<RecentlyViewedProps>
> = {
  v1: V1,
  default: V1,
};

export type RecentlyViewedVariantType = keyof typeof RecentlyViewedVariants;
