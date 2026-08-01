import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { getRouteTranslations } from "@/utils";
import { Metadata } from "next";
import { getPageMetadata } from "@shopkit/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return getPageMetadata({
    pageType: "page",
    path: `/pages/orders/${params.id}`,
    fallback: { title: `Order ${params.id}`, noIndex: true },
  });
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

  const pageBuildingEngine = createPageBuildingEngine();

  const pageContent = await pageBuildingEngine.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
