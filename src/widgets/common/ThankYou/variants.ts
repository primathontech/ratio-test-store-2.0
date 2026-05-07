import React from "react";
import { ThankYouProps } from "./types";
import { V1 } from "./V1";

export const ThankYouVariants: Record<string, React.FC<ThankYouProps>> = {
  v1: V1,
  default: V1,
};

export type ThankYouVariantType = keyof typeof ThankYouVariants;
