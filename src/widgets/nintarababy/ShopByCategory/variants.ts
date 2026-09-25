import React from "react";
import { ShopByCategoryProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ShopByCategory variants
 */
export const ShopByCategoryVariants: Record<
  string,
  React.FC<ShopByCategoryProps>
> = {
  v1: V1,
  default: V1,
};

export type ShopByCategoryVariantType = keyof typeof ShopByCategoryVariants;
