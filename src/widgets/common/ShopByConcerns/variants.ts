import React from "react";
import { ShopByConcernsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ShopByConcerns variants
 */
export const ShopByConcernsVariants: Record<
  string,
  React.FC<ShopByConcernsProps>
> = {
  v1: V1,
  default: V1,
};

export type ShopByConcernsVariantType = keyof typeof ShopByConcernsVariants;
