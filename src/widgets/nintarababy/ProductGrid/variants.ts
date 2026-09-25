import React from "react";
import { ProductGridProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductGrid variants
 */
export const ProductGridVariants: Record<string, React.FC<ProductGridProps>> = {
  v1: V1,
  default: V1,
};

export type ProductGridVariantType = keyof typeof ProductGridVariants;
