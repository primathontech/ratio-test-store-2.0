// app/page.tsx
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";
import type { PageConfig } from "@shopkit/builder";

export const revalidate = 30;

// Generate metadata for home page
export async function generateMetadata(): Promise<Metadata> {
  return resolveCommercePageSEO("home", null, "/");
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  // Editor preview state from the URL (?editor / ?previewKey). `isEditor`
  // selects the editor (client-shim) widget manifest so live overrides reach
  // widgets; `previewPageConfig` is the editor's in-flight edit — undefined on
  // normal traffic, so it falls through to the regular template load.
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

  // isEditor selects the editor widget manifest so live overrides reach widgets.
  const pageBuilder = getPageBuilder({ isEditor });
  // Clear @shopkit/builder's internal template cache so API/preview changes are
  // picked up on every request.
  pageBuilder.clearCache();

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
