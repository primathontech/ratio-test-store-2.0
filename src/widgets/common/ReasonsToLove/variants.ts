import React from "react";
import { ReasonsToLoveProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ReasonsToLove variants
 */
export const ReasonsToLoveVariants: Record<
  string,
  React.FC<ReasonsToLoveProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ReasonsToLoveVariantType = keyof typeof ReasonsToLoveVariants;
