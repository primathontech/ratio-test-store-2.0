// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getSEOConfig } from "@/config";
import { resolvePageSEO } from "@shopkit/seo";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";

/** ISR — revalidate collection data every 30 seconds */
export const revalidate = 30;

export function generateMetadata(): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    {
      title: "Collections – BBlunt",
      description:
        "Shop for Rs. 499 on BBlunt & Get 2 Intense Moisture Products Free (Code: FREEIM). Buy salon-quality Shampoos, Conditioners, Colors, Sprays & Combos in India.",
    },
    { siteUrl, siteName, path: "/collections" }
  );
}

export default async function CollectionsPage() {
  try {
    const themeName = getThemeName();
    const locale = getStaticLocale();

    const routeContext = {
      templateName: TEMPLATE_TYPES["collection-list"],
      path: "/collections",
      params: {},
      query: {},
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
  } catch (error) {
    console.error("Error rendering collections page:", error);
    throw error;
  }
}
