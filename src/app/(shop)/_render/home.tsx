// app/page.tsx
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getArmSelection, templateKeyOf } from "@/bootstrap/ab";
import { ArmReport } from "@/bootstrap/ab/ArmReport";
import type { Arm } from "@shopkit/ab";

// Generate metadata for home page
export async function pageMetadata(): Promise<Metadata> {
  return getPageMetadata({ pageType: "home", path: "/" });
}

/**
 * The home page body, with an optional A/B arm.
 *
 * A NAMED export rather than the default one: Next validates a page's default
 * export against `PageProps` and rejects any extra prop, so `arm` cannot travel
 * that way. The `/variant/[arm]` mirror route calls this directly.
 *
 * The body stays in this file rather than moving to a shared module — moving it
 * would touch working code in every merchant's app to serve a feature most of
 * them will never switch on. `arm` is absent on every ordinary request, and an
 * absent arm produces no selection, so this behaves exactly as it did before
 * A/B existed.
 */
export async function renderHome(arm?: Arm) {
  // Full ISR: no searchParams read (that would force dynamic rendering).
  // Shopper traffic renders the published template; editor previews run on the
  // /internal-preview route + the draft-mode pipeline, so this stays static.
  const themeName = getThemeName();
  const locale = getStaticLocale();

  // "/" — this page's own logical path, not the rewritten "/variant/b" one.
  // Matching on the rewritten path would find no experiment, by design.
  const ab = arm
    ? await getArmSelection(
        "/",
        arm,
        templateKeyOf(themeName, TEMPLATE_TYPES.home)
      )
    : undefined;

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
    query: {},
    sectionVariants: ab?.selection,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder();

  // The builder uses "merchantName" internally to load themes/templates from
  // @/themes/{name}/templates/, so we pass themeName here.
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return (
    <>
      <ArmReport report={ab?.report} />
      {pageContent}
    </>
  );
}
