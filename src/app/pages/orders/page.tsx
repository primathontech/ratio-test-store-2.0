import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getMerchantName, getThemeName } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { getRouteTranslations } from "@/utils";
import { Metadata } from "next";
import ProtectedRoute from "@/ui/components/ProtectedRoute";
import { getPageMetadata } from "@shopkit/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/pages/orders",
    fallback: { title: "Order History", noIndex: true },
  });
}

export default async function OrdersPage() {
  const merchantName = getMerchantName();
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

  const pageBuildingEngine = createPageBuildingEngine();

  const pageContent = await pageBuildingEngine.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <ProtectedRoute>{pageContent}</ProtectedRoute>;
}
