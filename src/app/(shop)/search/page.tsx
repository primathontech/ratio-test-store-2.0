// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { getSEOConfig } from "@/config";
import { resolvePageSEO } from "@shopkit/seo";
import { Metadata } from "next";

export const revalidate = 30;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q ?? "";
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    {
      title: query ? `"${query}" - Search` : "Search",
      description: "Search products.",
      // robots.ts disallows /search — keep metadata consistent (noindex, but
      // still allow crawlers to follow links out of the page).
      noIndex: true,
    },
    { siteUrl, siteName, path: "/search" }
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const themeName = getThemeName();
  const locale = getStaticLocale();
  const params = await searchParams;
  const flatQuery: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      flatQuery[key] = value;
    }
  }

  const routeContext = {
    templateName: TEMPLATE_TYPES["search"],
    path: "/search",
    params: {},
    query: flatQuery,
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder();

  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
