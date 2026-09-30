import React from "react";
import { FBTProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FBT variants.
 */
export const FBTVariants: Record<string, React.FC<FBTProps>> = {
  v1: V1,
  default: V1,
};

export type FBTVariantType = keyof typeof FBTVariants;
