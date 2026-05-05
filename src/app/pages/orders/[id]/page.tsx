// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import ProtectedRoute from "@/ui/components/ProtectedRoute";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Order Details – BBlunt",
    description: "View your order details from BBlunt.",
  };
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
