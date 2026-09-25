import React from "react";
import { FeaturedProductsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FeaturedProducts variants
 */
export const FeaturedProductsVariants: Record<
  string,
  React.FC<FeaturedProductsProps>
> = {
  v1: V1,
  default: V1,
};

export type FeaturedProductsVariantType = keyof typeof FeaturedProductsVariants;
