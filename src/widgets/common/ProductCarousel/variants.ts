import React from "react";
import { ProductCarouselProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductCarousel variants
 */
export const ProductCarouselVariants: Record<
  string,
  React.FC<ProductCarouselProps>
> = {
  v1: V1,
  default: V1,
};

export type ProductCarouselVariantType = keyof typeof ProductCarouselVariants;
