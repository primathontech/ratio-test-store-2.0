import React from "react";
import { RatioVideoProps } from "./types";
import { V1 } from "./V1";

export const RatioVideoVariants: Record<string, React.FC<RatioVideoProps>> = {
  v1: V1,
  default: V1,
};

export type RatioVideoVariantType = keyof typeof RatioVideoVariants;
