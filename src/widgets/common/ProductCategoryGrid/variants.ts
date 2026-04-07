import React from "react";
import { ProductCategoryGridProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductCategoryGrid variants
 */
export const ProductCategoryGridVariants: Record<
  string,
  React.FC<ProductCategoryGridProps>
> = {
  v1: V1,
  default: V1,
};

export type ProductCategoryGridVariantType =
  keyof typeof ProductCategoryGridVariants;
