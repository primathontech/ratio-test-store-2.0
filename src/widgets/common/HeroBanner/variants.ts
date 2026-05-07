import React from "react";
import { HeroBannerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all HeroBanner variants
 */
export const HeroBannerVariants: Record<string, React.FC<HeroBannerProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type HeroBannerVariantType = keyof typeof HeroBannerVariants;
