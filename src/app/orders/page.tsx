// app/page.tsx
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";
import { getPageMetadata } from "@shopkit/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: "/orders",
    fallback: { title: "Order Confirmation", noIndex: true },
  });
}

export default async function OrdersPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.orders,
    path: "/orders",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  // Get the page builder (widgets auto-loaded)
  const pageBuilder = getPageBuilder();

  // Note: The builder uses "merchantName" internally for loading themes/templates
  // from @/themes/{name}/templates/, so we pass themeName here
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
