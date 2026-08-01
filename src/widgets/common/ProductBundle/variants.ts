import React from "react";
import { ProductBundleProps } from "./types";
import { V1 } from "./V1";

export const ProductBundleVariants: Record<
  string,
  React.FC<ProductBundleProps>
> = {
  v1: V1,
  default: V1,
};

export type ProductBundleVariantType = keyof typeof ProductBundleVariants;
