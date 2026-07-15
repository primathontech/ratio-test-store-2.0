"use client";

import React from "react";
import { resolveLogic } from "../../_resolve";
import type { AnnouncementProps } from "./types";
import type { AnnouncementSharedSettings } from "./contract";
import { buildAnnouncementVM } from "./logic";
import { AnnouncementVariants } from "./variants";
// Library-default scheme tokens — keep the Color Scheme setting functional in
// hosts whose theme.json defines no scheme-N colors (theme values override).
import "./_shared/tokens.css";

/**
 * Announcement Widget — common storefront announcement bar section.
 *
 * Builds the AnnouncementVM once via the section's single logic entry (a
 * fork's logic-wrap override wins — see widgets/_overrides.ts) and dispatches
 * to the selected variant, which renders ONLY the VM:
 *   - v1: minimal centered bar (static / prev-next carousel)
 *   - v2: crossfade slider (rich-text messages, hover pause, chevrons)
 *   - v3: marquee ticker (clone-wrap slide track, sticky option)
 * All three consume the shared useAnnouncementRotation hook from logic.ts.
 */
export function Announcement({
  data,
  settings,
  className,
  locale,
}: AnnouncementProps) {
  const build = resolveLogic("Announcement", buildAnnouncementVM);
  const vm = build(data, settings as AnnouncementSharedSettings | undefined);
  const VariantComponent =
    AnnouncementVariants[vm.variant] ?? AnnouncementVariants.default;

  return <VariantComponent vm={vm} className={className} locale={locale} />;
}

export { AnnouncementVariants } from "./variants";

export default Announcement;
