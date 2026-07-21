// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import ProtectedRoute from "@/ui/components/ProtectedRoute";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    { noIndex: true },
    { siteUrl, siteName, path: "/pages/orders" }
  );
}

export default async function OrdersHistoryPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["order-history"],
    path: "/pages/orders",
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

  return <ProtectedRoute>{pageContent}</ProtectedRoute>;
}
