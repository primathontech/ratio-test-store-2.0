import React from "react";
import { AnnouncementBarProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all AnnouncementBar variants
 */
export const AnnouncementBarVariants: Record<
  string,
  React.FC<AnnouncementBarProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type AnnouncementBarVariantType = keyof typeof AnnouncementBarVariants;
