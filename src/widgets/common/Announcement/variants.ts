import React from "react";
import type { AnnouncementVM } from "./contract";
import { V1 } from "./V1";
import { V2 } from "./V2";
import { V3 } from "./V3";

/** Props every variant receives — the VM seam (never raw settings). */
export interface AnnouncementVariantProps {
  vm: AnnouncementVM;
  className?: string;
  locale?: string;
}

export const AnnouncementVariants: Record<
  string,
  React.FC<AnnouncementVariantProps>
> = {
  v1: V1,
  v2: V2,
  v3: V3,
  default: V1,
};
