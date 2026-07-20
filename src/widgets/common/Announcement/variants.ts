import type React from "react";
import dynamic from "next/dynamic";
import type { AnnouncementVM } from "./contract";

/** Props every variant receives — the VM seam (never raw settings). */
export interface AnnouncementVariantProps {
  vm: AnnouncementVM;
  className?: string;
  locale?: string;
}

// Each look is a lazy chunk (SSR stays on) so a storefront only downloads the
// variant its template actually renders — the others never reach the shopper.
const V1 = dynamic(() => import("./V1").then((m) => m.V1));
const V2 = dynamic(() => import("./V2").then((m) => m.V2));
const V3 = dynamic(() => import("./V3").then((m) => m.V3));

export const AnnouncementVariants: Record<
  string,
  React.ComponentType<AnnouncementVariantProps>
> = {
  v1: V1,
  v2: V2,
  v3: V3,
  default: V1,
};
