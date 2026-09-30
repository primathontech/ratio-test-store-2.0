import React from "react";
import { StickyAddToCartProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all StickyAddToCart variants
 */
export const StickyAddToCartVariants: Record<
  string,
  React.FC<StickyAddToCartProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type StickyAddToCartVariantType = keyof typeof StickyAddToCartVariants;
