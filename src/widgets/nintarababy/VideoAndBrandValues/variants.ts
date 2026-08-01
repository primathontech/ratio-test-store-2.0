import React from "react";
import { VideoAndBrandValuesProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all VideoAndBrandValues variants
 */
export const VideoAndBrandValuesVariants: Record<
  string,
  React.FC<VideoAndBrandValuesProps>
> = {
  v1: V1,
  default: V1,
};

export type VideoAndBrandValuesVariantType =
  keyof typeof VideoAndBrandValuesVariants;
