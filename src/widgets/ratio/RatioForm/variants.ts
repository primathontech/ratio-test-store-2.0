import React from "react";
import { RatioFormProps } from "./types";
import { V1 } from "./V1";

export const RatioFormVariants: Record<string, React.FC<RatioFormProps>> = {
  v1: V1,
  default: V1,
};

export type RatioFormVariantType = keyof typeof RatioFormVariants;
