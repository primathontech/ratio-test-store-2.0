import React from "react";
import { LovedByParentsCarouselProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all LovedByParentsCarousel variants
 */
export const LovedByParentsCarouselVariants: Record<
  string,
  React.FC<LovedByParentsCarouselProps>
> = {
  v1: V1,
  default: V1,
};

export type LovedByParentsCarouselVariantType =
  keyof typeof LovedByParentsCarouselVariants;
