"use client";

import React from "react";
import { resolveLogic } from "../../_resolve";
import type { FaqProps } from "./types";
import type { FaqSharedSettings } from "./contract";
import { buildFaqVM } from "./logic";
import { FaqVariants } from "./variants";
// Library-default scheme tokens — keep the Color Scheme setting functional in
// hosts whose theme.json defines no scheme-N colors (theme values override).
import "./_shared/tokens.css";

/**
 * FAQ Widget — common storefront FAQ / accordion section.
 *
 * Builds the FaqVM once via the section's single logic entry (a fork's
 * logic-wrap override wins — see widgets/_overrides.ts) and dispatches to the
 * selected variant, which renders ONLY the VM:
 *   - v1: collapsible content (native <details>, optional side image)
 *   - v2: flat accordion (caret/plus icons, dividers, per-row open state)
 *   - v3: animated single-open accordion (client state via useFaqLogic)
 */
export function Faq({ data, settings, className, locale }: FaqProps) {
  const build = resolveLogic("Faq", buildFaqVM);
  const vm = build(data, settings as FaqSharedSettings | undefined);
  const VariantComponent = FaqVariants[vm.variant] ?? FaqVariants.default;

  return <VariantComponent vm={vm} className={className} locale={locale} />;
}

export { FaqVariants } from "./variants";

export default Faq;
