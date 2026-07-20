// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { Metadata } from "next";
import { getPageMetadata } from "@shopkit/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/about-us",
    fallback: {
      title: "About Us - BBlunt",
      description: "Learn more about BBlunt.",
    },
  });
}

export default async function AboutUsPage({
  searchParams,
}: {
  searchParams: Promise<{ editor?: string; previewKey?: string }>;
}) {
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(searchParams);

  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["about-us"],
    path: "/pages/about-us",
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
