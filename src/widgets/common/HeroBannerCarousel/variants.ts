import React from "react";
import { HeroBannerCarouselProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all HeroBannerCarousel variants
 */
export const HeroBannerCarouselVariants: Record<
  string,
  React.FC<HeroBannerCarouselProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type HeroBannerCarouselVariantType =
  keyof typeof HeroBannerCarouselVariants;
