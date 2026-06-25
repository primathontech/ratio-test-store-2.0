// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";

// PERF/leak test: was `revalidate = 30`. On a near-idle pod, Site24x7/probe pings
// keep this page warm and ISR re-renders it every 30s, each render fanning out ~12+
// commerce fetches (AbortSignal.timeout) + native JSON decompression -> off-heap RSS
// churn. aqualogica (revalidate=3600) leaks ~15x slower than bblunt (revalidate=30)
// despite MORE traffic -> the leak tracks re-render frequency. Raised to 3600 to test.
// Do NOT delete this export: the page awaits searchParams (dynamic API), so removing it
// flips the route to per-request dynamic rendering (more renders, not fewer).
/** ISR — revalidate collection data every 1 hour */
export const revalidate = 3600;

// Generate metadata for home page
export async function generateMetadata(): Promise<Metadata> {
  return resolveCommercePageSEO("home", null, "/");
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(searchParams);

  const merchantName = getMerchantName();
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  // Get the page builder (widgets auto-loaded)
  const pageBuilder = getPageBuilder({ isEditor });

  // Note: The builder uses "merchantName" internally for loading themes/templates
  // from @/themes/{name}/templates/, so we pass themeName here
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
    pageConfig: previewPageConfig,
  });

  return <>{pageContent}</>;
}
