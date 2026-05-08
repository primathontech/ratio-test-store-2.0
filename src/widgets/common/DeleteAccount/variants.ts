import React from "react";
import { DeleteAccountProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all DeleteAccount variants
 */
export const DeleteAccountVariants: Record<
  string,
  React.FC<DeleteAccountProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type DeleteAccountVariantType = keyof typeof DeleteAccountVariants;
