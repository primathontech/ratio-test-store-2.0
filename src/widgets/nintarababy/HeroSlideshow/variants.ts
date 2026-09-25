import React from "react";
import { HeroSlideshowProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all HeroSlideshow variants
 */
export const HeroSlideshowVariants: Record<
  string,
  React.FC<HeroSlideshowProps>
> = {
  v1: V1,
  default: V1,
};

export type HeroSlideshowVariantType = keyof typeof HeroSlideshowVariants;
