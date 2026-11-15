import React from "react";
import { ShopByCategoriesProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ShopByCategories variants
 */
export const ShopByCategoriesVariants: Record<
  string,
  React.FC<ShopByCategoriesProps>
> = {
  v1: V1,
  default: V1,
};

export type ShopByCategoriesVariantType = keyof typeof ShopByCategoriesVariants;
