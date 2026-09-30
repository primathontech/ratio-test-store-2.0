import React from "react";
import { ProductDetailProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductDetail variants
 */
export const ProductDetailVariants: Record<
  string,
  React.FC<ProductDetailProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ProductDetailVariantType = keyof typeof ProductDetailVariants;
