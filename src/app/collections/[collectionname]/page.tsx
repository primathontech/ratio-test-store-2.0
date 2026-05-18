// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getCommerceClient } from "@/config/commerce";
import { getStaticLocale } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getRouteTranslations, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
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

  // Split and clean handles
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

export async function generateMetadata(props: {
  params: Promise<{ collectionname: string }>;
  searchParams?: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const collection = await fetchCollection(params.collectionname);
  return await resolveCommercePageSEO(
    "collection",
    collection,
    `/collections/${params.collectionname}`,
    { searchParams }
  );
}

export default async function CollectionPage(props: {
  params: Promise<{ collectionname: string }>;
}) {
  const params = await props.params;
  try {
    const themeName = getThemeName();
    const locale = getStaticLocale();

    const routeContext = {
      templateName: TEMPLATE_TYPES.collection,
      path: `/collections/${params.collectionname}`,
      params: { handle: params.collectionname },
      query: {},
    };

    const [messages, collection] = await Promise.all([
      getRouteTranslations({
        themeName,
        routeContext,
        language: locale,
      }),
      fetchCollection(params.collectionname),
    ]);

    if (!collection) {
      notFound();
    }

    // Get the page builder with widget manifest
    const pageBuilder = getPageBuilder();

    // Note: The builder uses "merchantName" internally for loading themes/templates
    // from @/themes/{name}/templates/, so we pass themeName here
    const pageContent = await pageBuilder.renderPage({
      merchantName: themeName,
      routeContext,
      locale,
      messages,
    });

    return <Suspense fallback={<></>}>{pageContent}</Suspense>;
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
