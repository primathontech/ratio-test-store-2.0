import { V1 } from "./V1";

export const ReasonToLoveSectionVariant = {
  v1: V1,
  default: V1, // fallback
};

export type ReasonToLoveSectionType = keyof typeof ReasonToLoveSectionVariant;
