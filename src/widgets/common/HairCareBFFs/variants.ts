import React from "react";
import { HairCareBFFsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all HairCareBFFs variants
 */
export const HairCareBFFsVariants: Record<
  string,
  React.FC<HairCareBFFsProps>
> = {
  v1: V1,
  default: V1,
};

export type HairCareBFFsVariantType = keyof typeof HairCareBFFsVariants;
