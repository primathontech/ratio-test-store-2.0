import React from "react";
import { FilterSortBarProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FilterSortBar variants
 */
export const FilterSortBarVariants: Record<
  string,
  React.FC<FilterSortBarProps>
> = {
  v1: V1,
  default: V1,
};

export type FilterSortBarVariantType = keyof typeof FilterSortBarVariants;
