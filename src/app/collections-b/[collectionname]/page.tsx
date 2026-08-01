import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getPageMetadata } from "@shopkit/seo";
import { getThemeName, getRouteTranslations } from "@/utils";
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { KwikPassCollectionView } from "@/integrations/kwikpass-custom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  const featuredCollections = process.env.FEATURED_COLLECTIONS;

  // Check environment variable
  if (!featuredCollections) {
    console.error("FEATURED_COLLECTIONS environment variable not found");
    return [];
  }

  // Split and clean handles (remove newlines/spaces from multi-line env vars)
  const handles = featuredCollections
    .split(",")
    .filter(Boolean)
    .map((h) => h.trim());

  // Return each handle as { collectionname }
  const staticParams = handles.map((handle) => ({
    collectionname: handle,
  }));

  return staticParams;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { collectionname: string };
  searchParams?: Record<string, string>;
}): Promise<Metadata> {
  const collection = await fetchCollection(params.collectionname);
  return getPageMetadata({
    pageType: "collection",
    path: `/collections-b/${params.collectionname}`,
    data: collection,
    searchParams,
  });
}

export default async function CollectionPage({
  params,
}: {
  params: { collectionname: string };
}) {
  try {
    const themeName = getThemeName();
    const locale = getStaticLocale();
    const routeContext = {
      templateName: TEMPLATE_TYPES["collection-b"],
      path: `/collections-b/${params.collectionname}`,
      params: { handle: params.collectionname },
      query: {},
      fetchAPITemplate: true,
    };
    const [messages, collection] = await Promise.all([
      getRouteTranslations({ themeName, routeContext, language: locale }),
      fetchCollection(params.collectionname),
    ]);

    if (!collection) {
      notFound();
    }

    // Get the page builder with widget manifest
    const pageBuilder = createPageBuildingEngine();

    // Note: The builder uses "merchantName" internally for loading themes/templates
    // from @/themes/{name}/templates/, so we pass themeName here
    const pageContent = await pageBuilder.renderPage({
      merchantName: themeName,
      routeContext,
      locale,
      messages,
    });

    return (
      <Suspense fallback={<></>}>
        {pageContent}
        <KwikPassCollectionView collection={collection} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error rendering collection page:", error);
    notFound();
  }
}

/**
 * Fetch collection data using the commerce client
 */
async function fetchCollection(handle: string): Promise<any | null> {
  try {
    const commerceClient = getCommerceClient();

    const collection = await commerceClient.getCollection({
      handle,
    });

    return collection.data;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}
