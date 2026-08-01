import React from "react";
import { HowToUseInstructionsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all HowToUseInstructions variants
 */
export const HowToUseInstructionsVariants: Record<
  string,
  React.FC<HowToUseInstructionsProps>
> = {
  v1: V1,
  default: V1,
};

export type HowToUseInstructionsVariantType =
  keyof typeof HowToUseInstructionsVariants;
