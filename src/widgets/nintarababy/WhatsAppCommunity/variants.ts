import React from "react";
import { WhatsAppCommunityProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all WhatsAppCommunity variants
 */
export const WhatsAppCommunityVariants: Record<
  string,
  React.FC<WhatsAppCommunityProps>
> = {
  v1: V1,
  default: V1,
};

export type WhatsAppCommunityVariantType =
  keyof typeof WhatsAppCommunityVariants;
