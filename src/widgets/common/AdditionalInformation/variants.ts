import React from "react";
import { AdditionalInformationProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all AdditionalInformation variants
 */
export const AdditionalInformationVariants: Record<
  string,
  React.FC<AdditionalInformationProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type AdditionalInformationVariantType =
  keyof typeof AdditionalInformationVariants;
