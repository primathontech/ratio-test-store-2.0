import React from "react";
import { BottomBarProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all BottomBar variants
 */
export const BottomBarVariants: Record<string, React.FC<BottomBarProps>> = {
  v1: V1,
  default: V1,
};

export type BottomBarVariantType = keyof typeof BottomBarVariants;
