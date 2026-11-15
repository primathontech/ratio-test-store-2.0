import React from "react";
import { ProductFAQProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductFAQ variants
 */
export const ProductFAQVariants: Record<string, React.FC<ProductFAQProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ProductFAQVariantType = keyof typeof ProductFAQVariants;
