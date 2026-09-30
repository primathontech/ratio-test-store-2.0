import React from "react";
import { HeaderProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all Header variants
 */
export const HeaderVariants: Record<string, React.FC<HeaderProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type HeaderVariantType = keyof typeof HeaderVariants;
