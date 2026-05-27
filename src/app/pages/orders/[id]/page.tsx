// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import ProtectedRoute from "@/ui/components/ProtectedRoute";
import { resolvePageSEO } from "@shopkit/seo";
import { getSEOConfig } from "@/config";

export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const { siteUrl, siteName } = getSEOConfig();
  return resolvePageSEO(
    { noIndex: true },
    { siteUrl, siteName, path: `/pages/orders/${params.id}` }
  );
}

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["order-details"],
    path: `/pages/orders/${params.id}`,
    params: { id: params.id },
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
