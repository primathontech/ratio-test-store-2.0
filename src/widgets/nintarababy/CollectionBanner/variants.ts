import React from "react";
import { CollectionBannerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionBanner variants
 */
export const CollectionBannerVariants: Record<
  string,
  React.FC<CollectionBannerProps>
> = {
  v1: V1,
  default: V1,
};

export type CollectionBannerVariantType = keyof typeof CollectionBannerVariants;
