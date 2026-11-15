/**
 * A/B testing — app-level wiring for `@shopkit/ab`.
 *
 * The package takes a base URL and a theme id and knows nothing about this app.
 * Supplying both from ONE place is what stops the edge and the render
 * disagreeing about which experiment is running.
 */

import {
  getManifest,
  matchExperiment,
  selectionFor,
  templateKeyOf,
  type Arm,
  type SectionVariantSelection,
} from "@shopkit/ab";

// Direct module path, not the `@/utils` barrel: this file runs in the EDGE
// middleware, and the barrel re-exports React hooks.
import { getThemeName } from "@/utils/theme-name";

/**
 * What the render resolved for this arm: which sections to overlay, and the
 * dimensions to report. Both absent when the experiment does not apply here.
 */
export interface ArmContext {
  selection?: SectionVariantSelection;
  report?: { experiment: string; arm: Arm; page: string };
}

// Re-exported so the `_render` bodies have one A/B import, and so the id format
// stays owned by the package that also compares against it.
export { templateKeyOf };

/** Same var the template/translation loaders use, so staging stays consistent. */
function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_EDITOR_API_URL ||
    "https://api-gw-v4.dev.gokwik.in/uat/os-editor"
  );
}

/** `themeId` on the backend IS `merchant_mappings.merchantName`. */
function themeId(): string {
  return getThemeName();
}

/**
 * Which section variants to render for a visitor on `arm`.
 *
 * `pathname` is the page's OWN route (`/products/x`), never the rewritten
 * `/variant/b` — `pageTypeOf` returns null for that by design.
 * `templateKey` is the template that actually resolved.
 *
 * Undefined means nothing to overlay; the engine then returns the config by
 * reference, so the unbucketed path costs nothing.
 */
export async function getArmSelection(
  pathname: string,
  arm: Arm,
  templateKey: string
): Promise<ArmContext> {
  // No early return for arm "a": after a promote, `liveVariantId` is "b", so
  // "live" means B and an un-pinned arm A would render arm B's page.
  const theme = themeId();
  if (!theme) {
    return {};
  }

  // Awaits, unlike middleware's read: a page can afford the wait, and returning
  // "no experiments" here would let the edge bucket a visitor this render then
  // refuses to serve — the exact mismatch `report` exists to remove.
  const manifest = await getManifest({
    baseUrl: baseUrl(),
    themeId: theme,
    merchantId: merchantId(),
  });

  // Passed here and NOT in middleware: the edge only has a URL, and a product's
  // template suffix lives on the product. First place that knows the template.
  const experiment = matchExperiment(pathname, manifest, templateKey);
  if (!experiment) {
    return {};
  }

  return {
    selection: selectionFor(experiment, arm),
    // Reported from HERE rather than from middleware, which matches on page type
    // alone and cannot see the resolved template. When the two disagreed the
    // visitor was counted in arm B while shown arm A, which quietly destroys a
    // test's ability to detect a real difference.
    report: {
      experiment: experiment.templateKey,
      arm,
      page: experiment.pageType,
    },
  };
}

/** The only arm values a mirror route may render. */
export function isArm(value: string | undefined): value is Arm {
  return value === "a" || value === "b";
}

/** Narrow a raw route param to an arm. Callers must gate on `isArm` first. */
export function toArm(value: string | undefined): Arm {
  return value === "b" ? "b" : "a";
}

/** Sent as gk-merchant-id: the API gateway rate-limits per merchant on it. */
function merchantId(): string | undefined {
  return process.env.NEXT_PUBLIC_MERCHANT_ID || undefined;
}

export {
  baseUrl as abBaseUrl,
  themeId as abThemeId,
  merchantId as abMerchantId,
};
