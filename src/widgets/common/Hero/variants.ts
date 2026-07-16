import React from "react";
import type { HeroVM } from "./contract";
import { V1 } from "./V1";
import { V2 } from "./V2";
import { V3 } from "./V3";
import { V4 } from "./V4";

/** Props every Hero variant receives — the VM seam (never raw settings). */
export interface HeroVariantProps {
  vm: HeroVM;
  className?: string;
  locale?: string;
}

/**
 * Registry for all Hero variants. Each look renders the same HeroVM; its
 * typed extension (vm.v1/v2/v3) carries the variant-specific options.
 */
export const HeroVariants: Record<string, React.FC<HeroVariantProps>> = {
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4,
  default: V1,
};

export type HeroVariantType = keyof typeof HeroVariants;
