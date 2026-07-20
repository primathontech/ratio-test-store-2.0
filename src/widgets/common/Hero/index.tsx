"use client";

import React from "react";
import { resolveLogic } from "../../_resolve";
import type { HeroProps } from "./types";
import type { HeroSharedSettings } from "./contract";
import { buildHeroVM, type HeroWidgetData } from "./logic";
import { HeroVariants } from "./variants";
// Library-default scheme tokens — keep the Color Scheme setting functional in
// hosts whose theme.json defines no scheme-N colors (theme values override).
import "./_shared/tokens.css";

/**
 * Hero Widget — common storefront hero section.
 *
 * Builds the HeroVM once via the section's single logic entry (a fork's
 * logic-wrap override wins — see widgets/_overrides.ts) and dispatches to the
 * selected variant, which renders ONLY the VM:
 *   - v1: image-banner look (two side-by-side images + overlaid content)
 *   - v2: media hero (image/video slots + reorderable content blocks)
 *   - v3: ambient video hero (background YouTube video + centered content)
 */
export function Hero({ data, settings, className, locale }: HeroProps) {
  const build = resolveLogic("Hero", buildHeroVM);
  const vm = build(
    data as HeroWidgetData | undefined,
    settings as HeroSharedSettings | undefined
  );
  const VariantComponent = HeroVariants[vm.variant] ?? HeroVariants.default;

  return <VariantComponent vm={vm} className={className} locale={locale} />;
}

export { HeroVariants } from "./variants";

export default Hero;
