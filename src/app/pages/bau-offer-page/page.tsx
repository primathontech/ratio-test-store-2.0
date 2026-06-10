// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { Metadata } from "next";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";

export const revalidate = 30;

export function generateMetadata(): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    {
      title: "Sale - BBlunt",
      description: "Sale sale page.",
    },
    { siteUrl, siteName, path: "/pages/bau-offer-page" }
  );
}

export default async function BauOfferPagePage({
  searchParams,
}: {
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(searchParams);

  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["bau-offer-page"],
    path: "/pages/bau-offer-page",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder({ isEditor });

  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
    pageConfig: previewPageConfig,
  });

  return <>{pageContent}</>;
}
