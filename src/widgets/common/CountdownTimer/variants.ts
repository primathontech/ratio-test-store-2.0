import React from "react";
import { CountdownTimerProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CountdownTimer variants
 */
export const CountdownTimerVariants: Record<
  string,
  React.FC<CountdownTimerProps>
> = {
  v1: V1,
  default: V1,
};

export type CountdownTimerVariantType = keyof typeof CountdownTimerVariants;
