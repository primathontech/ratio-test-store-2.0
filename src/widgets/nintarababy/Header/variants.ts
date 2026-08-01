import React from "react";
import { NintaraHeaderProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all NintaraHeader variants
 */
export const NintaraHeaderVariants: Record<
  string,
  React.FC<NintaraHeaderProps>
> = {
  v1: V1,
  default: V1,
};

export type NintaraHeaderVariantType = keyof typeof NintaraHeaderVariants;
