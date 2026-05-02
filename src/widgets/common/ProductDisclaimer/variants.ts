import React from "react";
import { ProductDisclaimerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductDisclaimer variants
 */
export const ProductDisclaimerVariants: Record<
  string,
  React.FC<ProductDisclaimerProps>
> = {
  v1: V1,
  default: V1,
};

export type ProductDisclaimerVariantType =
  keyof typeof ProductDisclaimerVariants;
