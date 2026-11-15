import React from "react";
import { FeaturedCollectionCarouselProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FeaturedCollectionCarousel variants
 */
export const FeaturedCollectionCarouselVariants: Record<
  string,
  React.FC<FeaturedCollectionCarouselProps>
> = {
  v1: V1,
  default: V1,
};

export type FeaturedCollectionCarouselVariantType =
  keyof typeof FeaturedCollectionCarouselVariants;
