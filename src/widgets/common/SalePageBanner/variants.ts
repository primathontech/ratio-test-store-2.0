import React from "react";
import type { SalePageBannerProps } from "./types";
import { V1 } from "./V1";

export const SalePageBannerVariants: Record<
  string,
  React.FC<SalePageBannerProps>
> = {
  v1: V1,
  default: V1,
};

export type SalePageBannerVariantType = keyof typeof SalePageBannerVariants;
