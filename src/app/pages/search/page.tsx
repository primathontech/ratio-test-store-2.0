import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

export const revalidate = 30;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q ?? "";
  return {
    title: query ? `Search results for "${query}" - BBlunt` : "Search - BBlunt",
    description: "Search results across the BBlunt catalogue.",
  };
}

export default async function SearchtapSearchPage({
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
    path: "/pages/search",
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
