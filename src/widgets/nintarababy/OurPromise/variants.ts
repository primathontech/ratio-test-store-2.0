import React from "react";
import { OurPromiseProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all OurPromise variants
 */
export const OurPromiseVariants: Record<string, React.FC<OurPromiseProps>> = {
  v1: V1,
  default: V1,
};

export type OurPromiseVariantType = keyof typeof OurPromiseVariants;
