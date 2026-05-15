import React from "react";
import { NotFoundProps } from "./types";
import { V1 } from "./V1";

export const NotFoundVariants: Record<string, React.FC<NotFoundProps>> = {
  v1: V1,
  default: V1,
};

export type NotFoundVariantType = keyof typeof NotFoundVariants;
