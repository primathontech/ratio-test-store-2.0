// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { getRouteTranslations } from "@/utils";
import type { Metadata } from "next";
import { getPageMetadata } from "@shopkit/seo";

export const revalidate = 30;
export const dynamicParams = true;

type ProductBundlePageProps = {
  params: Promise<{ bundleId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: ProductBundlePageProps): Promise<Metadata> {
  const { bundleId } = await params;
  return getPageMetadata({
    pageType: "page",
    path: `/productbundle/${bundleId}`,
    fallback: {
      title: `Build Your Bundle`,
      description:
        "Mix and match your favourites into a single bundle and checkout in one smooth flow.",
    },
  });
}

export default async function ProductBundlePage({
  params,
  searchParams,
}: ProductBundlePageProps) {
  const { bundleId } = await params;
  const query = await searchParams;
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES["productbundle"],
    path: `/productbundle/${bundleId}`,
    params: { bundleId },
    query,
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
