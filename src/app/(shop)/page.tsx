// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";
import { cache } from "react";
import { JsonLd, extractJsonLd, stripJsonLd } from "@/components/seo/JsonLd";

/** ISR — revalidate collection data every 3600 seconds */
import type { PageConfig } from "@shopkit/builder";

export const revalidate = 3600;

// Descriptive, merchant-agnostic home metadata derived from the configured
// site name (with a generic fallback). cache() so generateMetadata and the
// page component share a single computation per request.
const getHomeMetadata = cache(async (): Promise<Metadata> => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Our Store";
  return getPageMetadata({
    pageType: "home",
    path: "/",
    fallback: {
      title: `${siteName} | Shop Online`,
      description:
        process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        `Shop the latest products at ${siteName}. Discover our full range and enjoy a fast, secure checkout.`,
    },
  });
});

// Generate metadata for home page (JSON-LD stripped from `other`; rendered as a
// real <script> in the page body instead).
export async function generateMetadata(): Promise<Metadata> {
  return stripJsonLd(await getHomeMetadata());
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

  const jsonLd = extractJsonLd(await getHomeMetadata());

  return (
    <>
      {pageContent}
      <JsonLd data={jsonLd} />
    </>
  );
}
