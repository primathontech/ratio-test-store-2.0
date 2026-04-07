import React from "react";
import { HowItWorksBannerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all HowItWorksBanner variants
 */
export const HowItWorksBannerVariants: Record<
  string,
  React.FC<HowItWorksBannerProps>
> = {
  v1: V1,
  default: V1,
};

export type HowItWorksBannerVariantType = keyof typeof HowItWorksBannerVariants;
