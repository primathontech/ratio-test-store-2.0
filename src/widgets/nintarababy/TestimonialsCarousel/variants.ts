import React from "react";
import { TestimonialsCarouselProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all TestimonialsCarousel variants
 */
export const TestimonialsCarouselVariants: Record<
  string,
  React.FC<TestimonialsCarouselProps>
> = {
  v1: V1,
  default: V1,
};

export type TestimonialsCarouselVariantType =
  keyof typeof TestimonialsCarouselVariants;
