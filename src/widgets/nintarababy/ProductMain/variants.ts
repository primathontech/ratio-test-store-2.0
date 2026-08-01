import React from "react";
import { ProductMainProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductMain variants
 */
export const ProductMainVariants: Record<string, React.FC<ProductMainProps>> = {
  v1: V1,
  default: V1,
};

export type ProductMainVariantType = keyof typeof ProductMainVariants;
