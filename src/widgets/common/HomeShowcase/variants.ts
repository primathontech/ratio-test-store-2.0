import React from "react";
import { HomeShowcaseProps } from "./types";
import { V1 } from "./V1";

export const HomeShowcaseVariants: Record<
  string,
  React.FC<HomeShowcaseProps>
> = {
  v1: V1,
  default: V1,
};

export type HomeShowcaseVariantType = keyof typeof HomeShowcaseVariants;
