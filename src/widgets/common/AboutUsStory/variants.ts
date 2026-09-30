import React from "react";
import { AboutUsStoryProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all AboutUsStory variants
 */
export const AboutUsStoryVariants: Record<
  string,
  React.FC<AboutUsStoryProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type AboutUsStoryVariantType = keyof typeof AboutUsStoryVariants;
