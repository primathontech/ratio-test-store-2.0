import React from "react";
import { VideoAppProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all VideoApp variants.
 */
export const VideoAppVariants: Record<string, React.FC<VideoAppProps>> = {
  v1: V1,
  default: V1,
};

export type VideoAppVariantType = keyof typeof VideoAppVariants;
