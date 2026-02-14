import React from "react";
import { ProductInfoProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductInfo variants
 */
export const ProductInfoVariants: Record<string, React.FC<ProductInfoProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ProductInfoVariantType = keyof typeof ProductInfoVariants;
