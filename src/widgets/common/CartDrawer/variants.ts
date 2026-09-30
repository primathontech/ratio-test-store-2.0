import React from "react";
import { CartDrawerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CartDrawer variants
 */
export const CartDrawerVariants: Record<string, React.FC<CartDrawerProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type CartDrawerVariantType = keyof typeof CartDrawerVariants;
