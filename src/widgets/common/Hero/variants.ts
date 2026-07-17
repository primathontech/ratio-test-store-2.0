import type React from "react";
import dynamic from "next/dynamic";
import type { HeroVM } from "./contract";

/** Props every Hero variant receives — the VM seam (never raw settings). */
export interface HeroVariantProps {
  vm: HeroVM;
  className?: string;
  locale?: string;
}

// Each look is a lazy chunk (SSR stays on) so a storefront only downloads the
// variant its template actually renders — the others never reach the shopper.
const V1 = dynamic(() => import("./V1").then((m) => m.V1));
const V2 = dynamic(() => import("./V2").then((m) => m.V2));
const V3 = dynamic(() => import("./V3").then((m) => m.V3));
const V4 = dynamic(() => import("./V4").then((m) => m.V4));

/**
 * Registry for all Hero variants. Each look renders the same HeroVM; its
 * typed extension (vm.v1/v2/v3) carries the variant-specific options.
 */
export const HeroVariants: Record<
  string,
  React.ComponentType<HeroVariantProps>
> = {
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4,
  default: V1,
};

export type HeroVariantType = keyof typeof HeroVariants;
