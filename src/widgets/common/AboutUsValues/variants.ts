import React from "react";
import { AboutUsValuesProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all AboutUsValues variants
 */
export const AboutUsValuesVariants: Record<
  string,
  React.FC<AboutUsValuesProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type AboutUsValuesVariantType = keyof typeof AboutUsValuesVariants;
