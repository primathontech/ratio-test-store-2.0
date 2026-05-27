import React from "react";
import { CollectionTimerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionTimer variants
 */
export const CollectionTimerVariants: Record<
  string,
  React.FC<CollectionTimerProps>
> = {
  v1: V1,
  default: V1,
};

export type CollectionTimerVariantType = keyof typeof CollectionTimerVariants;
