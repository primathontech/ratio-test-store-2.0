import React from "react";
import { WelcomeProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all Welcome variants
 */
export const WelcomeVariants: Record<string, React.FC<WelcomeProps>> = {
  v1: V1,
  default: V1,
};

export type WelcomeVariantType = keyof typeof WelcomeVariants;
