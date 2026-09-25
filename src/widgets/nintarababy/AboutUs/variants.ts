import React from "react";
import { AboutUsProps } from "./types";
import { V1 } from "./V1";

export const AboutUsVariants: Record<string, React.FC<AboutUsProps>> = {
  v1: V1,
  default: V1,
};

export type AboutUsVariantType = keyof typeof AboutUsVariants;
