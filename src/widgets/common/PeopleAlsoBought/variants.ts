import React from "react";
import { PeopleAlsoBoughtProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all PeopleAlsoBought variants
 */
export const PeopleAlsoBoughtVariants: Record<
  string,
  React.FC<PeopleAlsoBoughtProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type PeopleAlsoBoughtVariantType = keyof typeof PeopleAlsoBoughtVariants;
