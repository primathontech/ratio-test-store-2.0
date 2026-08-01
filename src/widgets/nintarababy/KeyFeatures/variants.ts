import React from "react";
import { KeyFeaturesProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all KeyFeatures variants
 */
export const KeyFeaturesVariants: Record<string, React.FC<KeyFeaturesProps>> = {
  v1: V1,
  default: V1,
};

export type KeyFeaturesVariantType = keyof typeof KeyFeaturesVariants;
