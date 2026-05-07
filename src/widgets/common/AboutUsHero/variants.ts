import React from "react";
import { AboutUsHeroProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all AboutUsHero variants
 */
export const AboutUsHeroVariants: Record<string, React.FC<AboutUsHeroProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type AboutUsHeroVariantType = keyof typeof AboutUsHeroVariants;
