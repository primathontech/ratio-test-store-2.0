import React from "react";
import { FloatingActionsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FloatingActions variants
 */
export const FloatingActionsVariants: Record<
  string,
  React.FC<FloatingActionsProps>
> = {
  v1: V1,
  default: V1,
};

export type FloatingActionsVariantType = keyof typeof FloatingActionsVariants;
