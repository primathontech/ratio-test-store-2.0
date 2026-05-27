// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";

export function generateMetadata(): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    {
      title: "About Us - BBlunt",
      description: "Learn more about BBlunt.",
    },
    { siteUrl, siteName, path: "/pages/about-us" }
  );
}

export default async function AboutUsPage() {
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

  const pageBuilder = getPageBuilder();

  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
