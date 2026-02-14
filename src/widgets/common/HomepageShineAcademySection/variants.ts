import { V1 } from "./V1";

export const HomepageShineAcademySectionVariant = {
  v1: V1,
  default: V1, // fallback
};

export type HomepageShineAcademySectionType =
  keyof typeof HomepageShineAcademySectionVariant;
