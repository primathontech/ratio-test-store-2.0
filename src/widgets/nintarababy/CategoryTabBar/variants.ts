import React from "react";
import { CategoryTabBarProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CategoryTabBar variants
 */
export const CategoryTabBarVariants: Record<
  string,
  React.FC<CategoryTabBarProps>
> = {
  v1: V1,
  default: V1,
};

export type CategoryTabBarVariantType = keyof typeof CategoryTabBarVariants;
