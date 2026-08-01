import React from "react";
import { MobileBottomBarProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all MobileBottomBar variants
 */
export const MobileBottomBarVariants: Record<
  string,
  React.FC<MobileBottomBarProps>
> = {
  v1: V1,
  default: V1,
};

export type MobileBottomBarVariantType = keyof typeof MobileBottomBarVariants;
