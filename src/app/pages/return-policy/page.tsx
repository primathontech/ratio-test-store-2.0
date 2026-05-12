// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";

export function generateMetadata(): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    {
      title: "Return Policy – BBlunt",
      description:
        "Shipping What is the cost of shipping? A shipping charge of Rs. 40 is applicable to all orders under Rs. 499. How long will it take for the order to reach me? Please refer to the order details page for estimated shipping and delivery timelines for your orders. From the time of shipping, it takes 5-7 days for orders to",
    },
    { siteUrl, siteName, path: "/pages/return-policy" }
  );
}

export default async function ReturnPolicyPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["return-policy"],
    path: "/pages/return-policy",
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
