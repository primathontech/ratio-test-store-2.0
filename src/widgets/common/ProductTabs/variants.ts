import React from "react";
import { ProductTabsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductTabs variants
 */
export const ProductTabsVariants: Record<string, React.FC<ProductTabsProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ProductTabsVariantType = keyof typeof ProductTabsVariants;
