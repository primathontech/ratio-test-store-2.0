import React from "react";
import { ShineAcademyBannerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ShineAcademyBanner variants
 */
export const ShineAcademyBannerVariants: Record<
  string,
  React.FC<ShineAcademyBannerProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ShineAcademyBannerVariantType =
  keyof typeof ShineAcademyBannerVariants;
