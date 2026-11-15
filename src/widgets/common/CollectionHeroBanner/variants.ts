import React from "react";
import { CollectionHeroBannerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionHeroBanner variants
 */
export const CollectionHeroBannerVariants: Record<
  string,
  React.FC<CollectionHeroBannerProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type CollectionHeroBannerVariantType =
  keyof typeof CollectionHeroBannerVariants;
