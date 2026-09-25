import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { readEditorPreviewState } from "@shopkit/editor-bridge/server";
import type { PageConfig } from "@shopkit/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/search",
    fallback: { title: "Search", noIndex: true },
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { editor?: string; previewKey?: string };
}) {
  const { isEditor, pageConfig: previewPageConfig } =
    await readEditorPreviewState<PageConfig>(
      Promise.resolve(searchParams ?? {})
    );

  const merchantName = getMerchantName();
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.search,
    path: "/search",
    params: {},
    query: {},
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = createPageBuildingEngine({ isEditor });
  pageBuilder.clearCache();

  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
    pageConfig: previewPageConfig,
  });

  return <>{pageContent}</>;
}
